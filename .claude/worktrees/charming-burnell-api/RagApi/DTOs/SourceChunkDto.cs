namespace RagApi.DTOs;

public class SourceChunkDto
{
    public string DocumentId { get; set; } = string.Empty;
    public int ChunkIndex { get; set; }
    public string Text { get; set; } = string.Empty;
    public float Score { get; set; }
    public Dictionary<string, string> Metadata { get; set; } = new();
}
