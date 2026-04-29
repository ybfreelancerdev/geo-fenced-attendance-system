using GeoMarkSystem.Data.Context;
using GeoMarkSystem.Data.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace GeoMarkSystem.Data.Infrastructure
{
    public class ServiceBase<T> where T : class
    {
        protected readonly GeoMarkSystemContext _dbContext;
        protected readonly IUnitOfWork _unitOfWork;

        public ServiceBase(IDbFactory dbFactory, IUnitOfWork unitOfWork)
        {
            _dbContext = dbFactory.Init() ?? throw new ArgumentNullException(nameof(dbFactory));
            _unitOfWork = unitOfWork;
        }

        // 🔹 GET ALL
        public async Task<List<T>> GetAllAsync()
        {
            return await _dbContext.Set<T>().ToListAsync();
        }

        // 🔹 FIND ALL
        public async Task<List<T>> FindAllAsync(Expression<Func<T, bool>> match)
        {
            return await _dbContext.Set<T>().Where(match).ToListAsync();
        }

        // 🔹 FIRST OR DEFAULT
        public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> match)
        {
            return await _dbContext.Set<T>().FirstOrDefaultAsync(match);
        }

        // 🔹 GET BY ID (int)
        public async Task<T?> GetAsync(int id)
        {
            return await _dbContext.Set<T>().FindAsync(id);
        }

        // 🔹 GET BY ID (string)
        public async Task<T?> GetAsync(string id)
        {
            return await _dbContext.Set<T>().FindAsync(id);
        }

        // 🔹 ADD
        public T Add(T entity)
        {
            _dbContext.Set<T>().Add(entity);
            return entity;
        }
        public async Task<T> AddAsync(T entity)
        {
            await _dbContext.Set<T>().AddAsync(entity);
            return entity;
        }

        // 🔹 ADD RANGE
        public async Task<List<T>> AddRangeAsync(List<T> entities)
        {
            await _dbContext.Set<T>().AddRangeAsync(entities);
            return entities;
        }

        // 🔹 UPDATE
        public async Task<T?> UpdateAsync(T updated, object key)
        {
            if (updated == null)
                return null;

            var existing = await _dbContext.Set<T>().FindAsync(key);

            if (existing != null)
            {
                _dbContext.Entry(existing).CurrentValues.SetValues(updated);
            }

            return existing;
        }

        // 🔹 DELETE
        public void Delete(T entity)
        {
            _dbContext.Set<T>().Remove(entity);
        }

        // 🔹 SAVE (Unit of Work ONLY)
        public async Task SaveAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        // 🔹 TRANSACTION METHODS
        public void BeginTransaction()
        {
            _unitOfWork.BeginTransaction();
        }

        public void Rollback()
        {
            _unitOfWork.Rollback();
        }

        public async Task Commit()
        {
            await _unitOfWork.Commit();
        }

        // 🔹 COUNT
        public async Task<int> CountAsync(Expression<Func<T, bool>>? where = null)
        {
            return where == null
                ? await _dbContext.Set<T>().CountAsync()
                : await _dbContext.Set<T>().CountAsync(where);
        }

        // 🔹 GET MANY
        public async Task<List<T>> GetManyAsync(Expression<Func<T, bool>> where)
        {
            return await _dbContext.Set<T>().Where(where).ToListAsync();
        }
        public IQueryable<T> Query()
        {
            return _dbContext.Set<T>().AsQueryable();
        }
    }
    public interface IService<T> where T : class
    {
        Task<List<T>> GetAllAsync();
        Task<List<T>> FindAllAsync(Expression<Func<T, bool>> match);
        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> match);

        Task<T?> GetAsync(int id);
        Task<T?> GetAsync(string id);
        T Add(T entity);
        Task<T> AddAsync(T entity);
        Task<List<T>> AddRangeAsync(List<T> entities);

        Task<T?> UpdateAsync(T entity, object key);
        void Delete(T entity);

        Task SaveAsync();

        void BeginTransaction();
        void Rollback();
        Task Commit();

        Task<List<T>> GetManyAsync(Expression<Func<T, bool>> where);
        Task<int> CountAsync(Expression<Func<T, bool>>? where = null);
        IQueryable<T> Query();
    }
}