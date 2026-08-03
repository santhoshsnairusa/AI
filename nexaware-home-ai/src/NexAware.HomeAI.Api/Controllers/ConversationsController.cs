using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexAware.HomeAI.Application.Interfaces.Services;

namespace NexAware.HomeAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize] // Disabled for Stage 2 testing
public class ConversationsController : ControllerBase
{
    private readonly IChatService _chatService;

    // For Stage 2, we mock the user and household IDs
    private readonly Guid MockHouseholdId = Guid.Parse("00000000-0000-0000-0000-000000000001");
    private readonly Guid MockUserId = Guid.Parse("00000000-0000-0000-0000-000000000002");

    public ConversationsController(IChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateConversation([FromBody] CreateConversationRequest request, CancellationToken cancellationToken)
    {
        var conversation = await _chatService.CreateConversationAsync(MockHouseholdId, MockUserId, request.Title, cancellationToken);
        return Ok(conversation);
    }

    [HttpGet]
    public async Task<IActionResult> GetConversations(CancellationToken cancellationToken)
    {
        var conversations = await _chatService.GetConversationsAsync(MockHouseholdId, MockUserId, cancellationToken);
        return Ok(conversations);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetConversation(Guid id, CancellationToken cancellationToken)
    {
        var conversation = await _chatService.GetConversationAsync(MockHouseholdId, id, cancellationToken);
        if (conversation == null) return NotFound();
        return Ok(conversation);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteConversation(Guid id, CancellationToken cancellationToken)
    {
        await _chatService.DeleteConversationAsync(MockHouseholdId, id, cancellationToken);
        return NoContent();
    }

    [HttpPost("{id}/messages")]
    public async Task<IActionResult> AddMessage(Guid id, [FromBody] AddMessageRequest request, CancellationToken cancellationToken)
    {
        var message = await _chatService.AddMessageAsync(MockHouseholdId, id, request.Role, request.Content, cancellationToken);
        return Ok(message);
    }

    [HttpGet("{id}/stream")]
    public async Task StreamResponse(Guid id, CancellationToken cancellationToken)
    {
        Response.Headers.Append("Content-Type", "text/event-stream");
        Response.Headers.Append("Cache-Control", "no-cache");
        Response.Headers.Append("Connection", "keep-alive");

        var stream = _chatService.StreamChatCompletionAsync(MockHouseholdId, id, cancellationToken);

        await foreach (var chunk in stream)
        {
            var escapedChunk = chunk.Replace("\n", "\\n");
            var data = $"data: {escapedChunk}\n\n";
            var bytes = Encoding.UTF8.GetBytes(data);
            await Response.Body.WriteAsync(bytes, cancellationToken);
            await Response.Body.FlushAsync(cancellationToken);
        }

        var doneBytes = Encoding.UTF8.GetBytes("data: [DONE]\n\n");
        await Response.Body.WriteAsync(doneBytes, cancellationToken);
        await Response.Body.FlushAsync(cancellationToken);
    }
}

public class CreateConversationRequest
{
    public string Title { get; set; } = string.Empty;
}

public class AddMessageRequest
{
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}
