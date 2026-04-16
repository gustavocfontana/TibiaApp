using MediatR;
using TibiaApp.Application.Interfaces;
using TibiaApp.Domain.Entities;

namespace TibiaApp.Application.Features.SoulCores.ToggleSoulCore;

public class ToggleSoulCoreHandler : IRequestHandler<ToggleSoulCoreCommand, ToggleSoulCoreResponse>
{
    private readonly ISoulCoreRepository _repository;

    public ToggleSoulCoreHandler(ISoulCoreRepository repository)
    {
        _repository = repository;
    }

    public async Task<ToggleSoulCoreResponse> Handle(ToggleSoulCoreCommand request, CancellationToken ct)
    {
        var existing = await _repository.GetByUserAndRaceAsync(request.UserId, request.CreatureRace, ct);

        if (existing is not null)
        {
            await _repository.RemoveAsync(existing, ct);
            await _repository.SaveChangesAsync(ct);
            return new ToggleSoulCoreResponse(request.CreatureRace, false);
        }

        var soulCore = SoulCore.Create(request.UserId, request.CreatureRace);
        await _repository.AddAsync(soulCore, ct);
        await _repository.SaveChangesAsync(ct);
        return new ToggleSoulCoreResponse(request.CreatureRace, true);
    }
}
