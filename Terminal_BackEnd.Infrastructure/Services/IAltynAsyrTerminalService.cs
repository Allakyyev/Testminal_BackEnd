using Terminal_BackEnd.Infrastructure.Services.DataContracts;
using Terminal_BackEnd.Infrastructure.Services.ServiceTypes;

namespace Terminal_BackEnd.Infrastructure.Services {
    public interface IAltynAsyrTerminalService {
        Task<string[]> GetServicesAsync();
        Task<CheckDestinationAPIResponse> CheckDestinationAsync(string serviceKey, string msisdn);
        Task<AddTransactionResponse> AddTransationAsync(string serviceKey, int amount, string msisdn);
        Task<AddTransactionResponse> CheckDestinationAsyncn(string serviceKey, int amount, string msisdn);
        Task<bool> RegisterAddTransactionStatusCallbackAsync(string callBack, string currentTransactionState);
        Task<CheckTransactionStatusResponse> CheckTransactionStatusAsync(string localTransactionId);
        Task<PollCheckDestinationResponse> PollCheckDestinationAsync(string serviceKey, string msisdn);
        Task<bool> RegisterCheckDestinationStatusCallbackAsync(string callBackUrl, string serviceKey, string msisdn, string state);
    }
}