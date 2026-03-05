namespace RagApi.DTOs;

public class SearchResponseDto
{
    public string Answer { get; set; } = string.Empty;
    public List<SourceChunkDto> Sources { get; set; } = new();
    public long LatencyMs { get; set; }
}
