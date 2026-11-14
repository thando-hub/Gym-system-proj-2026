using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProgrammeAssignments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TrainingProgrammeId",
                table: "GymMembers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GymMembers_TrainingProgrammeId",
                table: "GymMembers",
                column: "TrainingProgrammeId");

            migrationBuilder.AddForeignKey(
                name: "FK_GymMembers_TrainingProgramme_TrainingProgrammeId",
                table: "GymMembers",
                column: "TrainingProgrammeId",
                principalTable: "TrainingProgramme",
                principalColumn: "ProgrammeId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GymMembers_TrainingProgramme_TrainingProgrammeId",
                table: "GymMembers");

            migrationBuilder.DropIndex(
                name: "IX_GymMembers_TrainingProgrammeId",
                table: "GymMembers");

            migrationBuilder.DropColumn(
                name: "TrainingProgrammeId",
                table: "GymMembers");
        }
    }
}
