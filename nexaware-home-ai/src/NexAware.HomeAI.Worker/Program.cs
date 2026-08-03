using Microsoft.EntityFrameworkCore;
using NexAware.HomeAI.Application;
using NexAware.HomeAI.Infrastructure.Persistence;
using NexAware.HomeAI.Infrastructure;
using NexAware.HomeAI.Rag;
using NexAware.HomeAI.Worker;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddRagServices();

// Configure EF Core with PostgreSQL and pgvector for the worker
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Host=localhost;Database=nexawaredb;Username=nexaware;Password=your_secure_password";
    options.UseNpgsql(connectionString, o => o.UseVector());
});

builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
