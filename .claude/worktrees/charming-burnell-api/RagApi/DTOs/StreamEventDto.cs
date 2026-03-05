namespace RagApi.DTOs;

public class StreamEventDto
{
    public string EventType { get; set; } = string.Empty; // "sources" | "token" | "done" | "error"
    public string? Token { get; set; }
    public List<SourceChunkDto>? Sources { get; set; }
    public string? FinishReason { get; set; }
    public int? TotalTokens { get; set; }
    public string? ErrorMessage { get; set; }
}
