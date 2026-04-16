using MediatR;
using TibiaApp.Application.Interfaces;

namespace TibiaApp.Application.Features.Worlds.GetWorlds;

public record GetWorldsQuery : IRequest<GetWorldsResponse>;

public record GetWorldsResponse(List<TibiaDataWorld> Worlds, int PlayersOnline, int RecordPlayers);
