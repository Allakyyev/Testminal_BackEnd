﻿using Microsoft.EntityFrameworkCore;
using Terminal_BackEnd.Infrastructure.Constants;
using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services;
using Terminal_BackEnd.Infrastructure.Services.APIDataContracts;
using Terminal_BackEnd.Web.Services.Model;

namespace Terminal_BackEnd.Web.Services {
    public enum RequestState {
        OK,
        RequestAgain,
        Fail
    }
    public class TransactionControllerService : ITransactionControllerService {
        readonly IAltynAsyrTerminalService altynAsyrTerminalService;
        readonly ISettingsService settingsService;
        readonly AppDbContext appDbContext;
        public TransactionControllerService(IAltynAsyrTerminalService altynAsyrTerminal, AppDbContext appDbContext, ISettingsService settingsService) {
            this.altynAsyrTerminalService = altynAsyrTerminal;
            this.appDbContext = appDbContext;
            this.settingsService = settingsService;
        }
        public async Task<CheckDestinationResponseClient> CheckDestinationAsync(CheckDestinationRequest checkDestinationRequest, int retryCount = 0) {
            var failResponseObj = new CheckDestinationResponseClient() {
                Destination = checkDestinationRequest.Msisdn,
                Success = false
            };
            var successObj = new CheckDestinationResponseClient() {
                Destination = checkDestinationRequest.Msisdn,
                Success = true
            };
            if(retryCount > 3) {
                return failResponseObj;
            }
            var result = await altynAsyrTerminalService.CheckDestinationAsync(checkDestinationRequest.ServiceKey, checkDestinationRequest.Msisdn);
            if(result.Status != "SUCCESS") {
                return failResponseObj;
            } else {
                var currentState = GetRequestState(result.State ?? "");
                if(currentState == RequestState.Fail) {
                    return failResponseObj;
                } else if(currentState == RequestState.RequestAgain) {
                    while(retryCount <= 3) {
                        Thread.Sleep(1000);
                        var pollingResult = await altynAsyrTerminalService.PollCheckDestinationAsync(checkDestinationRequest.ServiceKey, checkDestinationRequest.Msisdn);
                        if(pollingResult.Status == "SUCCESS") {
                            var pollingState = GetRequestState(pollingResult.State);
                            if(pollingState == RequestState.OK)
                                return successObj;
                            else if(pollingState == RequestState.Fail)
                                return failResponseObj;
                            else retryCount++;
                        } else {
                            return failResponseObj;
                        }
                    }

                } else if(currentState == RequestState.OK) {
                    return successObj;
                }
            }
            return failResponseObj;
        }

        public void CloseEncashment(long id, int sum, string remark) {
            if(id == null) return;
            var encashment = appDbContext.Encashments.Find(id);
            if(encashment == null) return;
            encashment.Status = EncashmentStatus.Close;
            encashment.EncashmentSumFromTerminal = (sum != 0 ? sum : encashment.EncashmentSumFromTerminal);
            encashment.Remarks = remark;
            appDbContext.Update(encashment);
            appDbContext.SaveChanges();
        }

        public Task<EncashementResponse> CreateEncashment(long terminalId, int sumFromTerminal, DateTime date, EncashmentStatus status = EncashmentStatus.Open) {
            using(var transaction = appDbContext.Database.BeginTransaction()) {
                try {
                    var terminal = appDbContext.Terminals.Include(p => p.Encashments).FirstOrDefault(x => x.Id == terminalId);
                    List<Transaction> transactions = new List<Transaction>();
                    if(terminal != null) {
                        if(terminal.Encashments != null && terminal.Encashments.Any()) {
                            //var lastEnchargementDate = terminal.Encashments.OrderByDescending(p => p.EncashmentDate).First().EncashmentDate;
                            transactions = appDbContext.Transactions.Where(t => t.Status == "SUCCESS").Include(t => t.Encashment).Where(p => p.TerminalId == terminalId && p.Encashment == null && p.TransactionDate <= date).ToList();
                        } else {
                            transactions = appDbContext.Transactions.Where(p => p.TerminalId == terminalId && p.Status == "SUCCESS").ToList();
                        }
                        long sum = transactions.Sum(t => t.Amount);
                        var enchargement = new Encashment() {
                            EncashmentDate = date,
                            TerminalId = terminalId,
                            EncashmentSum = sum > 0 ? sum / 100 : sum,
                            EncashmentSumFromTerminal = sumFromTerminal,
                            Status = status
                        };
                        appDbContext.Add(enchargement);
                        appDbContext.SaveChanges();
                        foreach(var item in transactions) {
                            item.EncargementId = enchargement.Id;
                            appDbContext.Transactions.Update(item);
                        }
                        appDbContext.SaveChanges();
                        transaction.Commit();
                        return Task.FromResult(new EncashementResponse() { Success = true, TerminalId = terminal.TerminalId });
                    }
                } catch {
                    transaction.Rollback();
                    Task.FromResult(new EncashementResponse() { Success = false });
                }
            }
            return Task.FromResult(new EncashementResponse() { Success = false });
        }

        public async Task<AddTransactionResponseClient> ForceAddTransactionAsync(ForceAddRequest forceAddRequest) {
            var settings = settingsService.GetGlobalSettings();
            bool exciding = forceAddRequest.Amount / 100 > 500;
            if(settings != null && settings.Any()) {
                var sum = settings.FirstOrDefault(s => s.Key == GlobalSettingKey.LimitAmountOfOneTransaction);
                if(sum != null) {
                    if(int.TryParse(sum.Value ?? "", out int limit)) {
                        exciding = forceAddRequest.Amount / 100 > limit;
                    }
                }
            }

            Transaction tnx = new Transaction() {
                Msisdn = forceAddRequest.Msisdn,
                TerminalId = forceAddRequest.TerminalId,
                Amount = forceAddRequest.Amount,
                PollingCallbackRegistered = false,
                Service = forceAddRequest.ServiceKey,
                CrossTransactionId = Guid.NewGuid().ToString("N"),
                Status = exciding ? StateConstants.TransactionState.ERROR : StateConstants.TransactionState.NEW
            };
            appDbContext.Add<Transaction>(tnx);
            appDbContext.SaveChanges();

            TransactionStatus tnxStatus = new TransactionStatus() {
                Status = tnx.Status,
                TransactionId = tnx.Id,
                UpdatedDate = DateTime.UtcNow,
            };

            appDbContext.Add<TransactionStatus>(tnxStatus);
            appDbContext.SaveChanges();

            var responseObj = new AddTransactionResponseClient() {
                TransactionId = tnx.Id,
                Success = true
            };
            if(exciding)
                return responseObj;

            var result = await this.altynAsyrTerminalService.ForceAddTransactionAsync(forceAddRequest.ServiceKey, forceAddRequest.Amount, forceAddRequest.Msisdn, tnx.CrossTransactionId, null);
            tnx.State = result.State;
            tnx.Status = result.Status;
            tnx.Reason = result.Reason;
            var kvp = result.FormData?.FirstOrDefault(f => f.Key == "ts");
            var tnxDate = DateTime.UtcNow;
            if(kvp != null && !string.IsNullOrEmpty(kvp.Value.Value)) {
                string tnx1 = kvp.Value.Value;
                tnxDate = Terminal_BackEnd.Infrastructure.Helpers.DateTimeHelper.ToLocalTimeFromUnixSec(long.Parse(tnx1));
            } else {
                tnxDate = tnxDate.ToLocalTime();
            }
            tnx.TransactionDate = tnxDate;
            appDbContext.Update<Transaction>(tnx);
            appDbContext.SaveChanges();
            if(result.ConnectionError) {
                int retryCount = 0;
                bool continueRetry = true;
                while(retryCount < 5 && continueRetry) {
                    Thread.Sleep(1000);
                    result = await this.altynAsyrTerminalService.ForceAddTransactionAsync(forceAddRequest.ServiceKey, forceAddRequest.Amount, forceAddRequest.Msisdn, tnx.CrossTransactionId, result.FormData?.ToDictionary());
                    continueRetry = result.ConnectionError;
                    retryCount++;
                    TransactionStatus statusChange = new TransactionStatus() {
                        Status = $"Retried. Status={result.Status} Message: {result.Message}",
                        TransactionId = tnx.Id,
                        UpdatedDate = DateTime.UtcNow,
                    };
                    appDbContext.Add<TransactionStatus>(statusChange);
                    appDbContext.SaveChanges();
                }
                responseObj.Success = !continueRetry;
                return responseObj;
            } else {
                //if(result.Status == StateConstants.TransactionState.NEW ||
                //    //NEW, PENDING, PROCESSING, WAITING, ERROR, REJECTING, UNKNOWN
                //    result.Status == StateConstants.TransactionState.NEW ||
                //    result.Status == StateConstants.TransactionState.PENDING ||
                //    result.Status == StateConstants.TransactionState.PROCESSING ||
                //    result.Status == StateConstants.TransactionState.WAITING ||
                //    result.Status == StateConstants.TransactionState.ERROR ||
                //    result.Status == StateConstants.TransactionState.REJECTING ||
                //    result.Status == StateConstants.TransactionState.REJECTED ||
                //    result.Status == StateConstants.TransactionState.UNKNOWN) {}               

                TransactionStatus tnxStatusChange = new TransactionStatus() {
                    Status = tnx.State,
                    TransactionId = tnx.Id,
                    UpdatedDate = DateTime.UtcNow,
                };
                appDbContext.TransactionStatuses.Add(tnxStatusChange);
                appDbContext.SaveChanges();
                return responseObj;
            }
        }

        public List<Transaction> GetAllTransactions() {
            return appDbContext.Transactions
                .Include(t => t.Terminal).ThenInclude(terminal => terminal.ApplicationUser)
                .Where(t => t.Terminal != null && t.Terminal.ApplicationUser != null)
                .ToList();
        }

        public List<Transaction> GetAllTransactions(string userId) {
            return appDbContext.Transactions
                .Include(t => t.Terminal).ThenInclude(terminal => terminal.ApplicationUser)
                .Where(t => t.Terminal != null && t.Terminal.ApplicationUser != null && t.Terminal.UserId == userId)
                .ToList();
        }

        public List<Transaction> GetAllTransactionsById(long terminalId) {
            return appDbContext.Transactions
                .Include(t => t.Terminal).ThenInclude(terminal => terminal.ApplicationUser)
                .Where(t => t.Terminal != null && t.Terminal.ApplicationUser != null && t.Terminal.Id == terminalId && (t.EncargementId == null || t.EncargementId <= 0))
                .ToList();
        }

        public List<TransactionStatus> GetTransactionStatuses(long transactionId) {
            return appDbContext.TransactionStatuses
                .Where(ts => ts.TransactionId == transactionId)
                .ToList();
        }

        public async Task<string[]> GetServicesAsync() {
            return await altynAsyrTerminalService.GetServicesAsync();
        }

        public TransactionViewModel GetTransactionViewModel(long transactionId) {
            var transactions = appDbContext.Transactions.Where(t => t.Id == transactionId)
                .Include(t => t.Terminal).ThenInclude(terminal => terminal.ApplicationUser)
                .Where(t => t.Terminal != null && t.Terminal.ApplicationUser != null);
            if(transactions.Any()) {
                return MapTransactionToViewModel(transactions.First());
            } else return null;
        }
        string GetOwnerName(ApplicationUser user) {
            if(user == null) return String.Empty;
            return $"{user.FirstName} {user.FamilyName} - {user.CompanyName}";
        }
        TransactionViewModel MapTransactionToViewModel(Transaction transaction) {
            return new TransactionViewModel() {
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
                TermianlName = transaction.Terminal?.Name ?? "",
                CrossTransactionId = transaction.CrossTransactionId,
                OwnerName = GetOwnerName(transaction.Terminal?.ApplicationUser)
            };
        }

        RequestState GetRequestState(string state) {
            if(state == StateConstants.CheckDestinationState.NOTALLOWED ||
                state == StateConstants.CheckDestinationState.DECLINED ||
                state == StateConstants.CheckDestinationState.NOTAVAILABLE) {
                return RequestState.Fail;
            } else if(state == StateConstants.CheckDestinationState.NEW ||
                state == StateConstants.CheckDestinationState.GWPROCESSING ||
                state == StateConstants.CheckDestinationState.PROCESSING ||
                state == StateConstants.CheckDestinationState.RETRYLATER ||
                state == StateConstants.CheckDestinationState.WAITING) {
                return RequestState.RequestAgain;
            } else if(state == StateConstants.CheckDestinationState.OK) {
                return RequestState.OK;
            }
            return RequestState.Fail;
        }

        public List<Encashment> GetAllEncashment() {
            return appDbContext.Encashments.Include(e => e.Terminal).ThenInclude(p => p.ApplicationUser).OrderByDescending(e => e.EncashmentDate).ToList();
        }

        public List<Encashment> GetEncashmentsByTerminal(long terminalId) {
            return appDbContext.Encashments.Where(e => e.TerminalId == terminalId).Include(e => e.Terminal).ThenInclude(t => t.ApplicationUser).ToList();
        }

        public List<Transaction> GetEncashmentTransactions(long encashmentId) {
            return appDbContext.Transactions.AsNoTracking().Where(e => e.EncargementId == encashmentId).ToList();
        }

        public Encashment GetEncashmentById(long encashmentId) {
            return appDbContext.Encashments.Where(e => e.Id == encashmentId).Include(e => e.Terminal).ThenInclude(t => t.ApplicationUser).First();
        }
    }
}
