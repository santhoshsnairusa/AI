using Microsoft.EntityFrameworkCore;
using NexAware.HomeAI.Application;
using NexAware.HomeAI.Infrastructure;
using NexAware.HomeAI.Infrastructure.Persistence;
using NexAware.HomeAI.Domain.Entities;
using NexAware.HomeAI.Rag;
using NexAware.HomeAI.Worker;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});
builder.Services.AddCors(options => { options.AddPolicy("AllowAll", builder => { builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader(); }); });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure EF Core with PostgreSQL and pgvector
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Host=localhost;Database=nexawaredb;Username=nexaware;Password=your_secure_password";
    options.UseNpgsql(connectionString, o => o.UseVector());
});

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddRagServices();

// Add Background Worker
builder.Services.AddHostedService<Worker>();

// Configure Identity
builder.Services.AddIdentityCore<User>(options => {
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 8;
})
.AddRoles<UserRole>()
.AddEntityFrameworkStores<ApplicationDbContext>();

var app = builder.Build();

// Apply Migrations and Seed Demo Data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // Automatically run all pending migrations
    context.Database.Migrate();

    var mockHouseholdId = Guid.Parse("00000000-0000-0000-0000-000000000001");
    if (!context.Households.Any(h => h.Id == mockHouseholdId))
    {
        context.Households.Add(new Household { Id = mockHouseholdId, Name = "Demo Household", CreatedOn = DateTimeOffset.UtcNow });
    }

    var mockUserId = Guid.Parse("00000000-0000-0000-0000-000000000002");
    if (!context.Users.Any(u => u.Id == mockUserId))
    {
        context.Users.Add(new User { Id = mockUserId, UserName = "demo_user", Email = "demo@example.com", HouseholdId = mockHouseholdId });
    }
    
    context.SaveChanges();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();


