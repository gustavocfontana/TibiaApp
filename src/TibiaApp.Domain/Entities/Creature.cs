namespace TibiaApp.Domain.Entities;

public class Creature
{
    public int Id { get; private set; }
    public string Race { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public string ImageUrl { get; private set; } = string.Empty;
    public DateTime LastSyncedAt { get; private set; }

    private Creature() { }

    public static Creature Create(string race, string name, string imageUrl)
    {
        return new Creature
        {
            Race = race,
            Name = name,
            ImageUrl = imageUrl,
            LastSyncedAt = DateTime.UtcNow
        };
    }

    public void Update(string name, string imageUrl)
    {
        Name = name;
        ImageUrl = imageUrl;
        LastSyncedAt = DateTime.UtcNow;
    }
}
