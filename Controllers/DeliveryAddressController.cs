using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
    public class DeliveryAddressController : Controller
    {
        private readonly IClientServices<DeliveryAddress> _deliveryAddressServices;

        public DeliveryAddressController(IClientServices<DeliveryAddress> deliveryAddressServices)
        {
            _deliveryAddressServices = deliveryAddressServices;
        }

        // Constructor to initialize the controller with required services

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> GetDeliveryAddressList()
        {
            var DeliveryAddress = await _deliveryAddressServices.GetAllClientsAsync("DeliveryAddress/getAllDeliveryAddress");
            return Json(new { data = DeliveryAddress });
        }
        [HttpPost]
        public async Task<IActionResult> Create(DeliveryAddress model)
        {
            model.CreatedBy = "";
            var result = await _deliveryAddressServices.PostClientAsync( "DeliveryAddress/CreateDeliveryAddress" , model);
            return Json(result);
        }
        [HttpGet]
        public async Task<IActionResult> GetById(Guid id)
        {
            var customer = await _deliveryAddressServices.GetClientByIdAsync($"DeliveryAddress/getDeliveryAddress/{id}");
            return Json(customer);
        }
        [HttpPut]
        public async Task<IActionResult> Update(Guid id, DeliveryAddress model)
        {
            model.UpdatedBy = "User";
            var result = await _deliveryAddressServices.UpdateClientAsync($"DeliveryAddress/UpdateDeliveryAddress/{id}", model);
            return Json(result);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _deliveryAddressServices.DeleteClientAsync($"DeliveryAddress/DeleteDeliveryAddress/{id}");
            return Json(deleted);
        }

    }
}
