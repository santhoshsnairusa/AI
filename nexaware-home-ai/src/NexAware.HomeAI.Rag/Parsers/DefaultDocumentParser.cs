using System.Text;
using NexAware.HomeAI.Application.Interfaces.Rag;
using UglyToad.PdfPig;

namespace NexAware.HomeAI.Rag.Parsers;

public class DefaultDocumentParser : IDocumentParser
{
    public bool SupportsContentType(string contentType)
    {
        return contentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase) ||
               contentType.Equals("text/plain", StringComparison.OrdinalIgnoreCase);
    }

    public async Task<string> ParseAsync(Stream documentStream, string contentType, CancellationToken cancellationToken)
    {
        if (!SupportsContentType(contentType))
            throw new ArgumentException($"Unsupported content type: {contentType}");

        if (contentType.Equals("text/plain", StringComparison.OrdinalIgnoreCase))
        {
            using var reader = new StreamReader(documentStream, Encoding.UTF8, leaveOpen: true);
            return await reader.ReadToEndAsync(cancellationToken);
        }

        // Default to PDF parsing
        var textBuilder = new StringBuilder();

        using (var document = PdfDocument.Open(documentStream))
        {
            foreach (var page in document.GetPages())
            {
                cancellationToken.ThrowIfCancellationRequested();
                var text = page.Text;
                textBuilder.AppendLine(text);
            }
        }

        return await Task.FromResult(textBuilder.ToString());
    }
}
