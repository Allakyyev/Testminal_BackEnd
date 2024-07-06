using Microsoft.Extensions.Options;
using Terminal_BackEnd.Infrastructure.Services.ServiceTypes;

namespace Terminal_BackEnd.Infrastructure.Services {
    public class AltynAsyrTerminalService : IAltynAsyrTerminalService {
        readonly IServiceProviderAPIService serviceProviderAPIService;
        readonly string dealerKey;
        readonly TerminalSettings terminalSettings;
        public AltynAsyrTerminalService(IServiceProviderAPIService serviceProviderAPIService, IOptions<TerminalSettings> terminalSettings) {
            this.serviceProviderAPIService = serviceProviderAPIService;
            this.terminalSettings = terminalSettings.Value;
            this.dealerKey = this.terminalSettings.DealerKey;
        }

        public async Task<CheckTransactionStatusResponse?> CheckTransactionStatusAsync(string localTransactionId) {
            RequestResponse result;
            try {
                result = await serviceProviderAPIService.RequestCheckStatusTransactionAsync(this.dealerKey, localTransactionId);
                if(result != null && result.Status == "SUCCESS") {
                    return result.Result?.ToObject<CheckTransactionStatusResponse>();
                }
                return null;
            } catch {
                return null;
            }
        }

        public async Task<AddTransactionResponse> ForceAddTransactionAsync(string serviceKey, int amount, string msisdn, string localTransactionId, Dictionary<string, string>? _formData) {
            RequestResponse result;
            Dictionary<string, string> requestedFormData = null;
            try {
                result = await serviceProviderAPIService.RequestForceAddTransactionAsync(this.dealerKey, localTransactionId, serviceKey, amount, msisdn, _formData);
                if(result != null && result.Status == "SUCCESS") {
                    var successResult = result.Result?.ToObject<AddTransactionResponse>();
                    if(successResult != null) {
                        successResult.ConnectionError = false;
                        successResult.FormData = result.FormData;
                        return successResult;
                    }
                }
                string message = String.Empty;
                string status = String.Empty;
                if(result != null) {
                    requestedFormData = result.FormData.ToDictionary();
                    if(!result.HttpResponseMessage.IsSuccessStatusCode) {
                        message = $"Request error: {result.HttpResponseMessage.ReasonPhrase}, HTTPResponseCode: {result.HttpResponseMessage.StatusCode}";
                        status = "RequestFailed";
                    } else {
                        message = $"Request Reached: ResultStatus: {result.Status}, ErrorCode={result?.ErrorCode}, ErrorMessage: {result?.ErrorMessage}";
                        status = result.Status ?? "";
                    }
                } else {
                    message = $"Request Failed with NULL Respose";
                    status = "NullResponse";
                }
                return new AddTransactionResponse() {
                    Message = message,
                    ConnectionError = true,
                    Status = status ?? "",
                    RefNum = 0,
                    FormData = result?.FormData
                };
            } catch(Exception e) {
                return new AddTransactionResponse() {
                    Message = e.Message,
                    ConnectionError = true,
                    Status = "RequestFailed",
                    RefNum = 0,
                    FormData = requestedFormData
                };
            }
        }

        public async Task<string[]> GetServicesAsync() {
            RequestResponse result;
            try {
                result = await serviceProviderAPIService.RequestGetServicesAsync(this.dealerKey);
                if(result.HttpResponseMessage == null) return new string[0];
                result.HttpResponseMessage.EnsureSuccessStatusCode();
                if(result != null && result.Status == "SUCCESS") {
                    return (result.Result?.ToObject<GetServicesResponse>())?.Services ?? new string[0];
                } else {
                    return new string[0];
                }
            } catch {
                return new string[0];
            }

        }

        public async Task<CheckDestinationResonse> CheckDestinationAsync(string serviceKey, string msisdn) {
            RequestResponse result;
            var retryObj = new CheckDestinationResonse() {
                Destination = msisdn,
                Status = "RETRY-LATER"
            };
            try {
                result = await serviceProviderAPIService.RequestCheckDestinationAsync(this.dealerKey, serviceKey, msisdn);
                if(result != null && result.Status == "SUCCESS") {
                    if(result.HttpResponseMessage == null || result.Result == null) {
                        return retryObj;
                    } else {
                        return result.Result.ToObject<CheckDestinationResonse>() ?? retryObj;
                    }
                } else {
                    return retryObj;
                }
            } catch {
                return retryObj;
            }
        }

        public Task<bool> RegisterAddTransactionStatusCallbackAsync(string callBack, string currentTransactionState) {
            throw new NotImplementedException();
        }

        public async Task<PollCheckDestinationResponse> PollCheckDestinationAsync(string serviceKey, string msisdn) {
            RequestResponse result;
            var retryObj = new PollCheckDestinationResponse() {
                Destination = msisdn,
                Service = serviceKey,
                State = "RETRY-LATER",
                Status = "SUCESS"
            };
            try {
                result = await serviceProviderAPIService.RequestPollCheckDestinationAsync(this.dealerKey, serviceKey, msisdn);
                if(result != null && result.Status == "SUCCESS") {
                    return result.Result?.ToObject<PollCheckDestinationResponse>() ?? retryObj;
                }
                return retryObj;
            } catch {
                return retryObj;
            }
        }

        public Task<bool> RegisterCheckDestinationStatusCallbackAsync(string callBackUrl, string serviceKey, string msisdn, string state) {
            throw new NotImplementedException();
        }
    }
}
