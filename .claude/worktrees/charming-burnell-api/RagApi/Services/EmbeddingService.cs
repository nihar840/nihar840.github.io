using RagApi.Infrastructure.OllamaClient;
using RagApi.Services.Interfaces;

namespace RagApi.Services;

public class EmbeddingService : IEmbeddingService
{
    private readonly OllamaHttpClient _ollama;

    public EmbeddingService(OllamaHttpClient ollama)
    {
        _ollama = ollama;
    }

    public Task<float[]> EmbedAsync(string text, CancellationToken ct = default)
        => _ollama.GetEmbeddingAsync(text, ct);

    public async Task<IReadOnlyList<float[]>> EmbedBatchAsync(
        IEnumerable<string> texts, CancellationToken ct = default)
    {
        var results = new List<float[]>();
        foreach (var text in texts)
        {
            ct.ThrowIfCancellationRequested();
            results.Add(await _ollama.GetEmbeddingAsync(text, ct));
        }
        return results;
    }
}
