using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
    public class OnlinePaymentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
