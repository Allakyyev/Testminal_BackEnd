namespace Terminal_BackEnd.Infrastructure.Entities {
    public class Encashment : BaseEntity {
        public DateTime EncashmentDate { get; set; }
        public long TerminalId { get; set; }
        public long EncashmentSum { get; set; }
        public Terminal? Terminal { get; set; }
        public List<Transaction>? Transactions { get; set; }
    }
}
