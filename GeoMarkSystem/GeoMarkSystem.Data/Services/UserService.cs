using GeoMarkSystem.Data.Infrastructure;
using GeoMarkSystem.Data.Models.Entities;

namespace GeoMarkSystem.Data.Services
{
    public partial class UserService : ServiceBase<User>, IUserService
    {
        private readonly IUnitOfWork _uow;
        public UserService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {
            _uow = unitOfWork;
        }
    }

    public partial interface IUserService : IService<User>
    {
    }
}
