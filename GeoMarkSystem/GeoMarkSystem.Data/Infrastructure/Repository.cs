
using GeoMarkSystem.Data.Context;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq.Expressions;

namespace GeoMarkSystem.Data.Infrastructure
{
    public class RepositoryBase<T> : IRepository<T> where T : class
    {
        protected readonly GeoMarkSystemContext _context;
        protected readonly DbSet<T> _dbSet;

        public RepositoryBase(GeoMarkSystemContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        // 🔹 GET ALL
        public async Task<List<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        // 🔹 GET BY ID
        public async Task<T?> GetByIdAsync(object id)
        {
            return await _dbSet.FindAsync(id);
        }

        // 🔹 FIRST OR DEFAULT
        public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.FirstOrDefaultAsync(predicate);
        }

        // 🔹 FIND ALL
        public async Task<List<T>> FindAllAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        // 🔹 ADD
        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        // 🔹 ADD RANGE
        public async Task AddRangeAsync(List<T> entities)
        {
            await _dbSet.AddRangeAsync(entities);
        }

        // 🔹 UPDATE
        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        // 🔹 DELETE
        public void Remove(T entity)
        {
            _dbSet.Remove(entity);
        }

        public void RemoveRange(List<T> entities)
        {
            _dbSet.RemoveRange(entities);
        }

        // 🔹 COUNT
        public async Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null)
        {
            return predicate == null
                ? await _dbSet.CountAsync()
                : await _dbSet.CountAsync(predicate);
        }
    }
    public interface IRepository<T> where T : class
    {
        Task<List<T>> GetAllAsync();
        Task<T?> GetByIdAsync(object id);

        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
        Task<List<T>> FindAllAsync(Expression<Func<T, bool>> predicate);

        Task AddAsync(T entity);
        Task AddRangeAsync(List<T> entities);

        void Update(T entity);
        void Remove(T entity);
        void RemoveRange(List<T> entities);

        Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null);
    }
}
