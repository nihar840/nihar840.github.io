using System.Text.Json.Serialization;

namespace RagApi.Infrastructure.OllamaClient;

public class OllamaGenerateRequest
{
    [JsonPropertyName("model")]
    public string Model { get; set; } = string.Empty;

    [JsonPropertyName("prompt")]
    public string Prompt { get; set; } = string.Empty;

    [JsonPropertyName("stream")]
    public bool Stream { get; set; }

    [JsonPropertyName("options")]
    public OllamaModelOptions? Options { get; set; }
}

public class OllamaModelOptions
{
    [JsonPropertyName("temperature")]
    public float Temperature { get; set; } = 0.1f;

    [JsonPropertyName("num_predict")]
    public int NumPredict { get; set; } = 512;
}
