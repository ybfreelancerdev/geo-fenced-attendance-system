using System;
using System.Collections.Generic;
using System.Text;

namespace GeoMarkSystem.Data.Models.Views
{
    public class AuthDto
    {
    }
    public class LoginDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
    public class AuthResponseDto
    {
        public string Name { get; set; } = null!;
        public string Token { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
    public class RegisterDto
    {
        public string Name { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
    public class ForgotPasswordDto
    {
        public string Email { get; set; }
    }
    public class VerifyOtpDto
    {
        public string Email { get; set; } = null!;
        public string Otp { get; set; }
    }
    public class ResetPasswordDto
    {
        public string NewPassword { get; set; }
        public string Email { get; set; }
    }
}
