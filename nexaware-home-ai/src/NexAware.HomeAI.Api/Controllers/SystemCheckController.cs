using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexAware.HomeAI.Infrastructure.Persistence;
using System.IO;
using System.Threading.Tasks;

namespace NexAware.HomeAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SystemCheckController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SystemCheckController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("status")]
    public async Task<IActionResult> GetSystemStatus()
    {
        bool dbConnected = false;
        bool tablesExist = false;
        bool documentsVolumeOk = false;

        // 1. Verify Database Connection
        try
        {
            dbConnected = await _context.Database.CanConnectAsync();
        }
        catch { }

        // 2. Verify Tables Exist
        if (dbConnected)
        {
            try
            {
                // Simple test against a known table, e.g. Users or Households
                tablesExist = await _context.Users.AnyAsync() || (await _context.Users.CountAsync() >= 0);
            }
            catch
            {
                tablesExist = false;
            }
        }

        // 3. Verify Documents Volume Mount
        try
        {
            var storageFolder = Path.Combine(Directory.GetCurrentDirectory(), "App_Data", "Documents");
            if (!Directory.Exists(storageFolder))
            {
                Directory.CreateDirectory(storageFolder);
            }
            // Check write access
            var testFile = Path.Combine(storageFolder, "test-mount.tmp");
            await System.IO.File.WriteAllTextAsync(testFile, "test");
            System.IO.File.Delete(testFile);
            documentsVolumeOk = true;
        }
        catch
        {
            documentsVolumeOk = false;
        }

        return Ok(new
        {
            DatabaseConnected = dbConnected,
            TablesExist = tablesExist,
            DocumentsVolumeConfigured = documentsVolumeOk,
            IsReady = dbConnected && tablesExist && documentsVolumeOk
        });
    }
}
