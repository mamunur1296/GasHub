using GasHub.Dtos;
using GasHub.Models;
using GasHub.Models.ViewModels;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace GasHub.Controllers
{
    public class HomeController : Controller
    {



        private readonly IClientServices<Product> _productServices;
        private readonly IClientServices<Company> _companyServices;
        private readonly IClientServices<ProductDiscunt> _productDiscuntServices;
        private readonly IClientServices<DeliveryAddress> _deliveryAddressServices;

        public HomeController(IClientServices<Product> productServices, 
            IClientServices<Company> companyServices,
            IClientServices<ProductDiscunt> productDiscuntServices,
            IClientServices<DeliveryAddress> deliveryAddressServices)
        {
            _productServices = productServices;
            _companyServices = companyServices;
            _productDiscuntServices = productDiscuntServices;
            _deliveryAddressServices = deliveryAddressServices;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var productsVm = new ProductViewModel();
            var products = await _productServices.GetAllClientsAsync("Product/getAllProduct");
            var companies = await _companyServices.GetAllClientsAsync("Company/getAllCompany");
            var discounts = await _productDiscuntServices.GetAllClientsAsync("ProductDiscunt/getAllProductDiscunt");

            if (products != null)
            {
                productsVm.ProductList = products;
            }

            if (companies != null)
            {
                productsVm.companiList = companies;
            }

            if (discounts != null)
            {
                productsVm.productDiscunts = discounts;
            }

            return View(productsVm);
        }
        public async Task<IActionResult> Product()
        {
            return View();
        }
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> CheckOut()
        {
            return View();
        }
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> AddAddress()
        {
            return View();
        }
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> ConfirmOrder()
        {
            return View();
        }

        
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddAddressToDb(AddressDtos model)
        {
            if (model.UserId == Guid.Empty)
            {
                ViewBag.errorMessage = " Pless Login Valid User ... .";
                return View("AddAddress", model);
            }
            if (!ModelState.IsValid)
            {

                return View("AddAddress", model);
            }
            
            var deliveryAddress = new DeliveryAddress();
            deliveryAddress.UserId = model.UserId;
            deliveryAddress.CreatedBy = "";
            deliveryAddress.Phone = model.ContactNumber;
            deliveryAddress.Mobile = model.ContactNumber;
            deliveryAddress.Address = $"{model.District}  {model.StreetAddress}";

            if (!string.IsNullOrEmpty(deliveryAddress.Address))
            {
                var result = await _deliveryAddressServices.PostClientAsync( "DeliveryAddress/CreateDeliveryAddress", deliveryAddress);
                if (result.Success)
                {
                    return RedirectToAction("CheckOut", "Home");
                }
            }


            return RedirectToAction("AddAddress");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
