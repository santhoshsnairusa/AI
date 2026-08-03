using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NexAware.HomeAI.Application.Interfaces.Persistence;
using NexAware.HomeAI.Domain.Entities;

namespace NexAware.HomeAI.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<User, UserRole, Guid>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Household> Households => Set<Household>();
    public DbSet<Conversation> Conversations => Set<Conversation>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<MessageCitation> MessageCitations => Set<MessageCitation>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<DocumentChunk> DocumentChunks => Set<DocumentChunk>();
    public DbSet<HouseholdItem> HouseholdItems => Set<HouseholdItem>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<AIResponseFeedback> AIResponseFeedbacks => Set<AIResponseFeedback>();
    public DbSet<ApplicationSetting> ApplicationSettings => Set<ApplicationSetting>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.HasPostgresExtension("vector");

        // ApplicationSetting configuration
        builder.Entity<ApplicationSetting>().HasKey(x => x.Key);

        // DocumentChunk vector mapping
        // nomic-embed-text uses 768 dimensions
        builder.Entity<DocumentChunk>()
            .Property(e => e.Embedding)
            .HasColumnType("vector(768)");
    }
}
