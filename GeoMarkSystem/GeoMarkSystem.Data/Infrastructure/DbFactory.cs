using GeoMarkSystem.Data;
using GeoMarkSystem.Data.Context;

namespace GeoMarkSystem.Data.Infrastructure

{
    public class DbFactory : Disposable, IDbFactory
    {
        GeoMarkSystemContext dbContext;
        public GeoMarkSystemContext Init()
        {
            return dbContext ?? (dbContext = new GeoMarkSystemContext());
        }
        protected override void DisposeCore()
        {
            if (dbContext != null)
            {
                dbContext.Dispose();
            }
        }
    }
    public interface IDbFactory : IDisposable
    {
        GeoMarkSystemContext Init();
    }
}
