using Microsoft.AspNetCore.Mvc;
using Terminal_BackEnd.Infrastructure.Services;
using Terminal_BackEnd.Infrastructure.Services.APIDataContracts;
using Terminal_BackEnd.Infrastructure.Services.DataContracts;
using Terminal_BackEnd.Infrastructure.Services.ServiceTypes;
using Terminal_BackEnd.Web.Services;

namespace Terminal_BackEnd.Web.API {
    [Route("api/[controller]")]
    [ApiController]
    public class AltynAsyrTerminalAPIController : ControllerBase {
        readonly ITransactionControllerService transactionController;
        readonly ISecurityService securityService;
        public AltynAsyrTerminalAPIController(ITransactionControllerService transactionController, ISecurityService securityService) {
            this.transactionController = transactionController;
            this.securityService = securityService;
        }

        [HttpGet("checkDestinaltion")]
        public string[] GetServices(APIRequestBase requestBase) {
            //return this.AltynAsynTerminalService.GetServicesAsync();
            return null;
        }

        [HttpPost]
        public async Task<CheckDestinationAPIResponse> CheckDestination(CheckDestinationRequest checkDestinationRequest) {  
            var failResponse = new CheckDestinationAPIResponse() { Success = true };
            if(checkDestinationRequest == null) return failResponse;

            if(this.securityService.TryValidateMsisdn(checkDestinationRequest?.MsisdnEncrypted ?? "", out string msisdn) && 
                this.securityService.TryValidateTerminalId(checkDestinationRequest?.TerminalIdEncrypted ?? "", out long terminalId)) {
                checkDestinationRequest.Msisdn = msisdn;
                var result = await this.transactionController.CheckDestinationAsync(checkDestinationRequest);
                return new CheckDestinationAPIResponse() { Success = result.Success };
                
            }
            return new CheckDestinationAPIResponse() { Success = false };            
        }

        [HttpPost]
        public async Task<ForceAddAPIResponse> ForceAddTransaction(ForceAddRequest forceAddRequest) {
            var failResponse = new ForceAddAPIResponse() { Success = false };
            if(forceAddRequest == null)
                return failResponse;
            if(this.securityService.TryValidateMsisdn(forceAddRequest?.MsisdnEncrypted ?? "", out string msisdn) &&
                this.securityService.TryValidateTerminalId(forceAddRequest?.TerminalIdEncrypted ?? "", out long terminalId)) {
                forceAddRequest.Msisdn = msisdn;
                forceAddRequest.TerminalId = terminalId;
                var result = await this.transactionController.ForceAddTransactionAsync(forceAddRequest);

            }
            return failResponse;
        }                
    }
}
