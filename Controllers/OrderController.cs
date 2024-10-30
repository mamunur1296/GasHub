using GasHub.Dtos;
using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
    public class OrderController : Controller
    {
        private readonly IClientServices<Order> _orderServices;
        private readonly IClientServices<ConfirmOrderDTOs> _confirmOrderServices;

        public OrderController(IClientServices<Order> orderServices, IClientServices<ConfirmOrderDTOs> confirmOrderServices)
        {
            _orderServices = orderServices;
            _confirmOrderServices = confirmOrderServices;
        }

        public IActionResult Index()
        {
            return View();
        }
        public IActionResult PlasedOrder()
        {
            return View();
        }
        public IActionResult ConfirmedOrder()
        {
            return View();
        }
        public IActionResult DispatchOrder()
        {
            return View();
        }
        public IActionResult ConfirmDispatchOrder()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetOrderList()
        {
            var orders = await _orderServices.GetAllClientsAsync("Order/getAllOrder");
            return Json(new { data = orders });
        }
        [HttpGet]
        public async Task<IActionResult> GetIsPlasedOrderList()
        {
            var orders = await _orderServices.GetAllClientsAsync("Order/getAllIsPlasedOrder");
            return Json(new { data = orders });
        }
        [HttpGet]
        public async Task<IActionResult> GetIsConfirmedOrderList()
        {
            var orders = await _orderServices.GetAllClientsAsync("Order/getAllIsConfirmedOrder");
            return Json(new { data = orders });
        }
        [HttpGet]
        public async Task<IActionResult> GetRadyToDispatchOrderList()
        {
            var orders = await _orderServices.GetAllClientsAsync("Order/getAllIsRadyToDispatchOrder");
            return Json(new { data = orders });
        }
        [HttpGet]
        public async Task<IActionResult> GetDispatchOrderList()
        {
            var orders = await _orderServices.GetAllClientsAsync("Order/getAllIsDispatchOrder");
            return Json(new { data = orders });
        }
        [HttpGet]
        public async Task<IActionResult> GetDelevarateOrderList()
        {
            var orders = await _orderServices.GetAllClientsAsync("Order/getAllIsDelevarateOrder");
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
        [HttpPost]
        public async Task<IActionResult> ConfirmOrder(ConfirmOrderDTOs model)
        {
            var Result = await _confirmOrderServices.PostClientAsync("Order/ConfirmOrder", model);
            return Json(Result);
        }
    }
}
