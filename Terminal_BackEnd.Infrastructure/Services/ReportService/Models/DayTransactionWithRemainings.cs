using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.Services.ReportService.Models {
    public class DayTransactionWithRemainings {
        public DateTime DayStartTime { get; set; }
        public DateTime DayEndTime { get; set; }
        public long Remainings { get; set; }
        public long Billing { get; set; }
        public long EnchashmentSum { get; set; }
        public List<Encashment> Encashments { get; set; }
    }
}
