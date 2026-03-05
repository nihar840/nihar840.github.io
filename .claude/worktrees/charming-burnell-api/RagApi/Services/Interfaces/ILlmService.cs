namespace RagApi.Services.Interfaces;

public interface ILlmService
{
    Task<string> GenerateAsync(string prompt, CancellationToken ct = default);
    IAsyncEnumerable<string> GenerateStreamAsync(string prompt, CancellationToken ct = default);
}
