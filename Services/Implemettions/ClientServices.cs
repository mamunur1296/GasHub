using GasHub.Dtos;
using GasHub.Services.Interface;
using Newtonsoft.Json;

namespace GasHub.Services.Implemettions
{
    public class ClientServices<T> : IClientServices<T> where T : class
    {
        private readonly IHttpService _httpService;

        // Constructor to initialize ClientServices with the necessary dependencies
        public ClientServices(IHttpService httpService)
        {
            _httpService = httpService;
        }

        // Deletes a client asynchronously by sending a DELETE request to the specified endpoint
        public async Task<ResponseDto> DeleteClientAsync(string endpoint)
        {
            var request = new ClientRequest
            {
                Url = Helper.BaseUrl + endpoint,
                ApiType = ApiType.Delete,
                ContentType = ContentType.Json
            };

            string response = await _httpService.SendData(request);
            return JsonConvert.DeserializeObject<ResponseDto>(response);
        }

        // Retrieves all clients asynchronously by sending a GET request to the specified endpoint
        public async Task<IEnumerable<T>> GetAllClientsAsync(string endpoint)
        {
            var request = new ClientRequest
            {
                Url = Helper.BaseUrl + endpoint,
                ApiType = ApiType.Get,
                ContentType = ContentType.Json
            };

            string response = await _httpService.SendData(request);
            return JsonConvert.DeserializeObject<IEnumerable<T>>(response);
        }

        // Retrieves a client by ID asynchronously by sending a GET request to the specified endpoint
        public async Task<T> GetClientByIdAsync(string endpoint)
        {
            var request = new ClientRequest
            {
                Url = Helper.BaseUrl + endpoint,
                ApiType = ApiType.Get,
                ContentType = ContentType.Json
            };

            string response = await _httpService.SendData(request);
            return JsonConvert.DeserializeObject<T>(response);
        }

        // Adds a new client asynchronously by sending a POST request to the specified endpoint
        public async Task<ResponseDto> PostClientAsync(string endpoint, T client)
        {
            var request = new ClientRequest
            {
                Url = Helper.BaseUrl + endpoint,
                ApiType = ApiType.Post,
                ContentType = ContentType.Json,
                Data = client
            };

            string response = await _httpService.SendData(request);
            return JsonConvert.DeserializeObject<ResponseDto>(response);
        }

        // Updates a client asynchronously by sending a PUT request to the specified endpoint
        public async Task<ResponseDto> UpdateClientAsync(string endpoint, T client)
        {
            var request = new ClientRequest
            {
                Url = Helper.BaseUrl + endpoint,
                ApiType = ApiType.Put,
                ContentType = ContentType.Json,
                Data = client
            };

            string response = await _httpService.SendData(request);
            return JsonConvert.DeserializeObject<ResponseDto>(response);
        }
    }
}
