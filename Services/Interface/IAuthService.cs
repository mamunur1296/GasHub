

using GasHub.Dtos;
using GasHub.Models;

namespace GasHub.Services.Interface
{
    public interface IAuthService
    {
        Task<ResponseDto> Register(Register model);
        Task<List<User>> GetAllUser();
        Task<LoginResponseDto> Login(Login model);
    }
}
