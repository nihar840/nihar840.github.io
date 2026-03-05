namespace RagApi.Configuration;

public class RagOptions
{
    public const string SectionName = "Rag";
    public int DefaultTopK { get; set; } = 5;
    public int MaxContextTokens { get; set; } = 3000;
    public int ChunkSize { get; set; } = 400;
    public int ChunkOverlap { get; set; } = 80;
    public int MinChunkLength { get; set; } = 50;
}
