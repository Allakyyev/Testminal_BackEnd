using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Terminal_BackEnd.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TerminalUserrelationcorrection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Terminals_AspNetUsers_TerminalId",
                table: "Terminals");

            migrationBuilder.DropIndex(
                name: "IX_Terminals_TerminalId",
                table: "Terminals");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Terminals",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TerminalId",
                table: "Terminals",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_Terminals_UserId",
                table: "Terminals",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Terminals_AspNetUsers_UserId",
                table: "Terminals",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Terminals_AspNetUsers_UserId",
                table: "Terminals");

            migrationBuilder.DropIndex(
                name: "IX_Terminals_UserId",
                table: "Terminals");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Terminals",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TerminalId",
                table: "Terminals",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Terminals_TerminalId",
                table: "Terminals",
                column: "TerminalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Terminals_AspNetUsers_TerminalId",
                table: "Terminals",
                column: "TerminalId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
