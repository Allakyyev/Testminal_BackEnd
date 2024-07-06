using System.Security.Claims;
using DevExtreme.AspNet.Data;
using Microsoft.AspNetCore.Mvc;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Web.Services;
using Terminal_BackEnd.Web.Services.Model;

namespace Terminal_BackEnd.Web.API {
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsAPIController : ControllerBase {
        readonly ITransactionControllerService _transactionControllerService;
        public TransactionsAPIController(ITransactionControllerService transactionControllerService) {
            this._transactionControllerService = transactionControllerService;
        }
        [HttpGet]
        public async Task<object?> Get(DataSourceLoadOptions loadOptions) {
            if(User.Identity != null && User.Identity.IsAuthenticated) {
                if(User.IsInRole("Admin")) {
                    return DataSourceLoader.Load<TransactionViewModel>(MapToViewModel(_transactionControllerService.GetAllTransactions()), loadOptions);
                } else if(User.IsInRole("Standart")) {
                    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    if(userId != null)
                        return DataSourceLoader.Load<TransactionViewModel>(MapToViewModel(_transactionControllerService.GetAllTransactions(userId)), loadOptions);
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
                    EncharchmentId = transaction.EncharchmentId,
                    TransactionDate = transaction.TransactionDate,
                    TermianlName = transaction.Terminal?.Name ?? "",
                    OwnerName = GetOwnerName(transaction.Terminal?.ApplicationUser)
                };
                transactionsViewModels.Add(terminalViewModel);
            }
            return transactionsViewModels;
        }

        string GetOwnerName(ApplicationUser user) {
            if(user == null) return String.Empty;
            return $"{user.FirstName} {user.FamilyName} - {user.CompanyName}";
        }
    }
}
