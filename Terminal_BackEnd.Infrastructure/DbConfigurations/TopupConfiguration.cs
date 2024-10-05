using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.DbConfigurations {
    internal class TopupConfiguration : IEntityTypeConfiguration<Topup> {
        public void Configure(EntityTypeBuilder<Topup> builder) {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.TopupDate).IsRequired(true);
            builder.Property(p => p.TopupSum).IsRequired(true);
            builder.Property(p => p.UserId).IsRequired(false);            
        }
    }
}
