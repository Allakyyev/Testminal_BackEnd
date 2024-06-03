using System.Text.Json;
using Terminal_BackEnd.Infrastructure.Services.DataContracts;
using Terminal_BackEnd.Infrastructure.Services.ServiceTypes;

namespace Terminal_BackEnd.Infrastructure.Services
{
    public class AltynAsyrTerminalService : IAltynAsyrTerminalService
    {
        readonly IServiceProviderAPIService serviceProviderAPIService;
        readonly string dealerKey;
        public AltynAsyrTerminalService(IServiceProviderAPIService  serviceProviderAPIService, string dealerKey) {
            this.serviceProviderAPIService = serviceProviderAPIService;
            this.dealerKey = dealerKey;
        }
        public AddTransactionResponse AddTransation(string serviceKey, int amount, string msisdn) {
            throw new NotImplementedException();
        }

        public CheckDestinationAPIResponse CheckDestination(string serviceKey, string msisdn) {
            throw new NotImplementedException();
        }

        public CheckTransactionStatusResponse CheckTransactionStatus(string localTransactionId) {
            throw new NotImplementedException();
        }

        public AddTransactionResponse ForceAddTransaction(string serviceKey, int amount, string msisdn) {
            throw new NotImplementedException();
        }

        public async Task<string[]> GetServicesAsync() {
            RequestResponse result;
            try {
                result = await serviceProviderAPIService.RequestGetServicesAsync(this.dealerKey);
                if(result.HttpResponseMessage == null) return new string[0];

                result.HttpResponseMessage.EnsureSuccessStatusCode();
                return (result.Result?.ToObject<GetServicesResponse>())?.Services ?? new string[0];
            } catch {
                return new string[0];
            }
            
        }

        public PollCheckDestinationResponse PollCheckDestination(string serviceKey, string msisdn) {
            throw new NotImplementedException();
        }

        public bool RegisterAddTransactionStatusCallback(string callBack, string currentTransactionState) {
            throw new NotImplementedException();
        }

        public bool RegisterCheckDestinationStatusCallback(string callBackUrl, string serviceKey, string msisdn, string state) {
            throw new NotImplementedException();
        }
    }
}
