namespace NexAware.HomeAI.Domain.Entities;

public class ApplicationSetting
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTimeOffset UpdatedOn { get; set; }
}
