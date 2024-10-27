using GasHub.Dtos;
using GasHub.Models;
using GasHub.Models.ViewModels;
using GasHub.Services.Interface;
using iTextSharp.text;
using iTextSharp.text.pdf;
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
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> InvoiceReportDounlode()
        {
            byte[] data = GeneratePdf();
            return File(data,"application/pdf","invoice.pdf");
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

        private byte[] GeneratePdf()
        {
            Document doc = new Document(PageSize.A4, 50, 50, 50, 50);
            MemoryStream memory = new MemoryStream();
            PdfWriter writer = PdfWriter.GetInstance(doc, memory);
            doc.Open();

            // Fonts
            var titleFont = FontFactory.GetFont("Calibri", 24, Font.BOLD, BaseColor.BLACK);
            var headerFont = FontFactory.GetFont("Calibri", 14, Font.BOLD, BaseColor.BLACK);
            var bodyFont = FontFactory.GetFont("Calibri", 12, Font.NORMAL, BaseColor.GRAY);
            var linkFont = FontFactory.GetFont("Calibri", 11, Font.UNDERLINE, BaseColor.BLUE);

            // Organization Details
            PdfPTable orgTable = new PdfPTable(2);
            orgTable.HorizontalAlignment = Element.ALIGN_LEFT;
            orgTable.WidthPercentage = 100;
            orgTable.SetWidths(new float[] { 1, 3 });
            orgTable.SpacingAfter = 20;

            // Optionally, you can add a logo here
            // Image logo = Image.GetInstance("path_to_logo_image");
            // logo.ScaleToFit(100f, 100f);
            // PdfPCell logoCell = new PdfPCell(logo) { Border = Rectangle.NO_BORDER };
            // orgTable.AddCell(logoCell);

            orgTable.AddCell(new PdfPCell(new Phrase("Company Name", headerFont)) { Border = Rectangle.NO_BORDER, Rowspan = 2 });

            PdfPCell addressCell = new PdfPCell(new Phrase("123 Company Address\nCity, State, ZIP\nCountry", bodyFont));
            addressCell.Border = Rectangle.NO_BORDER;
            orgTable.AddCell(addressCell);

            PdfPCell contactCell = new PdfPCell(new Phrase("Phone: (123) 456-7890\nEmail: info@company.com\nWebsite: www.company.com", bodyFont));
            contactCell.Border = Rectangle.NO_BORDER;
            orgTable.AddCell(contactCell);

            doc.Add(orgTable);

            // Title
            Paragraph title = new Paragraph("Invoice", titleFont);
            title.Alignment = Element.ALIGN_CENTER;
            doc.Add(title);

            // Invoice Info
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.HorizontalAlignment = Element.ALIGN_LEFT;
            infoTable.WidthPercentage = 100;
            infoTable.SetWidths(new float[] { 1, 2 });

            // Invoice Number
            infoTable.AddCell(new PdfPCell(new Phrase("Invoice Number:", headerFont)) { Border = Rectangle.NO_BORDER });
            infoTable.AddCell(new PdfPCell(new Phrase("12345", bodyFont)) { Border = Rectangle.NO_BORDER });

            // Date
            infoTable.AddCell(new PdfPCell(new Phrase("Date:", headerFont)) { Border = Rectangle.NO_BORDER });
            infoTable.AddCell(new PdfPCell(new Phrase(DateTime.Now.ToString("MM/dd/yyyy"), bodyFont)) { Border = Rectangle.NO_BORDER });

            doc.Add(infoTable);

            // Bill To
            Paragraph billToHeader = new Paragraph("Bill To:", headerFont);
            billToHeader.SpacingBefore = 20;
            doc.Add(billToHeader);

            Paragraph billToInfo = new Paragraph("Customer Name\nCustomer Address\nCity, State, ZIP\nCountry", bodyFont);
            doc.Add(billToInfo);

            // Line Items Table
            PdfPTable itemTable = new PdfPTable(4);
            itemTable.HorizontalAlignment = Element.ALIGN_LEFT;
            itemTable.WidthPercentage = 100;
            itemTable.SetWidths(new float[] { 4, 1, 1, 1 });
            itemTable.SpacingBefore = 20;
            itemTable.SpacingAfter = 20;

            // Table Headers
            itemTable.AddCell(new PdfPCell(new Phrase("Description", headerFont)));
            itemTable.AddCell(new PdfPCell(new Phrase("Quantity", headerFont)));
            itemTable.AddCell(new PdfPCell(new Phrase("Unit Price", headerFont)));
            itemTable.AddCell(new PdfPCell(new Phrase("Total", headerFont)));

            // Example Item
            itemTable.AddCell(new PdfPCell(new Phrase("Item 1 Description", bodyFont)));
            itemTable.AddCell(new PdfPCell(new Phrase("2", bodyFont)));
            itemTable.AddCell(new PdfPCell(new Phrase("$10.00", bodyFont)));
            itemTable.AddCell(new PdfPCell(new Phrase("$20.00", bodyFont)));

            // Add more items as needed...

            doc.Add(itemTable);

            // Total Amount
            PdfPTable totalTable = new PdfPTable(2);
            totalTable.HorizontalAlignment = Element.ALIGN_RIGHT;
            totalTable.WidthPercentage = 30;
            totalTable.SetWidths(new float[] { 1, 1 });

            totalTable.AddCell(new PdfPCell(new Phrase("Subtotal:", headerFont)) { Border = Rectangle.NO_BORDER });
            totalTable.AddCell(new PdfPCell(new Phrase("$20.00", bodyFont)) { Border = Rectangle.NO_BORDER });

            totalTable.AddCell(new PdfPCell(new Phrase("Tax:", headerFont)) { Border = Rectangle.NO_BORDER });
            totalTable.AddCell(new PdfPCell(new Phrase("$2.00", bodyFont)) { Border = Rectangle.NO_BORDER });

            totalTable.AddCell(new PdfPCell(new Phrase("Total:", headerFont)) { Border = Rectangle.NO_BORDER });
            totalTable.AddCell(new PdfPCell(new Phrase("$22.00", bodyFont)) { Border = Rectangle.NO_BORDER });

            doc.Add(totalTable);

            doc.Close();
            return memory.ToArray();
        }
    }
}
