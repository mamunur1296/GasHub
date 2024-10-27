using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
    public class RoleController : Controller
    {
        private readonly IClientServices<Role> _roleServices;

        public RoleController(IClientServices<Role> roleServices)
        {
            _roleServices = roleServices;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> GetallRole()
        {
            var roles = await _roleServices.GetAllClientsAsync("Role/GetAll");
            return Json(new { data = roles });
        }
        [HttpPost]
        public async Task<IActionResult> Create(Role model)
        {
            model.CreatedBy = "mamun";
            var role = await _roleServices.PostClientAsync( "Role/Create", model);
            return Json(role);
        }
        [HttpGet]
        public async Task<IActionResult> GetById(Guid id)
        {
            var role = await _roleServices.GetClientByIdAsync($"Role/{id}");
            return Json(role);
        }
        [HttpPut]
        public async Task<IActionResult> Update(Guid id, Role model)
        {
            model.UpdatedBy = "mamun";
            var role = await _roleServices.UpdateClientAsync($"Role/Edit/{id}", model);
            return Json(role);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _roleServices.DeleteClientAsync($"Role/Delete/{id}");
            return Json(deleted);
        }
    }
}
