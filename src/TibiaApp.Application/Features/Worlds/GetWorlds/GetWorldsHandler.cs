using MediatR;
using TibiaApp.Application.Interfaces;

namespace TibiaApp.Application.Features.Worlds.GetWorlds;

public class GetWorldsHandler : IRequestHandler<GetWorldsQuery, GetWorldsResponse>
{
    private readonly ITibiaDataService _tibiaDataService;

    public GetWorldsHandler(ITibiaDataService tibiaDataService)
    {
        _tibiaDataService = tibiaDataService;
    }

    public async Task<GetWorldsResponse> Handle(GetWorldsQuery request, CancellationToken ct)
    {
        var summary = await _tibiaDataService.GetWorldsAsync(ct);
        return new GetWorldsResponse(summary.Worlds, summary.PlayersOnline, summary.RecordPlayers);
    }
}
