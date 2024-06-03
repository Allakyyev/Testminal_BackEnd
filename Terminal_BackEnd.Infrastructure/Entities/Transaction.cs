namespace Terminal_BackEnd.Infrastructure.Entities {
    public class Transaction : BaseEntity {        
        public required string Msisdn { get; set; }
        public int Amount { get; set; }
        public string? Status { get; set; }
        public long? RefNum { get; set; }
        public string? Service { get; set; }
        public string? State { get; set; }
        public string? Reason { get; set; }
        public required int TerminalId { get; set; }
        public Terminal? Terminal { get; set; }
    }
}
