
using GeoMarkSystem.Data.Context;
using Microsoft.EntityFrameworkCore.Storage;


namespace GeoMarkSystem.Data.Infrastructure
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly GeoMarkSystemContext _context;
        private IDbContextTransaction? _transaction;

        public UnitOfWork(IDbFactory dbFactory)
        {
            _context = dbFactory.Init()
                ?? throw new ArgumentNullException(nameof(dbFactory));
        }

        // 🔹 START TRANSACTION
        public void BeginTransaction()
        {
            _transaction = _context.Database.BeginTransaction();
        }

        // 🔹 SAVE (NO TRANSACTION COMMIT)
        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }

        // 🔹 COMMIT TRANSACTION
        public async Task Commit()
        {
            try
            {
                await _context.SaveChangesAsync();

                if (_transaction != null)
                {
                    await _transaction.CommitAsync();
                    await _transaction.DisposeAsync();
                    _transaction = null;
                }
            }
            catch
            {
                if (_transaction != null)
                {
                    await _transaction.RollbackAsync();
                    await _transaction.DisposeAsync();
                    _transaction = null;
                }

                throw;
            }
        }

        // 🔹 ROLLBACK
        public void Rollback()
        {
            if (_transaction != null)
            {
                _transaction.Rollback();
                _transaction.Dispose();
                _transaction = null;
            }
        }

        // 🔹 DISPOSE
        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
    public interface IUnitOfWork : IDisposable
    {
        Task Commit();
        Task SaveChanges();
        void BeginTransaction();
        void Rollback();
    }
}