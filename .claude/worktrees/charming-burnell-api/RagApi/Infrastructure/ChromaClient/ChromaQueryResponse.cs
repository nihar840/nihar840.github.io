using System.Text.Json.Serialization;

namespace RagApi.Infrastructure.ChromaClient;

public class ChromaQueryResponse
{
    [JsonPropertyName("ids")]
    public List<List<string>> Ids { get; set; } = new();

    [JsonPropertyName("documents")]
    public List<List<string?>> Documents { get; set; } = new();

    [JsonPropertyName("metadatas")]
    public List<List<Dictionary<string, object>?>> Metadatas { get; set; } = new();

    [JsonPropertyName("distances")]
    public List<List<float>> Distances { get; set; } = new();
}
