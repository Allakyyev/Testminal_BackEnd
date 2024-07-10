using Microsoft.EntityFrameworkCore;
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
        readonly AppDbContext appDbContext;
        public TransactionControllerService(IAltynAsyrTerminalService altynAsyrTerminal, AppDbContext appDbContext) {
            this.altynAsyrTerminalService = altynAsyrTerminal;
            this.appDbContext = appDbContext;
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

        public Task<EncashementResponse> CreateEncashment(long terminalId) {
            try {
                var terminal = appDbContext.Terminals.Include(p => p.Encashments).FirstOrDefault(x => x.Id == terminalId);
                List<Transaction> transactions = new List<Transaction>();
                if(terminal != null) {
                    if(terminal.Encashments != null && terminal.Encashments.Any()) {
                        var lastEnchargementDate = terminal.Encashments.OrderByDescending(p => p.EncashmentDate).First().EncashmentDate;
                        transactions = appDbContext.Transactions.Include(t => t.Encashment).Where(p => p.TransactionDate > lastEnchargementDate && p.TerminalId == terminalId && p.Encashment == null).ToList();
                    } else {
                        transactions = appDbContext.Transactions.Where(p => p.TerminalId == terminalId).ToList();
                    }
                    long sum = transactions.Sum(t => t.Amount);
                    var enchargement = new Encashment() {
                        EncashmentDate = DateTime.Now,
                        TerminalId = terminalId,
                        EncashmentSum = sum > 0 ? sum/100 : sum
                    };
                    appDbContext.Encashments.Add(enchargement);
                    appDbContext.SaveChanges();
                    foreach(var item in transactions) {
                        item.EncargementId = enchargement.Id;
                        appDbContext.Transactions.Update(item);
                    }
                    appDbContext.SaveChanges();
                    return Task.FromResult(new EncashementResponse() { Success = true, TerminalId = terminal.TerminalId });
                }
            } catch {
                Task.FromResult(new EncashementResponse() { Success = false });
            }
            return Task.FromResult(new EncashementResponse() { Success = false });
        }

        public async Task<AddTransactionResponseClient> ForceAddTransactionAsync(ForceAddRequest forceAddRequest) {
            Transaction tnx = new Transaction() {
                Msisdn = forceAddRequest.Msisdn,
                TerminalId = forceAddRequest.TerminalId,
                Amount = forceAddRequest.Amount,
                PollingCallbackRegistered = false,
                Service = forceAddRequest.ServiceKey,
                Status = StateConstants.TransactionState.NEW
            };
            appDbContext.Transactions.Add(tnx);
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
            var result = await this.altynAsyrTerminalService.ForceAddTransactionAsync(forceAddRequest.ServiceKey, forceAddRequest.Amount, forceAddRequest.Msisdn, tnx.Id.ToString(), null);
            tnx.State = result.State;
            tnx.Status = result.Status;
            tnx.Reason = result.Reason;
            var kvp = result.FormData?.FirstOrDefault(f => f.Key == "ts");
            var tnxDate = DateTime.Now;
            if(kvp != null && !string.IsNullOrEmpty(kvp.Value.Value)) {
                string tnx1 = kvp.Value.Value;
                tnxDate = DateTimeOffset.FromUnixTimeSeconds(long.Parse(tnx1)).DateTime;

            }
            tnx.TransactionDate = tnxDate;
            appDbContext.Transactions.Update(tnx);
            appDbContext.SaveChanges();
            if(result.ConnectionError) {
                int retryCount = 0;
                bool continueRetry = true;
                while(retryCount < 5 && continueRetry) {
                    Thread.Sleep(1000);
                    result = await this.altynAsyrTerminalService.ForceAddTransactionAsync(forceAddRequest.ServiceKey, forceAddRequest.Amount, forceAddRequest.Msisdn, tnx.Id.ToString(), result.FormData?.ToDictionary());
                    continueRetry = result.ConnectionError;
                    TransactionStatus statusChange = new TransactionStatus() {
                        Status = $"Retried. Status={result.Status} Message: {result.Message}",
                        TransactionId = tnx.Id,
                        UpdatedDate = DateTime.UtcNow,
                    };
                    appDbContext.TransactionStatuses.Add(statusChange);
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
                .Where(t => t.Terminal != null && t.Terminal.ApplicationUser != null && t.Terminal.Id == terminalId)
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
            return appDbContext.Encashments.Include(e => e.Terminal).ThenInclude(p => p.ApplicationUser).ToList();
        }

        public List<Encashment> GetEncashmentsByTerminal(long terminalId) {
            return appDbContext.Encashments.Where(e => e.TerminalId == terminalId).ToList();
        }

        public List<Transaction> GetEncashmentTransactions(long encashmentId) {
            return appDbContext.Transactions.AsNoTracking().Where(e => e.EncargementId == encashmentId).ToList();
        }

        public Encashment GetEncashmentById(long encashmentId) {
            return appDbContext.Encashments.Where(e => e.Id == encashmentId).Include(e => e.Terminal).ThenInclude(t => t.ApplicationUser).First();
        }
    }
}
