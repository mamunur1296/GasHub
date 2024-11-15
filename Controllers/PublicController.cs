using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace GasHub.Controllers
{
    public class PublicController : Controller
    {
        private readonly IClientServices<Register> _registerServices;
        private readonly ITokenService _tokenService;
        private readonly IAuthService _authenticationService;

        public PublicController(IClientServices<Register> registerServices,
            ITokenService tokenService,
            IAuthService authenticationService
            )
        {
            _registerServices = registerServices;
            _tokenService = tokenService;
            _authenticationService = authenticationService;
        }

        public IActionResult Register()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> CreateUser(Register model)
        {
            var loginModel = new Login();
            loginModel.UserName = model.UserName;
            loginModel.Password = model.Password;
            model.Roles = new List<string> { "User" };
            var register = await _registerServices.PostClientAsync("User/Create", model);

            if (register.Success)
            {
                var loginResponse = await _authenticationService.Login(loginModel);
                if(loginResponse.token != null)
                {
                    _tokenService.SaveToken(loginResponse.token);
                    await UserLogin(loginResponse.token);
                }
                return RedirectToAction("Index", "Home");
            }

            // Check for specific error messages and add model state errors
            if (register.ErrorMessage.Contains("DuplicateUserName"))
            {
                ModelState.AddModelError("UserName", "Username is already taken.");
            }
            else if (register.ErrorMessage.Contains("DuplicateEmail"))
            {
                ModelState.AddModelError("Email", "Email is already taken.");
            }else if (register.ErrorMessage.Contains("ConfirmationPassword"))
            {
                ModelState.AddModelError("ConfirmationPassword", "Password and confirmation password do not match.");
            }else if (register.ErrorMessage.Contains("PasswordRequiresLower"))
            {
                ModelState.AddModelError("Password", "Passwords must have at least one lowercase ('a'-'z')");
            }
            else
            {
                ModelState.AddModelError("", "Registration failed. Please try again.");
            }

            return View("Register", model);
        }
        [HttpGet]
        public IActionResult Login(string? ReturnUrl = null)
        {
            ViewData["ReturnUrl"] = ReturnUrl;
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> LoginUser(Login model, string? ReturnUrl)
        {
            if (!ModelState.IsValid)
            {
                ViewData["ReturnUrl"] = ReturnUrl;
                return View("Login", model);
            }

            var loginResponse = await _authenticationService.Login(model);

            if (loginResponse.token == null)
            {
                ModelState.AddModelError("", "Invalid username or password.");
                ViewData["ReturnUrl"] = ReturnUrl;
                return View("Login", model);
            }

            _tokenService.SaveToken(loginResponse.token);
            await UserLogin(loginResponse.token);

            if (!string.IsNullOrEmpty(ReturnUrl) && Url.IsLocalUrl(ReturnUrl))
            {
                return Redirect(ReturnUrl);
            }

            return RedirectToAction("Index", "Home");

        }
        public async Task<IActionResult> LogOut()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            _tokenService.ClearToken();
            return RedirectToAction("Index", "Home");
        }

        private async Task UserLogin(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);

            var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);

            foreach (var claim in jwt.Claims)
            {
                identity.AddClaim(claim);
            }

            var principal = new ClaimsPrincipal(identity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            // Optionally extract and log user details
            var userId = jwt.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            var userName = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var roles = jwt.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();
        }

    }
}
