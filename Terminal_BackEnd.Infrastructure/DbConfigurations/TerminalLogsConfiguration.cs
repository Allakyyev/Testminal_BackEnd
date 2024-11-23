using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.DbConfigurations {
    internal class TerminalLogsConfiguration : IEntityTypeConfiguration<TerminalLog> {
        public void Configure(EntityTypeBuilder<TerminalLog> builder) {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.TerminalId).IsRequired();
            builder.Property(p => p.LogDate).IsRequired();
            builder.Property(p => p.LogInfo).IsRequired();
            builder.HasOne(p => p.Terminal).WithMany(p => p.TerminalLogs).HasForeignKey(p => p.TerminalId);
        }
    }
}