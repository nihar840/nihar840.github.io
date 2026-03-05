namespace RagApi.DTOs;

public class IngestResponseDto
{
    public string DocumentId { get; set; } = string.Empty;
    public int ChunksCreated { get; set; }
    public string CollectionName { get; set; } = string.Empty;
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = new();
}
