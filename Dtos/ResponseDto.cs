namespace GasHub.Dtos
{
    public class ResponseDto
    {
        public object? Data { get; set; }
        public int Status { get; set; }
        public bool Success { get; set; } = true;
        public string ErrorMessage { get; set; }
        public string Type { get; set; }
        public string Title { get; set; }
        public string Detail { get; set; }
    }
}
