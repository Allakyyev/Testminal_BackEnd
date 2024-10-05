using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Terminal_BackEnd.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Topups_Json_Recursive_Error2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Topups_AspNetUsers_UserId",
                table: "Topups");

            migrationBuilder.DropIndex(
                name: "IX_Topups_UserId",
                table: "Topups");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Topups",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "Topups",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Topups_ApplicationUserId",
                table: "Topups",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Topups_AspNetUsers_ApplicationUserId",
                table: "Topups",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Topups_AspNetUsers_ApplicationUserId",
                table: "Topups");

            migrationBuilder.DropIndex(
                name: "IX_Topups_ApplicationUserId",
                table: "Topups");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "Topups");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Topups",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Topups_UserId",
                table: "Topups",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Topups_AspNetUsers_UserId",
                table: "Topups",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
