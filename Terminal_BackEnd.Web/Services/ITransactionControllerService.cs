using System.Runtime.Serialization;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services.APIDataContracts;
using Terminal_BackEnd.Web.Services.Model;

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
        public Task<EncashementResponse> CreateEncashment(long terminalId, int sum, DateTime? date, EncashmentStatus status = EncashmentStatus.Open);
        public Task<string[]> GetServicesAsync();
        public List<Transaction> GetAllTransactions();
        public List<Transaction> GetAllTransactions(string userId);
        public TransactionViewModel GetTransactionViewModel(long transactionId);
        public List<TransactionStatus> GetTransactionStatuses(long transactionId);
        public List<Transaction> GetAllTransactionsById(long terminalId);
        public List<Encashment> GetAllEncashment();
        public List<Encashment> GetEncashmentsByTerminal(long terminalId);
        public List<Transaction> GetEncashmentTransactions(long encashmentId);
        public Encashment GetEncashmentById(long encashmentId);
        public void CloseEncashment(long id, int sum);
    }
}
