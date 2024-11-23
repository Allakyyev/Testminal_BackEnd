using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.Data {
    public class AppDbContext : IdentityDbContext<ApplicationUser> {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Terminal> Terminals { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<TransactionStatus> TransactionStatuses { get; set; }
        public DbSet<Encashment> Encashments { get; set; }
        public DbSet<Topup> Topups { get; set; }
        public DbSet<GlobalSetting> GlobalSettings { get; set; }
        public DbSet<TerminalLog> TerminalLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder) {
            builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
            builder.Entity<GlobalSetting>().HasData(
                new GlobalSetting { Id = 1, Key = GlobalSettingKey.LimitDaySumAmountOfPnone, Value = String.Empty },
                new GlobalSetting { Id = 2, Key = GlobalSettingKey.LimitAmountOfOneTransaction, Value = "500" }
            );
            base.OnModelCreating(builder);
        }
    }
}
