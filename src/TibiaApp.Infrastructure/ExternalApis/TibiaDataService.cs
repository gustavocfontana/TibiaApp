using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;
using TibiaApp.Application.Interfaces;

namespace TibiaApp.Infrastructure.ExternalApis;

public class TibiaDataService : ITibiaDataService
{
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
    };

    public TibiaDataService(HttpClient httpClient, IMemoryCache cache)
    {
        _httpClient = httpClient;
        _cache = cache;
    }

    public async Task<List<TibiaDataCreature>> GetCreaturesAsync(CancellationToken ct = default)
    {
        var response = await _httpClient.GetFromJsonAsync<CreaturesApiResponse>("v4/creatures", JsonOptions, ct);

        return response?.Creatures?.CreatureList?
            .Select(c => new TibiaDataCreature(c.Name, c.Race, c.ImageUrl))
            .ToList() ?? [];
    }

    public async Task<List<TibiaDataSpell>> GetSpellsAsync(CancellationToken ct = default)
    {
        return await _cache.GetOrCreateAsync("spells", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24);

            var response = await _httpClient.GetFromJsonAsync<SpellsApiResponse>("v4/spells", JsonOptions, ct);

            return response?.Spells?.SpellList?
                .Select(s => new TibiaDataSpell(
                    s.Name, s.SpellId, s.Formula, s.Level, s.Mana,
                    s.GroupAttack, s.GroupHealing, s.GroupSupport,
                    s.TypeInstant, s.TypeRune, s.PremiumOnly))
                .ToList() ?? [];
        }) ?? [];
    }

    public async Task<TibiaDataWorldsSummary> GetWorldsAsync(CancellationToken ct = default)
    {
        return await _cache.GetOrCreateAsync("worlds", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

            var response = await _httpClient.GetFromJsonAsync<WorldsApiResponse>("v4/worlds", JsonOptions, ct);

            var worlds = response?.Worlds?.RegularWorlds?
                .Select(w => new TibiaDataWorld(
                    w.Name, w.Status, w.PlayersOnline, w.Location,
                    w.PvpType, w.BattleyeProtected, w.BattleyeDate, w.TransferType))
                .ToList() ?? [];

            return new TibiaDataWorldsSummary(
                response?.Worlds?.PlayersOnline ?? 0,
                response?.Worlds?.RecordPlayers ?? 0,
                worlds);
        }) ?? new TibiaDataWorldsSummary(0, 0, []);
    }

    public async Task<List<TibiaDataHighscoreEntry>> GetHighscoresAsync(
        string world, string category, string vocation, int page, CancellationToken ct = default)
    {
        var response = await _httpClient.GetFromJsonAsync<HighscoresApiResponse>(
            $"v4/highscores/{world}/{category}/{vocation}/{page}", JsonOptions, ct);

        return response?.Highscores?.HighscoreList?
            .Select(h => new TibiaDataHighscoreEntry(h.Rank, h.Name, h.Vocation, h.World, h.Level, h.Value))
            .ToList() ?? [];
    }
}

// ── API Response Models ──

internal class CreaturesApiResponse
{
    public CreaturesData? Creatures { get; set; }
}

internal class CreaturesData
{
    public List<CreatureItem>? CreatureList { get; set; }
}

internal class CreatureItem
{
    public string Name { get; set; } = "";
    public string Race { get; set; } = "";
    public string ImageUrl { get; set; } = "";
}

internal class SpellsApiResponse
{
    public SpellsData? Spells { get; set; }
}

internal class SpellsData
{
    public List<SpellItem>? SpellList { get; set; }
}

internal class SpellItem
{
    public string Name { get; set; } = "";
    public string SpellId { get; set; } = "";
    public string Formula { get; set; } = "";
    public int Level { get; set; }
    public int Mana { get; set; }
    public bool GroupAttack { get; set; }
    public bool GroupHealing { get; set; }
    public bool GroupSupport { get; set; }
    public bool TypeInstant { get; set; }
    public bool TypeRune { get; set; }
    public bool PremiumOnly { get; set; }
}

internal class WorldsApiResponse
{
    public WorldsData? Worlds { get; set; }
}

internal class WorldsData
{
    public int PlayersOnline { get; set; }
    public int RecordPlayers { get; set; }
    public List<WorldItem>? RegularWorlds { get; set; }
}

internal class WorldItem
{
    public string Name { get; set; } = "";
    public string Status { get; set; } = "";
    public int PlayersOnline { get; set; }
    public string Location { get; set; } = "";
    public string PvpType { get; set; } = "";
    public bool BattleyeProtected { get; set; }
    public string BattleyeDate { get; set; } = "";
    public string TransferType { get; set; } = "";
}

internal class HighscoresApiResponse
{
    public HighscoresData? Highscores { get; set; }
}

internal class HighscoresData
{
    public List<HighscoreItem>? HighscoreList { get; set; }
}

internal class HighscoreItem
{
    public int Rank { get; set; }
    public string Name { get; set; } = "";
    public string Vocation { get; set; } = "";
    public string World { get; set; } = "";
    public int Level { get; set; }
    public long Value { get; set; }
}
