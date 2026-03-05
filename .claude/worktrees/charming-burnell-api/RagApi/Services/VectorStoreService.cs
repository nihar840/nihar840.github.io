using RagApi.Infrastructure.ChromaClient;
using RagApi.Models;
using RagApi.Services.Interfaces;

namespace RagApi.Services;

public class VectorStoreService : IVectorStoreService
{
    private readonly ChromaHttpClient _chroma;
    // Cache collection name → id to avoid repeated lookups
    private readonly Dictionary<string, string> _collectionIdCache = new();

    public VectorStoreService(ChromaHttpClient chroma)
    {
        _chroma = chroma;
    }

    public async Task EnsureCollectionAsync(string collectionName, CancellationToken ct = default)
    {
        var collection = await _chroma.EnsureCollectionAsync(collectionName, ct);
        _collectionIdCache[collectionName] = collection.Id;
    }

    public async Task UpsertChunksAsync(
        string collectionName, IEnumerable<EmbeddedChunk> chunks, CancellationToken ct = default)
    {
        var collectionId = await GetCollectionIdAsync(collectionName, ct);
        var chunkList = chunks.ToList();

        var request = new ChromaAddRequest
        {
            Ids = chunkList.Select(c => c.Chunk.Id).ToList(),
            Embeddings = chunkList.Select(c => c.Embedding).ToList(),
            Metadatas = chunkList.Select(c => c.Chunk.Metadata).ToList(),
            Documents = chunkList.Select(c => c.Chunk.Text).ToList()
        };

        await _chroma.AddEmbeddingsAsync(collectionId, request, ct);
    }

    public async Task<IReadOnlyList<RetrievedContext>> QueryAsync(
        string collectionName, float[] queryEmbedding, int topK, CancellationToken ct = default)
    {
        var collectionId = await GetCollectionIdAsync(collectionName, ct);

        var request = new ChromaQueryRequest
        {
            QueryEmbeddings = [queryEmbedding],
            NResults = topK
        };

        var response = await _chroma.QueryAsync(collectionId, request, ct);
        var results = new List<RetrievedContext>();

        if (response.Ids.Count == 0) return results;

        var ids = response.Ids[0];
        var docs = response.Documents.Count > 0 ? response.Documents[0] : new();
        var metas = response.Metadatas.Count > 0 ? response.Metadatas[0] : new();
        var dists = response.Distances.Count > 0 ? response.Distances[0] : new();

        for (int i = 0; i < ids.Count; i++)
        {
            var meta = metas.ElementAtOrDefault(i);
            var metaStr = meta?
                .Where(kv => kv.Value is not null)
                .ToDictionary(kv => kv.Key, kv => kv.Value?.ToString() ?? string.Empty)
                ?? new Dictionary<string, string>();

            // ChromaDB returns cosine distance (0=identical, 2=opposite); convert to similarity
            var distance = dists.ElementAtOrDefault(i);
            var score = 1f - (distance / 2f);

            results.Add(new RetrievedContext
            {
                ChunkId = ids[i],
                DocumentId = metaStr.GetValueOrDefault("document_id", string.Empty),
                ChunkIndex = int.TryParse(metaStr.GetValueOrDefault("chunk_index", "0"), out var idx) ? idx : 0,
                Text = docs.ElementAtOrDefault(i) ?? string.Empty,
                Score = score,
                Metadata = metaStr
            });
        }

        return results;
    }

    public async Task DeleteDocumentChunksAsync(
        string collectionName, string documentId, CancellationToken ct = default)
    {
        var collectionId = await GetCollectionIdAsync(collectionName, ct);
        var filter = new Dictionary<string, object>
        {
            ["document_id"] = new Dictionary<string, string> { ["$eq"] = documentId }
        };
        await _chroma.DeleteByMetadataAsync(collectionId, filter, ct);
    }

    private async Task<string> GetCollectionIdAsync(string collectionName, CancellationToken ct)
    {
        if (_collectionIdCache.TryGetValue(collectionName, out var id)) return id;
        var collection = await _chroma.EnsureCollectionAsync(collectionName, ct);
        _collectionIdCache[collectionName] = collection.Id;
        return collection.Id;
    }
}
