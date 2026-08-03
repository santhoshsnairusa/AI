using NexAware.HomeAI.Domain.Entities;

namespace NexAware.HomeAI.Application.Interfaces.Rag;

public interface IDocumentProcessingService
{
    Task ProcessDocumentAsync(Guid documentId, CancellationToken cancellationToken);
}
