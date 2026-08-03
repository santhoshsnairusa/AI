namespace NexAware.HomeAI.Domain.Entities;

public class MessageCitation
{
    public Guid Id { get; set; }
    public Guid ChatMessageId { get; set; }
    public ChatMessage? ChatMessage { get; set; }
    public Guid DocumentId { get; set; }
    public Document? Document { get; set; }
    public Guid DocumentChunkId { get; set; }
    public DocumentChunk? DocumentChunk { get; set; }
    public string FileName { get; set; } = string.Empty;
    public int? PageNumber { get; set; }
    public float RelevanceScore { get; set; }
}
