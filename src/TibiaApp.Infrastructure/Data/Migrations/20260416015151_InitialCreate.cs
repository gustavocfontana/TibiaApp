using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TibiaApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "creatures",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    race = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    image_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    last_synced_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_creatures", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "soul_cores",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    creature_race = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    acquired_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_soul_cores", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_creatures_race",
                table: "creatures",
                column: "race",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_soul_cores_user_id",
                table: "soul_cores",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_soul_cores_user_id_creature_race",
                table: "soul_cores",
                columns: new[] { "user_id", "creature_race" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "creatures");

            migrationBuilder.DropTable(
                name: "soul_cores");
        }
    }
}
