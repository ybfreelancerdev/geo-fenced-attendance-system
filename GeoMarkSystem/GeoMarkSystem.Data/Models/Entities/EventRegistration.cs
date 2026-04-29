using System;
using System.Collections.Generic;
using System.Text;

namespace GeoMarkSystem.Data.Models.Entities
{
    public class EventRegistration
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int EventId { get; set; }
        public DateTime RegisteredOn { get; set; }
    }
}
