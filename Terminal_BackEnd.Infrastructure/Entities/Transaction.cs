namespace Terminal_BackEnd.Infrastructure.Entities {
    public class Transaction : BaseEntity {        
        public required string Msisdn { get; set; }
        public int Amount { get; set; }
        public string? Status { get; set; }
        public long? RefNum { get; set; }
        public string? Service { get; set; }
        public string? State { get; set; }
        public string? Reason { get; set; }
        public required long TerminalId { get; set; }
        public bool PollingCallbackRegistered { get; set; }
        public Terminal? Terminal { get; set; }
        public List<TransactionStatus> TransactionStatuses { get; set; } = new List<TransactionStatus>();
    }

    public class TransactionStatus: BaseEntity {
        public string? Status { get; set; }
        public long TransactionId { get; set; }
        public Transaction? Transaction { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
