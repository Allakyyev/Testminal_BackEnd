using Microsoft.AspNetCore.Mvc;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services.APIDataContracts;
using Terminal_BackEnd.Infrastructure.Services.DataContracts;
using Terminal_BackEnd.Infrastructure.Services.TerminalService;
using Terminal_BackEnd.Infrastructure.Services.UserService;
using Terminal_BackEnd.Web.Services;
using static DevExpress.Xpo.Helpers.AssociatedCollectionCriteriaHelper;

namespace Terminal_BackEnd.Web.API {
    [Route("api/[controller]")]
    [ApiController]
    public class AltynAsyrTerminalAPIController : ControllerBase {
        readonly ITransactionControllerService transactionController;
        readonly ISecurityService securityService;
        readonly IApplicationUserService applicationUserService;
        readonly ITerminalService terminalService;
        public AltynAsyrTerminalAPIController(ITransactionControllerService transactionController, ISecurityService securityService, IApplicationUserService applicationUserService, ITerminalService terminalService) {
            this.transactionController = transactionController;
            this.securityService = securityService;
            this.applicationUserService = applicationUserService;
            this.terminalService = terminalService;
        }

        [HttpGet("get-services")]
        public async Task<string[]> GetServices() {
            return await this.transactionController.GetServicesAsync();

        }

        [HttpPost("check-destination")]
        public async Task<CheckDestinationAPIResponse> CheckDestination(CheckDestinationRequest checkDestinationRequest) {
            var failResponse = new CheckDestinationAPIResponse() { Success = false };
            if(checkDestinationRequest == null) return failResponse;
            if(this.securityService.TryValidateTerminalId(checkDestinationRequest?.TerminalIdEncrypted ?? "", out Terminal terminal)) {
                if(terminal != null && terminal.Status == TerminalStatus.Inactive) return failResponse;
                if(this.securityService.TryValidateMsisdn(checkDestinationRequest?.MsisdnEncrypted ?? "", terminal.Password, out string msisdn)) {
                    checkDestinationRequest.Msisdn = msisdn;
                    var result = await this.transactionController.CheckDestinationAsync(checkDestinationRequest);
                    long currentUserTotal = await applicationUserService.GetCurrentTotal(terminal.UserId);
                    return new CheckDestinationAPIResponse() { Success = result.Success, DealerTotal = currentUserTotal };
                }
            }
            return failResponse;
        }

        [HttpPost("force-add")]
        public async Task<ForceAddAPIResponse> ForceAddTransaction(ForceAddRequest forceAddRequest) {
            var failResponse = new ForceAddAPIResponse() { Success = false };
            if(forceAddRequest == null)
                return failResponse;
            if(this.securityService.TryValidateTerminalId(forceAddRequest.TerminalIdEncrypted ?? "", out Terminal terminal)) {
                if(this.securityService.TryValidateMsisdn(forceAddRequest.MsisdnEncrypted ?? "", terminal.Password, out string msisdn)) {
                    forceAddRequest.Msisdn = msisdn.Replace("993", "");
                    forceAddRequest.TerminalId = terminal.Id;
                    long currentUserTotal = await applicationUserService.GetCurrentTotal(terminal.UserId);
                    if(currentUserTotal > 0) {
                        var result = await this.transactionController.ForceAddTransactionAsync(forceAddRequest);
                        if(result.Success) {
                            await applicationUserService.UpdateCurrentTotal(terminal.UserId, forceAddRequest.Amount);
                        }
                        return new ForceAddAPIResponse { Success = result.Success };
                    }
                }
            }
            return failResponse;
        }

        [HttpPost("add-enchargement")]
        public async Task<AddEnchargementAPIResponse> AddEnchargement(CreateEncashementRequest encashementRequest) {
            var failObj = new AddEnchargementAPIResponse() { Success = false };
            if(encashementRequest == null) return failObj;
            if(this.securityService.TryValidateTerminalId(encashementRequest?.TerminalIdEncrypted ?? "", out Terminal terminal)) {
                if(encashementRequest.EncashmentPasscode != terminal.EncashmenPassCode) return failObj;
                if(this.securityService.ValidateCheckSum(encashementRequest.CheckSum, encashementRequest.CheckSumEncrypted, terminal.Password)) {
                    var result = await this.transactionController.CreateEncashment(terminal.Id, encashementRequest.Sum);
                    return new AddEnchargementAPIResponse { Success = result.Success };
                }
            }
            return failObj;
        }

        [HttpPost("register-terminal")]
        public RegisterTerminalResponse RegisterTerminal(RegisterTerminalRequest registerTerminalRequest) {
            var result = this.terminalService.RegisterTerminal(registerTerminalRequest.TerminalId, registerTerminalRequest.MotherboardId, registerTerminalRequest.CpuId);
            return new RegisterTerminalResponse() {
                Success = result
            };
        }

        [HttpPost("terminal-log")]
        public LogTerminalResponse TerminalLog(TerminalLogRequest terminalLogRequest) {            
            bool logSuccess = false;
            if(!string.IsNullOrEmpty(terminalLogRequest?.LogInfo) && this.securityService.TryValidateTerminalId(terminalLogRequest?.TerminalIdEncrypted ?? "", out Terminal terminal)) {
                logSuccess = this.terminalService.LogTerminal(terminal.Id, terminalLogRequest.LogInfo, terminalLogRequest.Type, DateTime.Now);                
            }
            return new LogTerminalResponse() {
                Success = logSuccess
            };
        }
    }
}
