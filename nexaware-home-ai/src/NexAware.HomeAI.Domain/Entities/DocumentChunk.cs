using Pgvector;

namespace NexAware.HomeAI.Domain.Entities;

public class DocumentChunk
{
    public Guid Id { get; set; }
    public Guid HouseholdId { get; set; }
    public Household? Household { get; set; }
    public Guid DocumentId { get; set; }
    public Document? Document { get; set; }
    public int ChunkNumber { get; set; }
    public string Content { get; set; } = string.Empty;
    public int TokenCount { get; set; }
    public int? PageNumber { get; set; }
    public string? SectionTitle { get; set; }
    public Vector? Embedding { get; set; } // Maps to pgvector
    public DateTimeOffset CreatedOn { get; set; }
}
