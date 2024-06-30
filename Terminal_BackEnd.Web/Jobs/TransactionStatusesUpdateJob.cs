namespace Terminal_BackEnd.Web.Jobs {
    public class TransactionStatusesUpdateJob : IHostedService, IDisposable {
        private Timer _timer;
        private readonly IHostEnvironment _environment;
        public TransactionStatusesUpdateJob(IHostEnvironment environment) {
            _environment = environment;
        }
        public Task StartAsync(CancellationToken cancellationToken) {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromMinutes(1)); // Change to desired interval
            return Task.CompletedTask;
        }

        private void DoWork(object state) {
            var contentRootPath = _environment.ContentRootPath;
            Console.WriteLine("Job executed at: " + DateTime.Now);
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
