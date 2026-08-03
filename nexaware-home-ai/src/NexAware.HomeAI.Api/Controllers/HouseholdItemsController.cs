using Microsoft.AspNetCore.Mvc;
using NexAware.HomeAI.Application.Interfaces.Services;
using NexAware.HomeAI.Domain.Entities;

namespace NexAware.HomeAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HouseholdItemsController : ControllerBase
{
    private readonly IHouseholdItemService _service;

    public HouseholdItemsController(IHouseholdItemService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] Guid householdId, CancellationToken cancellationToken)
    {
        var items = await _service.GetItemsAsync(householdId, cancellationToken);
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id, [FromQuery] Guid householdId, CancellationToken cancellationToken)
    {
        var item = await _service.GetItemAsync(householdId, id, cancellationToken);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] HouseholdItem item, [FromQuery] Guid householdId, CancellationToken cancellationToken)
    {
        var created = await _service.CreateItemAsync(householdId, item, cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = created.Id, householdId }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(Guid id, [FromBody] HouseholdItem item, [FromQuery] Guid householdId, CancellationToken cancellationToken)
    {
        item.Id = id;
        var updated = await _service.UpdateItemAsync(householdId, item, cancellationToken);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, [FromQuery] Guid householdId, CancellationToken cancellationToken)
    {
        await _service.DeleteItemAsync(householdId, id, cancellationToken);
        return NoContent();
    }
}
