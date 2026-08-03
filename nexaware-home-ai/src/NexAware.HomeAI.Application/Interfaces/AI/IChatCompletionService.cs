using NexAware.HomeAI.Application.DTOs.Chat;

namespace NexAware.HomeAI.Application.Interfaces.AI;

public interface IChatCompletionService
{
    IAsyncEnumerable<string> StreamResponseAsync(
        ChatRequest request,
        CancellationToken cancellationToken);
}
