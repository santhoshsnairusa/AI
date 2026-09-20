using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexAware.HomeAI.Application.Interfaces.Persistence;
using NexAware.HomeAI.Domain.Entities;
using System.Security.Claims;

namespace NexAware.HomeAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<DocumentsController> _logger;

    public DocumentsController(IApplicationDbContext context, ILogger<DocumentsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost]
    [RequestSizeLimit(50_000_000)] // 50MB
    public async Task<IActionResult> UploadDocument(IFormFile file, [FromForm] Guid householdId, [FromForm] string category = "Uncategorized", CancellationToken cancellationToken = default)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        // Simple auth simulation - in a real app, validate user belongs to household
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userId = Guid.TryParse(userIdString, out var parsedId) ? parsedId : Guid.Empty;

        var storageFolder = Path.Combine(Directory.GetCurrentDirectory(), "App_Data", "Documents", householdId.ToString());
        if (!Directory.Exists(storageFolder))
            Directory.CreateDirectory(storageFolder);

        var extension = Path.GetExtension(file.FileName);
        var safeFileName = $"{Guid.NewGuid()}{extension}";
        var storagePath = Path.Combine(storageFolder, safeFileName);

        using (var stream = new FileStream(storagePath, FileMode.Create, FileAccess.Write, FileShare.None, 4096, FileOptions.Asynchronous))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var document = new Document
        {
            Id = Guid.NewGuid(),
            HouseholdId = householdId,
            FileName = safeFileName,
            OriginalFileName = file.FileName,
            MimeType = file.ContentType,
            FileSize = file.Length,
            StoragePath = storagePath,
            Category = category,
            Status = "Pending",
            UploadedBy = userId,
            UploadedOn = DateTimeOffset.UtcNow
        };

        _context.Documents.Add(document);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Document {OriginalFileName} uploaded as {DocumentId} for Household {HouseholdId}", file.FileName, document.Id, householdId);

        return Ok(new { document.Id, document.OriginalFileName, document.Status });
    }

    [HttpGet]
    public async Task<IActionResult> GetDocuments([FromQuery] Guid householdId, CancellationToken cancellationToken)
    {
        var documents = await _context.Documents
            .Where(d => d.HouseholdId == householdId && !d.IsDeleted)
            .OrderByDescending(d => d.UploadedOn)
            .Select(d => new { d.Id, d.OriginalFileName, d.Category, d.Status, d.UploadedOn })
            .ToListAsync(cancellationToken);

        return Ok(documents);
    }

    [HttpGet("{id}/download")]
    public async Task<IActionResult> DownloadDocument(Guid id, [FromQuery] Guid householdId, CancellationToken cancellationToken)
    {
        var document = await _context.Documents
            .FirstOrDefaultAsync(d => d.Id == id && d.HouseholdId == householdId && !d.IsDeleted, cancellationToken);

        if (document == null)
            return NotFound("Document not found.");

        if (!System.IO.File.Exists(document.StoragePath))
            return NotFound("File not found on disk.");

        var stream = new FileStream(document.StoragePath, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.Asynchronous);
        return File(stream, document.MimeType ?? "application/octet-stream", document.OriginalFileName);
    }
}

