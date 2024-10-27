using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GasHub.Controllers
{
    public class CompanyController : Controller
    {
        private readonly IClientServices<Company> _companyServices;
        public CompanyController(IClientServices<Company> companyServices)
        {
            _companyServices = companyServices;
        }



        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> GetCompanyList()
        {
            var companys = await _companyServices.GetAllClientsAsync("Company/getAllCompany");
            return Json(new { data = companys });
        }
        [HttpPost]
        public async Task<IActionResult> Create(Company model)
        {
            model.CreatedBy = "";
            var result = await _companyServices.PostClientAsync("Company/CreateCompany",model);
            return Json(result);
        }
        [HttpGet]
        public async Task<IActionResult> GetCompany(Guid id)
        {
            var customer = await _companyServices.GetClientByIdAsync($"Company/getCompany/{id}");
            return Json(customer);
        }
        [HttpPut]
        public async Task<IActionResult> Update(Guid id, Company model)
        {
            var result = await _companyServices.UpdateClientAsync($"Company/UpdateCompany/{id}", model);
            return Json(result);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _companyServices.DeleteClientAsync($"Company/DeleteCompany/{id}");
            return Json(deleted);
        }
    }
}
