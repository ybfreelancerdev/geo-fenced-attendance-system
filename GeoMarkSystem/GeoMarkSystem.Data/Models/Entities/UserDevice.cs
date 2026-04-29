using System;
using System.Collections.Generic;
using System.Text;

namespace GeoMarkSystem.Data.Models.Entities
{
    public class UserDevice
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public string FcmToken { get; set; } = null!;
    }
}
