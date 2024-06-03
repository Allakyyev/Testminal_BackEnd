﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.DbConfigurations {
    internal class TerminalConfiguration : IEntityTypeConfiguration<Terminal> {
        public void Configure(EntityTypeBuilder<Terminal> builder) {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.UserId).IsRequired(false);
            builder.Property(p => p.TerminalId).IsRequired(true);
            builder.Property(p => p.Name).IsRequired(true);
            builder.Property(p => p.Password).IsRequired(true);
            builder.HasOne(p => p.ApplicationUser).WithMany(p => p.Terminals).HasForeignKey(p => p.TerminalId);
        }
    }
}