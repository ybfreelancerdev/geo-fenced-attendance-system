using GeoMarkSystem.Data.Context;
using GeoMarkSystem.Data.Helpers;
using GeoMarkSystem.Data.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace GeoMarkSystem.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(GeoMarkSystemContext context)
        {
            // Ensure DB created
            await context.Database.MigrateAsync();

            // Seed Admin
            if (!context.Users.Any(x => x.Role == "Admin"))
            {
                var admin = new User
                {
                    Name = "Admin",
                    Email = "admin@gmail.com",
                    Phone = "1234567890",
                    PasswordHash = ShaHash.Encrypt("123456"),
                    Role = "Admin",
                    CreatedOn = DateTime.UtcNow,
                    IsActive = true,
                    IsDeleted = false
                };

                await context.Users.AddAsync(admin);
            }

            // Seed Normal User
            if (!context.Users.Any(x => x.Email == "user@gmail.com"))
            {
                var user = new User
                {
                    Name = "Test User",
                    Email = "user@gmail.com",
                    Phone = "1234567891",
                    PasswordHash = ShaHash.Encrypt("123456"),
                    Role = "User",
                    CreatedOn = DateTime.UtcNow,
                    IsActive = true,
                    IsDeleted = false
                };

                await context.Users.AddAsync(user);
            }

            await context.SaveChangesAsync();
        }
    }
}
