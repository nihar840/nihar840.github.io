using System.Runtime.CompilerServices;
using RagApi.Configuration;
using RagApi.Infrastructure.OllamaClient;
using RagApi.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace RagApi.Services;

public class LlmService : ILlmService
{
    private readonly OllamaHttpClient _ollama;
    private readonly OllamaOptions _opts;

    public LlmService(OllamaHttpClient ollama, IOptions<OllamaOptions> opts)
    {
        _ollama = ollama;
        _opts = opts.Value;
    }

    public Task<string> GenerateAsync(string prompt, CancellationToken ct = default)
        => _ollama.GenerateAsync(new OllamaGenerateRequest
        {
            Model = _opts.GenerationModel,
            Prompt = prompt,
            Options = new OllamaModelOptions { Temperature = 0.1f }
        }, ct);

    public async IAsyncEnumerable<string> GenerateStreamAsync(
        string prompt,
        [EnumeratorCancellation] CancellationToken ct = default)
    {
        var request = new OllamaGenerateRequest
        {
            Model = _opts.GenerationModel,
            Prompt = prompt,
            Options = new OllamaModelOptions { Temperature = 0.1f }
        };

        await foreach (var token in _ollama.GenerateStreamAsync(request, ct))
        {
            yield return token;
        }
    }
}
