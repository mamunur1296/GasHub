using GasHub.Dtos;

namespace GasHub.Services.Interface
{
    public interface IClientServices<T> where T : class
    {
        Task<IEnumerable<T>> GetAllClientsAsync(string endpoint);
        Task<T> GetClientByIdAsync(string endpoint);
        Task<ResponseDto> PostClientAsync(string endpoint, T data);
        Task<ResponseDto> UpdateClientAsync(string endpoint, T data);
        Task<ResponseDto> DeleteClientAsync(string endpoint);
    }
}


