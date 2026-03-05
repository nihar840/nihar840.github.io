namespace RagApi.Configuration;

public class OllamaOptions
{
    public const string SectionName = "Ollama";
    public string BaseUrl { get; set; } = "http://localhost:11434";
    public string EmbeddingModel { get; set; } = "nomic-embed-text";
    public string GenerationModel { get; set; } = "llama3.2";
    public int RequestTimeoutSeconds { get; set; } = 120;
    public int StreamingTimeoutSeconds { get; set; } = 300;
}
