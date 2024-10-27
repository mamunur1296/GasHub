using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
    public class TraderController : Controller
    {
        private readonly IClientServices<Trader> _traderServices;

        public TraderController(IClientServices<Trader> traderServices)
        {
            _traderServices = traderServices;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetallTrader()
        {
            var traders = await _traderServices.GetAllClientsAsync("Trader/getAllTrader");
            return Json(new { data = traders });
        }
        [HttpPost]
        public async Task<IActionResult> Create(Trader model)
        {
            model.CreatedBy = "mamun";
            model.BIN = "Tast Bin";
            var trader = await _traderServices.PostClientAsync( "Trader/CreateTrader", model);
            return Json(trader);
        }
        [HttpGet]
        public async Task<IActionResult> GetById(Guid id)
        {
            var trader = await _traderServices.GetClientByIdAsync($"Trader/getTrader/{id}");
            return Json(trader);
        }
        [HttpPut]
        public async Task<IActionResult> Update(Guid id, Trader model)
        {
            model.UpdatedBy = "mamun";
            model.BIN = "Tast Bin";
            var trader = await _traderServices.UpdateClientAsync($"Trader/UpdateTrader/{id}", model);
            return Json(trader);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _traderServices.DeleteClientAsync($"Trader/DeleteTrader/{id}" );
            return Json(deleted);
        }
    }
}
