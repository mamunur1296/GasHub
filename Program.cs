using GasHub.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddCustomServices(builder.Configuration);

var app = builder.Build();

app.UseCustomMiddleware();

app.Run();
