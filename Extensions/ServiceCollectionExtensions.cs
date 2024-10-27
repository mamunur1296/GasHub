using GasHub.Dtos;
using GasHub.Models;
using GasHub.Services.Implemettions;
using GasHub.Services.Interface;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace GasHub.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCustomServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Reading the BaseUrl value from configuration
            var baseUrl = configuration["BaseUrl:AuthenticationAPI"];
            // Assign it to Helper.BaseUrl if Helper is a static class
            Helper.BaseUrl = baseUrl;

            services.AddHttpClient();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IHttpService, HttpService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IFileUploader, FileUploader>();
            services.AddScoped<IClientServices<User>, ClientServices<User>>();
            services.AddScoped<IClientServices<Company>, ClientServices<Company>>();
            services.AddScoped<IClientServices<DeliveryAddress>, ClientServices<DeliveryAddress>>();
            services.AddScoped<IClientServices<Order>, ClientServices<Order>>();
            services.AddScoped<IClientServices<ProdReturn>, ClientServices<ProdReturn>>();
            services.AddScoped<IClientServices<Product>, ClientServices<Product>>();
            services.AddScoped<IClientServices<ProductDiscunt>, ClientServices<ProductDiscunt>>();
            services.AddScoped<IClientServices<ProductSize>, ClientServices<ProductSize>>();
            services.AddScoped<IClientServices<Retailer>, ClientServices<Retailer>>();
            services.AddScoped<IClientServices<Role>, ClientServices<Role>>();
            services.AddScoped<IClientServices<Stock>, ClientServices<Stock>>();
            services.AddScoped<IClientServices<Trader>, ClientServices<Trader>>(); 
            services.AddScoped<IClientServices<Valve>, ClientServices<Valve>>();
            services.AddScoped<IClientServices<Register>, ClientServices<Register>>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.LoginPath = "/Public/Login";
                    options.ExpireTimeSpan = TimeSpan.FromMinutes(120);
                    options.ReturnUrlParameter = "ReturnUrl";
                });

            services.AddSession();

            return services;
        }
    }
}
