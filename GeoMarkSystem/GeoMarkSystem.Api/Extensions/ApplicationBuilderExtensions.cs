using GeoMarkSystem.Data;
using GeoMarkSystem.Data.Context;

namespace GeoMarkSystem.Api.Extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static async Task SeedDatabaseAsync(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();

            var context = scope.ServiceProvider
                .GetRequiredService<GeoMarkSystemContext>();

            await DbInitializer.SeedAsync(context);
        }
    }
}
