using RagApi.Models;

namespace RagApi.Services.Interfaces;

public interface IVectorStoreService
{
    Task EnsureCollectionAsync(string collectionName, CancellationToken ct = default);
    Task UpsertChunksAsync(string collectionName, IEnumerable<EmbeddedChunk> chunks, CancellationToken ct = default);
    Task<IReadOnlyList<RetrievedContext>> QueryAsync(string collectionName, float[] queryEmbedding, int topK, CancellationToken ct = default);
    Task DeleteDocumentChunksAsync(string collectionName, string documentId, CancellationToken ct = default);
}
