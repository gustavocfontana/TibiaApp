using TibiaApp.Domain.Entities;

namespace TibiaApp.Application.Interfaces;

public interface ICreatureRepository
{
    Task<List<Creature>> GetAllAsync(CancellationToken ct = default);
    Task<Creature?> GetByRaceAsync(string race, CancellationToken ct = default);
    Task UpsertRangeAsync(List<Creature> creatures, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
