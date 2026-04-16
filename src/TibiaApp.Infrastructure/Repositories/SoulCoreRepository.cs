using Microsoft.EntityFrameworkCore;
using TibiaApp.Application.Interfaces;
using TibiaApp.Domain.Entities;
using TibiaApp.Infrastructure.Data;

namespace TibiaApp.Infrastructure.Repositories;

public class SoulCoreRepository : ISoulCoreRepository
{
    private readonly AppDbContext _context;

    public SoulCoreRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<SoulCore>> GetByUserIdAsync(string userId, CancellationToken ct = default)
    {
        return await _context.SoulCores
            .Where(s => s.UserId == userId)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<SoulCore?> GetByUserAndRaceAsync(string userId, string creatureRace, CancellationToken ct = default)
    {
        return await _context.SoulCores
            .FirstOrDefaultAsync(s => s.UserId == userId && s.CreatureRace == creatureRace, ct);
    }

    public async Task AddAsync(SoulCore soulCore, CancellationToken ct = default)
    {
        await _context.SoulCores.AddAsync(soulCore, ct);
    }

    public async Task RemoveAsync(SoulCore soulCore, CancellationToken ct = default)
    {
        _context.SoulCores.Remove(soulCore);
        await Task.CompletedTask;
    }

    public async Task RemoveAllByUserIdAsync(string userId, CancellationToken ct = default)
    {
        await _context.SoulCores
            .Where(s => s.UserId == userId)
            .ExecuteDeleteAsync(ct);
    }

    public async Task AddRangeAsync(List<SoulCore> soulCores, CancellationToken ct = default)
    {
        await _context.SoulCores.AddRangeAsync(soulCores, ct);
    }

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _context.SaveChangesAsync(ct);
    }
}
