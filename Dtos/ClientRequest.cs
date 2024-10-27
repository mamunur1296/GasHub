using System.Security.AccessControl;

namespace GasHub.Dtos
{
    public class ClientRequest
    {
        public string Url { get; set; }
        public object Data { get; set; }
        public string AccessToken { get; set; }
        public ApiType ApiType { get; set; } = ApiType.Get;
        public ContentType ContentType { get; set; } = ContentType.Json;
    }
    public enum ContentType
    {
        Json,
        MultipartFormData
    }

    public enum ApiType
    {
        Get,
        Post,
        Put,
        Delete
    }
}
