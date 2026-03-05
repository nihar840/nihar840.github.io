using Microsoft.AspNetCore.Mvc;

namespace RagApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    /// <summary>
    /// Simple liveness check used by the React frontend to detect whether
    /// the local AI backend is reachable before opening the chat panel.
    /// </summary>
    [HttpGet]
    public IActionResult Get() =>
        Ok(new { status = "ok", timestamp = DateTime.UtcNow });
}
