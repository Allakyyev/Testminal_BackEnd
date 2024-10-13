using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Terminal_BackEnd.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Enchashmentstatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Encashments",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Encashments");
        }
    }
}
