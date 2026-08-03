namespace NexAware.HomeAI.Application.DTOs.Chat;

public class ChatRequest
{
    public IEnumerable<ChatMessageDto> Messages { get; set; } = new List<ChatMessageDto>();
    public float Temperature { get; set; } = 0.7f;
}
