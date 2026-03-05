namespace RagApi.DTOs;

public class IngestRequestDto
{
    public string DocumentId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Dictionary<string, string> Metadata { get; set; } = new();
    public string CollectionName { get; set; } = "portfolio-docs";
}
