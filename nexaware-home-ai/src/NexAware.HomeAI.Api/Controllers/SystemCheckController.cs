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
        string? dbError = null;
        bool tablesExist = false;
        string? tableError = null;
        bool documentsVolumeOk = false;
        string? mountError = null;

        // 1. Verify Database Connection
        try
        {
            dbConnected = await _context.Database.CanConnectAsync();
            if (!dbConnected) dbError = "Connection returned false. Is the server running and credentials correct?";
        }
        catch (System.Exception ex) 
        { 
            dbError = ex.Message; 
        }

        // 2. Verify Tables Exist
        if (dbConnected)
        {
            try
            {
                // Simple test against a known table, e.g. Users or Households
                tablesExist = await _context.Users.AnyAsync() || (await _context.Users.CountAsync() >= 0);
            }
            catch (System.Exception ex)
            {
                tablesExist = false;
                tableError = ex.Message;
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
        catch (System.Exception ex)
        {
            documentsVolumeOk = false;
            mountError = ex.Message;
        }

        return Ok(new
        {
            DatabaseName = _context.Database.GetDbConnection().Database,
            DatabaseConnected = dbConnected,
            DbError = dbError,
            TablesExist = tablesExist,
            TableError = tableError,
            DocumentsVolumeConfigured = documentsVolumeOk,
            MountError = mountError,
            IsReady = dbConnected && tablesExist && documentsVolumeOk
        });
    }
}
