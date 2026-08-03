namespace NexAware.HomeAI.Domain.Entities;

public class Household
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTimeOffset CreatedOn { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
    public ICollection<Document> Documents { get; set; } = new List<Document>();
    public ICollection<HouseholdItem> HouseholdItems { get; set; } = new List<HouseholdItem>();
}
