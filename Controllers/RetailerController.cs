using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
    public class RetailerController : Controller
    {
        private readonly IClientServices<Retailer> _retailerServices;

        public RetailerController(IClientServices<Retailer> retailerServices)
        {
            _retailerServices = retailerServices;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> GetallRetailer()
        {
            var retailer = await _retailerServices.GetAllClientsAsync("Retailer/getAllRetailer");
            return Json(new { data = retailer });
        }
        [HttpPost]
        public async Task<IActionResult> Create(Retailer model)
        {
            model.CreatedBy = "mamun";
            var retailer = await _retailerServices.PostClientAsync( "Retailer/CreateRetailer" , model);
            return Json(retailer);
        }
        [HttpGet]
        public async Task<IActionResult> GetById(Guid id)
        {
            var retailer = await _retailerServices.GetClientByIdAsync($"Retailer/getRetailer/{id}");
            return Json(retailer);
        }
        [HttpPut]
        public async Task<IActionResult> Update(Guid id, Retailer model)
        {
            model.UpdatedBy = "mamun";
            var productSize = await _retailerServices.UpdateClientAsync($"Retailer/UpdateRetailer/{id}", model);
            return Json(productSize);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _retailerServices.DeleteClientAsync($"Retailer/DeleteRetailer/{id}");
            return Json(deleted);
        }
        
    }
}
