using System;
using System.Collections.Generic;
using System.Text;

namespace GeoMarkSystem.Data.Models.Views
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = "User";
    }
    public class ChangePasswordDto
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
    public class GetUserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public DateTime CreatedOn { get; set; }
    }
    public class UpdateProfileDto
    {
        public string Name { get; set; } = null!;
        public string Phone { get; set; } = null!;
    }

    public class MyProfileDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        public int TotalJoinedEvents { get; set; }
        public int TotalAttendedEvents { get; set; }

        public int UpcomingEvents { get; set; }
    }

    public class AdminDashboardDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int TotalUsers { get; set; }
        public int TotalActiveUsers { get; set; }
        public int TotalInactiveUsers { get; set; }
        public int TotalEvents { get; set; }
        public int TotalUpcomingEvents { get; set; }
        public int TotalDeletedEvents { get; set; }
    }

    public class UserListRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public string Search { get; set; } // name, email
        public string Status { get; set; } = "all"; // (all, active, inactive)

        public string SortBy { get; set; } = "CreatedDate"; // Name, Email, CreatedDate
        public string SortDirection { get; set; } = "desc"; // asc / desc
    }

    public class PagedResult<T>
    {
        public List<T> Data { get; set; }
        public int TotalRecords { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }

    public class UserListDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Status { get; set; }
        public DateTime createdAt { get; set; }
    }
    public class AddFcmTokenRequest
    {
        public string FcmToken { get; set; } = null!;
    }
}
