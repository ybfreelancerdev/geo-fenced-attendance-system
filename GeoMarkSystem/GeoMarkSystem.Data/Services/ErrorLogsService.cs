using GeoMarkSystem.Data.Infrastructure;
using GeoMarkSystem.Data.Models.Entities;

namespace GeoMarkSystem.Data.Services
{
    public partial class ErrorLogsService : ServiceBase<ErrorLogs>, IErrorLogsService
    {
        private readonly IUnitOfWork _uow;
        public ErrorLogsService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {
            _uow = unitOfWork;
        }

        public async Task<ErrorLogs> LogExceptionAsync(Exception ex)
        {
            ErrorLogs errorLog = new ErrorLogs();
            errorLog.CreatedTime = DateTime.UtcNow.ToUniversalTime();
            if (ex.InnerException != null)
                errorLog.InnerException = ex.InnerException.Message;
            errorLog.Message = ex.Message;
            errorLog.Source = ex.Source;
            errorLog.StackTrace = ex.StackTrace;
            Add(errorLog);
            SaveAsync();
            return errorLog;
        }
    }

    public partial interface IErrorLogsService : IService<ErrorLogs>
    {
        Task<ErrorLogs> LogExceptionAsync(Exception ex);
    }
}
