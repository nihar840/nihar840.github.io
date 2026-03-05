using System.Text;
using RagApi.Models;
using RagApi.Services.Interfaces;

namespace RagApi.Services;

public class ChunkingService : IChunkingService
{
    public IReadOnlyList<Chunk> ChunkText(
        string documentId,
        string text,
        Dictionary<string, string> metadata,
        int chunkSize,
        int overlap,
        int minLength)
    {
        var chunks = new List<Chunk>();
        var normalized = NormalizeWhitespace(text);
        var sentences = SplitIntoSentences(normalized);

        var buffer = new StringBuilder();
        int chunkIndex = 0;

        foreach (var sentence in sentences)
        {
            buffer.Append(sentence).Append(' ');

            if (buffer.Length >= chunkSize)
            {
                var chunkText = buffer.ToString().Trim();
                if (chunkText.Length >= minLength)
                {
                    chunks.Add(CreateChunk(documentId, chunkIndex++, chunkText, metadata));
                }

                // Roll back by overlap amount
                var tail = chunkText.Length > overlap
                    ? chunkText[^overlap..]
                    : chunkText;
                buffer.Clear();
                buffer.Append(tail).Append(' ');
            }
        }

        // Emit remaining buffer
        var remaining = buffer.ToString().Trim();
        if (remaining.Length >= minLength)
        {
            chunks.Add(CreateChunk(documentId, chunkIndex, remaining, metadata));
        }

        return chunks;
    }

    private static Chunk CreateChunk(
        string documentId, int index, string text, Dictionary<string, string> metadata)
    {
        var meta = new Dictionary<string, string>(metadata)
        {
            ["document_id"] = documentId,
            ["chunk_index"] = index.ToString()
        };

        return new Chunk
        {
            Id = $"{documentId}_chunk_{index}",
            DocumentId = documentId,
            ChunkIndex = index,
            Text = text,
            Metadata = meta
        };
    }

    private static string NormalizeWhitespace(string text)
    {
        // Collapse multiple whitespace runs, normalize line endings
        var result = System.Text.RegularExpressions.Regex.Replace(text, @"\r\n|\r", "\n");
        result = System.Text.RegularExpressions.Regex.Replace(result, @" {2,}", " ");
        result = System.Text.RegularExpressions.Regex.Replace(result, @"\n{3,}", "\n\n");
        return result.Trim();
    }

    private static IEnumerable<string> SplitIntoSentences(string text)
    {
        // Split on sentence-ending punctuation followed by whitespace, or double newlines
        var parts = System.Text.RegularExpressions.Regex.Split(
            text, @"(?<=[.!?])\s+|(?<=\n\n)");

        return parts
            .Select(p => p.Trim())
            .Where(p => !string.IsNullOrEmpty(p));
    }
}
