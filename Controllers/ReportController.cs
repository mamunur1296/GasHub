using AspNetCore.Reporting;
using GasHub.Dtos;
using GasHub.Models;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Reflection;
using System.Xml.Linq;

namespace GasHub.Controllers
{
    public class ReportController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IClientServices<Order> _orderServices;
        private readonly IClientServices<Product> _productServices;
        private readonly IClientServices<ProductDiscunt> _productDiscuntServices;
        private readonly IClientServices<User> _userServices;
        private readonly IClientServices<DeliveryAddress> _deliveryAddressServices;
        private readonly IClientServices<PurchaseReportDTO> _purchaseServices;
        public ReportController(IWebHostEnvironment webHostEnvironment, IClientServices<Order> orderServices, IClientServices<Product> productServices, IClientServices<ProductDiscunt> productDiscuntServices, IClientServices<User> userServices, IClientServices<DeliveryAddress> deliveryAddressServices, IClientServices<PurchaseReportDTO> purchaseServices)
        {
            _webHostEnvironment = webHostEnvironment;
            _orderServices = orderServices;
            _productServices = productServices;
            _productDiscuntServices = productDiscuntServices;
            _userServices = userServices;
            _deliveryAddressServices = deliveryAddressServices;
            _purchaseServices = purchaseServices;
        }

        public IActionResult Index()
        {
            return View();
        }
        
        public async Task<IActionResult> DownloadOrderInvoice(string id, bool isDownload = false)
        {
            string mimeType = "application/pdf";

            try
            {
                // Fetch the specific order
                var orders = await _orderServices.GetAllClientsAsync("Order/getAllOrder");
                var order = orders.FirstOrDefault(or => or.Id.ToString() == id);
                if (order == null)
                    throw new KeyNotFoundException($"Order with ID {id} not found.");
                var user = await _userServices.GetClientByIdAsync($"User/GetUserDetails/{order.UserId}");
                if (user == null)
                    throw new KeyNotFoundException($"User with ID {order.UserId} not found.");
                var DeliveryAddress = await _deliveryAddressServices.GetAllClientsAsync("DeliveryAddress/getAllDeliveryAddress");
                var address = DeliveryAddress.FirstOrDefault(da=>da.UserId == user.Id);
                if (address == null)
                    throw new KeyNotFoundException($"address  not found.");
                // Fetch related data
                var orderDetails = orders.Where(od => od.TransactionNumber == order.TransactionNumber).ToList();
                var products = (await _productServices.GetAllClientsAsync("Product/getAllProduct")).ToDictionary(p => p.Id);
                var productDiscounts = (await _productDiscuntServices.GetAllClientsAsync("ProductDiscunt/getAllProductDiscunt"))
                                        .ToDictionary(pd => pd.ProductId, pd => pd.DiscountedPrice);

                // Map to DTO
                var reportOrderDetails = orderDetails.Select(od =>
                {
                    // Fetch product details
                    if (!products.TryGetValue(od.ProductId, out var product))
                        throw new KeyNotFoundException($"Product with ID {od.ProductId} not found.");

                    // Calculate discount
                    var discount = productDiscounts.ContainsKey(od.ProductId) ? productDiscounts[od.ProductId] : 0;
                    var unitPrice = product.ProdPrice;
                    var quantity = int.TryParse(od.Comments, out var parsedQuantity) ? parsedQuantity : 0; 
                    var totalPrice = quantity * unitPrice - (  discount );


                    return new OrderReportDto
                    {
                        OrderID = order.Id,
                        ProductID = od.ProductId,
                        ProductName = product.Name,
                        UnitPrice = unitPrice,
                        Quantity = quantity,
                        Discount = discount,
                        TotalPrice = totalPrice
                    };
                }).ToList();

                // Calculate subtotal and create the ReportOrder object
                var subtotal = Math.Round(reportOrderDetails.Sum(item => item.TotalPrice), 2); // Ensure Subtotal has 2 decimal places
                var deliveryCharge = 50.00;  // Assuming delivery charge is fixed
                var total = Math.Round((double)subtotal + (double)deliveryCharge, 2);  // Ensure Total has 2 decimal places
                var ReportOrder = new
                {
                    OrderID = order.Id,
                    CustomerName = user?.FirstName + user?.LastName,
                    CustomerPhone = address?.Phone,
                    EmployeeName = "Employee Name",
                    EmployeePhone = "Employee Phone",
                    CreationDate = order.CreationDate,
                    CustomerAddress = address?.Address,
                    Subtotal = subtotal.ToString("F2"),
                    DalivaryCharge = deliveryCharge.ToString("F2"),
                    Total = total.ToString("F2"),
                    Paid = total.ToString("F2"),
                    TodayDate = DateTime.Now.ToString("MM/dd/yy"),
                    CurrentTime = DateTime.Now.ToString("hh:mm:ss tt"),
                    InvoiceNumber = order.TransactionNumber,
                };


                // Convert to DataTables
                var dtOrderDetails = dtHelpers.ListToDt(reportOrderDetails);
                var dtOrder = dtHelpers.ObjectToDataTable(ReportOrder);

                // Set up the report path using the WebRootPath
                string reportPath = Path.Combine(_webHostEnvironment.WebRootPath, "Repots", "OrderInvoice.rdlc");

                // Check if the report file exists
                if (!System.IO.File.Exists(reportPath))
                {
                    return NotFound("Report file not found.");
                }

                // Create the local report with the correct path
                var localReport = new LocalReport(reportPath);

                // Add the data source to the report
                localReport.AddDataSource("OrdereDetailsList", dtOrderDetails);
                localReport.AddDataSource("Order", dtOrder);

                // Render the report as a PDF
                var result = localReport.Execute(RenderType.Pdf, 1, null, mimeType);
                if (isDownload)
                {
                    // Return the PDF file
                    return File(result.MainStream.ToArray(), mimeType, "Invoice.pdf");
                }
                else
                {
                    return File(result.MainStream.ToArray(), mimeType);
                }

            }
            catch (Exception ex)
            {
                // Log the exception for debugging

                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            
        }
        public async Task<IActionResult> DownloadCustomerInvoice(string id, bool isDownload = false)
        {
            string mimeType = "application/pdf";

            try
            {
                // Fetch the specific order
                var orders = await _orderServices.GetAllClientsAsync("Order/getTotalOrder");
                var order = orders.FirstOrDefault(or => or.TransactionNumber == id);
                if (order == null)
                    throw new KeyNotFoundException($"Order with ID {id} not found.");
                var user = await _userServices.GetClientByIdAsync($"User/GetUserDetails/{order.UserId}");
                if (user == null)
                    throw new KeyNotFoundException($"User with ID {order.UserId} not found.");
                var DeliveryAddress = await _deliveryAddressServices.GetAllClientsAsync("DeliveryAddress/getAllDeliveryAddress");
                var address = DeliveryAddress.FirstOrDefault(da => da.UserId == user.Id);
                if (address == null)
                    throw new KeyNotFoundException($"address  not found.");
                // Fetch related data
                var orderDetails = orders.Where(od => od.TransactionNumber == order.TransactionNumber).ToList();
                var products = (await _productServices.GetAllClientsAsync("Product/getAllProduct")).ToDictionary(p => p.Id);
                var productDiscounts = (await _productDiscuntServices
                        .GetAllClientsAsync("ProductDiscunt/getAllProductDiscunt"))
                        .Where(pd => pd.ValidTill > DateTime.Now) // Filter only valid discounts
                        .ToDictionary(pd => pd.ProductId, pd => pd.DiscountedPrice);

                // Map to DTO
                var reportOrderDetails = orderDetails.Select(od =>
                {
                    // Fetch product details
                    if (!products.TryGetValue(od.ProductId, out var product))
                        throw new KeyNotFoundException($"Product with ID {od.ProductId} not found.");

                    // Calculate discount
                    var discount = productDiscounts.ContainsKey(od.ProductId) ? productDiscounts[od.ProductId] : 0;
                   
                    var unitPrice = product.ProdPrice;
                    var quantity = int.TryParse(od.Comments, out var parsedQuantity) ? parsedQuantity : 0;
                    var totalPrice = Math.Round(quantity * unitPrice - (discount * quantity), 2);


                    return new OrderReportDto
                    {
                        OrderID = order.Id,
                        ProductID = od.ProductId,
                        ProductName = product.Name,
                        UnitPrice = unitPrice,
                        Quantity = quantity,
                        Discount = discount,
                        TotalPrice = totalPrice
                    };
                }).ToList();

                // Calculate subtotal and create the ReportOrder object
                var subtotal = Math.Round(reportOrderDetails.Sum(item => item.TotalPrice), 2); // Ensure Subtotal has 2 decimal places
                var deliveryCharge = 50.00;  // Assuming delivery charge is fixed
                var total = Math.Round((double)subtotal + (double)deliveryCharge, 2);  // Ensure Total has 2 decimal places
                var ReportOrder = new
                {
                    OrderID = order.Id,
                    CustomerName = user?.FirstName + user?.LastName,
                    CustomerPhone = address?.Phone,
                    EmployeeName = "Employee Name",
                    EmployeePhone = "Employee Phone",
                    CreationDate = order.CreationDate,
                    CustomerAddress = address?.Address,
                    Subtotal = subtotal.ToString("F2"),
                    DalivaryCharge = deliveryCharge.ToString("F2"),
                    Total = total.ToString("F2"),
                    Paid = total.ToString("F2"),
                    TodayDate = DateTime.Now.ToString("MM/dd/yy"),
                    CurrentTime = DateTime.Now.ToString("hh:mm:ss tt"),
                    InvoiceNumber = order.TransactionNumber,
                };


                // Convert to DataTables
                var dtOrderDetails = dtHelpers.ListToDt(reportOrderDetails);
                var dtOrder = dtHelpers.ObjectToDataTable(ReportOrder);

                // Set up the report path using the WebRootPath
                string reportPath = Path.Combine(_webHostEnvironment.WebRootPath, "Repots", "CustomerInvoice.rdlc");

                // Check if the report file exists
                if (!System.IO.File.Exists(reportPath))
                {
                    return NotFound("Report file not found.");
                }

                // Create the local report with the correct path
                var localReport = new LocalReport(reportPath);

                // Add the data source to the report
                localReport.AddDataSource("OrdereDetailsList", dtOrderDetails);
                localReport.AddDataSource("Order", dtOrder);

                // Render the report as a PDF
                var result = localReport.Execute(RenderType.Pdf, 1, null, mimeType);
                if (isDownload)
                {
                    // Return the PDF file
                    return File(result.MainStream.ToArray(), mimeType, "Invoice.pdf");
                }
                else
                {
                    return File(result.MainStream.ToArray(), mimeType);
                }

            }
            catch (Exception ex)
            {
                // Log the exception for debugging

                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }
        public async Task<IActionResult> DownloadPurchaseInvoice(string id, bool isDownload = false)
        {
            string mimeType = "application/pdf";

            try
            {
                var Purchase = await _purchaseServices.GetClientByIdAsync($"Purchase/Details/{id}");



                var ReportPurchaseDetail = Purchase.PurchaseDetails.Select(od => new OrderReportDto
                {
                    OrderID = od.Id,
                    ProductID = Guid.Parse(od.ProductID),
                    ProductName = od?.Product?.Name,
                    UnitPrice = od.UnitPrice,  
                    Quantity = od.Quantity,
                    Discount = od.Discount,
                    TotalPrice = Math.Round(od.Quantity * od.UnitPrice - od.Discount, 2) // Calculate total per line with 2 decimals
                }).ToList();
                // Calculate subtotal and create the ReportOrder object
                var subtotal = Math.Round(ReportPurchaseDetail.Sum(item => item.TotalPrice), 2); // Ensure Subtotal has 2 decimal places
                var deliveryCharge = 50.00;  // Assuming delivery charge is fixed
                var total = Math.Round((double)subtotal + (double)deliveryCharge, 2);  // Ensure Total has 2 decimal places
                var ReportOrder = new
                {
                    OrderID = Purchase.Id,
                    CustomerName = Purchase?.Company.Name,
                    CustomerPhone = Purchase?.Company.ContactPerNum,
                    EmployeeName = "Mamun",
                    EmployeePhone = "01767988385",
                    CreationDate = Purchase.CreationDate,
                    CustomerAddress = Purchase?.Company.Name + Purchase?.Company.ContactPerNum,
                    Subtotal = subtotal.ToString("F2"), // Format subtotal as string with 2 decimal places
                    DalivaryCharge = deliveryCharge.ToString("F2"), // Format delivery charge with 2 decimals
                    Total = total.ToString("F2"), // Format total as string with 2 decimal places
                    Paid = total.ToString("F2"),  // Assuming the paid amount equals the total
                    TodayDate = DateTime.Now.ToString("MM/dd/yy"), // Format the current date as MM/dd/yy
                    CurrentTime = DateTime.Now.ToString("hh:mm:ss tt"),
                    InvoiceNumber = "Null",
                };
                // Convert to DataTables
                var dtOrderDetails = dtHelpers.ListToDt(ReportPurchaseDetail);
                var dtOrder = dtHelpers.ObjectToDataTable(ReportOrder);

                // Set up the report path using the WebRootPath
                string reportPath = Path.Combine(_webHostEnvironment.WebRootPath, "Repots", "PurchaseInvoice.rdlc");

                // Check if the report file exists
                if (!System.IO.File.Exists(reportPath))
                {
                    return NotFound("Report file not found.");
                }

                // Create the local report with the correct path
                var localReport = new LocalReport(reportPath);

                // Add the data source to the report
                localReport.AddDataSource("OrdereDetailsList", dtOrderDetails);
                localReport.AddDataSource("Order", dtOrder);

                // Render the report as a PDF
                var result = localReport.Execute(RenderType.Pdf, 1, null, mimeType);
                if (isDownload)
                {
                    // Return the PDF file
                    return File(result.MainStream.ToArray(), mimeType, "Invoice.pdf");
                }
                else
                {
                    return File(result.MainStream.ToArray(), mimeType);
                }

            }
            catch (Exception ex)
            {
                // Log the exception for debugging

                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }
        public static class dtHelpers
        {
            public static DataTable ListToDt<T>(List<T> items)
            {
                DataTable dt = new DataTable(typeof(T).Name);

                // Get all the properties of the type T
                var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

                // Add a column to the DataTable for each property of T
                foreach (var prop in properties)
                {
                    dt.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
                }

                // Populate the DataTable rows with the values from the list
                foreach (var item in items)
                {
                    var values = new object[properties.Length];
                    for (int i = 0; i < properties.Length; i++)
                    {
                        values[i] = properties[i].GetValue(item, null);
                    }
                    dt.Rows.Add(values);
                }

                return dt;
            }
            public static DataTable ObjectToDataTable<T>(T obj)
            {
                DataTable table = new DataTable();
                var properties = typeof(T).GetProperties();

                foreach (var prop in properties)
                {
                    // Add columns for each property in the object
                    table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
                }

                // Create a new row and add the property values
                DataRow row = table.NewRow();
                foreach (var prop in properties)
                {
                    row[prop.Name] = prop.GetValue(obj) ?? DBNull.Value;
                }
                table.Rows.Add(row);

                return table;
            }


        }
    }
}
