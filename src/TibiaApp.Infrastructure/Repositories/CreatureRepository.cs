using Microsoft.EntityFrameworkCore;
using TibiaApp.Application.Interfaces;
using TibiaApp.Domain.Entities;
using TibiaApp.Infrastructure.Data;

namespace TibiaApp.Infrastructure.Repositories;

public class CreatureRepository : ICreatureRepository
{
    private readonly AppDbContext _context;

    public CreatureRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Creature>> GetAllAsync(CancellationToken ct = default)
    {
        return await _context.Creatures
            .OrderBy(c => c.Name)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<Creature?> GetByRaceAsync(string race, CancellationToken ct = default)
    {
        return await _context.Creatures
            .FirstOrDefaultAsync(c => c.Race == race, ct);
    }

    public async Task UpsertRangeAsync(List<Creature> creatures, CancellationToken ct = default)
    {
        foreach (var creature in creatures)
        {
            var existing = await _context.Creatures
                .FirstOrDefaultAsync(c => c.Race == creature.Race, ct);

            if (existing is not null)
            {
                existing.Update(creature.Name, creature.ImageUrl);
            }
            else
            {
                await _context.Creatures.AddAsync(creature, ct);
            }
        }
    }

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _context.SaveChangesAsync(ct);
    }
}
