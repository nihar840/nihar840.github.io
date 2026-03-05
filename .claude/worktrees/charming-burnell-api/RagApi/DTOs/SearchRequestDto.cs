namespace RagApi.DTOs;

public class SearchRequestDto
{
    public string Query { get; set; } = string.Empty;
    public int TopK { get; set; } = 5;
    public string CollectionName { get; set; } = "portfolio-docs";
}
