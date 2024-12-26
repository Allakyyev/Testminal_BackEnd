using System.ComponentModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services.ReportDataSource.Models;

namespace Terminal_BackEnd.Web.ReportDataSources {
    [DisplayName("Transaction By Day DataSource")]
    public class TransactionsByDayDataSource {       
        public List<DayTransactionModel> GetData(DateTime start, DateTime end, IEnumerable<long> terminalIds, IEnumerable<string> dealerIds) {
            IQueryable<Terminal> terminals;
            var _dbContext = ServiceProvider.GetService<AppDbContext>();
            if(_dbContext == null ) return new List<DayTransactionModel>();

            if(terminalIds == null || !terminalIds.Any()) {
                if(dealerIds == null || !dealerIds.Any()) {
                    terminals = _dbContext.Terminals.Include(t => t.Transactions).Include(t => t.Encashments).Include(t => t.ApplicationUser);
                } else {
                    terminals = _dbContext.Terminals.Include(t => t.Transactions).Include(t => t.Encashments).Include(t => t.ApplicationUser).Where(t => dealerIds.Contains(t.UserId));
                }
            } else {
                terminals = _dbContext.Terminals.Include(t => t.Transactions).Include(t => t.Encashments).Include(t => t.ApplicationUser).Where(t => terminalIds.Contains(t.Id));
            }

            List<DayTransactionModel> result = new List<DayTransactionModel>();
            foreach(var terminal in terminals) {                
                var periodTransactions = terminal.Transactions?
                    .Where(t => t.TransactionDate >= start.Date && t.TransactionDate <= end.Date.AddDays(1).AddTicks(-1));
                var periodTransactionsGroup = periodTransactions?
                    .GroupBy(t => t.TransactionDate.Date).Select(g => new {
                        Date = g.Key,
                        TotalSum = g.Sum(t => t.Amount),
                        TransactionCount = g.Count()
                    });

                var periodEncashments = terminal.Encashments?
                    .Where(e => e.EncashmentDate >= start.Date && e.EncashmentDate <= end.Date.AddDays(1).AddTicks(-1));
                var periodEncashmentsGroup = periodEncashments?
                    .GroupBy(e => e.EncashmentDate.Date).Select(g => new {
                        Date = g.Key,
                        TotalSum = g.Sum(t => t.EncashmentSumFromTerminal),
                        TransactionCount = g.Count()
                    });

                for(DateTime date = start; date <= end; date = date.AddDays(1)) {
                    var transactionModel = new DayTransactionModel() {
                        TerminalId = terminal.Id,
                        TerminalName = terminal.Name,
                        DealerUserName = terminal.ApplicationUser?.UserName ?? "",
                        DealerName = $"{terminal.ApplicationUser?.UserName} {terminal.ApplicationUser?.FamilyName} : {terminal.ApplicationUser?.CompanyName}"
                    };

                    DateTime startOfDay = date.Date;
                    DateTime endOfDay = date.Date.AddDays(1).AddTicks(-1);
                    transactionModel.Start = startOfDay;
                    transactionModel.End = endOfDay;

                    var dayTransactions = periodTransactionsGroup?.Where(t => t.Date >= startOfDay && t.Date <= endOfDay);
                    transactionModel.BillingSum = dayTransactions == null ? 0 : dayTransactions.Sum(dt => (dt.TotalSum/100));

                    var dayEncashments = periodEncashmentsGroup?.Where(e => e.Date >= startOfDay && e.Date <= endOfDay);
                    transactionModel.EncashmentSum = dayEncashments == null ? 0 : dayEncashments.Sum(dt => (dt.TotalSum));

                    transactionModel.RemainInTerminal = transactionModel.BillingSum - transactionModel.EncashmentSum;
                    transactionModel.Encashments = periodEncashments?.Where(e => e.EncashmentDate >= startOfDay && e.EncashmentDate <= endOfDay).ToList() ?? new List<Encashment>();
                    result.Add(transactionModel);
                }
            }
            return result;
        }
    }
}
