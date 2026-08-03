using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NexAware.HomeAI.Application.Interfaces.AI;
using NexAware.HomeAI.Application.Interfaces.Persistence;
using NexAware.HomeAI.Application.Interfaces.Rag;
using NexAware.HomeAI.Infrastructure.AI.Ollama;
using NexAware.HomeAI.Infrastructure.Persistence;

namespace NexAware.HomeAI.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<OllamaOptions>(configuration.GetSection(OllamaOptions.SectionName));
        
        services.AddHttpClient<IChatCompletionService, OllamaChatCompletionService>(client => 
        {
            client.Timeout = TimeSpan.FromMinutes(5);
        });
        services.AddHttpClient<IEmbeddingService, OllamaEmbeddingService>(client => 
        {
            client.Timeout = TimeSpan.FromMinutes(5);
        });
        
        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        return services;
    }
}
