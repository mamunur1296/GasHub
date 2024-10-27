using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
    public class ProductSizeController : Controller
    {
        private readonly IClientServices<ProductSize> _productSizeServices;

        public ProductSizeController(IClientServices<ProductSize> productSizeServices)
        {
            _productSizeServices = productSizeServices;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> GetallProductSize()
        {
            var productSize = await _productSizeServices.GetAllClientsAsync("ProductSize/getAllProductSize");
            return Json(new { data = productSize });
        }
        [HttpPost]
        public async Task<IActionResult> Create(ProductSize model)
        {
            model.CreatedBy = "mamun";
            var productSize = await _productSizeServices.PostClientAsync( "ProductSize/CreateProductSize" , model);
            return Json(productSize);
        }
        [HttpGet]
        public async Task<IActionResult> GetById(Guid id)
        {
            var productSize = await _productSizeServices.GetClientByIdAsync($"ProductSize/getProductSize/{id}" );
            return Json(productSize);
        }
        [HttpPut]
        public async Task<IActionResult> Update(Guid id, ProductSize model)
        {
            model.UpdatedBy = "mamun";
            var productSize = await _productSizeServices.UpdateClientAsync($"ProductSize/UpdateProductSize/{id}", model );
            return Json(productSize);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _productSizeServices.DeleteClientAsync($"ProductSize/DeleteProductSize/{id}");
            return Json(deleted);
        }
    }
}
