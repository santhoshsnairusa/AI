using Microsoft.EntityFrameworkCore;
using NexAware.HomeAI.Application.Interfaces.Persistence;
using NexAware.HomeAI.Application.Interfaces.Services;
using NexAware.HomeAI.Domain.Entities;

namespace NexAware.HomeAI.Application.Services;

public class HouseholdItemService : IHouseholdItemService
{
    private readonly IApplicationDbContext _context;

    public HouseholdItemService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<HouseholdItem>> GetItemsAsync(Guid householdId, CancellationToken cancellationToken)
    {
        return await _context.HouseholdItems
            .Where(i => i.HouseholdId == householdId)
            .OrderByDescending(i => i.UpdatedOn)
            .ToListAsync(cancellationToken);
    }

    public async Task<HouseholdItem?> GetItemAsync(Guid householdId, Guid itemId, CancellationToken cancellationToken)
    {
        return await _context.HouseholdItems
            .FirstOrDefaultAsync(i => i.HouseholdId == householdId && i.Id == itemId, cancellationToken);
    }

    public async Task<HouseholdItem> CreateItemAsync(Guid householdId, HouseholdItem item, CancellationToken cancellationToken)
    {
        item.HouseholdId = householdId;
        item.CreatedOn = DateTimeOffset.UtcNow;
        item.UpdatedOn = DateTimeOffset.UtcNow;
        
        _context.HouseholdItems.Add(item);
        await _context.SaveChangesAsync(cancellationToken);
        
        return item;
    }

    public async Task<HouseholdItem> UpdateItemAsync(Guid householdId, HouseholdItem item, CancellationToken cancellationToken)
    {
        var existing = await _context.HouseholdItems
            .FirstOrDefaultAsync(i => i.HouseholdId == householdId && i.Id == item.Id, cancellationToken)
            ?? throw new Exception("Item not found");

        existing.Name = item.Name;
        existing.Category = item.Category;
        existing.Description = item.Description;
        existing.Brand = item.Brand;
        existing.ModelNumber = item.ModelNumber;
        existing.SerialNumber = item.SerialNumber;
        existing.PurchaseDate = item.PurchaseDate;
        existing.PurchasePrice = item.PurchasePrice;
        existing.ExpiryDate = item.ExpiryDate;
        existing.WarrantyStartDate = item.WarrantyStartDate;
        existing.WarrantyEndDate = item.WarrantyEndDate;
        existing.StorageLocation = item.StorageLocation;
        existing.Supplier = item.Supplier;
        existing.Notes = item.Notes;
        existing.UpdatedOn = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return existing;
    }

    public async Task DeleteItemAsync(Guid householdId, Guid itemId, CancellationToken cancellationToken)
    {
        var existing = await _context.HouseholdItems
            .FirstOrDefaultAsync(i => i.HouseholdId == householdId && i.Id == itemId, cancellationToken);
            
        if (existing != null)
        {
            _context.HouseholdItems.Remove(existing);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
