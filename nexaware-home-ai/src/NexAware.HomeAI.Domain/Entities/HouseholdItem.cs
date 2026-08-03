namespace NexAware.HomeAI.Domain.Entities;

public class HouseholdItem
{
    public Guid Id { get; set; }
    public Guid HouseholdId { get; set; }
    public Household? Household { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Brand { get; set; }
    public string? ModelNumber { get; set; }
    public string? SerialNumber { get; set; }
    public DateTimeOffset? PurchaseDate { get; set; }
    public decimal? PurchasePrice { get; set; }
    public DateTimeOffset? ExpiryDate { get; set; }
    public DateTimeOffset? WarrantyStartDate { get; set; }
    public DateTimeOffset? WarrantyEndDate { get; set; }
    public string? StorageLocation { get; set; }
    public string? Supplier { get; set; }
    public string? Notes { get; set; }
    public string? AttachmentPath { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTimeOffset CreatedOn { get; set; }
    public DateTimeOffset UpdatedOn { get; set; }
}
