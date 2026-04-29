using System;
using System.Collections.Generic;
using System.Text;

namespace GeoMarkSystem.Data.Models.Entities
{
    public class User
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;

        public string PasswordHash { get; set; } = null!;

        public string Role { get; set; } = "User"; // Admin / User

        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        // OTP fields
        public string? Otp { get; set; }
        public DateTime? OtpExpiry { get; set; }
    }
}
