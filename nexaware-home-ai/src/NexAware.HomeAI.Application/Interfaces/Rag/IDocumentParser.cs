namespace NexAware.HomeAI.Application.Interfaces.Rag;

public interface IDocumentParser
{
    Task<string> ParseAsync(Stream documentStream, string contentType, CancellationToken cancellationToken);
    bool SupportsContentType(string contentType);
}
