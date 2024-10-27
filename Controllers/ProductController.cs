using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
    public class ProductController : Controller
    {
        private readonly IClientServices<Product> _productServices;
        private readonly IFileUploader _fileUploder;

        public ProductController(IClientServices<Product> productServices, IFileUploader fileUploder)
        {
            _productServices = productServices;
            _fileUploder = fileUploder;
        }

        public async Task<IActionResult> Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> GetAllProduct()
        {
            var products = await _productServices.GetAllClientsAsync("Product/getAllProduct");
            return Json(new { data = products });
        }
       
        [HttpPost]
        public async Task<IActionResult> Create(Product model)
        {
            var prdI = await _fileUploder.ImgUploader(model.FormFile);
            model.CreatedBy = "mamun";
            model.ProdImage = prdI;
            var product = await _productServices.PostClientAsync( "Product/CreateProduct" , model);
            return Json(product);
        }
        [HttpGet]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await _productServices.GetClientByIdAsync($"Product/getProduct/{id}");
            return Json(product);
        }
        [HttpPut]
        public async Task<IActionResult> Update(Guid id, Product model)
        {
            model.UpdatedBy = "mamun";
            var productbyId = await _productServices.GetClientByIdAsync($"Product/getProduct/{id}");
            
            if(model.FormFile != null)
            {
                bool deleteImg = await _fileUploder.DeleteFile(productbyId.ProdImage);
                model.ProdImage = await _fileUploder.ImgUploader(model.FormFile);
            }
            else
            {
                model.ProdImage = productbyId.ProdImage;
            }
            
            var product = await _productServices.UpdateClientAsync($"Product/UpdateProduct/{id}", model);
            return Json(product);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            // Get the product by ID
            var product = await _productServices.GetClientByIdAsync($"Product/getProduct/{id}");

            if (product.ProdImage == null)
            {
                return NotFound(new { Message = "Product not found" });
            }
            //Delete the product image
            bool deleteImg = await _fileUploder.DeleteFile(product.ProdImage);

            if (!deleteImg)
            {
                return StatusCode(500, new { Message = "Error deleting product image" });
            }

            // Delete the product
            var deleted = await _productServices.DeleteClientAsync($"Product/DeleteProduct/{id}" );

            if (!deleted.Success)
            {
                return StatusCode(500, new { Message = "Error deleting product" });
            }

            return Json(deleted);

        }
    }
}
