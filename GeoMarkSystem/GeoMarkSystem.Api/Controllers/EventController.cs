using FirebaseAdmin.Messaging;
using GeoMarkSystem.Data.Common;
using GeoMarkSystem.Data.Models.Entities;
using GeoMarkSystem.Data.Models.Views;
using GeoMarkSystem.Data.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Security.Claims;

namespace GeoMarkSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EventController : ControllerBase
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
        public EventController(IUserService userService, 
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

        #region 'Admin APIs'

        [HttpPost("admin/event")]
        [Authorize(Roles = "Admin")]
        public async Task<OperationResult<string>> Create(EventDto dto)
        {
            var entity = new Event
            {
                Title = dto.Title,
                Description = dto.Description,
                Highlights = dto.Highlights,
                Place = dto.Place,
                Address = dto.Address,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                Radius = dto.Radius,
                MaxMembers = dto.MaxMembers,
                EventDate = dto.EventDate
            };

            _eventService.Add(entity);
            await _eventService.SaveAsync();

            return new OperationResult<string>(true, "Event created successfully.");
        }

        [HttpPut("admin/event/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<OperationResult<string>> Update(int id, EventDto dto)
        {
            var entity = await _eventService.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

            if (entity == null)
                return new OperationResult<string>(false, "Event not found.");

            entity.Title = dto.Title;
            entity.Description = dto.Description;
            entity.Highlights = dto.Highlights;
            entity.Place = dto.Place;
            entity.Address = dto.Address;
            entity.Latitude = dto.Latitude;
            entity.Longitude = dto.Longitude;
            entity.Radius = dto.Radius;
            entity.MaxMembers = dto.MaxMembers;
            entity.EventDate = dto.EventDate;

            _eventService.UpdateAsync(entity, id);
            await _eventService.SaveAsync();

            return new OperationResult<string>(true, "Event updated successfully.");
        }

        [HttpDelete("admin/event/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<OperationResult<string>> Delete(int id)
        {
            var entity = await _eventService.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

            if (entity == null)
                return new OperationResult<string>(false, "Event not found.");

            entity.IsDeleted = true;

            _eventService.UpdateAsync(entity, id);
            await _eventService.SaveAsync();

            return new OperationResult<string>(true, "Event deleted.");
        }

        [HttpGet("admin/event/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<OperationResult<Event>> GetDetails(int id)
        {
            var entity = await _eventService.FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return new OperationResult<Event>(false, "Event not found.");

            return new OperationResult<Event>(true, "", entity);
        }

        [HttpGet("admin/events/active")]
        public async Task<OperationResult<List<Event>>> GetActive()
        {
            var list = await _eventService.FindAllAsync(x => x.IsActive && !x.IsDeleted);
            return new OperationResult<List<Event>>(true, "", list.ToList());
        }

        [HttpGet("admin/events/inactive")]
        public async Task<OperationResult<List<Event>>> GetInactive()
        {
            var list = await _eventService.FindAllAsync(x => !x.IsActive && !x.IsDeleted);
            return new OperationResult<List<Event>>(true, "", list.ToList());
        }

        [HttpGet("admin/events/deleted")]
        public async Task<OperationResult<List<Event>>> GetDeleted()
        {
            var list = await _eventService.FindAllAsync(x => x.IsDeleted);
            return new OperationResult<List<Event>>(true, "", list.ToList());
        }

        #endregion

        #region 'User APIs'

        [HttpGet("upcoming/top5")]
        public async Task<OperationResult<List<GetTopEventDto>>> GetTop5Upcoming()
        {
            var now = DateTime.UtcNow;

            var list = await _eventService.FindAllAsync(x =>
                x.EventDate > now && x.IsActive && !x.IsDeleted);

            var result = list
                .OrderBy(x => x.EventDate)   // ✅ nearest upcoming first
                .Take(5)                    // ✅ limit to 5
                .Select(x => new GetTopEventDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    MaxMembers = x.MaxMembers,
                    Location = x.Address,
                    EventDate = x.EventDate,
                })
                .ToList();

            return new OperationResult<List<GetTopEventDto>>(true, "", result);
        }

        [HttpGet("upcoming")]
        public async Task<OperationResult<List<GetEventDto>>> GetUpcoming()
        {
            var now = DateTime.UtcNow;

            var list = await _eventService.FindAllAsync(x =>
                x.EventDate > now && x.IsActive && !x.IsDeleted);

            var result = list.Select(x => new GetEventDto
            {
                Id = x.Id,
                Title = x.Title,
                MaxMembers = x.MaxMembers,
                Location = x.Place +", "+ x.Address,
                EventDate = x.EventDate,
            }).ToList();

            return new OperationResult<List<GetEventDto>>(true, "", result);
        }

        [HttpGet("allEvents")]
        public async Task<OperationResult<List<GetEventDto>>> AllEvents()
        {
            var list = await _eventService.FindAllAsync(x =>
                x.IsActive && !x.IsDeleted);

            var result = list.Select(x => new GetEventDto
            {
                Id = x.Id,
                Title = x.Title,
                MaxMembers = x.MaxMembers,
                Location = x.Place + ", " + x.Address,
                EventDate = x.EventDate,
            }).ToList();

            return new OperationResult<List<GetEventDto>>(true, "", result);
        }

        [HttpPost("list")]
        public async Task<OperationResult<PagedResult<GetEventDto>>> GetEvents([FromBody] EventListRequest request)
        {
            var now = DateTime.UtcNow;

            var query = _eventService.Query()
                .Where(x => x.IsActive && !x.IsDeleted);

            // Status Filter
            if (!string.IsNullOrWhiteSpace(request.Status))
            {
                var status = request.Status.ToLower();

                if (status == "upcoming")
                {
                    query = query.Where(x => x.EventDate > now);
                }
                // "all" → no extra filter
            }

            // Latest first (descending)
            query = query.OrderByDescending(x => x.EventDate);

            // Total count
            var totalRecords = await query.CountAsync();

            // Pagination (fetch events first)
            var events = await query
                .OrderByDescending(x => x.EventDate)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            // Get only required event IDs
            var eventIds = events.Select(e => e.Id).ToList();

            // Get joined users count (GROUP BY)
            var registrationCounts = await _eventRegistrationService.Query()
                .Where(r => eventIds.Contains(r.EventId))
                .GroupBy(r => r.EventId)
                .Select(g => new
                {
                    EventId = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            // Convert to dictionary (fast lookup)
            var registrationDict = registrationCounts
                .ToDictionary(x => x.EventId, x => x.Count);

            // Map DTO
            var list = events.Select(x => new GetEventDto
            {
                Id = x.Id,
                Title = x.Title,
                MaxMembers = x.MaxMembers,
                Location = x.Place + ", " + x.Address,
                EventDate = x.EventDate,

                // Joined users count
                JoinedUsers = registrationDict.ContainsKey(x.Id)
                    ? registrationDict[x.Id]
                    : 0
            }).ToList();

            // Final response
            var result = new PagedResult<GetEventDto>
            {
                Data = list,
                TotalRecords = totalRecords,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };

            return new OperationResult<PagedResult<GetEventDto>>(true, "", result);
        }

        [HttpGet("events")]
        [Authorize]
        public async Task<OperationResult<EventDetailDto>> GetEvent(int id)
        {
            var entity = await _eventService.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

            if (entity == null)
                return new OperationResult<EventDetailDto>(false, "Event not found.");

            // Check if current user joined
            var isJoined = await _eventRegistrationService.CountAsync(x =>
                x.EventId == id && x.UserId == LoggedInUserId);

            // Count total joined users
            var totalJoinedUsers = await _eventRegistrationService.CountAsync(x =>
                x.EventId == id);

            var result = new EventDetailDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Description = entity.Description,
                Highlights = entity.Highlights,
                Place = entity.Place,
                Address = entity.Address,
                Latitude = entity.Latitude,
                Longitude = entity.Longitude,
                Radius = entity.Radius,
                MaxMembers = entity.MaxMembers,
                EventDate = entity.EventDate,
                IsJoined = isJoined == 0 ? false : true,
                JoinedUsers = totalJoinedUsers
            };

            return new OperationResult<EventDetailDto>(true, "", result);
        }

        [HttpPost("{eventId}/apply")]
        [Authorize]
        public async Task<OperationResult<string>> Apply(int eventId)
        {
            var exists = await _eventRegistrationService.FirstOrDefaultAsync(x =>
                x.UserId == LoggedInUserId && x.EventId == eventId);

            if (exists != null)
                return new OperationResult<string>(false, "Already applied.");

            var count = await _eventRegistrationService.CountAsync(x => x.EventId == eventId);

            var eventEntity = await _eventService.FirstOrDefaultAsync(x => x.Id == eventId);

            if (count >= eventEntity.MaxMembers)
                return new OperationResult<string>(false, "Event is full.");

            var reg = new EventRegistration
            {
                UserId = LoggedInUserId,
                EventId = eventId,
                RegisteredOn = DateTime.UtcNow
            };

            _eventRegistrationService.Add(reg);
            await _eventRegistrationService.SaveAsync();

            return new OperationResult<string>(true, "Applied successfully.");
        }

        [HttpPost("my-events")]
        [Authorize]
        public async Task<OperationResult<PagedResult<GetMyEventDto>>> MyEvents(MyEventsRequest request)
        {
            var now = DateTime.UtcNow;

            // Get registered events
            var registrations = await _eventRegistrationService.Query()
                .Where(x => x.UserId == LoggedInUserId)
                .Select(x => x.EventId)
                .ToListAsync();

            // Step 2: Get attended events
            var attendedEventIds = await _attendanceService.Query()
                .Where(x => x.UserId == LoggedInUserId)
                .Select(x => x.EventId)
                .ToListAsync();

            // Step 3: Base query
            var query = _eventService.Query()
                .Where(x => registrations.Contains(x.Id) && !x.IsDeleted);

            // Step 4: Status filter
            if (!string.IsNullOrWhiteSpace(request.Status))
            {
                var status = request.Status.ToLower();

                if (status == "upcoming")
                {
                    query = query.Where(x => x.EventDate > now);
                }
                else if (status == "past")
                {
                    query = query.Where(x => x.EventDate <= now);
                }
            }

            // Step 5: Sorting
            query = query.OrderByDescending(x => x.EventDate);

            // Step 6: Total count
            var totalRecords = await query.CountAsync();

            // Step 7: Pagination
            var events = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var eventIds = events.Select(x => x.Id).ToList();

            // Step 8: Get joined users count in ONE query
            var joinedCounts = await _eventRegistrationService.Query()
                .Where(r => eventIds.Contains(r.EventId))
                .GroupBy(r => r.EventId)
                .Select(g => new
                {
                    EventId = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            // Convert to dictionary
            var joinedDict = joinedCounts.ToDictionary(x => x.EventId, x => x.Count);

            // Step 9: Map DTO
            var result = events.Select(x => new GetMyEventDto
            {
                Id = x.Id,
                Title = x.Title,
                Location = x.Address,
                MaxMembers = x.MaxMembers,
                EventDate = x.EventDate,

                // Attendance flag
                Attended = attendedEventIds.Contains(x.Id),

                // Joined users count
                JoinedUsers = joinedDict.ContainsKey(x.Id) ? joinedDict[x.Id] : 0
            }).ToList();

            var response = new PagedResult<GetMyEventDto>
            {
                Data = result,
                TotalRecords = totalRecords,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };

            return new OperationResult<PagedResult<GetMyEventDto>>(true, "", response);
        }

        [HttpPost("attendance/{eventId}")]
        [Authorize]
        public async Task<OperationResult<string>> MarkAttendance(int eventId)
        {
            var exists = await _attendanceService.FirstOrDefaultAsync(x =>
                x.UserId == LoggedInUserId && x.EventId == eventId);

            if (exists != null)
                return new OperationResult<string>(false, "Already marked.");

            var attendance = new Attendance
            {
                UserId = LoggedInUserId,
                EventId = eventId,
                MarkedOn = DateTime.UtcNow,
                IsPresent = true
            };

            _attendanceService.Add(attendance);
            await _attendanceService.SaveAsync();

            // Send notification
            await SendNotification(
                LoggedInUserId,
                "Attendance Marked",
                "You have successfully attended the event."
            );

            return new OperationResult<string>(true, "Attendance marked.");
        }

        #endregion

        [NonAction]
        public async Task SendNotification(int userId, string title, string body)
        {
            var tokens = (await _userDeviceService.FindAllAsync(x => x.UserId == userId))
                .Select(x => x.FcmToken)
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Distinct()
                .ToList();

            if (!tokens.Any()) return;

            foreach (var token in tokens)
            {
                try
                {
                    var message = new Message()
                    {
                        Token = token,
                        Notification = new Notification
                        {
                            Title = "Attendance Marked",
                            Body = "You have successfully attended the event."
                        }
                    };

                    await FirebaseMessaging.DefaultInstance.SendAsync(message);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Failed token: {token}");
                    Console.WriteLine(ex.Message);

                    // Optionally remove invalid token
                    var device = await _userDeviceService.FirstOrDefaultAsync(x => x.FcmToken == token);
                    if (device != null)
                    {
                        _userDeviceService.Delete(device);
                    }
                }
            }
            await _userDeviceService.SaveAsync();
        }
    }
}
