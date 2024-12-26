using System.Data;
using DevExpress.DashboardCommon;
using Microsoft.EntityFrameworkCore;
using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Web.DataSources.Dashboards {
    public class TerminalActivityPeriod {
        public string Name { get; set; }
        public string Dealer { get; set; }
        public DateTime FirstTransactionDate { get; set; }
        public DateTime LastTransactionDate { get; set; }
        public int TransactionCount { get; set; }
        public int MaxTransactionAmountPerDay { get; set; }
        public int TotalDaysInPeriod { get; set; }
        public int TotalDaysWithTransaction { get; set; }
        public double AverageTransactionAmountPerDay { get; set; }
        public int TotalTransactionAmount { get; set; }
    }
     
    public static class TerminalActivitiesDataSource {
        static List<TerminalActivityPeriod> GetTransactionStatistics(
        List<Transaction> transactions, DateTime startDate, DateTime endDate) {
            return transactions
                .Where(t => t.TransactionDate.Date >= startDate && t.TransactionDate.Date <= endDate && t.Terminal != null)
                .GroupBy(t => t.Terminal.Name)
                .Select(g => new TerminalActivityPeriod {
                    Name = g.Key,
                    Dealer = g.First()?.Terminal?.ApplicationUser?.CompanyName ?? "",
                    FirstTransactionDate = g.Min(t => t.TransactionDate),
                    LastTransactionDate = g.Max(t => t.TransactionDate),
                    TransactionCount = g.Count(),
                    MaxTransactionAmountPerDay = g.GroupBy(t => t.TransactionDate.Date)
                                                  .Max(dayGroup => dayGroup.Sum(t => (t.Amount/100))),
                    TotalDaysInPeriod = (endDate - startDate).Days + 1,
                    TotalDaysWithTransaction = g.Select(t => t.TransactionDate.Date).Distinct().Count(),
                    AverageTransactionAmountPerDay = g.Sum(t => (t.Amount / 100))*1.0/((endDate - startDate).Days + 1),
                    TotalTransactionAmount = g.Sum(t => (t.Amount/100))
                })
                .ToList();
        }
        public static object GetData(DateTime start, DateTime end) {
            var _dbContext = ServiceProvider.GetService<AppDbContext>();
            if(_dbContext == null ) return new List<object>();
            DataTable table = new DataTable();
            var transactions = _dbContext.Transactions.Include(t => t.Terminal).ThenInclude(a => a.ApplicationUser);
            return GetTransactionStatistics(transactions.ToList(), start, end);
        }      
    }
}
