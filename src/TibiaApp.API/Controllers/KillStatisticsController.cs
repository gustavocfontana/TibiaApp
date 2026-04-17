using MediatR;
using Microsoft.AspNetCore.Mvc;
using TibiaApp.Application.Features.KillStatistics.GetKillStatistics;

namespace TibiaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KillStatisticsController : ControllerBase
{
    private readonly IMediator _mediator;

    public KillStatisticsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{world}")]
    public async Task<IActionResult> GetByWorld(string world, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetKillStatisticsQuery(world), ct);
        return Ok(result);
    }
}
