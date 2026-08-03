using Microsoft.Extensions.DependencyInjection;
using NexAware.HomeAI.Application.Interfaces.AI;
using NexAware.HomeAI.Application.Interfaces.Rag;
using NexAware.HomeAI.Application.Interfaces.Services;
using NexAware.HomeAI.Application.Services;

namespace NexAware.HomeAI.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IChatService, ChatService>();
        services.AddScoped<IDocumentProcessingService, DocumentProcessingService>();
        
        services.AddScoped<IHouseholdItemService, HouseholdItemService>();
        return services;
    }
}

