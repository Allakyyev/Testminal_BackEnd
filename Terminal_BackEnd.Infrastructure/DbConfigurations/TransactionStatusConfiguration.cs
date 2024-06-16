using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.DbConfigurations {
    internal class TransactionStatusConfiguration : IEntityTypeConfiguration<TransactionStatus> {
        public void Configure(EntityTypeBuilder<TransactionStatus> builder) {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Status).IsRequired(true);            
            builder.HasOne(p => p.Transaction).WithMany(p => p.TransactionStatuses).HasForeignKey(p => p.TransactionId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}