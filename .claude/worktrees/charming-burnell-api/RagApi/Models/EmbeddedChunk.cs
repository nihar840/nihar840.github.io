namespace RagApi.Models;

public class EmbeddedChunk
{
    public Chunk Chunk { get; init; } = null!;
    public float[] Embedding { get; init; } = Array.Empty<float>();
}
