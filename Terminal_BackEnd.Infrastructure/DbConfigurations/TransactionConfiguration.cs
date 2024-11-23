using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.DbConfigurations {
    internal class TransactionConfiguration : IEntityTypeConfiguration<Transaction> {
        public void Configure(EntityTypeBuilder<Transaction> builder) {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Msisdn).IsRequired();
            builder.Property(p => p.Amount).IsRequired();
            builder.Property(p => p.TerminalId).IsRequired();
            builder.Property(p => p.Status).IsRequired(false);
            builder.Property(p => p.RefNum).IsRequired(false);
            builder.Property(p => p.Service).IsRequired(false);
            builder.Property(p => p.State).IsRequired(false);
            builder.Property(p => p.Reason).IsRequired(false);
            builder.Property(p => p.CrossTransactionId).IsRequired(true);
            builder.Property(p => p.TransactionDate).IsRequired();
            builder.HasOne(p => p.Terminal).WithMany(p => p.Transactions).HasForeignKey(p => p.TerminalId);
            builder.HasMany(t => t.TransactionStatuses).WithOne(ts => ts.Transaction).HasForeignKey(ts => ts.TransactionId);
        }
    }
}