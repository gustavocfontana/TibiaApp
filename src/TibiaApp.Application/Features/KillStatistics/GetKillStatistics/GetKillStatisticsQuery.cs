using MediatR;
using TibiaApp.Application.Interfaces;

namespace TibiaApp.Application.Features.KillStatistics.GetKillStatistics;

public record GetKillStatisticsQuery(string World) : IRequest<GetKillStatisticsResponse>;

public record GetKillStatisticsResponse(string World, List<TibiaDataKillEntry> Entries);
