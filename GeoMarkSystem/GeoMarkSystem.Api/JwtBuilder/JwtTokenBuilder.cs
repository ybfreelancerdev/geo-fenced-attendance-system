using GeoMarkSystem.Data.Context;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace GeoMarkSystem.Jwt
{
    public sealed class JwtTokenBuilder
    {
        private SecurityKey securityKey = JwtSecurityKey.Create(GeoMarkSystemContext.SecretKey);
        private string subject = "JwtAuthentication";
        private string? issuer = GeoMarkSystemContext.ValidIssuer;
        private string? audience = GeoMarkSystemContext.ValidAudience;
        private Dictionary<string, string> claims = new Dictionary<string, string>();
        private int expiryInMinutes = Convert.ToInt16(GeoMarkSystemContext.TokenExpireMinute);

        public string GenerateToken(IEnumerable<Claim> claims, bool RememberMe)
        {
            string tokenString = string.Empty;
            if (RememberMe == true)
            {
                var token = new JwtSecurityToken(
                             issuer: this.issuer,
                             audience: this.audience,
                             claims: claims,
                             expires: DateTime.UtcNow.AddYears(1),
                             signingCredentials: new SigningCredentials(
                                                       this.securityKey,
                                                       SecurityAlgorithms.HmacSha256));
                tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            }
            else
            {
                var token = new JwtSecurityToken(
                                 issuer: this.issuer,
                                 audience: this.audience,
                                 claims: claims,
                                 expires: DateTime.UtcNow.AddMinutes(expiryInMinutes),
                                 signingCredentials: new SigningCredentials(
                                                           this.securityKey,
                                                           SecurityAlgorithms.HmacSha256));
                tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            }
            return tokenString;
        }

        public static string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        public static ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false, //you might want to validate the audience and issuer depending on your use case
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(GeoMarkSystemContext.SecretKey)),
                ValidateLifetime = false //here we are saying that we don't care about the token's expiration date
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }

        #region private

        private void EnsureArguments()
        {
            if (this.securityKey == null)
                throw new ArgumentNullException("Security Key");

            if (string.IsNullOrEmpty(this.subject))
                throw new ArgumentNullException("Subject");

            if (string.IsNullOrEmpty(this.issuer))
                throw new ArgumentNullException("Issuer");

            if (string.IsNullOrEmpty(this.audience))
                throw new ArgumentNullException("Audience");
        }

        /// <summary>
        /// Get this datetime as a Unix epoch timestamp (seconds since Jan 1, 1970, midnight UTC).
        /// </summary>
        /// <param name="date">The date to convert.</param>
        /// <returns>Seconds since Unix epoch.</returns>
        public static long ToUnixEpochDate(DateTime date) => new DateTimeOffset(date).ToUniversalTime().ToUnixTimeSeconds();

        #endregion
    }


}
