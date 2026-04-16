using MediatR;
using Microsoft.AspNetCore.Mvc;
using TibiaApp.Application.Features.Highscores.GetHighscores;

namespace TibiaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HighscoresController : ControllerBase
{
    private readonly IMediator _mediator;

    public HighscoresController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{world}/{category}/{vocation}/{page:int}")]
    public async Task<IActionResult> Get(string world, string category, string vocation, int page, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetHighscoresQuery(world, category, vocation, page), ct);
        return Ok(result);
    }
}
