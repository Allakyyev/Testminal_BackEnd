using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Terminal_BackEnd.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Addglobalsettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GlobalSettings",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<int>(type: "int", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GlobalSettings", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "GlobalSettings",
                columns: new[] { "Id", "Key", "Value" },
                values: new object[,]
                {
                    { 1L, 1, "" },
                    { 2L, 0, "500" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GlobalSettings");
        }
    }
}
