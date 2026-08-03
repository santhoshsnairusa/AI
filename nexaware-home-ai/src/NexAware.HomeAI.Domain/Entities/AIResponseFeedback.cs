namespace NexAware.HomeAI.Domain.Entities;

public class AIResponseFeedback
{
    public Guid Id { get; set; }
    public Guid ChatMessageId { get; set; }
    public ChatMessage? ChatMessage { get; set; }
    public bool? IsHelpful { get; set; }
    public bool? IsIncorrect { get; set; }
    public bool? IsIncomplete { get; set; }
    public string? CorrectedAnswer { get; set; }
    public DateTimeOffset CreatedOn { get; set; }
}
