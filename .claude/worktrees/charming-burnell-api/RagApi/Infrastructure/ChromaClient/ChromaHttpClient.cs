using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace RagApi.Infrastructure.ChromaClient;

public class ChromaHttpClient
{
    private readonly HttpClient _http;
    private static readonly JsonSerializerOptions _json = new(JsonSerializerDefaults.Web);

    public ChromaHttpClient(IHttpClientFactory factory)
    {
        _http = factory.CreateClient("chroma");
    }

    public async Task<ChromaCollection> EnsureCollectionAsync(string name, CancellationToken ct = default)
    {
        // Try to get existing collection first
        try
        {
            var existing = await _http.GetFromJsonAsync<ChromaCollection>(
                $"/api/v1/collections/{name}", _json, ct);
            if (existing is not null) return existing;
        }
        catch (HttpRequestException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound) { }

        // Create it
        var payload = new { name, metadata = new { hnsw_space = "cosine" } };
        var response = await _http.PostAsJsonAsync("/api/v1/collections", payload, _json, ct);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<ChromaCollection>(_json, ct))!;
    }

    public async Task<ChromaCollection> GetCollectionAsync(string name, CancellationToken ct = default)
    {
        var result = await _http.GetFromJsonAsync<ChromaCollection>(
            $"/api/v1/collections/{name}", _json, ct);
        return result!;
    }

    public async Task AddEmbeddingsAsync(string collectionId, ChromaAddRequest request, CancellationToken ct = default)
    {
        var response = await _http.PostAsJsonAsync(
            $"/api/v1/collections/{collectionId}/add", request, _json, ct);
        response.EnsureSuccessStatusCode();
    }

    public async Task<ChromaQueryResponse> QueryAsync(
        string collectionId, ChromaQueryRequest request, CancellationToken ct = default)
    {
        var response = await _http.PostAsJsonAsync(
            $"/api/v1/collections/{collectionId}/query", request, _json, ct);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<ChromaQueryResponse>(_json, ct))!;
    }

    public async Task DeleteByMetadataAsync(
        string collectionId,
        Dictionary<string, object> whereFilter,
        CancellationToken ct = default)
    {
        var payload = new { where = whereFilter };
        var response = await _http.PostAsJsonAsync(
            $"/api/v1/collections/{collectionId}/delete", payload, _json, ct);
        response.EnsureSuccessStatusCode();
    }
}
