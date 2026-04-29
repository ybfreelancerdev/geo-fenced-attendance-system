using GeoMarkSystem.Data.Common;
using GeoMarkSystem.Data.Helpers;
using GeoMarkSystem.Data.Models.Entities;
using GeoMarkSystem.Data.Models.Views;
using GeoMarkSystem.Data.Services;
using GeoMarkSystem.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;

namespace GeoMarkSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        #region Property Initialization
        private readonly JsonSerializerSettings _serializerSettings;
        private readonly IUserService _userService;
        #endregion

        #region 'Constructor'
        public AuthController(IUserService userService)
        {
            _userService = userService;
            _serializerSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }
        #endregion

        [HttpPost("Login")]
        public async Task<OperationResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var user = await _userService.FirstOrDefaultAsync(x => x.Email.ToUpper() == dto.Email.ToUpper());
            if (user == null) return new OperationResult<AuthResponseDto>(false, "User not found.");

            if (user.IsActive == false) return new OperationResult<AuthResponseDto>(false, "User is deactivated, please contact to administrator.");

            var isValid = (user.PasswordHash == ShaHash.Encrypt(dto.Password));
            if (!isValid) return new OperationResult<AuthResponseDto>(false, "Incorrect password.");

            var token = new JwtTokenBuilder().GenerateToken(GetClaim(user), false);
            AuthResponseDto authResponse = new AuthResponseDto();
            authResponse.Token = token;
            authResponse.Name = user.Name;
            authResponse.Email = dto.Email;
            authResponse.Role = user.Role;

            return new OperationResult<AuthResponseDto>(true, "Login successful.", authResponse);
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<OperationResult<string>> Register(RegisterDto dto)
        {
            var existing = await _userService.FirstOrDefaultAsync(x => x.Email.ToUpper() == dto.Email.ToUpper() && !x.IsDeleted);
            if (existing != null) return new OperationResult<string>(false, "User already exists.");

            var user = new User
            {
                Name = dto.Name,
                Phone = dto.Phone,
                Email = dto.Email,
                PasswordHash = ShaHash.Encrypt(dto.Password),
                Role = "User"
            };

            _userService.Add(user);
            await _userService.SaveAsync();
            return new OperationResult<string>(true, "User registered successfully.");
        }

        [HttpPost("forgot-password")]
        public async Task<OperationResult<string>> ForgotPassword(ForgotPasswordDto dto)
        {
            var user = await _userService.FirstOrDefaultAsync(x => x.Email.ToUpper() == dto.Email.ToUpper() && !x.IsDeleted);

            if (user == null)
                return new OperationResult<string>(false, "User not found.");

            // Random OTP Generate Function
            Random generator = new Random();
            String randomOTP = generator.Next(0, 1000000).ToString("D6");

            user.Otp = randomOTP;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(10);

            _userService.UpdateAsync(user, user.Id);
            await _userService.SaveAsync();

            // TODO: Send OTP via Email/SMS

            return new OperationResult<string>(true, "OTP sent successfully.");
        }

        [HttpPost("verify-otp")]
        [AllowAnonymous]
        public async Task<OperationResult<string>> VerifyOtp(VerifyOtpDto dto)
        {
            var user = await _userService.FirstOrDefaultAsync(x =>
                x.Email.ToUpper() == dto.Email.ToUpper() &&
                x.Otp == dto.Otp &&
                x.OtpExpiry > DateTime.UtcNow);

            if (user == null)
                return new OperationResult<string>(false, "Invalid or expired OTP.");

            return new OperationResult<string>(true, "OTP verified successfully.");
        }

        [HttpPost("resend-otp")]
        [AllowAnonymous]
        public async Task<OperationResult<string>> ResendOtp(ForgotPasswordDto dto)
        {
            var user = await _userService.FirstOrDefaultAsync(x =>
                x.Email.ToUpper() == dto.Email.ToUpper() && !x.IsDeleted);

            if (user == null)
                return new OperationResult<string>(false, "User not found.");

            // Random OTP Generate Function
            Random generator = new Random();
            String randomOTP = generator.Next(0, 1000000).ToString("D6");

            user.Otp = randomOTP;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(10);

            _userService.UpdateAsync(user, user.Id);
            await _userService.SaveAsync();

            // TODO: Send OTP again

            return new OperationResult<string>(true, "OTP resent successfully.");
        }

        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<OperationResult<string>> ResetPassword(ResetPasswordDto dto)
        {
            var user = await _userService.FirstOrDefaultAsync(x =>
                x.Email.ToUpper() == dto.Email.ToUpper() && !x.IsDeleted);

            if (user == null)
                return new OperationResult<string>(false, "User not found.");

            user.PasswordHash = ShaHash.Encrypt(dto.NewPassword);

            // Clear OTP after use
            user.Otp = null;
            user.OtpExpiry = null;

            _userService.UpdateAsync(user, user.Id);
            await _userService.SaveAsync();

            return new OperationResult<string>(true, "Password reset successfully.");
        }

        #region 'Helper'
        private List<Claim> GetClaim(User obj)
        {
            var claims = new List<Claim>();
            claims.Add(new Claim("sid", obj.Id.ToString()));
            claims.Add(new Claim("Email", obj.Email.ToString()));
            claims.Add(new Claim(ClaimTypes.Role, obj.Role.ToString()));
            claims.Add(new Claim("Name", obj.Name.ToString()));
            claims.Add(new Claim("Phone", obj.Phone.ToString()));
            return claims;
        }

        #endregion
    }
}
