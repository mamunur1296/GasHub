using GasHub.Models;
using GasHub.Services.Interface;
using iTextSharp.text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
    [Authorize]
    public class UserController : Controller
    {
        private readonly IClientServices<User> _userServices;
        private readonly IClientServices<Register> _registerServices;


        public UserController(IClientServices<User> userServices, IClientServices<Register> registerServices)
        {
            _userServices = userServices;
            _registerServices = registerServices;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> GetallUser()
        {
            var users = await _userServices.GetAllClientsAsync("User/GetAllUserDetails");
            return Json(new { data = users });
        }
        [HttpPost]
        public async Task<IActionResult> Create(Register model)
        {
            var user = await _registerServices.PostClientAsync( "User/Create" , model);
            return Json(user);
        }
        [HttpGet]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _userServices.GetClientByIdAsync($"User/GetUserDetails/{id}");
            return Json(user);
        }



        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _userServices.DeleteClientAsync($"User/Delete/{id}");
            return Json(deleted);
        }
    }
}
