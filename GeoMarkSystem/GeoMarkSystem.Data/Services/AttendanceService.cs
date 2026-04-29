using GeoMarkSystem.Data.Infrastructure;
using GeoMarkSystem.Data.Models.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GeoMarkSystem.Data.Services
{
    public partial class AttendanceService : ServiceBase<Attendance>, IAttendanceService
    {
        private readonly IUnitOfWork _uow;
        public AttendanceService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {
            _uow = unitOfWork;
        }
    }

    public partial interface IAttendanceService : IService<Attendance>
    {
    }
}
