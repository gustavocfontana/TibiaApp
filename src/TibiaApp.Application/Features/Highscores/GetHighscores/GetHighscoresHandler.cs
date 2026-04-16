using MediatR;
using TibiaApp.Application.Interfaces;

namespace TibiaApp.Application.Features.Highscores.GetHighscores;

public class GetHighscoresHandler : IRequestHandler<GetHighscoresQuery, GetHighscoresResponse>
{
    private readonly ITibiaDataService _tibiaDataService;

    public GetHighscoresHandler(ITibiaDataService tibiaDataService)
    {
        _tibiaDataService = tibiaDataService;
    }

    public async Task<GetHighscoresResponse> Handle(GetHighscoresQuery request, CancellationToken ct)
    {
        var entries = await _tibiaDataService.GetHighscoresAsync(
            request.World, request.Category, request.Vocation, request.Page, ct);

        return new GetHighscoresResponse(entries, request.World, request.Category, request.Page);
    }
}
