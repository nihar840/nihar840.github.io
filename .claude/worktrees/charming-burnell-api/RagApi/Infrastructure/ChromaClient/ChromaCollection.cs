using System.Text.Json.Serialization;

namespace RagApi.Infrastructure.ChromaClient;

public class ChromaCollection
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}
