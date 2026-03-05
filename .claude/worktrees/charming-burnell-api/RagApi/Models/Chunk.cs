namespace RagApi.Models;

public class Chunk
{
    public string Id { get; init; } = string.Empty;
    public string DocumentId { get; init; } = string.Empty;
    public int ChunkIndex { get; init; }
    public string Text { get; init; } = string.Empty;
    public Dictionary<string, string> Metadata { get; init; } = new();
}
