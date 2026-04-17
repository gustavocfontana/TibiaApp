using MediatR;
using TibiaApp.Application.Interfaces;

namespace TibiaApp.Application.Features.KillStatistics.GetKillStatistics;

public class GetKillStatisticsHandler : IRequestHandler<GetKillStatisticsQuery, GetKillStatisticsResponse>
{
    private readonly ITibiaDataService _tibiaDataService;

    public GetKillStatisticsHandler(ITibiaDataService tibiaDataService)
    {
        _tibiaDataService = tibiaDataService;
    }

    public async Task<GetKillStatisticsResponse> Handle(GetKillStatisticsQuery request, CancellationToken ct)
    {
        var entries = await _tibiaDataService.GetKillStatisticsAsync(request.World, ct);
        return new GetKillStatisticsResponse(request.World, entries);
    }
}
