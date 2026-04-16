using TibiaApp.Domain.Entities;

namespace TibiaApp.Application.Interfaces;

public interface ISoulCoreRepository
{
    Task<List<SoulCore>> GetByUserIdAsync(string userId, CancellationToken ct = default);
    Task<SoulCore?> GetByUserAndRaceAsync(string userId, string creatureRace, CancellationToken ct = default);
    Task AddAsync(SoulCore soulCore, CancellationToken ct = default);
    Task RemoveAsync(SoulCore soulCore, CancellationToken ct = default);
    Task RemoveAllByUserIdAsync(string userId, CancellationToken ct = default);
    Task AddRangeAsync(List<SoulCore> soulCores, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
