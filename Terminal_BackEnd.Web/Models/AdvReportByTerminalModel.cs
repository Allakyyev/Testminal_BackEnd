using Terminal_BackEnd.Infrastructure.Services.ReportService.Models;

namespace Terminal_BackEnd.Web.Models {
    public class AdvReportByTerminalModel {
        public List<TransactionsByDayReportModel> transactionsByDayReportModels { get; set; } = new List<TransactionsByDayReportModel>();
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public List<long> TerminalIds { get; set; } = new List<long>();
    }
}
