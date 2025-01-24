using System.Security.Claims;
using DevExtreme.AspNet.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Terminal_BackEnd.Infrastructure.Constants;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services.UserService.Models;
using Terminal_BackEnd.Web.Services;
using Terminal_BackEnd.Web.Services.Model;

namespace Terminal_BackEnd.Web.API {
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TransactionsAPIController : ControllerBase {
        readonly ITransactionControllerService _transactionControllerService;
        public TransactionsAPIController(ITransactionControllerService transactionControllerService) {
            this._transactionControllerService = transactionControllerService;
        }
        [HttpGet]
        public async Task<object?> Get(DataSourceLoadOptions loadOptions) {
            if(User.Identity != null && User.Identity.IsAuthenticated) {
                if(User.IsInRole(ConstantsCommon.Role.Admin) || User.IsInRole(ConstantsCommon.Role.Cashier)) {
                    return DataSourceLoader.Load<TransactionViewModel>(MapToViewModel(_transactionControllerService.GetAllTransactions()), loadOptions);
                } else if(User.IsInRole(ConstantsCommon.Role.Standard)) {
                    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    if(userId != null)
                        return DataSourceLoader.Load<TransactionViewModel>(MapToViewModel(_transactionControllerService.GetAllTransactions(userId)), loadOptions);
                }
            }
            return Unauthorized();
        }

        [HttpGet("Terminal/{id}")]
        public async Task<object?> Terminal(long id, DataSourceLoadOptions loadOptions) {
            if(User.Identity != null && User.Identity.IsAuthenticated) {
                var transactions = _transactionControllerService.GetAllTransactionsById(id);
                if(User.IsInRole(ConstantsCommon.Role.Admin) || User.IsInRole(ConstantsCommon.Role.Cashier)) {
                    return DataSourceLoader.Load<TransactionViewModel>(MapToViewModel(transactions), loadOptions);
                } else {
                    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    return DataSourceLoader.Load<TransactionViewModel>(MapToViewModel(transactions.Where(t => t.Terminal != null && t.Terminal.UserId == userId).ToList()), loadOptions);
                }
            }
            return Unauthorized();
        }

        [HttpGet("Statuses/{id}")]
        public async Task<object?> Statuses(long id, DataSourceLoadOptions loadOptions) {
            if(User.Identity != null && User.Identity.IsAuthenticated) {
                return _transactionControllerService.GetTransactionStatuses(id);
            }
            return Unauthorized();
        }

        [HttpPost("CloseEncashment")]
        public void CloseEncashment(CloseEncashmentModel model) {
            _transactionControllerService.CloseEncashment(model.Id, model.SumFromTerm, model.Remark);
        }

        [HttpGet("Enchargement")]
        public async Task<object?> Enchargement(DataSourceLoadOptions loadOptions) {
            if(User.Identity != null && User.Identity.IsAuthenticated) {
                var enchargement = _transactionControllerService.GetAllEncashment();
                if(User.IsInRole(ConstantsCommon.Role.Admin) || User.IsInRole(ConstantsCommon.Role.Cashier)) {
                    return DataSourceLoader.Load<EncashmentViewModel>(MapToEncachmentViewModel(enchargement), loadOptions);
                } else if(enchargement.Any()) {
                    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    var filteredEnchargement = enchargement.Where(e => e.Terminal != null && e.Terminal.UserId == userId);
                    return DataSourceLoader.Load<EncashmentViewModel>(MapToEncachmentViewModel(filteredEnchargement.ToList()), loadOptions);
                } else {
                    return DataSourceLoader.Load<EncashmentViewModel>(MapToEncachmentViewModel(enchargement), loadOptions);
                }
            }
            return Unauthorized();
        }

        [HttpGet("TerminalEnchargements/{id}")]
        public async Task<object?> TerminalEnchargements(long id, DataSourceLoadOptions loadOptions) {
            if(User.Identity != null && User.Identity.IsAuthenticated) {
                var enchargement = _transactionControllerService.GetEncashmentsByTerminal(id);
                if(User.IsInRole(ConstantsCommon.Role.Admin) || User.IsInRole(ConstantsCommon.Role.Cashier)) {
                    return DataSourceLoader.Load<EncashmentViewModel>(MapToEncachmentViewModel(enchargement.ToList()), loadOptions);
                } else if(enchargement.Any()) {
                    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    var filteredEnchargement = enchargement.Where(e => e.Terminal != null && e.Terminal.UserId == userId);
                    return DataSourceLoader.Load<EncashmentViewModel>(MapToEncachmentViewModel(filteredEnchargement.ToList()), loadOptions);
                } else {
                    return DataSourceLoader.Load<EncashmentViewModel>(MapToEncachmentViewModel(enchargement.ToList()), loadOptions);
                }
            }
            return Unauthorized();
        }

        [HttpGet("EncashmentTransactions/{id}")]
        public async Task<object?> EncashmentTransactions(long id, DataSourceLoadOptions loadOptions) {
            if(User.Identity != null && User.Identity.IsAuthenticated) {
                var transactions = _transactionControllerService.GetEncashmentTransactions(id);
                foreach (var item in transactions)
                {
                    item.Amount = item.Amount > 0 ? item.Amount / 100 : item.Amount;
                }
                if (User.IsInRole(ConstantsCommon.Role.Admin) || User.IsInRole(ConstantsCommon.Role.Cashier)) {
                    return DataSourceLoader.Load<Transaction>(transactions, loadOptions);
                } else if(transactions.Any()) {
                    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    var encashment = _transactionControllerService.GetEncashmentById(id);
                    if(encashment != null && encashment.Terminal != null && encashment.Terminal.UserId == userId) {
                        return DataSourceLoader.Load<Transaction>(transactions, loadOptions);

                    }
                } else {
                    return DataSourceLoader.Load<Transaction>(transactions, loadOptions);
                }
            }
            return Unauthorized();
        }

        List<TransactionViewModel> MapToViewModel(List<Transaction> transactions) {
            var transactionsViewModels = new List<TransactionViewModel>();
            foreach(var transaction in transactions) {
                var terminalViewModel = new TransactionViewModel() {
                    Id = transaction.Id,
                    Msisdn = transaction.Msisdn,
                    Amount = (transaction.Amount / 100),
                    RefNum = transaction.RefNum,
                    State = transaction.State,
                    Status = transaction.Status,
                    Reason = transaction.Reason,
                    TerminalId = transaction.TerminalId,
                    EncargementId = transaction.EncargementId,
                    TransactionDate = transaction.TransactionDate,
                    CrossTransactionId = transaction.CrossTransactionId,
                    TermianlName = transaction.Terminal?.Name ?? "",
                    OwnerName = GetOwnerName(transaction.Terminal?.ApplicationUser)
                };
                transactionsViewModels.Add(terminalViewModel);
            }
            return transactionsViewModels;
        }

        List<EncashmentViewModel> MapToEncachmentViewModel(List<Encashment> encashments) {
            List<EncashmentViewModel> result = new List<EncashmentViewModel>();
            foreach(var item in encashments) {
                var terminal = item.Terminal;
                EncashmentViewModel enchargementViewModel = new EncashmentViewModel() {
                    Id = item.Id,
                    EncashmentDate = item.EncashmentDate,
                    EncashmentSum = item.EncashmentSum,
                    TerminalId = item.TerminalId,
                    TerminalName = terminal?.Name ?? String.Empty,
                    TerminalOwner = $"{terminal.ApplicationUser?.FamilyName ?? String.Empty} {terminal.ApplicationUser?.CompanyName ?? String.Empty}",
                    EncashmentSumFromTerminal = item.EncashmentSumFromTerminal,
                    BalanceDifference = item.EncashmentSumFromTerminal - item.EncashmentSum,
                    Status = item.Status,
                    Remarks = item.Remarks,
                };
                result.Add(enchargementViewModel);
            }
            return result;
        }

        string GetOwnerName(ApplicationUser user) {
            if(user == null) return String.Empty;
            return $"{user.FirstName} {user.FamilyName} - {user.CompanyName}";
        }
    }
}
