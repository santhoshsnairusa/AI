using Microsoft.EntityFrameworkCore;
using NexAware.HomeAI.Domain.Entities;

namespace NexAware.HomeAI.Application.Interfaces.Persistence;

public interface IApplicationDbContext
{
    DbSet<Household> Households { get; }
    DbSet<Conversation> Conversations { get; }
    DbSet<ChatMessage> ChatMessages { get; }
    DbSet<MessageCitation> MessageCitations { get; }
    DbSet<Document> Documents { get; }
    DbSet<DocumentChunk> DocumentChunks { get; }
    DbSet<HouseholdItem> HouseholdItems { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<AIResponseFeedback> AIResponseFeedbacks { get; }
    DbSet<ApplicationSetting> ApplicationSettings { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
