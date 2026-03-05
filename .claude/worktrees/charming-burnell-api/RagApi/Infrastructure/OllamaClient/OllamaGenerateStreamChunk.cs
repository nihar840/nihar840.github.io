using System.Text.Json.Serialization;

namespace RagApi.Infrastructure.OllamaClient;

public class OllamaGenerateStreamChunk
{
    [JsonPropertyName("response")]
    public string Response { get; set; } = string.Empty;

    [JsonPropertyName("done")]
    public bool Done { get; set; }

    [JsonPropertyName("eval_count")]
    public int? EvalCount { get; set; }
}
