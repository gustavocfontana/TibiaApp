using MediatR;
using TibiaApp.Application.Interfaces;

namespace TibiaApp.Application.Features.SoulCores.GetSoulCores;

public class GetSoulCoresHandler : IRequestHandler<GetSoulCoresQuery, GetSoulCoresResponse>
{
    private readonly ICreatureRepository _creatureRepository;
    private readonly ISoulCoreRepository _soulCoreRepository;
    private readonly ITibiaDataService _tibiaDataService;

    public GetSoulCoresHandler(
        ICreatureRepository creatureRepository,
        ISoulCoreRepository soulCoreRepository,
        ITibiaDataService tibiaDataService)
    {
        _creatureRepository = creatureRepository;
        _soulCoreRepository = soulCoreRepository;
        _tibiaDataService = tibiaDataService;
    }

    public async Task<GetSoulCoresResponse> Handle(GetSoulCoresQuery request, CancellationToken ct)
    {
        var creatures = await _creatureRepository.GetAllAsync(ct);

        if (creatures.Count == 0)
        {
            var apiCreatures = await _tibiaDataService.GetCreaturesAsync(ct);
            var newCreatures = apiCreatures
                .Select(c => Domain.Entities.Creature.Create(c.Race, c.Name, c.ImageUrl))
                .ToList();

            await _creatureRepository.UpsertRangeAsync(newCreatures, ct);
            await _creatureRepository.SaveChangesAsync(ct);
            creatures = await _creatureRepository.GetAllAsync(ct);
        }

        var ownedCores = await _soulCoreRepository.GetByUserIdAsync(request.UserId, ct);
        var ownedRaces = ownedCores.Select(s => s.CreatureRace).ToHashSet();

        var items = creatures
            .Select(c => new SoulCoreItem(c.Race, c.Name, c.ImageUrl, ownedRaces.Contains(c.Race)))
            .OrderBy(c => c.Name)
            .ToList();

        var total = items.Count;
        var owned = items.Count(i => i.Owned);

        return new GetSoulCoresResponse(items, total, owned, total - owned);
    }
}
