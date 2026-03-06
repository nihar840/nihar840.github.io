using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using RagApi.Configuration;
using RagApi.DTOs;
using RagApi.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace RagApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly IRagOrchestrator _rag;
    private readonly RagOptions _opts;
    private static readonly JsonSerializerOptions _json = new(JsonSerializerDefaults.Web);

    public SearchController(IRagOrchestrator rag, IOptions<RagOptions> opts)
    {
        _rag = rag;
        _opts = opts.Value;
    }

    /// <summary>Blocking search — returns full answer + sources.</summary>
    [HttpPost]
    public async Task<ActionResult<SearchResponseDto>> Search(
        [FromBody] SearchRequestDto request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Query))
            return BadRequest("Query cannot be empty.");

        var sw = System.Diagnostics.Stopwatch.StartNew();
        var (answer, sources) = await _rag.QueryAsync(
            request.Query,
            request.CollectionName,
            request.TopK > 0 ? request.TopK : _opts.DefaultTopK,
            ct);
        sw.Stop();

        return Ok(new SearchResponseDto
        {
            Answer = answer,
            Sources = sources.Select(s => new SourceChunkDto
            {
                DocumentId = s.DocumentId,
                ChunkIndex = s.ChunkIndex,
                Text = s.Text,
                Score = s.Score,
                Metadata = s.Metadata
            }).ToList(),
            LatencyMs = sw.ElapsedMilliseconds
        });
    }

    /// <summary>Server-Sent Events streaming endpoint.</summary>
    [HttpGet("stream")]
    public async Task StreamSearch(
        [FromQuery] string query,
        [FromQuery] int topK = 8,
        [FromQuery] string collectionName = "portfolio-docs",
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            Response.StatusCode = 400;
            return;
        }

        Response.ContentType = "text/event-stream";
        Response.Headers["Cache-Control"] = "no-cache";
        Response.Headers["Connection"] = "keep-alive";
        Response.Headers["X-Accel-Buffering"] = "no";

        await foreach (var evt in _rag.QueryStreamAsync(query, collectionName, topK > 0 ? topK : _opts.DefaultTopK, ct))
        {
            var json = JsonSerializer.Serialize(evt, _json);
            var line = $"event: {evt.EventType}\ndata: {json}\n\n";
            await Response.WriteAsync(line, Encoding.UTF8, ct);
            await Response.Body.FlushAsync(ct);
        }
    }
}
