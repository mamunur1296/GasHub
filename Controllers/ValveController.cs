using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
    public class ValveController : Controller
    {
        private readonly IClientServices<Valve> _valveServices;

        public ValveController(IClientServices<Valve> valveServices)
        {
            _valveServices = valveServices;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> GetallValve()
        {
            var Valve = await _valveServices.GetAllClientsAsync("Valve/getAllValve");
            return Json(new { data = Valve });
        }
        [HttpPost]
        public async Task<IActionResult> Create(Valve model)
        {
            model.CreatedBy = "mamun";
            var Valve = await _valveServices.PostClientAsync( "Valve/CreateValve", model);
            return Json(Valve);
        }
        [HttpGet]
        public async Task<IActionResult> GetById(Guid id)
        {
            var Valve = await _valveServices.GetClientByIdAsync($"Valve/getValve/{id}");
            return Json(Valve);
        }
        [HttpPut]
        public async Task<IActionResult> Update(Guid id, Valve model)
        {
            model.UpdatedBy = "mamun";
            var Valve = await _valveServices.UpdateClientAsync($"Valve/UpdateValve/{id}", model);
            return Json(Valve);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _valveServices.DeleteClientAsync($"Valve/DeleteValve/{id}" );
            return Json(deleted);
        }
    }
}
