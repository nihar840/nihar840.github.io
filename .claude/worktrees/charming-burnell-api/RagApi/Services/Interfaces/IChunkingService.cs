using RagApi.Models;

namespace RagApi.Services.Interfaces;

public interface IChunkingService
{
    IReadOnlyList<Chunk> ChunkText(
        string documentId,
        string text,
        Dictionary<string, string> metadata,
        int chunkSize,
        int overlap,
        int minLength);
}
