using GeoMarkSystem.Data.Infrastructure;
using GeoMarkSystem.Data.Models.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GeoMarkSystem.Data.Services
{
    public partial class EventRegistrationService : ServiceBase<EventRegistration>, IEventRegistrationService
    {
        private readonly IUnitOfWork _uow;
        public EventRegistrationService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {
            _uow = unitOfWork;
        }
    }

    public partial interface IEventRegistrationService : IService<EventRegistration>
    {
    }
}
