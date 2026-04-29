using GeoMarkSystem.Data.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace GeoMarkSystem.Data.Context
{
    public class GeoMarkSystemContext : DbContext
    {
        public static string? ConnectionString { get; set; }
        public static string? ValidIssuer { get; set; }
        public static string? SecretKey { get; set; }
        public static string? ValidAudience { get; set; }
        public static string? TokenExpireMinute { get; set; }

        public GeoMarkSystemContext(DbContextOptions<GeoMarkSystemContext> options)
        : base(options) {
            Database.SetCommandTimeout(150000);
        }

        public GeoMarkSystemContext()
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<UserDevice> UserDevices => Set<UserDevice>();
        public DbSet<Event> Events => Set<Event>();
        public DbSet<Attendance> Attendance => Set<Attendance>();
        public DbSet<EventRegistration> EventRegistration => Set<EventRegistration>();

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                if (ConnectionString != null)
                    optionsBuilder.UseSqlServer(ConnectionString);
            }
        }
    }
}
