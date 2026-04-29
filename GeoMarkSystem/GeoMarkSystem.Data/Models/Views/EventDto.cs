using System;
using System.Collections.Generic;
using System.Text;

namespace GeoMarkSystem.Data.Models.Views
{
    public class EventDto
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Highlights { get; set; } = null!;
        public string Place { get; set; } = null!;
        public string Address { get; set; } = null!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int Radius { get; set; }
        public int MaxMembers { get; set; }
        public DateTime EventDate { get; set; }
    }

    public class GetEventDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public int MaxMembers { get; set; }
        public string Location { get; set; }
        public int JoinedUsers { get; set; }
        public DateTime EventDate { get; set; }
    }
    public class GetMyEventDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public int MaxMembers { get; set; }
        public string Location { get; set; }
        public bool Attended { get; set; }
        public int JoinedUsers { get; set; }
        public DateTime EventDate { get; set; }
    }

    public class GetTopEventDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public int MaxMembers { get; set; }
        public string Location { get; set; }
        public DateTime EventDate { get; set; }
    }
    public class EventListRequest
    {
        public string Status { get; set; } = "upcoming"; // upcoming | all
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
    public class MyEventsRequest
    {
        public string Status { get; set; } = "upcoming"; // upcoming | all
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class EventDetailDto
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
        public int JoinedUsers { get; set; }
        public bool IsJoined { get; set; }
    }
}
