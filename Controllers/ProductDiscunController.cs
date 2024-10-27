using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
    public class ProductDiscunController : Controller
    {
        private readonly IClientServices<ProductDiscunt> _productDiscuntServices;

        public ProductDiscunController(IClientServices<ProductDiscunt> productDiscuntServices)
        {
            _productDiscuntServices = productDiscuntServices;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> GetallProductDiscun()
        {
            var ProductDiscun = await _productDiscuntServices.GetAllClientsAsync("ProductDiscunt/getAllProductDiscunt");
            return Json(new { data = ProductDiscun });
        }
        [HttpPost]
        public async Task<IActionResult> Create(ProductDiscunt model)
        {
            model.CreatedBy = "mamun";
            var ProductDiscun = await _productDiscuntServices.PostClientAsync( "ProductDiscunt/CreateProductDiscunt", model);
            return Json(ProductDiscun);
        }
        [HttpGet]
        public async Task<IActionResult> GetById(Guid id)
        {
            var ProductDiscunt = await _productDiscuntServices.GetClientByIdAsync($"ProductDiscunt/getProductDiscunt/{id}");
            return Json(ProductDiscunt);
        }
        [HttpPut]
        public async Task<IActionResult> Update(Guid id, ProductDiscunt model)
        {
            model.UpdatedBy = "mamun";
            var ProductDiscunt = await _productDiscuntServices.UpdateClientAsync($"ProductDiscunt/UpdateProductDiscunt/{id}", model );
            return Json(ProductDiscunt);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _productDiscuntServices.DeleteClientAsync($"ProductDiscunt/DeleteProductDiscunt/{id}");
            return Json(deleted);
        }
    }
}
