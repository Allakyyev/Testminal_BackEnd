using Microsoft.EntityFrameworkCore;
using Terminal_BackEnd.Infrastructure.Constants;
using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services;

namespace Terminal_BackEnd.Web.Jobs {
    public class TransactionStatusesUpdateJob : IHostedService, IDisposable {
        private Timer _timer;

        private readonly IServiceProvider _serviceProvider;
        public TransactionStatusesUpdateJob(IServiceProvider serviceProvider) {
            _serviceProvider = serviceProvider;
        }
        public Task StartAsync(CancellationToken cancellationToken) {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromMinutes(5)); // Change to desired interval
            return Task.CompletedTask;
        }

        private void DoWork(object state) {
            using(var scope = _serviceProvider.CreateScope()) {
                var _appDbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var _altynAsyrTerminalService = scope.ServiceProvider.GetRequiredService<IAltynAsyrTerminalService>();
                var transactions = _appDbContext.Transactions.Include(t => t.TransactionStatuses).ToList();
                List<TransactionStatus> listToCheck = new List<TransactionStatus>();
                transactions.ForEach(t => {
                    if(t.TransactionStatuses != null && t.TransactionStatuses.Any()) {
                        var tStatus = t.TransactionStatuses.OrderByDescending(p => p.UpdatedDate).First();
                        if(tStatus.Status == StateConstants.TransactionState.NEW ||
                            //NEW, PENDING, PROCESSING, WAITING, ERROR, REJECTING, UNKNOWN
                            tStatus.Status == StateConstants.TransactionState.NEW ||
                            tStatus.Status == StateConstants.TransactionState.PENDING ||
                            tStatus.Status == StateConstants.TransactionState.PROCESSING ||
                            tStatus.Status == StateConstants.TransactionState.GWPROCESSING ||
                            tStatus.Status == StateConstants.TransactionState.WAITING ||
                            tStatus.Status == StateConstants.TransactionState.ERROR ||
                            tStatus.Status == StateConstants.TransactionState.REJECTING ||
                            tStatus.Status == StateConstants.TransactionState.REJECTED ||
                            tStatus.Status == StateConstants.TransactionState.UNKNOWN) {
                            listToCheck.Add(tStatus);
                        }
                    }
                });
                foreach(var t in listToCheck) { 
                var result = _altynAsyrTerminalService.CheckTransactionStatusAsync(t.TransactionId.ToString()).GetAwaiter().GetResult();
                if(result != null) {
                    var tnx = _appDbContext.Transactions.Find(t.TransactionId);
                    if(tnx != null) {
                        tnx.State = result.State;
                        _appDbContext.Transactions.Update(tnx);
                        _appDbContext.SaveChanges();
                        TransactionStatus newStatus = new TransactionStatus() {
                            Status = tnx.State,
                            TransactionId = tnx.Id,
                            UpdatedDate = DateTime.UtcNow,
                        };
                        _appDbContext.TransactionStatuses.Add(newStatus);
                        _appDbContext.SaveChanges();
                    }
                }
            };
            Console.WriteLine("Job executed at: " + DateTime.Now);
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) {
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose() {
        _timer?.Dispose();
    }
}
}
