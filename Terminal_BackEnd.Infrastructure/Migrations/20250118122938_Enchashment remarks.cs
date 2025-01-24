using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Terminal_BackEnd.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Enchashmentremarks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "Encashments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "Encashments");
        }
    }
}
