using Terminal_BackEnd.Infrastructure.Constants;
using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services;
using Terminal_BackEnd.Infrastructure.Services.APIDataContracts;

namespace Terminal_BackEnd.Web.Services {
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
            if(retryCount > 3) {
                return failResponseObj;
            }
            var result = await altynAsyrTerminalService.CheckDestinationAsync(checkDestinationRequest.ServiceKey, checkDestinationRequest.Msisdn);
            if(result.Status != "SUCCESS") {
                return failResponseObj;
            } else {
                if(result.State == StateConstants.CheckDestinationState.NOTALLOWED ||
                   result.State == StateConstants.CheckDestinationState.DECLINED ||
                   result.State == StateConstants.CheckDestinationState.NOTAVAILABLE) {
                    return failResponseObj;
                }else if(result.State == StateConstants.CheckDestinationState.NEW ||
                    result.State == StateConstants.CheckDestinationState.GWPROCESSING ||
                    result.State == StateConstants.CheckDestinationState.PROCESSING ||
                    result.State == StateConstants.CheckDestinationState.RETRYLATER) {
                    Thread.Sleep(1000);
                    return await CheckDestinationAsync(checkDestinationRequest, retryCount + 1);
                }else if(result.State == StateConstants.CheckDestinationState.OK) {
                    return new CheckDestinationResponseClient() {
                        Destination = checkDestinationRequest.Msisdn,
                        Success = true
                    };
                }
            }
            return failResponseObj;
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
            var result = await this.altynAsyrTerminalService.ForceAddTransactionAsync(forceAddRequest.ServiceKey, forceAddRequest.Amount, forceAddRequest.Msisdn, tnx.Id.ToString());
            if(result == null || result.Status == StateConstants.TransactionState.DECLINED) {
                responseObj.Success = false;
            }
            if(result != null) {
                tnx.Status = result.Status;
                tnx.State = result.State;
                tnx.Reason = result.Reason;
                TransactionStatus tnxStatusChange = new TransactionStatus() {
                    Status = tnx.Status,
                    TransactionId = tnx.Id,
                    UpdatedDate = DateTime.UtcNow,
                };
                appDbContext.TransactionStatuses.Add(tnxStatusChange);
                appDbContext.SaveChanges();
            }
            return responseObj;
        }

        public async Task<string[]> GetServicesAsync() {
            return await altynAsyrTerminalService.GetServicesAsync();
        }
    }
}
