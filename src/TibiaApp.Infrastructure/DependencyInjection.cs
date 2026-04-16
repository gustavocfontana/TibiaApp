using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TibiaApp.Application.Interfaces;
using TibiaApp.Infrastructure.Data;
using TibiaApp.Infrastructure.ExternalApis;
using TibiaApp.Infrastructure.Repositories;

namespace TibiaApp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<ICreatureRepository, CreatureRepository>();
        services.AddScoped<ISoulCoreRepository, SoulCoreRepository>();

        services.AddMemoryCache();

        services.AddHttpClient<ITibiaDataService, TibiaDataService>(client =>
        {
            client.BaseAddress = new Uri("https://api.tibiadata.com/");
            client.DefaultRequestHeaders.Add("User-Agent", "TibiaApp/1.0");
        });

        return services;
    }
}
