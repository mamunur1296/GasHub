using GasHub.Dtos;
using GasHub.Models;
using GasHub.Services.Interface;
using Newtonsoft.Json;

namespace GasHub.Services.Implemettions
{
    public class AuthService : IAuthService
    {
        private readonly IHttpService _httpService;

        public AuthService(IHttpService httpService)
        {
            _httpService = httpService;
        }

        public async Task<List<User>> GetAllUser()
        {
            // Send the HTTP request asynchronously and await the response
            var responseBody = await _httpService.SendData(new ClientRequest
            {
                ContentType = ContentType.Json,
                ApiType = ApiType.Get,
                Url = Helper.BaseUrl + "User/GetAll"
            }, token: false);

            // Deserialize the response body to ResponseDto<string>
            var response = JsonConvert.DeserializeObject<List<User>>(responseBody);

            // Return the deserialized response
            return response;

        }

        public async Task<LoginResponseDto> Login(Login model)
        {
            // Send the HTTP request asynchronously and await the response
            var responseBody = await _httpService.SendData(new ClientRequest
            {
                Data = model,
                ContentType = ContentType.Json,
                ApiType = ApiType.Post,
                Url = Helper.BaseUrl + "Auth/Login"
            }, token: false);

            // Deserialize the response body to ResponseDto<string>
            var response = JsonConvert.DeserializeObject<LoginResponseDto>(responseBody);

            // Return the deserialized response
            return response;
        }

        public async Task<ResponseDto> Register(Register model)
        {
            // Send the HTTP request asynchronously and await the response
            var responseBody = await _httpService.SendData(new ClientRequest
            {
                Data = model,
                ContentType = ContentType.Json,
                ApiType = ApiType.Post,
                Url = Helper.BaseUrl + "User/Create"
            }, token: false);

            // Deserialize the response body to ResponseDto<string>
            var response = JsonConvert.DeserializeObject<ResponseDto>(responseBody);

            // Return the deserialized response
            return response;
        }
    }
}
