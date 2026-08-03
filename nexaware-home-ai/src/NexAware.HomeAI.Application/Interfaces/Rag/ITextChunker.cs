namespace NexAware.HomeAI.Application.Interfaces.Rag;

public interface ITextChunker
{
    IEnumerable<string> ChunkText(string text, int maxTokens, int overlapTokens);
}
