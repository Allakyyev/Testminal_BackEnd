using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Terminal_BackEnd.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EncashmentsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TransactionStatus_Transactions_TransactionId",
                table: "TransactionStatus");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TransactionStatus",
                table: "TransactionStatus");

            migrationBuilder.RenameTable(
                name: "TransactionStatus",
                newName: "TransactionStatuses");

            migrationBuilder.RenameIndex(
                name: "IX_TransactionStatus_TransactionId",
                table: "TransactionStatuses",
                newName: "IX_TransactionStatuses_TransactionId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TransactionStatuses",
                table: "TransactionStatuses",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Encashment",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EncashmentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TerminalId = table.Column<long>(type: "bigint", nullable: false),
                    EncashmentSum = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Encashment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Encashment_Terminals_TerminalId",
                        column: x => x.TerminalId,
                        principalTable: "Terminals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Encashment_TerminalId",
                table: "Encashment",
                column: "TerminalId");

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionStatuses_Transactions_TransactionId",
                table: "TransactionStatuses",
                column: "TransactionId",
                principalTable: "Transactions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TransactionStatuses_Transactions_TransactionId",
                table: "TransactionStatuses");

            migrationBuilder.DropTable(
                name: "Encashment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TransactionStatuses",
                table: "TransactionStatuses");

            migrationBuilder.RenameTable(
                name: "TransactionStatuses",
                newName: "TransactionStatus");

            migrationBuilder.RenameIndex(
                name: "IX_TransactionStatuses_TransactionId",
                table: "TransactionStatus",
                newName: "IX_TransactionStatus_TransactionId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TransactionStatus",
                table: "TransactionStatus",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionStatus_Transactions_TransactionId",
                table: "TransactionStatus",
                column: "TransactionId",
                principalTable: "Transactions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
