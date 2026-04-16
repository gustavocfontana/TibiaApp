using TibiaApp.Domain.Entities;

namespace TibiaApp.Application.Interfaces;

public record TibiaDataCreature(string Name, string Race, string ImageUrl);
public record TibiaDataSpell(string Name, string SpellId, string Formula, int Level, int Mana, bool GroupAttack, bool GroupHealing, bool GroupSupport, bool TypeInstant, bool TypeRune, bool PremiumOnly);
public record TibiaDataWorld(string Name, string Status, int PlayersOnline, string Location, string PvpType, bool BattleyeProtected, string BattleyeDate, string TransferType);
public record TibiaDataWorldsSummary(int PlayersOnline, int RecordPlayers, List<TibiaDataWorld> Worlds);
public record TibiaDataHighscoreEntry(int Rank, string Name, string Vocation, string World, int Level, long Value);

public interface ITibiaDataService
{
    Task<List<TibiaDataCreature>> GetCreaturesAsync(CancellationToken ct = default);
    Task<List<TibiaDataSpell>> GetSpellsAsync(CancellationToken ct = default);
    Task<TibiaDataWorldsSummary> GetWorldsAsync(CancellationToken ct = default);
    Task<List<TibiaDataHighscoreEntry>> GetHighscoresAsync(string world, string category, string vocation, int page, CancellationToken ct = default);
}
