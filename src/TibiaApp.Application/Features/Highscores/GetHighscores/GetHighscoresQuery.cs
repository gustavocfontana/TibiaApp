using MediatR;
using TibiaApp.Application.Interfaces;

namespace TibiaApp.Application.Features.Highscores.GetHighscores;

public record GetHighscoresQuery(
    string World,
    string Category,
    string Vocation,
    int Page) : IRequest<GetHighscoresResponse>;

public record GetHighscoresResponse(List<TibiaDataHighscoreEntry> Entries, string World, string Category, int Page);
