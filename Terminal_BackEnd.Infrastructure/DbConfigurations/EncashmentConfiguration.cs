using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.DbConfigurations {
    internal class EncashmentConfiguration : IEntityTypeConfiguration<Encashment> {
        public void Configure(EntityTypeBuilder<Encashment> builder) {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.EncashmentDate).IsRequired();
            builder.Property(p => p.TerminalId).IsRequired();
            builder.Property(p => p.EncashmentSum).IsRequired();            
            builder.HasOne(p => p.Terminal).WithMany(p => p.Encashments).HasForeignKey(p => p.TerminalId).OnDelete(DeleteBehavior.Restrict);
            builder.HasMany(p => p.Transactions).WithOne(p => p.Encashment).HasForeignKey(p => p.EncargementId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}
