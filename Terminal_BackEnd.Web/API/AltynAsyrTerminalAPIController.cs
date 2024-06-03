using Microsoft.AspNetCore.Mvc;
using Terminal_BackEnd.Infrastructure.Services;
using Terminal_BackEnd.Infrastructure.Services.APIDataContracts;
using Terminal_BackEnd.Infrastructure.Services.DataContracts;
using Terminal_BackEnd.Infrastructure.Services.ServiceTypes;

namespace Terminal_BackEnd.Web.API {
    [Route("api/[controller]")]
    [ApiController]
    public class AltynAsyrTerminalAPIController : ControllerBase {
        readonly IAltynAsyrTerminalService AltynAsynTerminalService;
        public AltynAsyrTerminalAPIController(IAltynAsyrTerminalService  altynAsyrTerminalService) {
            this.AltynAsynTerminalService = altynAsyrTerminalService;
        }

        [HttpGet("checkDestinaltion")]
        public string[] GetServices() {
            return this.AltynAsynTerminalService.GetServicesAsync();
        }

        [HttpPost]
        public CheckDestinationAPIResponse CheckDestination(CheckDestinationRequest checkDestinationRequest) {
            return this.AltynAsynTerminalService.CheckDestination(checkDestinationRequest.ServiceKey, checkDestinationRequest.Msisdn);
        }

        [HttpPost]
        public AddTransactionResponse ForceAddTransaction(ForceAddRequest forceAddRequest) {
            return this.AltynAsynTerminalService.ForceAddTransaction(forceAddRequest.ServiceKey, forceAddRequest.Amount, forceAddRequest.Msisdn);
        }
    }
}
