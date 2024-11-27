using GasHub.Extensions;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddCustomServices(builder.Configuration);

var app = builder.Build();

app.UseCustomMiddleware();

app.Run();
