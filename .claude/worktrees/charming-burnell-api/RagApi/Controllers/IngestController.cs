using Microsoft.AspNetCore.Mvc;
using RagApi.DTOs;
using RagApi.Services.Interfaces;
using UglyToad.PdfPig;
using Markdig;

namespace RagApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IngestController : ControllerBase
{
    private readonly IRagOrchestrator _rag;
    private readonly IVectorStoreService _vectorStore;

    public IngestController(IRagOrchestrator rag, IVectorStoreService vectorStore)
    {
        _rag = rag;
        _vectorStore = vectorStore;
    }

    /// <summary>Ingest raw text content.</summary>
    [HttpPost("text")]
    public async Task<ActionResult<IngestResponseDto>> IngestText(
        [FromBody] IngestRequestDto request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.DocumentId))
            return BadRequest("DocumentId is required.");
        if (string.IsNullOrWhiteSpace(request.Content))
            return BadRequest("Content cannot be empty.");

        var result = await _rag.IngestDocumentAsync(request, ct);
        return result.Success ? Ok(result) : StatusCode(500, result);
    }

    /// <summary>Ingest uploaded file (.txt, .md, .pdf).</summary>
    [HttpPost("file")]
    public async Task<ActionResult<IngestResponseDto>> IngestFile(
        IFormFile file,
        [FromForm] string documentId,
        [FromForm] string collectionName = "portfolio-docs",
        CancellationToken ct = default)
    {
        if (file is null || file.Length == 0)
            return BadRequest("No file uploaded.");
        if (string.IsNullOrWhiteSpace(documentId))
            return BadRequest("DocumentId is required.");

        string content;
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

        try
        {
            content = ext switch
            {
                ".pdf" => ExtractPdfText(file),
                ".md" => ExtractMarkdownText(file),
                _ => await ExtractPlainText(file, ct)
            };
        }
        catch (Exception ex)
        {
            return BadRequest($"Failed to parse file: {ex.Message}");
        }

        var request = new IngestRequestDto
        {
            DocumentId = documentId,
            Title = Path.GetFileNameWithoutExtension(file.FileName),
            Content = content,
            CollectionName = collectionName,
            Metadata = new Dictionary<string, string> { ["filename"] = file.FileName }
        };

        var result = await _rag.IngestDocumentAsync(request, ct);
        return result.Success ? Ok(result) : StatusCode(500, result);
    }

    /// <summary>Delete all chunks for a given document.</summary>
    [HttpDelete("{documentId}")]
    public async Task<IActionResult> DeleteDocument(
        string documentId,
        [FromQuery] string collectionName = "portfolio-docs",
        CancellationToken ct = default)
    {
        await _vectorStore.DeleteDocumentChunksAsync(collectionName, documentId, ct);
        return NoContent();
    }

    private static string ExtractPdfText(IFormFile file)
    {
        using var stream = file.OpenReadStream();
        using var pdf = PdfDocument.Open(stream);
        var sb = new System.Text.StringBuilder();
        foreach (var page in pdf.GetPages())
            sb.AppendLine(page.Text);
        return sb.ToString();
    }

    private static string ExtractMarkdownText(IFormFile file)
    {
        using var reader = new StreamReader(file.OpenReadStream());
        var md = reader.ReadToEnd();
        // Strip markdown syntax, keep plain text
        return Markdown.ToPlainText(md);
    }

    private static async Task<string> ExtractPlainText(IFormFile file, CancellationToken ct)
    {
        using var reader = new StreamReader(file.OpenReadStream());
        return await reader.ReadToEndAsync(ct);
    }
}
