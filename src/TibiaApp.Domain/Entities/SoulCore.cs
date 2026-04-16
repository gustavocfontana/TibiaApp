namespace TibiaApp.Domain.Entities;

public class SoulCore
{
    public int Id { get; private set; }
    public string UserId { get; private set; } = string.Empty;
    public string CreatureRace { get; private set; } = string.Empty;
    public DateTime AcquiredAt { get; private set; }

    private SoulCore() { }

    public static SoulCore Create(string userId, string creatureRace)
    {
        return new SoulCore
        {
            UserId = userId,
            CreatureRace = creatureRace,
            AcquiredAt = DateTime.UtcNow
        };
    }
}
