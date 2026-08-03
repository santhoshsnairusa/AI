using Microsoft.EntityFrameworkCore;
using NexAware.HomeAI.Application.Interfaces.Persistence;
using NexAware.HomeAI.Application.Interfaces.Rag;

namespace NexAware.HomeAI.Worker;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IServiceScopeFactory _scopeFactory;

    public Worker(ILogger<Worker> logger, IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Document Processing Worker started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();
                var processingService = scope.ServiceProvider.GetRequiredService<IDocumentProcessingService>();

                var pendingDocument = await dbContext.Documents
                    .Where(d => d.Status == "Pending" && !d.IsDeleted)
                    .OrderBy(d => d.UploadedOn)
                    .FirstOrDefaultAsync(stoppingToken);

                if (pendingDocument != null)
                {
                    _logger.LogInformation("Found pending document {DocumentId}. Processing...", pendingDocument.Id);
                    
                    // Mark as processing to prevent other workers from picking it up
                    pendingDocument.Status = "Processing";
                    await dbContext.SaveChangesAsync(stoppingToken);

                    await processingService.ProcessDocumentAsync(pendingDocument.Id, stoppingToken);
                }
                else
                {
                    // Wait before polling again
                    await Task.Delay(5000, stoppingToken);
                }
            }
            catch (Exception ex) when (ex is not TaskCanceledException)
            {
                _logger.LogError(ex, "Error in Document Processing Worker");
                await Task.Delay(5000, stoppingToken); // delay on error
            }
        }
    }
}

