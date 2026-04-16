using MediatR;

namespace TibiaApp.Application.Features.SoulCores.GetSoulCores;

public record GetSoulCoresQuery(string UserId) : IRequest<GetSoulCoresResponse>;

public record SoulCoreItem(string Race, string Name, string ImageUrl, bool Owned);

public record GetSoulCoresResponse(List<SoulCoreItem> Items, int Total, int Owned, int Missing);
