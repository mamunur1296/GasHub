using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
    public class StockController : Controller
    {
        private readonly IClientServices<Stock> _stockServices;

        public StockController(IClientServices<Stock> stockServices)
        {
            _stockServices = stockServices;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> GetallStock()
        {
            var stock = await _stockServices.GetAllClientsAsync("Stock/getAllStock");
            return Json(new { data = stock });
        }
        [HttpPost]
        public async Task<IActionResult> Create(Stock model)
        {
            model.CreatedBy = "mamun";
            var stock = await _stockServices.PostClientAsync( "Stock/CreateStock", model);
            return Json(stock);
        }
        [HttpGet]
        public async Task<IActionResult> GetById(Guid id)
        {
            var stock = await _stockServices.GetClientByIdAsync($"Stock/getStock/{id}");
            return Json(stock);
        }
        [HttpPut]
        public async Task<IActionResult> Update(Guid id, Stock model)
        {
            model.UpdatedBy = "mamun";
            var stock = await _stockServices.UpdateClientAsync($"Stock/UpdateStock/{id}", model );
            return Json(stock);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _stockServices.DeleteClientAsync($"Stock/DeleteStock/{id}");
            return Json(deleted);
        }
    }
}
