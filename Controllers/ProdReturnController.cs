using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
    public class ProdReturnController : Controller
    {
        private readonly IClientServices<ProdReturn> _prodReturnServices;

        public ProdReturnController(IClientServices<ProdReturn> prodReturnServices)
        {
            _prodReturnServices = prodReturnServices;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> GetallProdReturn()
        {
            var ProdReturn = await _prodReturnServices.GetAllClientsAsync("ProdReturn/getAllProdReturn");
            return Json(new { data = ProdReturn });
        }
        [HttpPost]
        public async Task<IActionResult> Create( ProdReturn model)
        {
            model.CreatedBy = "mamun";
            var ProdReturn = await _prodReturnServices.PostClientAsync( "ProdReturn/CreateProdReturn" , model);
            return Json(ProdReturn);
        }
        [HttpPost]
        public async Task<IActionResult> CreatebyUser( [FromBody] ProdReturn model)
        {
            model.CreatedBy = "mamun";
            var ProdReturn = await _prodReturnServices.PostClientAsync("ProdReturn/CreateProdReturn", model);
            return Json(ProdReturn);
        }
        [HttpGet]
        public async Task<IActionResult> GetById(Guid id)
        {
            var ProdReturn = await _prodReturnServices.GetClientByIdAsync($"ProdReturn/getProdReturn/{id}"); 
            return Json(ProdReturn);
        }
        [HttpPut]
        public async Task<IActionResult> Update(Guid id, ProdReturn model)
        {
            model.UpdatedBy = "mamun";
            var productReturn = await _prodReturnServices.UpdateClientAsync($"ProdReturn/UpdateProdReturn/{id}", model);
            return Json(productReturn);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _prodReturnServices.DeleteClientAsync($"ProdReturn/DeleteProdReturn/{id}" );
            return Json(deleted);
        }
    }
}
