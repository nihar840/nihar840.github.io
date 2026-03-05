using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using RagApi.Configuration;
using Microsoft.Extensions.Options;

namespace RagApi.Infrastructure.OllamaClient;

public class OllamaHttpClient
{
    private readonly HttpClient _http;
    private readonly OllamaOptions _opts;
    private static readonly JsonSerializerOptions _json = new(JsonSerializerDefaults.Web);

    public OllamaHttpClient(IHttpClientFactory factory, IOptions<OllamaOptions> opts)
    {
        _http = factory.CreateClient("ollama");
        _opts = opts.Value;
    }

    public async Task<float[]> GetEmbeddingAsync(string text, CancellationToken ct = default)
    {
        var payload = new { model = _opts.EmbeddingModel, prompt = text };
        var response = await _http.PostAsJsonAsync("/api/embeddings", payload, ct);
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
        var embedding = json.GetProperty("embedding").EnumerateArray()
            .Select(e => e.GetSingle())
            .ToArray();
        return embedding;
    }

    public async Task<string> GenerateAsync(OllamaGenerateRequest request, CancellationToken ct = default)
    {
        request.Stream = false;
        var response = await _http.PostAsJsonAsync("/api/generate", request, _json, ct);
        response.EnsureSuccessStatusCode();
        var chunk = await response.Content.ReadFromJsonAsync<OllamaGenerateStreamChunk>(_json, ct);
        return chunk?.Response ?? string.Empty;
    }

    public async IAsyncEnumerable<string> GenerateStreamAsync(
        OllamaGenerateRequest request,
        [EnumeratorCancellation] CancellationToken ct = default)
    {
        request.Stream = true;
        var body = JsonSerializer.Serialize(request, _json);
        var content = new StringContent(body, Encoding.UTF8, "application/json");

        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, "/api/generate") { Content = content };
        using var response = await _http.SendAsync(httpRequest, HttpCompletionOption.ResponseHeadersRead, ct);
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(ct);
        using var reader = new StreamReader(stream);

        while (!reader.EndOfStream && !ct.IsCancellationRequested)
        {
            var line = await reader.ReadLineAsync(ct);
            if (string.IsNullOrWhiteSpace(line)) continue;

            var chunk = JsonSerializer.Deserialize<OllamaGenerateStreamChunk>(line, _json);
            if (chunk is null) continue;

            if (!string.IsNullOrEmpty(chunk.Response))
                yield return chunk.Response;

            if (chunk.Done) break;
        }
    }
}
