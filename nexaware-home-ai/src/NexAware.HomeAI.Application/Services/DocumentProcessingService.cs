using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NexAware.HomeAI.Application.Interfaces.Persistence;
using NexAware.HomeAI.Application.Interfaces.Rag;
using NexAware.HomeAI.Domain.Entities;

namespace NexAware.HomeAI.Application.Services;

public class DocumentProcessingService : IDocumentProcessingService
{
    private readonly IApplicationDbContext _context;
    private readonly IDocumentParser _documentParser;
    private readonly ITextChunker _textChunker;
    private readonly IEmbeddingService _embeddingService;
    private readonly ILogger<DocumentProcessingService> _logger;

    public DocumentProcessingService(
        IApplicationDbContext context,
        IDocumentParser documentParser,
        ITextChunker textChunker,
        IEmbeddingService embeddingService,
        ILogger<DocumentProcessingService> logger)
    {
        _context = context;
        _documentParser = documentParser;
        _textChunker = textChunker;
        _embeddingService = embeddingService;
        _logger = logger;
    }

    public async Task ProcessDocumentAsync(Guid documentId, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting processing for document {DocumentId}", documentId);

        var document = await _context.Documents
            .FirstOrDefaultAsync(d => d.Id == documentId, cancellationToken);

        if (document == null)
        {
            _logger.LogWarning("Document {DocumentId} not found.", documentId);
            return;
        }

        try
        {
            // 1. Read file
            if (!File.Exists(document.StoragePath))
            {
                throw new FileNotFoundException("Document file not found on disk.", document.StoragePath);
            }

            string extractedText;
            using (var stream = new FileStream(document.StoragePath, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.Asynchronous))
            {
                // 2. Parse text
                extractedText = await _documentParser.ParseAsync(stream, document.MimeType, cancellationToken);
            }

            // 3. Chunk text
            var chunks = _textChunker.ChunkText(extractedText, maxTokens: 256, overlapTokens: 32).ToList();
            
            _logger.LogInformation("Extracted {ChunkCount} chunks from document {DocumentId}", chunks.Count, documentId);

            // 4. Generate embeddings and save chunks
            for (int i = 0; i < chunks.Count; i++)
            {
                var chunkText = chunks[i];
                var embedding = await _embeddingService.GenerateEmbeddingAsync(chunkText, cancellationToken);
                
                var documentChunk = new DocumentChunk
                {
                    Id = Guid.NewGuid(),
                    HouseholdId = document.HouseholdId,
                    DocumentId = document.Id,
                    ChunkNumber = i + 1,
                    Content = chunkText,
                    TokenCount = chunkText.Split(' ').Length, // Rough estimate
                    Embedding = new Pgvector.Vector(embedding),
                    CreatedOn = DateTimeOffset.UtcNow
                };

                _context.DocumentChunks.Add(documentChunk);
            }

            // 5. Update document status
            document.Status = "Processed";
            document.IndexedOn = DateTimeOffset.UtcNow;
            
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Successfully processed document {DocumentId}", documentId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing document {DocumentId}", documentId);
            document.Status = "Error";
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}

