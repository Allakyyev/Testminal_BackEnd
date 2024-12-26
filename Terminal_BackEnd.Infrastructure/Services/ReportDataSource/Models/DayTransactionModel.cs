using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.Services.ReportDataSource.Models {
    public class DayTransactionModel {
        public string TerminalName { get; set; }
        public string DealerName { get; set; }
        public string DealerUserName { get; set; }
        public long TerminalId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public long RemainInTerminal { get; set; }
        public long BillingSum { get; set; }
        public long EncashmentSum { get; set; }        
        public List<Encashment> Encashments { get; set; }
    }
}
