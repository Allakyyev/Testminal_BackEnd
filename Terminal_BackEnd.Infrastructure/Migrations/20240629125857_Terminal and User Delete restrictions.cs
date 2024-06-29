using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Terminal_BackEnd.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TerminalandUserDeleterestrictions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Terminals_AspNetUsers_UserId",
                table: "Terminals");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Terminals_TerminalId",
                table: "Transactions");

            migrationBuilder.AddForeignKey(
                name: "FK_Terminals_AspNetUsers_UserId",
                table: "Terminals",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Terminals_TerminalId",
                table: "Transactions",
                column: "TerminalId",
                principalTable: "Terminals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Terminals_AspNetUsers_UserId",
                table: "Terminals");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Terminals_TerminalId",
                table: "Transactions");

            migrationBuilder.AddForeignKey(
                name: "FK_Terminals_AspNetUsers_UserId",
                table: "Terminals",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Terminals_TerminalId",
                table: "Transactions",
                column: "TerminalId",
                principalTable: "Terminals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
