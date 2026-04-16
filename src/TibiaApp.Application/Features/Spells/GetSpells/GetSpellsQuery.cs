using MediatR;
using TibiaApp.Application.Interfaces;

namespace TibiaApp.Application.Features.Spells.GetSpells;

public record GetSpellsQuery : IRequest<GetSpellsResponse>;

public record GetSpellsResponse(List<TibiaDataSpell> Spells, int Total);
