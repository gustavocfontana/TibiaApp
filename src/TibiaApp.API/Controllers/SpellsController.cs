using MediatR;
using Microsoft.AspNetCore.Mvc;
using TibiaApp.Application.Features.Spells.GetSpells;

namespace TibiaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SpellsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SpellsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetSpellsQuery(), ct);
        return Ok(result);
    }
}
