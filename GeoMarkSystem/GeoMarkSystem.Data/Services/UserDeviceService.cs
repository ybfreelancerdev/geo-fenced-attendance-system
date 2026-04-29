using GeoMarkSystem.Data.Infrastructure;
using GeoMarkSystem.Data.Models.Entities;

namespace GeoMarkSystem.Data.Services
{
    public partial class UserDeviceService : ServiceBase<UserDevice>, IUserDeviceService
    {
        private readonly IUnitOfWork _uow;
        public UserDeviceService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {
            _uow = unitOfWork;
        }
    }

    public partial interface IUserDeviceService : IService<UserDevice>
    {
    }
}
