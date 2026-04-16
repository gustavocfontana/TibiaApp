using MediatR;
using TibiaApp.Application.Interfaces;

namespace TibiaApp.Application.Features.Spells.GetSpells;

public class GetSpellsHandler : IRequestHandler<GetSpellsQuery, GetSpellsResponse>
{
    private readonly ITibiaDataService _tibiaDataService;

    public GetSpellsHandler(ITibiaDataService tibiaDataService)
    {
        _tibiaDataService = tibiaDataService;
    }

    public async Task<GetSpellsResponse> Handle(GetSpellsQuery request, CancellationToken ct)
    {
        var spells = await _tibiaDataService.GetSpellsAsync(ct);
        return new GetSpellsResponse(spells, spells.Count);
    }
}
