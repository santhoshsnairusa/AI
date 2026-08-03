namespace NexAware.HomeAI.Domain.Entities;

public class ChatMessage
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public Conversation? Conversation { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int InputTokens { get; set; }
    public int OutputTokens { get; set; }
    public float Confidence { get; set; }
    public DateTimeOffset CreatedOn { get; set; }
    public ICollection<MessageCitation> Citations { get; set; } = new List<MessageCitation>();
    public AIResponseFeedback? Feedback { get; set; }
}
