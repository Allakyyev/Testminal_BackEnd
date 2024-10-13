namespace Terminal_BackEnd.Infrastructure.Entities {
    public enum EncashmentStatus {
        Open,
        Close
    }
    public class Encashment : BaseEntity {
        public DateTime EncashmentDate { get; set; }
        public long TerminalId { get; set; }
        public long EncashmentSum { get; set; }
        public int EncashmentSumFromTerminal { get; set; }
        public Terminal? Terminal { get; set; }
        public EncashmentStatus Status { get; set; }
        public List<Transaction>? Transactions { get; set; }
    }
}
