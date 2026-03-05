using System.Text.Json.Serialization;

namespace RagApi.Infrastructure.ChromaClient;

public class ChromaQueryRequest
{
    [JsonPropertyName("query_embeddings")]
    public List<float[]> QueryEmbeddings { get; set; } = new();

    [JsonPropertyName("n_results")]
    public int NResults { get; set; }

    [JsonPropertyName("include")]
    public List<string> Include { get; set; } = ["documents", "metadatas", "distances"];
}
