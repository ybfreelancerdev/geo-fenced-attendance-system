using System;
using System.Collections.Generic;
using System.Text;

namespace GeoMarkSystem.Data.Models.Entities
{
    public class Event
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Highlights { get; set; } = null!;
        public string Place { get; set; } = null!;
        public string Address { get; set; } = null!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int Radius { get; set; } = 20;
        public int MaxMembers { get; set; }
        public DateTime EventDate { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    }
}
