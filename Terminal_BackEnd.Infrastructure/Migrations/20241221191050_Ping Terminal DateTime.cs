using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Terminal_BackEnd.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class PingTerminalDateTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastPing",
                table: "Terminals",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastPing",
                table: "Terminals");
        }
    }
}
