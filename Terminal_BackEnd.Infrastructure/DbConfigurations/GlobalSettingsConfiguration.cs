using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.DbConfigurations {
    internal class GlobalSettingsConfiguration : IEntityTypeConfiguration<GlobalSetting> {
        public void Configure(EntityTypeBuilder<GlobalSetting> builder) {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Key).IsRequired(true);
            builder.Property(p => p.Value).IsRequired(true);
        }
    }
}
