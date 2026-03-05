using System.Text.Json.Serialization;

namespace RagApi.Infrastructure.ChromaClient;

public class ChromaAddRequest
{
    [JsonPropertyName("ids")]
    public List<string> Ids { get; set; } = new();

    [JsonPropertyName("embeddings")]
    public List<float[]> Embeddings { get; set; } = new();

    [JsonPropertyName("metadatas")]
    public List<Dictionary<string, string>> Metadatas { get; set; } = new();

    [JsonPropertyName("documents")]
    public List<string> Documents { get; set; } = new();
}
