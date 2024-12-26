using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Terminal_BackEnd.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TerminalAddressTerminalPhonenumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Terminals",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactPhoneNumber",
                table: "Terminals",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Terminals");

            migrationBuilder.DropColumn(
                name: "ContactPhoneNumber",
                table: "Terminals");
        }
    }
}
