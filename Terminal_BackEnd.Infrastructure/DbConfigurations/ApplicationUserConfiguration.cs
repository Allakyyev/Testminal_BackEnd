using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.DbConfigurations {
    internal class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser> {
        public void Configure(EntityTypeBuilder<ApplicationUser> builder) {            
            builder.Property(p => p.FirstName).IsRequired(true);
            builder.Property(p => p.FamilyName).IsRequired(false);
            builder.Property(p => p.CompanyName).IsRequired(false);
            builder.Property(p => p.CompanyAddress).IsRequired(false);
            builder.Property(p => p.Address).IsRequired(false);
            builder.HasMany(p => p.Terminals).WithOne(p => p.ApplicationUser).HasForeignKey(p => p.TerminalId);            
        }
    }
}