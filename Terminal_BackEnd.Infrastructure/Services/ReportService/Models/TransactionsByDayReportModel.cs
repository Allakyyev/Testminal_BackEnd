using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.Services.ReportService.Models {

    public class TransactionsByDayReportModel {
        public Terminal Terminal { get; set; }
        public List<DayTransactionWithRemainings> Data { get; set; } = new List<DayTransactionWithRemainings>();
        public long RemainingSum { get; set; }
        public long BillingSum { get; set; }
        public long EncashmentSum { get; set; }
    }
}
