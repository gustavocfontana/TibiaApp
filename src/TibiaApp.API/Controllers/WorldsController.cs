using MediatR;
using Microsoft.AspNetCore.Mvc;
using TibiaApp.Application.Features.Worlds.GetWorlds;

namespace TibiaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorldsController : ControllerBase
{
    private readonly IMediator _mediator;

    public WorldsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetWorldsQuery(), ct);
        return Ok(result);
    }
}
