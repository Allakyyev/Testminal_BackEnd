using System.Data;
using Microsoft.EntityFrameworkCore;
using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Web.DataSources.Dashboards {
    public class TerminalActivitiesByDay {
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public int TransactionCount { get; set; }
        public int TotalTransactionAmount { get; set; }
    }

    public static class TerminalActivitiesByDayDataSource {
        static List<TerminalActivitiesByDay> GetTransactionStatistics(List<Transaction> transactions, int days, List<string> terminalNames) {
            var lastDays = DateTime.Today.AddDays(-1 * days);
            var allDates = Enumerable.Range(0, days).Select(offset => lastDays.AddDays(offset)).ToList();

            var groupedTransactions = transactions
            .Where(t => t.TransactionDate >= lastDays)
            .GroupBy(t => new { t.Terminal.Name, Date = t.TransactionDate.Date })
            .Select(g => new TerminalActivitiesByDay() {
                Name = g.Key.Name,
                Date = g.Key.Date,
                TotalTransactionAmount = g.Sum(t => t.Amount / 100),
                TransactionCount = g.Count()
            });

            var allNames = transactions.Select(t => t.Terminal.Name).Distinct();
            List<string> temp = new List<string>();
            List<string> allTerminalNames = new List<string>();

            if(allNames != null) {
                temp.AddRange(allNames.ToList());
            }

            if(terminalNames != null) {
                temp.AddRange(terminalNames.ToList());
            }
            allTerminalNames = temp.Distinct().ToList();

            var allCombinations = from name in allTerminalNames
                                  from date in allDates
                                  select new { Name = name, Date = date };

            var result = from combo in allCombinations
                         join transaction in groupedTransactions
                         on new { combo.Name, combo.Date } equals new { transaction.Name, transaction.Date } into gj
                         from subTransaction in gj.DefaultIfEmpty()
                         select new TerminalActivitiesByDay() {
                             Name = combo.Name,
                             Date = combo.Date,
                             TotalTransactionAmount = subTransaction?.TotalTransactionAmount ?? 0,
                             TransactionCount = subTransaction?.TotalTransactionAmount ?? 0
                         };
            var orderedResult = result.OrderBy(r => r.Name).ThenBy(r => r.Date);
            return orderedResult.ToList();
        }
        public static object GetData(int days) {
            var _dbContext = ServiceProvider.GetService<AppDbContext>();
            if(_dbContext == null) return new List<object>();
            DataTable table = new DataTable();
            var allTerminals = _dbContext.Terminals.Select(t => t.Name).ToList();
            var transactions = _dbContext.Transactions.Include(t => t.Terminal).ThenInclude(a => a.ApplicationUser);
            return GetTransactionStatistics(transactions.ToList(), days, allTerminals);
        }
    }
}
