using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Terminal_BackEnd.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EnchargementrenamedtoEncashment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Encashments_EncharchmentId",
                table: "Transactions");

            migrationBuilder.RenameColumn(
                name: "EncharchmentId",
                table: "Transactions",
                newName: "EncargementId");

            migrationBuilder.RenameIndex(
                name: "IX_Transactions_EncharchmentId",
                table: "Transactions",
                newName: "IX_Transactions_EncargementId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Encashments_EncargementId",
                table: "Transactions",
                column: "EncargementId",
                principalTable: "Encashments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Encashments_EncargementId",
                table: "Transactions");

            migrationBuilder.RenameColumn(
                name: "EncargementId",
                table: "Transactions",
                newName: "EncharchmentId");

            migrationBuilder.RenameIndex(
                name: "IX_Transactions_EncargementId",
                table: "Transactions",
                newName: "IX_Transactions_EncharchmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Encashments_EncharchmentId",
                table: "Transactions",
                column: "EncharchmentId",
                principalTable: "Encashments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
