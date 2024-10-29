using GasHub.Dtos;
using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
  
    public class NewPurchaseController : Controller
    {
        private readonly IClientServices<Product> _productService;
        private readonly IClientServices<Company> _companyServices;
        private readonly IClientServices<PurchaseItem> _purchaseServices;

        public NewPurchaseController(IClientServices<Product> productServices, IClientServices<Company> companyServices, IClientServices<PurchaseItem> purchaseServices)
        {
            _productService = productServices;
            _companyServices = companyServices;
            _purchaseServices = purchaseServices;
        }
        
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> SearchProducts(string term)
        {
            // Fetch all products from the service
            var products = await _productService.GetAllClientsAsync("Product/getAllProduct");

            // Ensure the products data is not null
            if (products == null)
            {
                return Ok(new List<object>());
            }

            // Filter products based on the search term (ignoring case)
            var filteredProducts = products
                .Where(p => p.Name.Contains(term, StringComparison.OrdinalIgnoreCase))
                .Select(p => new
                {
                    label = p.Name, // Display name for the autocomplete dropdown
                    productid = p.Id       // Actual product ID
                })
                .ToList();

            // Return filtered products in the expected format for jQuery autocomplete
            return Ok(filteredProducts);
        }
        [HttpGet]
        public async Task<IActionResult> SearchSupplair(string term)
        {
            // Fetch all suppliers from the service
            var suppliers = await _companyServices.GetAllClientsAsync("Company/getAllCompany");

            // Ensure the suppliers data is not null
            if (suppliers == null)
            {
                return Ok(new List<object>());
            }

            // Filter suppliers based on the search term (ignoring case)
            var filteredSuppliers = suppliers
                .Where(s => s.Name.Contains(term, StringComparison.OrdinalIgnoreCase))
                .Select(s => new
                {
                    label = s.Name, // Display name for the autocomplete dropdown
                    id = s.Id, 
                    Phone=s.ContactNumber,
                          
                })
                .ToList();

            // Return filtered suppliers in the expected format for jQuery autocomplete
            return Ok(filteredSuppliers);
        }

        [HttpPost]
        public async Task<IActionResult> Purchase([FromBody] PurchaseItem paymentItem)
        {
            if (paymentItem == null || paymentItem.Products == null || !paymentItem.Products.Any())
            {
                return BadRequest("Invalid purchase item data.");
            }

            var result = await _purchaseServices.PostClientAsync("Purchase/Purchase", paymentItem);
            if (result.Success)
            {
                return Json(true);
            }
            // Process the paymentItem here (e.g., save to database)

            return Json(false); // or return a specific result
        }


    }
}
