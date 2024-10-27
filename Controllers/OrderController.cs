using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
    public class OrderController : Controller
    {
        private readonly IClientServices<Order> _orderServices;

        public OrderController(IClientServices<Order> orderServices)
        {
            _orderServices = orderServices;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> GetOrderList()
        {
            var orders = await _orderServices.GetAllClientsAsync("Order/getAllOrder");
            return Json(new { data = orders });
        }
        [HttpPost]
        public async Task<IActionResult> Create(Order model)
        {
            model.CreatedBy = "mamun";
            var orders = await _orderServices.PostClientAsync( "Order/CreateOrder", model);
            return Json(orders);
        }
        [HttpPost]
        public async Task<IActionResult> CreatebyUser([FromBody] Order model)
        {
            model.CreatedBy = "mamun";
            var orders = await _orderServices.PostClientAsync( "Order/CreateOrder", model);
            return Json(orders);
        }
        [HttpGet]
        public async Task<IActionResult> GetById(Guid id)
        {
            var order = await _orderServices.GetClientByIdAsync($"Order/getOrder/{id}" );
            return Json(order);
        }
        [HttpPut]
        public async Task<IActionResult> Update(Guid id, Order model)
        {
            model.UpdatedBy = "mamun";
            var order = await _orderServices.UpdateClientAsync($"Order/UpdateOrder/{id}", model);
            return Json(order);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _orderServices.DeleteClientAsync($"Order/DeleteOrder/{id}");
            return Json(deleted);
        }
    }
}
