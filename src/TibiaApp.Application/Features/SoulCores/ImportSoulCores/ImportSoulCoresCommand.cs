using MediatR;

namespace TibiaApp.Application.Features.SoulCores.ImportSoulCores;

public record ImportSoulCoresCommand(string UserId, List<string> Races) : IRequest<ImportSoulCoresResponse>;

public record ImportSoulCoresResponse(int Imported);
