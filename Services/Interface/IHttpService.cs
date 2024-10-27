using GasHub.Dtos;

namespace GasHub.Services.Interface
{
    public interface IHttpService
    {
        Task<string> SendData(ClientRequest requestData, bool token = true);
    }
}
