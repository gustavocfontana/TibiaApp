using MediatR;
using Microsoft.AspNetCore.Mvc;
using TibiaApp.Application.Features.SoulCores.GetSoulCores;
using TibiaApp.Application.Features.SoulCores.ImportSoulCores;
using TibiaApp.Application.Features.SoulCores.ToggleSoulCore;

namespace TibiaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SoulCoresController : ControllerBase
{
    private readonly IMediator _mediator;

    // TODO: substituir por claim do token quando Keycloak for implementado
    private const string DefaultUserId = "dev-user";

    public SoulCoresController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetSoulCoresQuery(DefaultUserId), ct);
        return Ok(result);
    }

    [HttpPut("{race}")]
    public async Task<IActionResult> Toggle(string race, CancellationToken ct)
    {
        var result = await _mediator.Send(new ToggleSoulCoreCommand(DefaultUserId, race), ct);
        return Ok(result);
    }

    [HttpPost("import")]
    public async Task<IActionResult> Import([FromBody] ImportRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new ImportSoulCoresCommand(DefaultUserId, request.Owned), ct);
        return Ok(result);
    }

    [HttpDelete]
    public async Task<IActionResult> Reset(CancellationToken ct)
    {
        var result = await _mediator.Send(new ImportSoulCoresCommand(DefaultUserId, []), ct);
        return Ok(result);
    }
}

public record ImportRequest(List<string> Owned);
