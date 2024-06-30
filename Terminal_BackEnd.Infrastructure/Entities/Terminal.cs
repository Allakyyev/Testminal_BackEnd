namespace Terminal_BackEnd.Infrastructure.Entities {
    public enum TerminalStatus {
        Active = 0,
        Inactive = 1
    }
    public class Terminal : BaseEntity {
        public required string Password { get; set; }
        public required string TerminalId { get; set; }
        public required string Name { get; set; }
        public required string UserId { get; set; }
        public List<Transaction>? Transactions { get; set; }
        public List<Encashment>? Encashments { get; set; }
        public ApplicationUser? ApplicationUser { get; set; }
        public TerminalStatus Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
