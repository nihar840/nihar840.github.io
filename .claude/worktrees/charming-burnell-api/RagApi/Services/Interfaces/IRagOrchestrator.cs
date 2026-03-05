using RagApi.DTOs;
using RagApi.Models;

namespace RagApi.Services.Interfaces;

public interface IRagOrchestrator
{
    Task<(string Answer, IReadOnlyList<RetrievedContext> Sources)> QueryAsync(
        string userQuery, string collectionName, int topK, CancellationToken ct = default);

    IAsyncEnumerable<StreamEventDto> QueryStreamAsync(
        string userQuery, string collectionName, int topK, CancellationToken ct = default);

    Task<IngestResponseDto> IngestDocumentAsync(IngestRequestDto request, CancellationToken ct = default);
}
