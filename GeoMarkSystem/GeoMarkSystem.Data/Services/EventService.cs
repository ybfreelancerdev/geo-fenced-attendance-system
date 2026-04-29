using GeoMarkSystem.Data.Infrastructure;
using GeoMarkSystem.Data.Models.Entities;

namespace GeoMarkSystem.Data.Services
{
    public partial class EventService : ServiceBase<Event>, IEventService
    {
        private readonly IUnitOfWork _uow;
        public EventService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {
            _uow = unitOfWork;
        }
    }

    public partial interface IEventService : IService<Event>
    {
    }
}
