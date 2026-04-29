using FirebaseAdmin.Messaging;
using GeoMarkSystem.Data.Common;
using GeoMarkSystem.Data.Helpers;
using GeoMarkSystem.Data.Models.Entities;
using GeoMarkSystem.Data.Models.Views;
using GeoMarkSystem.Data.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Security.Claims;

namespace GeoMarkSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        #region Property Initialization
        private Authentication.Authorization _authorization;
        private readonly JsonSerializerSettings _serializerSettings;
        private readonly IUserService _userService;
        private readonly IEventService _eventService;
        private readonly IEventRegistrationService _eventRegistrationService;
        private readonly IAttendanceService _attendanceService;
        private readonly IUserDeviceService _userDeviceService;
        private int LoggedInUserId
        {
            get
            {
                ClaimsPrincipal userClaims = this.User as ClaimsPrincipal;
                return _authorization.GetUserId(userClaims);
            }
        }
        #endregion

        #region 'Constructor'
        public UserController(IUserService userService, 
            IEventService eventService, 
            IEventRegistrationService eventRegistrationService, 
            IAttendanceService attendanceService,
            IUserDeviceService userDeviceService)
        {
            _authorization = new Authentication.Authorization();
            _userService = userService;
            _userDeviceService = userDeviceService;
            _eventService = eventService;
            _eventRegistrationService = eventRegistrationService;
            _attendanceService = attendanceService;
            _serializerSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }
        #endregion

        [HttpGet("dashboard")]
        [Authorize(Roles = "Admin")]
        public async Task<OperationResult<AdminDashboardDto>> GetDashboard()
        {
            var admin = await _userService.FirstOrDefaultAsync(x =>
                        x.Id == LoggedInUserId && !x.IsDeleted && x.IsActive); // or from token

            if (admin == null)
                return new OperationResult<AdminDashboardDto>(false, "User not found.");

            var now = DateTime.UtcNow;

            var totalUsers = await _userService.CountAsync();
            var totalActiveUsers = await _userService.CountAsync(x => !x.IsDeleted && x.IsActive);
            var totalInactiveUsers = await _userService.CountAsync(x => !x.IsDeleted && !x.IsActive);
            var totalEvents = await _eventService.CountAsync();
            var totalUpcomingEvents = await _eventService.CountAsync(x => !x.IsDeleted && x.IsActive && x.EventDate > now);
            var totalDeletedEvents = await _eventService.CountAsync(x => x.IsDeleted);

            var result = new AdminDashboardDto
            {
                Id = admin.Id,
                Name = admin.Name,
                TotalUsers = totalUsers,
                TotalActiveUsers = totalActiveUsers,
                TotalInactiveUsers = totalInactiveUsers,
                TotalEvents = totalEvents,
                TotalUpcomingEvents = totalUpcomingEvents,
                TotalDeletedEvents = totalDeletedEvents
            };

            return new OperationResult<AdminDashboardDto>(true, "", result);
        }

        [HttpGet("profile")]
        public async Task<OperationResult<GetUserDto>> GetProfile()
        {
            var user = await _userService.FirstOrDefaultAsync(x =>
                x.Id == LoggedInUserId && !x.IsDeleted);

            if (user == null)
                return new OperationResult<GetUserDto>(false, "User not found.");

            var result = new GetUserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                CreatedOn = user.CreatedOn
            };

            return new OperationResult<GetUserDto>(true, "", result);
        }

        [HttpPut("update-profile")]
        [Authorize]
        public async Task<OperationResult<string>> UpdateProfile(UpdateProfileDto dto)
        {
            var user = await _userService.FirstOrDefaultAsync(x =>
                x.Id == LoggedInUserId && !x.IsDeleted);

            if (user == null)
                return new OperationResult<string>(false, "User not found.");

            // Optional: Validate phone uniqueness
            var existingPhone = await _userService.FirstOrDefaultAsync(x =>
                x.Phone == dto.Phone &&
                x.Id != LoggedInUserId &&
                !x.IsDeleted);

            if (existingPhone != null)
                return new OperationResult<string>(false, "Phone number already in use.");

            // Update fields
            user.Name = dto.Name;
            user.Phone = dto.Phone;

            // Optional (recommended)
            // user.UpdatedOn = DateTime.UtcNow;

            _userService.UpdateAsync(user, user.Id);
            await _userService.SaveAsync();

            return new OperationResult<string>(true, "Profile updated successfully.");
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<OperationResult<string>> ChangePassword(ChangePasswordDto dto)
        {
            var user = await _userService.FirstOrDefaultAsync(x =>
                x.Id == LoggedInUserId && !x.IsDeleted);

            if (user == null)
                return new OperationResult<string>(false, "User not found.");

            // Validate old password
            var oldHash = ShaHash.Encrypt(dto.OldPassword);
            if (user.PasswordHash != oldHash)
                return new OperationResult<string>(false, "Old password is incorrect.");

            // Optional: prevent same password
            if (dto.OldPassword == dto.NewPassword)
                return new OperationResult<string>(false, "New password cannot be same as old password.");

            user.PasswordHash = ShaHash.Encrypt(dto.NewPassword);

            _userService.UpdateAsync(user, user.Id);
            await _userService.SaveAsync();

            return new OperationResult<string>(true, "Password changed successfully.");
        }

        [HttpDelete("delete-account")]
        [Authorize]
        public async Task<OperationResult<string>> DeleteAccount()
        {
            var user = await _userService.FirstOrDefaultAsync(x =>
                x.Id == LoggedInUserId && !x.IsDeleted);

            if (user == null)
                return new OperationResult<string>(false, "User not found.");

            user.IsDeleted = true;
            user.IsActive = false;

            _userService.UpdateAsync(user, user.Id);
            await _userService.SaveAsync();

            return new OperationResult<string>(true, "Account deleted successfully.");
        }

        [HttpPut("block-user/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<OperationResult<string>> BlockUser(int userId)
        {
            var user = await _userService.FirstOrDefaultAsync(x =>
                x.Id == userId && !x.IsDeleted);

            if (user == null)
                return new OperationResult<string>(false, "User not found.");

            if (!user.IsActive)
                return new OperationResult<string>(false, "User already blocked.");

            user.IsActive = false;

            _userService.UpdateAsync(user, user.Id);
            await _userService.SaveAsync();

            return new OperationResult<string>(true, "User blocked successfully.");
        }

        [HttpGet("myprofile")]
        public async Task<OperationResult<MyProfileDto>> MyProfile()
        {
            var now = DateTime.UtcNow;

            // 👉 Get User
            var user = await _userService.FirstOrDefaultAsync(x =>
                x.Id == LoggedInUserId && !x.IsDeleted);
            if (user == null)
                return new OperationResult<MyProfileDto>(false, "User not found");

            // 👉 Joined Events
            var registrations = await _eventRegistrationService.FindAllAsync(x =>
                x.UserId == LoggedInUserId);

            var eventIds = registrations.Select(x => x.EventId).ToList();

            // 👉 Upcoming Events
            var upcomingEvents = await _eventService.FindAllAsync(x =>
                eventIds.Contains(x.Id) &&
                x.EventDate >= now &&
                x.IsActive && !x.IsDeleted);

            // 👉 Attendance Count
            var attendedCount = (await _attendanceService.FindAllAsync(x =>
                x.UserId == LoggedInUserId && x.IsPresent)).Count;

            // 👉 Map Data
            var result = new MyProfileDto
            {
                Name = user.Name,
                Email = user.Email,
                TotalJoinedEvents = registrations.Count,
                TotalAttendedEvents = attendedCount,
                UpcomingEvents = upcomingEvents.Count
            };

            return new OperationResult<MyProfileDto>(true, "", result);
        }

        [HttpPost("list")]
        public async Task<OperationResult<PagedResult<UserListDto>>> GetUsers([FromBody] UserListRequest request)
        {
            var query = _userService.Query(); // IQueryable

            // Search
            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var search = request.Search.ToLower();

                query = query.Where(x =>
                    x.Name.ToLower().Contains(search) ||
                    x.Email.ToLower().Contains(search));
            }

            // Status Filter
            if (!string.IsNullOrWhiteSpace(request.Status))
            {
                var status = request.Status.ToLower();

                if (status == "active")
                {
                    query = query.Where(x => x.IsActive && !x.IsDeleted);
                }
                else if (status == "inactive")
                {
                    query = query.Where(x => !x.IsActive || x.IsDeleted);
                }
                // "all" → no filter applied
            }

            // Sorting
            query = request.SortBy switch
            {
                "Name" => request.SortDirection == "asc"
                    ? query.OrderBy(x => x.Name)
                    : query.OrderByDescending(x => x.Name),

                "Email" => request.SortDirection == "asc"
                    ? query.OrderBy(x => x.Email)
                    : query.OrderByDescending(x => x.Email),

                _ => request.SortDirection == "asc"
                    ? query.OrderBy(x => x.CreatedOn)
                    : query.OrderByDescending(x => x.CreatedOn)
            };

            // Total Count
            var totalRecords = await query.CountAsync();

            // Pagination
            var users = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(x => new UserListDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Email = x.Email,
                    Phone = x.Phone,
                    createdAt = x.CreatedOn,
                    Status = (x.IsActive && !x.IsDeleted) ? "active" : "inactive"
                }).ToListAsync();

            var result = new PagedResult<UserListDto>
            {
                Data = users,
                TotalRecords = totalRecords,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };

            return new OperationResult<PagedResult<UserListDto>>(true, "", result);
        }

        [HttpPost("add-fcm-token")]
        [Authorize]
        public async Task<OperationResult<string>> AddFcmToken([FromBody] AddFcmTokenRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.FcmToken))
                return new OperationResult<string>(false, "FCM token is required.");

            // Check if token already exists for this user
            var existing = await _userDeviceService.FirstOrDefaultAsync(x =>
                x.UserId == LoggedInUserId && x.FcmToken == request.FcmToken);

            if (existing != null)
                return new OperationResult<string>(true, "Token already exists.");

            // Save new token
            var device = new UserDevice
            {
                UserId = LoggedInUserId,
                FcmToken = request.FcmToken
            };

            _userDeviceService.AddAsync(device);
            await _userDeviceService.SaveAsync();

            return new OperationResult<string>(true, "FCM token added successfully.");
        }

        [HttpPost("remove-fcm-token")]
        [Authorize]
        public async Task<OperationResult<string>> RemoveFcmToken([FromBody] AddFcmTokenRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.FcmToken))
                return new OperationResult<string>(false, "FCM token is required.");

            var device = await _userDeviceService.FirstOrDefaultAsync(x =>
                x.UserId == LoggedInUserId && x.FcmToken == request.FcmToken);

            if (device == null)
                return new OperationResult<string>(false, "Token not found.");

            _userDeviceService.Delete(device);
            await _userDeviceService.SaveAsync();

            return new OperationResult<string>(true, "FCM token removed successfully.");
        }
    }
}
