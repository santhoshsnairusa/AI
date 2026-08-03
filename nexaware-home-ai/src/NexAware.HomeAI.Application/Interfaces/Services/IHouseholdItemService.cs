using NexAware.HomeAI.Domain.Entities;

namespace NexAware.HomeAI.Application.Interfaces.Services;

public interface IHouseholdItemService
{
    Task<IEnumerable<HouseholdItem>> GetItemsAsync(Guid householdId, CancellationToken cancellationToken);
    Task<HouseholdItem?> GetItemAsync(Guid householdId, Guid itemId, CancellationToken cancellationToken);
    Task<HouseholdItem> CreateItemAsync(Guid householdId, HouseholdItem item, CancellationToken cancellationToken);
    Task<HouseholdItem> UpdateItemAsync(Guid householdId, HouseholdItem item, CancellationToken cancellationToken);
    Task DeleteItemAsync(Guid householdId, Guid itemId, CancellationToken cancellationToken);
}
