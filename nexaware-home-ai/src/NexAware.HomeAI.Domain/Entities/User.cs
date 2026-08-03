using Microsoft.AspNetCore.Identity;

namespace NexAware.HomeAI.Domain.Entities;

public class User : IdentityUser<Guid>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public Guid HouseholdId { get; set; }
    public Household? Household { get; set; }
}
