using MediatR;
using TibiaApp.Application.Interfaces;
using TibiaApp.Domain.Entities;

namespace TibiaApp.Application.Features.SoulCores.ImportSoulCores;

public class ImportSoulCoresHandler : IRequestHandler<ImportSoulCoresCommand, ImportSoulCoresResponse>
{
    private readonly ISoulCoreRepository _repository;

    public ImportSoulCoresHandler(ISoulCoreRepository repository)
    {
        _repository = repository;
    }

    public async Task<ImportSoulCoresResponse> Handle(ImportSoulCoresCommand request, CancellationToken ct)
    {
        await _repository.RemoveAllByUserIdAsync(request.UserId, ct);

        var soulCores = request.Races
            .Distinct()
            .Select(race => SoulCore.Create(request.UserId, race))
            .ToList();

        await _repository.AddRangeAsync(soulCores, ct);
        await _repository.SaveChangesAsync(ct);

        return new ImportSoulCoresResponse(soulCores.Count);
    }
}
