namespace RagApi.Models;

public class RetrievedContext
{
    public string ChunkId { get; init; } = string.Empty;
    public string DocumentId { get; init; } = string.Empty;
    public int ChunkIndex { get; init; }
    public string Text { get; init; } = string.Empty;
    public float Score { get; init; }
    public Dictionary<string, string> Metadata { get; init; } = new();
}
