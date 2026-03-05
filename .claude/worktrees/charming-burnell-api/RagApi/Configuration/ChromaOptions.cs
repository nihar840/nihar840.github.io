namespace RagApi.Configuration;

public class ChromaOptions
{
    public const string SectionName = "Chroma";
    public string BaseUrl { get; set; } = "http://localhost:8000";
    public string DefaultCollection { get; set; } = "portfolio-docs";
    public int EmbeddingDimension { get; set; } = 768;
}
