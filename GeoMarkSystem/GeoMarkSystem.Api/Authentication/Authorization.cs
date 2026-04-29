using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace GeoMarkSystem.Authentication
{
    public class Authorization : ControllerBase
    {
        #region 'Property Initialization'
        private int userId;
        #endregion

        #region Constructor
        public Authorization()
        {

        }
        #endregion

        public int GetUserId(ClaimsPrincipal user)
        {
            if (user.Claims.Count() == 0)
                return 0;
            else
                return Convert.ToInt32(user.FindFirst(JwtRegisteredClaimNames.Sid).Value);
        }
    }
}
