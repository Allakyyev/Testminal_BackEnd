using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Terminal_BackEnd.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TransactionStatuses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Terminal_AspNetUsers_TerminalId",
                table: "Terminal");

            migrationBuilder.DropForeignKey(
                name: "FK_Transaction_Terminal_TerminalId",
                table: "Transaction");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Transaction",
                table: "Transaction");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Terminal",
                table: "Terminal");

            migrationBuilder.RenameTable(
                name: "Transaction",
                newName: "Transactions");

            migrationBuilder.RenameTable(
                name: "Terminal",
                newName: "Terminals");

            migrationBuilder.RenameIndex(
                name: "IX_Transaction_TerminalId",
                table: "Transactions",
                newName: "IX_Transactions_TerminalId");

            migrationBuilder.RenameIndex(
                name: "IX_Terminal_TerminalId",
                table: "Terminals",
                newName: "IX_Terminals_TerminalId");

            migrationBuilder.AlterColumn<long>(
                name: "TerminalId",
                table: "Transactions",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<long>(
                name: "Id",
                table: "Transactions",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("SqlServer:Identity", "1, 1")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<bool>(
                name: "PollingCallbackRegistered",
                table: "Transactions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<long>(
                name: "Id",
                table: "Terminals",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("SqlServer:Identity", "1, 1")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "Terminals",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_Transactions",
                table: "Transactions",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Terminals",
                table: "Terminals",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "TransactionStatus",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TransactionId = table.Column<long>(type: "bigint", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionStatus", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TransactionStatus_Transactions_TransactionId",
                        column: x => x.TransactionId,
                        principalTable: "Transactions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TransactionStatus_TransactionId",
                table: "TransactionStatus",
                column: "TransactionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Terminals_AspNetUsers_TerminalId",
                table: "Terminals",
                column: "TerminalId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Terminals_TerminalId",
                table: "Transactions",
                column: "TerminalId",
                principalTable: "Terminals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Terminals_AspNetUsers_TerminalId",
                table: "Terminals");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Terminals_TerminalId",
                table: "Transactions");

            migrationBuilder.DropTable(
                name: "TransactionStatus");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Transactions",
                table: "Transactions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Terminals",
                table: "Terminals");

            migrationBuilder.DropColumn(
                name: "PollingCallbackRegistered",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "Terminals");

            migrationBuilder.RenameTable(
                name: "Transactions",
                newName: "Transaction");

            migrationBuilder.RenameTable(
                name: "Terminals",
                newName: "Terminal");

            migrationBuilder.RenameIndex(
                name: "IX_Transactions_TerminalId",
                table: "Transaction",
                newName: "IX_Transaction_TerminalId");

            migrationBuilder.RenameIndex(
                name: "IX_Terminals_TerminalId",
                table: "Terminal",
                newName: "IX_Terminal_TerminalId");

            migrationBuilder.AlterColumn<int>(
                name: "TerminalId",
                table: "Transaction",
                type: "int",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Transaction",
                type: "int",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("SqlServer:Identity", "1, 1")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Terminal",
                type: "int",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("SqlServer:Identity", "1, 1")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Transaction",
                table: "Transaction",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Terminal",
                table: "Terminal",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Terminal_AspNetUsers_TerminalId",
                table: "Terminal",
                column: "TerminalId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transaction_Terminal_TerminalId",
                table: "Transaction",
                column: "TerminalId",
                principalTable: "Terminal",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
