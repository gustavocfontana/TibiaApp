using Microsoft.EntityFrameworkCore;
using TibiaApp.Domain.Entities;

namespace TibiaApp.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public DbSet<Creature> Creatures => Set<Creature>();
    public DbSet<SoulCore> SoulCores => Set<SoulCore>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Creature>(entity =>
        {
            entity.ToTable("creatures");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Race).HasColumnName("race").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(200).IsRequired();
            entity.Property(e => e.ImageUrl).HasColumnName("image_url").HasMaxLength(500);
            entity.Property(e => e.LastSyncedAt).HasColumnName("last_synced_at");
            entity.HasIndex(e => e.Race).IsUnique();
        });

        modelBuilder.Entity<SoulCore>(entity =>
        {
            entity.ToTable("soul_cores");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id").HasMaxLength(100).IsRequired();
            entity.Property(e => e.CreatureRace).HasColumnName("creature_race").HasMaxLength(100).IsRequired();
            entity.Property(e => e.AcquiredAt).HasColumnName("acquired_at");
            entity.HasIndex(e => new { e.UserId, e.CreatureRace }).IsUnique();
            entity.HasIndex(e => e.UserId);
        });
    }
}
