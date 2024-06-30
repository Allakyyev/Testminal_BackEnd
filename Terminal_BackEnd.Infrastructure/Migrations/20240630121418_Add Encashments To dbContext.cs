using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Terminal_BackEnd.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEncashmentsTodbContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Encashment_Terminals_TerminalId",
                table: "Encashment");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Encashment_EncharchmentId",
                table: "Transactions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Encashment",
                table: "Encashment");

            migrationBuilder.RenameTable(
                name: "Encashment",
                newName: "Encashments");

            migrationBuilder.RenameIndex(
                name: "IX_Encashment_TerminalId",
                table: "Encashments",
                newName: "IX_Encashments_TerminalId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Encashments",
                table: "Encashments",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Encashments_Terminals_TerminalId",
                table: "Encashments",
                column: "TerminalId",
                principalTable: "Terminals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Encashments_EncharchmentId",
                table: "Transactions",
                column: "EncharchmentId",
                principalTable: "Encashments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Encashments_Terminals_TerminalId",
                table: "Encashments");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Encashments_EncharchmentId",
                table: "Transactions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Encashments",
                table: "Encashments");

            migrationBuilder.RenameTable(
                name: "Encashments",
                newName: "Encashment");

            migrationBuilder.RenameIndex(
                name: "IX_Encashments_TerminalId",
                table: "Encashment",
                newName: "IX_Encashment_TerminalId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Encashment",
                table: "Encashment",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Encashment_Terminals_TerminalId",
                table: "Encashment",
                column: "TerminalId",
                principalTable: "Terminals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Encashment_EncharchmentId",
                table: "Transactions",
                column: "EncharchmentId",
                principalTable: "Encashment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
