using Microsoft.Extensions.Http.Resilience;
using RagApi.Configuration;
using RagApi.Infrastructure.ChromaClient;
using RagApi.Infrastructure.OllamaClient;
using RagApi.Services;
using RagApi.Services.Interfaces;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.Console()
    .CreateLogger();
builder.Host.UseSerilog();

// Options
builder.Services.Configure<OllamaOptions>(
    builder.Configuration.GetSection(OllamaOptions.SectionName));
builder.Services.Configure<ChromaOptions>(
    builder.Configuration.GetSection(ChromaOptions.SectionName));
builder.Services.Configure<RagOptions>(
    builder.Configuration.GetSection(RagOptions.SectionName));

var ollamaBaseUrl = builder.Configuration["Ollama:BaseUrl"] ?? "http://localhost:11434";
var chromaBaseUrl = builder.Configuration["Chroma:BaseUrl"] ?? "http://localhost:8000";
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:3000"];

// Named HttpClients with resilience
builder.Services.AddHttpClient("ollama", c =>
{
    c.BaseAddress = new Uri(ollamaBaseUrl);
    c.Timeout = TimeSpan.FromSeconds(300);
}).AddStandardResilienceHandler();

builder.Services.AddHttpClient("chroma", c =>
{
    c.BaseAddress = new Uri(chromaBaseUrl);
    c.Timeout = TimeSpan.FromSeconds(30);
}).AddStandardResilienceHandler();

// Infrastructure clients (singleton - HttpClient-backed, thread-safe)
builder.Services.AddSingleton<OllamaHttpClient>();
builder.Services.AddSingleton<ChromaHttpClient>();

// Services
builder.Services.AddScoped<IChunkingService, ChunkingService>();
builder.Services.AddScoped<IEmbeddingService, EmbeddingService>();
builder.Services.AddScoped<IVectorStoreService, VectorStoreService>();
builder.Services.AddScoped<ILlmService, LlmService>();
builder.Services.AddScoped<IRagOrchestrator, RagOrchestrator>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

app.UseSerilogRequestLogging();
app.UseCors();
app.MapControllers();

app.Run();
