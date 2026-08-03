using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;
using NexAware.HomeAI.Application.DTOs.Chat;
using NexAware.HomeAI.Application.Interfaces.AI;
using NexAware.HomeAI.Application.Interfaces.Persistence;
using NexAware.HomeAI.Application.Interfaces.Rag;
using NexAware.HomeAI.Application.Interfaces.Services;
using NexAware.HomeAI.Domain.Entities;
using Pgvector.EntityFrameworkCore;

namespace NexAware.HomeAI.Application.Services;

public class ChatService : IChatService
{
    private readonly IChatCompletionService _chatCompletionService;
    private readonly IApplicationDbContext _context;
    private readonly IEmbeddingService _embeddingService;

    public ChatService(
        IChatCompletionService chatCompletionService, 
        IApplicationDbContext context,
        IEmbeddingService embeddingService)
    {
        _chatCompletionService = chatCompletionService;
        _context = context;
        _embeddingService = embeddingService;
    }

    public async Task<Conversation> CreateConversationAsync(Guid householdId, Guid userId, string title, CancellationToken cancellationToken)
    {
        var conversation = new Conversation
        {
            HouseholdId = householdId,
            UserId = userId,
            Title = title,
            CreatedOn = DateTimeOffset.UtcNow,
            UpdatedOn = DateTimeOffset.UtcNow,
            IsDeleted = false
        };

        _context.Conversations.Add(conversation);
        await _context.SaveChangesAsync(cancellationToken);
        return conversation;
    }

    public async Task<Conversation?> GetConversationAsync(Guid householdId, Guid conversationId, CancellationToken cancellationToken)
    {
        return await _context.Conversations
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(c => c.HouseholdId == householdId && c.Id == conversationId && !c.IsDeleted, cancellationToken);
    }

    public async Task<IEnumerable<Conversation>> GetConversationsAsync(Guid householdId, Guid userId, CancellationToken cancellationToken)
    {
        return await _context.Conversations
            .Where(c => c.HouseholdId == householdId && c.UserId == userId && !c.IsDeleted)
            .OrderByDescending(c => c.UpdatedOn)
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteConversationAsync(Guid householdId, Guid conversationId, CancellationToken cancellationToken)
    {
        var conversation = await _context.Conversations
            .FirstOrDefaultAsync(c => c.HouseholdId == householdId && c.Id == conversationId, cancellationToken);

        if (conversation != null)
        {
            conversation.IsDeleted = true;
            conversation.UpdatedOn = DateTimeOffset.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<ChatMessage> AddMessageAsync(Guid householdId, Guid conversationId, string role, string content, CancellationToken cancellationToken)
    {
        var conversation = await _context.Conversations
            .FirstOrDefaultAsync(c => c.HouseholdId == householdId && c.Id == conversationId && !c.IsDeleted, cancellationToken)
            ?? throw new Exception("Conversation not found.");

        var message = new ChatMessage
        {
            ConversationId = conversationId,
            Role = role,
            Content = content,
            CreatedOn = DateTimeOffset.UtcNow
        };

        _context.ChatMessages.Add(message);
        conversation.UpdatedOn = DateTimeOffset.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return message;
    }
    
    public async IAsyncEnumerable<string> StreamChatCompletionAsync(Guid householdId, Guid conversationId, [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var conversation = await _context.Conversations
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(c => c.HouseholdId == householdId && c.Id == conversationId && !c.IsDeleted, cancellationToken)
            ?? throw new Exception("Conversation not found.");

        var messagesDto = conversation.Messages.OrderBy(m => m.CreatedOn).Select(m => new ChatMessageDto
        {
            Role = m.Role,
            Content = m.Content
        }).ToList();

        // RAG Integration:
        // Get the latest user message
        var latestUserMessage = messagesDto.LastOrDefault(m => m.Role == "user");
        if (latestUserMessage != null)
        {
            // Embed the query
            var queryEmbedding = await _embeddingService.GenerateEmbeddingAsync(latestUserMessage.Content, cancellationToken);
            
            // Search pgvector for closest chunks in this household
            var relevantChunks = await _context.DocumentChunks
                .Where(c => c.HouseholdId == householdId)
                .OrderBy(c => c.Embedding!.L2Distance(new Pgvector.Vector(queryEmbedding)))
                .Take(5)
                .Select(c => c.Content)
                .ToListAsync(cancellationToken);

            if (relevantChunks.Any())
            {
                var contextText = string.Join("\n\n---\n\n", relevantChunks);
                
                // Inject system message with context
                var systemMessage = new ChatMessageDto
                {
                    Role = "system",
                    Content = $"You are NexAware, a helpful home AI assistant. Use the following context from the user's household documents to answer their questions. If the answer is not in the context, just say you don't know based on the documents, but you can try to help generally.\n\nContext:\n{contextText}"
                };
                
                messagesDto.Insert(0, systemMessage);
            }
        }

        var request = new ChatRequest
        {
            Messages = messagesDto,
            Temperature = 0.7f
        };

        var assistantResponse = string.Empty;

        await foreach (var chunk in _chatCompletionService.StreamResponseAsync(request, cancellationToken))
        {
            assistantResponse += chunk;
            yield return chunk;
        }

        // Save assistant response
        var message = new ChatMessage
        {
            ConversationId = conversationId,
            Role = "assistant",
            Content = assistantResponse,
            CreatedOn = DateTimeOffset.UtcNow
        };

        _context.ChatMessages.Add(message);
        conversation.UpdatedOn = DateTimeOffset.UtcNow;
        await _context.SaveChangesAsync(CancellationToken.None); // Don't cancel saving if request cancels
    }
}

