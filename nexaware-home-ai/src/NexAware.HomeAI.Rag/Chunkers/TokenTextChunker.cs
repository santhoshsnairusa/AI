using NexAware.HomeAI.Application.Interfaces.Rag;

namespace NexAware.HomeAI.Rag.Chunkers;

public class TokenTextChunker : ITextChunker
{
    // A simplified chunker based on words instead of actual BPE tokens for demonstration.
    // In a real application, you would use Microsoft.ML.Tokenizers or Tiktoken.
    
    public IEnumerable<string> ChunkText(string text, int maxTokens, int overlapTokens)
    {
        var words = text.Split(new[] { ' ', '\r', '\n', '\t' }, StringSplitOptions.RemoveEmptyEntries);
        var currentChunk = new List<string>();
        int currentCount = 0;

        for (int i = 0; i < words.Length; i++)
        {
            currentChunk.Add(words[i]);
            currentCount++;

            if (currentCount >= maxTokens)
            {
                yield return string.Join(" ", currentChunk);
                
                // Backtrack for overlap
                i -= overlapTokens;
                if (i < 0) i = 0;
                
                currentChunk.Clear();
                currentCount = 0;
            }
        }

        if (currentChunk.Count > 0)
        {
            yield return string.Join(" ", currentChunk);
        }
    }
}
