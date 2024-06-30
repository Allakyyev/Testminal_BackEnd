using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Terminal_BackEnd.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EncashmentsTransaztionRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "EncharchmentId",
                table: "Transactions",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_EncharchmentId",
                table: "Transactions",
                column: "EncharchmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Encashment_EncharchmentId",
                table: "Transactions",
                column: "EncharchmentId",
                principalTable: "Encashment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Encashment_EncharchmentId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_EncharchmentId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "EncharchmentId",
                table: "Transactions");
        }
    }
}
