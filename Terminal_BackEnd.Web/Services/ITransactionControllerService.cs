using System.Runtime.Serialization;
using Terminal_BackEnd.Infrastructure.Services.APIDataContracts;

namespace Terminal_BackEnd.Web.Services {
    [DataContract]
    public class AddTransactionResponseClient {
        [DataMember(Name = "transactionId")]
        public long TransactionId { get; set; }
        [DataMember(Name = "success")]
        public bool Success { get; set; }
    }
    public class CheckDestinationResponseClient {
        [DataMember(Name = "destination")]
        public string? Destination { get; set; }
        [DataMember(Name = "success")]
        public bool Success { get; set; }
    }

    public class  EncashementResponse
    {
        [DataMember(Name = "terminalId")]
        public string? TerminalId { get; set; }
        [DataMember(Name = "success")]
        public bool Success { get; set; }
    }

    public interface ITransactionControllerService {
        public Task<AddTransactionResponseClient> ForceAddTransactionAsync(ForceAddRequest forceAddRequest);
        public Task<CheckDestinationResponseClient> CheckDestinationAsync(CheckDestinationRequest checkDestinationRequest, int retryCount = 3);
        public Task<EncashementResponse> CreateEncashment(long terminalId);
        public Task<string[]> GetServicesAsync();
    }
}
