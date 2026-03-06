using System.Runtime.CompilerServices;
using System.Text;
using RagApi.Configuration;
using RagApi.DTOs;
using RagApi.Models;
using RagApi.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace RagApi.Services;

public class RagOrchestrator : IRagOrchestrator
{
    private readonly IChunkingService _chunker;
    private readonly IEmbeddingService _embedder;
    private readonly IVectorStoreService _vectorStore;
    private readonly ILlmService _llm;
    private readonly RagOptions _ragOpts;

    public RagOrchestrator(
        IChunkingService chunker,
        IEmbeddingService embedder,
        IVectorStoreService vectorStore,
        ILlmService llm,
        IOptions<RagOptions> ragOpts)
    {
        _chunker = chunker;
        _embedder = embedder;
        _vectorStore = vectorStore;
        _llm = llm;
        _ragOpts = ragOpts.Value;
    }

    public async Task<IngestResponseDto> IngestDocumentAsync(
        IngestRequestDto request, CancellationToken ct = default)
    {
        var errors = new List<string>();
        try
        {
            // Merge caller metadata with document-level fields
            var metadata = new Dictionary<string, string>(request.Metadata)
            {
                ["title"] = request.Title,
                ["source"] = request.DocumentId
            };

            var chunks = _chunker.ChunkText(
                request.DocumentId,
                request.Content,
                metadata,
                _ragOpts.ChunkSize,
                _ragOpts.ChunkOverlap,
                _ragOpts.MinChunkLength);

            var texts = chunks.Select(c => c.Text);
            var embeddings = await _embedder.EmbedBatchAsync(texts, ct);

            var embeddedChunks = chunks.Zip(embeddings, (chunk, emb) => new EmbeddedChunk
            {
                Chunk = chunk,
                Embedding = emb
            });

            await _vectorStore.EnsureCollectionAsync(request.CollectionName, ct);
            await _vectorStore.UpsertChunksAsync(request.CollectionName, embeddedChunks, ct);

            return new IngestResponseDto
            {
                DocumentId = request.DocumentId,
                ChunksCreated = chunks.Count,
                CollectionName = request.CollectionName,
                Success = true,
                Errors = errors
            };
        }
        catch (Exception ex)
        {
            errors.Add(ex.Message);
            return new IngestResponseDto
            {
                DocumentId = request.DocumentId,
                ChunksCreated = 0,
                CollectionName = request.CollectionName,
                Success = false,
                Errors = errors
            };
        }
    }

    public async Task<(string Answer, IReadOnlyList<RetrievedContext> Sources)> QueryAsync(
        string userQuery, string collectionName, int topK, CancellationToken ct = default)
    {
        var queryEmbedding = await _embedder.EmbedAsync(userQuery, ct);
        var contexts = await _vectorStore.QueryAsync(collectionName, queryEmbedding, topK, ct);
        var prompt = BuildPrompt(userQuery, contexts);
        var answer = await _llm.GenerateAsync(prompt, ct);
        return (answer, contexts);
    }

    public async IAsyncEnumerable<StreamEventDto> QueryStreamAsync(
        string userQuery,
        string collectionName,
        int topK,
        [EnumeratorCancellation] CancellationToken ct = default)
    {
        // Step 1: Embed query — capture error outside yield context
        float[] queryEmbedding;
        string? earlyError = null;
        try
        {
            queryEmbedding = await _embedder.EmbedAsync(userQuery, ct);
        }
        catch (Exception ex)
        {
            earlyError = $"Embedding failed: {ex.Message}";
            queryEmbedding = Array.Empty<float>();
        }

        if (earlyError is not null)
        {
            yield return new StreamEventDto { EventType = "error", ErrorMessage = earlyError };
            yield break;
        }

        // Step 2: Retrieve context
        IReadOnlyList<RetrievedContext> contexts;
        string? retrieveError = null;
        try
        {
            contexts = await _vectorStore.QueryAsync(collectionName, queryEmbedding, topK, ct);
        }
        catch (Exception ex)
        {
            retrieveError = $"Vector search failed: {ex.Message}";
            contexts = Array.Empty<RetrievedContext>();
        }

        if (retrieveError is not null)
        {
            yield return new StreamEventDto { EventType = "error", ErrorMessage = retrieveError };
            yield break;
        }

        // Step 3: Emit sources immediately (browser can render them while answer streams)
        yield return new StreamEventDto
        {
            EventType = "sources",
            Sources = contexts.Select(c => new SourceChunkDto
            {
                DocumentId = c.DocumentId,
                ChunkIndex = c.ChunkIndex,
                Text = c.Text,
                Score = c.Score,
                Metadata = c.Metadata
            }).ToList()
        };

        // Step 4: Build prompt and stream answer
        var prompt = BuildPrompt(userQuery, contexts);
        int totalTokens = 0;

        await foreach (var token in _llm.GenerateStreamAsync(prompt, ct))
        {
            totalTokens++;
            yield return new StreamEventDto { EventType = "token", Token = token };
        }

        yield return new StreamEventDto
        {
            EventType = "done",
            FinishReason = "stop",
            TotalTokens = totalTokens
        };
    }

    private static string BuildPrompt(string query, IReadOnlyList<RetrievedContext> contexts)
    {
        // Keep prompt short and simple — qwen2.5:0.5b is a 0.5B param model.
        // Complex multi-instruction prompts confuse it; a clean, direct prompt works best.
        // Answer in Nihar's voice: friendly, curious, slightly humorous, conversational.
        var sb = new StringBuilder();
        sb.AppendLine("You are Nihar Ranjan's personal AI on his portfolio website.");
        sb.AppendLine("Answer as if you are Nihar — friendly, conversational, curious, and occasionally humorous.");
        sb.AppendLine("Use the excerpts below. Be specific: mention real companies, technologies, years, and achievements.");
        sb.AppendLine();
        sb.AppendLine("CONTEXT:");

        for (int i = 0; i < contexts.Count; i++)
        {
            sb.AppendLine(contexts[i].Text);
            if (i < contexts.Count - 1) sb.AppendLine("---");
        }

        sb.AppendLine();
        sb.AppendLine($"Question: {query}");
        sb.AppendLine();
        sb.Append("Answer:");

        return sb.ToString();
    }
}
