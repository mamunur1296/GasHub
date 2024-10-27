using GasHub.Services.Interface;

namespace GasHub.Services.Implemettions
{
    public class TokenService : ITokenService
    {
        private readonly IHttpContextAccessor _contextAccessor;

        public TokenService(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }

        public void ClearToken()
        {
            _contextAccessor.HttpContext.Response.Cookies.Delete("Jwt_Token");
        }

        public string? GetToken()
        {
            string token = null;
            bool? isTokenAvailable = _contextAccessor.HttpContext?.Request.Cookies.TryGetValue("Jwt_Token", out token);
            return isTokenAvailable is true ? token : null;
        }

        public void SaveToken(string token)
        {
            _contextAccessor.HttpContext?.Response.Cookies.Append("Jwt_Token", token);
        }
    }
}
