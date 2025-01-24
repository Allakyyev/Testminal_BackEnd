using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Services.ReportService.Models;

namespace Terminal_BackEnd.Infrastructure.Services.ReportService {
    public interface IReportService {
        DayTransactionWithRemainings GetDayTransactionDataByTerminal(long terminalId, DateOnly date, long remaining = 0);
        TransactionsByDayReportModel? GetTransactionsByDayReport(long terminalId, DateOnly startDateOnly, DateOnly endDateOnly);
        List<TransactionsByDayReportModel> GetTerminalTranactionsByDaysReport(List<long> terminalIds, DateOnly startDateOnly, DateOnly endDateOnly);
    }

    public class ReportService : IReportService {
        private readonly AppDbContext _dbContex;
        public ReportService(AppDbContext appDbContext) {
            this._dbContex = appDbContext;
        }
        public DayTransactionWithRemainings GetDayTransactionDataByTerminal(long terminalId, DateOnly dateOnly, long remaining = 0) {
            var result = new DayTransactionWithRemainings() {
                DayStartTime = new DateTime(dateOnly.Year, dateOnly.Month, dateOnly.Day),
                DayEndTime = new DateTime(dateOnly.Year, dateOnly.Month, dateOnly.Day, 23, 59, 59)
            };
            var transactions = _dbContex.Transactions.Where(t => t.TerminalId == terminalId && dateOnly == DateOnly.FromDateTime(t.TransactionDate) && t.Status == "SUCCESS");
            if(transactions.Any()) {
                result.Billing = transactions.Sum(t => (t.Amount / 100));
            }

            var enchashments = _dbContex.Encashments.Where(t => t.TerminalId == terminalId && dateOnly == DateOnly.FromDateTime(t.EncashmentDate));
            if(enchashments.Any()) {
                result.Encashments = enchashments.ToList();
                result.EnchashmentSum = enchashments.Sum(t => t.EncashmentSum);
            }
            result.Remainings = remaining;
            return result;
        }

        public List<TransactionsByDayReportModel> GetTerminalTranactionsByDaysReport(List<long> terminalIds, DateOnly startDateOnly, DateOnly endDateOnly) {
            var result = new List<TransactionsByDayReportModel>();
            foreach(var terminalId in terminalIds) {
                var data = GetTransactionsByDayReport(terminalId, startDateOnly, endDateOnly);
                if(data != null) result.Add(data);
            }
            return result;
        }

        public TransactionsByDayReportModel? GetTransactionsByDayReport(long terminalId, DateOnly startDateOnly, DateOnly endDateOnly) {
            var terminal = _dbContex.Terminals.FirstOrDefault(t => t.Id == terminalId);
            if(terminal == null) return null;

            TransactionsByDayReportModel result = new TransactionsByDayReportModel() {
                Terminal = terminal                
            };
            DateOnly currentDate = startDateOnly;
            long remaining = 0;
            while(currentDate <= endDateOnly) {
                var data = GetDayTransactionDataByTerminal(terminal.Id, currentDate, remaining);
                result.Data.Add(data);
                remaining = Math.Max(0, (data.Billing + remaining) - data.EnchashmentSum);
                currentDate = currentDate.AddDays(1);
            }
            result.EncashmentSum = result.Data.Sum(r => r.EnchashmentSum);
            result.BillingSum = result.Data.Sum(r => r.Billing);
            result.RemainingSum = result.Data.Sum(r => r.Remainings);
            return result;
        }
    }
}
