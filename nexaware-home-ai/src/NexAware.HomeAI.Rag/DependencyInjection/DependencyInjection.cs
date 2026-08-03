using Microsoft.Extensions.DependencyInjection;
using NexAware.HomeAI.Application.Interfaces.Rag;
using NexAware.HomeAI.Rag.Chunkers;
using NexAware.HomeAI.Rag.Parsers;

namespace NexAware.HomeAI.Rag;

public static class DependencyInjection
{
    public static IServiceCollection AddRagServices(this IServiceCollection services)
    {
        services.AddScoped<IDocumentParser, DefaultDocumentParser>();
        services.AddScoped<ITextChunker, TokenTextChunker>();
        
        return services;
    }
}
