using NexAware.HomeAI.Application.DTOs.Chat;
using NexAware.HomeAI.Domain.Entities;

namespace NexAware.HomeAI.Application.Interfaces.Services;

public interface IChatService
{
    Task<Conversation> CreateConversationAsync(Guid householdId, Guid userId, string title, CancellationToken cancellationToken);
    Task<Conversation?> GetConversationAsync(Guid householdId, Guid conversationId, CancellationToken cancellationToken);
    Task<IEnumerable<Conversation>> GetConversationsAsync(Guid householdId, Guid userId, CancellationToken cancellationToken);
    Task DeleteConversationAsync(Guid householdId, Guid conversationId, CancellationToken cancellationToken);
    Task<ChatMessage> AddMessageAsync(Guid householdId, Guid conversationId, string role, string content, CancellationToken cancellationToken);
    IAsyncEnumerable<string> StreamChatCompletionAsync(Guid householdId, Guid conversationId, CancellationToken cancellationToken);
}
