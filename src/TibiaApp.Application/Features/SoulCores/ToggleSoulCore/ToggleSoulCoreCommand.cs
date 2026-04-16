using MediatR;

namespace TibiaApp.Application.Features.SoulCores.ToggleSoulCore;

public record ToggleSoulCoreCommand(string UserId, string CreatureRace) : IRequest<ToggleSoulCoreResponse>;

public record ToggleSoulCoreResponse(string CreatureRace, bool Owned);
