namespace Terminal_BackEnd.Infrastructure.Entities {
    public class Topup : BaseEntity {
        public DateTime TopupDate { get; set; }
        public long TopupSum { get; set; }
        public required string  UserId { get; set; }        
    }
}
