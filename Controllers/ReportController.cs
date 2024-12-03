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
                var order = await _orderServices.GetClientByIdAsync($"Order/getReport/{id}");
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
                var ReportPurchaseDetail = order.OrderDetail.Select(od => new OrderReportDto
                {
                    OrderID = order.Id,
                    ProductID = Guid.Parse(od.ProductID),
                    ProductName = od?.Product?.Name,
                    UnitPrice = od.UnitPrice,
                    Quantity = od.Quantity,
                    Discount = od.Discount,
                    TotalPrice = Math.Round(od.Quantity * od.UnitPrice - od.Discount * od.Quantity, 2) // Calculate total per line with 2 decimals
                }).ToList();



                // calculate subtotal and create the reportorder object
                var subtotal = Math.Round(ReportPurchaseDetail.Sum(item => item.TotalPrice), 2); // ensure subtotal has 2 decimal places
                var deliverycharge = 50.00;  // assuming delivery charge is fixed
                var total = Math.Round((double)subtotal + (double)deliverycharge, 2);  // ensure total has 2 decimal places
                var reportorder = new
                {
                    orderid = order.Id,
                    customername = user?.FirstName + user?.LastName,
                    customerphone = address?.Phone,
                    employeename = "employee name",
                    employeephone = "employee phone",
                    creationdate = order.CreationDate,
                    customeraddress = address?.Address,
                    subtotal = subtotal.ToString("f2"),
                    dalivarycharge = deliverycharge.ToString("f2"),
                    total = total.ToString("f2"),
                    paid = total.ToString("f2"),
                    todaydate = DateTime.Now.ToString("mm/dd/yy"),
                    currenttime = DateTime.Now.ToString("hh:mm:ss tt"),
                    invoicenumber = order.TransactionNumber,
                };


                // convert to datatables
                var dtorderdetails = dtHelpers.ListToDt(ReportPurchaseDetail);
                var dtorder = dtHelpers.ObjectToDataTable(reportorder);

                // set up the report path using the webrootpath
                string reportpath = Path.Combine(_webHostEnvironment.WebRootPath, "Repots", "OrderInvoice.rdlc");

                if (!System.IO.File.Exists(reportpath))
                {
                    return NotFound("Report file not found.");
                }

                // create the local report with the correct path
                var localreport = new LocalReport(reportpath);

                // add the data source to the report
                localreport.AddDataSource("OrdereDetailsList", dtorderdetails);
                localreport.AddDataSource("Order", dtorder);

                //render the report as a pdf
               var result = localreport.Execute(RenderType.Pdf, 1, null, mimeType);
                if (isDownload)
                {
                    // return the pdf file
                    return File(result.MainStream.ToArray(), mimeType, "invoice.pdf");
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
                var reportorder = await _orderServices.GetClientByIdAsync($"Order/getReport/{order.Id}");
                if (reportorder == null)
                    throw new KeyNotFoundException($"Order with ID {id} not found.");
                var user = await _userServices.GetClientByIdAsync($"User/GetUserDetails/{reportorder.UserId}");
                if (user == null)
                    throw new KeyNotFoundException($"User with ID {reportorder.UserId} not found.");
                var DeliveryAddress = await _deliveryAddressServices.GetAllClientsAsync("DeliveryAddress/getAllDeliveryAddress");
                var address = DeliveryAddress.FirstOrDefault(da => da.UserId == user.Id);
                if (address == null)
                    throw new KeyNotFoundException($"address  not found.");
                // Fetch related data
                var reportOrderDetails = reportorder.OrderDetail.Select(od => new OrderReportDto
                {
                    OrderID = reportorder.Id,
                    ProductID = Guid.Parse(od.ProductID),
                    ProductName = od?.Product?.Name,
                    UnitPrice = od.UnitPrice,
                    Quantity = od.Quantity,
                    Discount = od.Discount,
                    TotalPrice = Math.Round(od.Quantity * od.UnitPrice - od.Discount * od.Quantity, 2) // Calculate total per line with 2 decimals
                }).ToList();



                // calculate subtotal and create the reportorder object
                var subtotal = Math.Round(reportOrderDetails.Sum(item => item.TotalPrice), 2); // ensure subtotal has 2 decimal places
                var deliverycharge = 50.00;  // assuming delivery charge is fixed
                var total = Math.Round((double)subtotal + (double)deliverycharge, 2);  // ensure total has 2 decimal places
                var ReportOrder = new
                {
                    orderid = order.Id,
                    customername = user?.FirstName + user?.LastName,
                    customerphone = address?.Phone,
                    employeename = "employee name",
                    employeephone = "employee phone",
                    creationdate = order.CreationDate,
                    customeraddress = address?.Address,
                    subtotal = subtotal.ToString("f2"),
                    dalivarycharge = deliverycharge.ToString("f2"),
                    total = total.ToString("f2"),
                    paid = total.ToString("f2"),
                    todaydate = DateTime.Now.ToString("mm/dd/yy"),
                    currenttime = DateTime.Now.ToString("hh:mm:ss tt"),
                    invoicenumber = order.TransactionNumber,
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
