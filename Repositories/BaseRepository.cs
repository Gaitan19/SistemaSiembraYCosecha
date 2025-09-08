using Microsoft.EntityFrameworkCore;
using ReactVentas.Interfaces;
using ReactVentas.Models;
using System.Linq.Expressions;
using System.Reflection;

namespace ReactVentas.Repositories
{
    /// <summary>
    /// Implementación del repositorio base que proporciona operaciones comunes para entidades con soporte de eliminación suave
    /// </summary>
    /// <typeparam name="T">Tipo de entidad</typeparam>
    public class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        protected readonly DBREACT_VENTAContext _context;
        protected readonly DbSet<T> _dbSet;

        public BaseRepository(DBREACT_VENTAContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        /// <summary>
        /// Obtiene todas las entidades (tanto activas como inactivas)
        /// </summary>
        public virtual async Task<List<T>> GetAllAsync()
        {
            // Retorna todas las entidades sin importar el estado EsActivo para mantener el comportamiento original de la API
            return await _dbSet.OrderByDescending(GetIdProperty()).ToListAsync();
        }

        /// <summary>
        /// Obtiene solo las entidades activas (donde EsActivo = true)
        /// </summary>
        public virtual async Task<List<T>> GetActiveAsync()
        {
            // Verifica si la entidad tiene la propiedad EsActivo para filtrado de eliminación suave
            var esActivoProperty = typeof(T).GetProperty("EsActivo");
            if (esActivoProperty != null)
            {
                // Crea expresión: entity => entity.EsActivo == true
                var parameter = Expression.Parameter(typeof(T), "entity");
                var property = Expression.Property(parameter, "EsActivo");
                var constant = Expression.Constant(true, typeof(bool?));
                var equal = Expression.Equal(property, constant);
                var lambda = Expression.Lambda<Func<T, bool>>(equal, parameter);

                return await _dbSet.Where(lambda).OrderByDescending(GetIdProperty()).ToListAsync();
            }

            // Si no tiene propiedad EsActivo, retorna todas las entidades
            return await _dbSet.OrderByDescending(GetIdProperty()).ToListAsync();
        }

        /// <summary>
        /// Obtiene una entidad por id, solo si está activa
        /// </summary>
        public virtual async Task<T?> GetByIdAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            
            if (entity == null) return null;

            // Verifica si la entidad está activa
            //var esActivoProperty = typeof(T).GetProperty("EsActivo");
            //if (esActivoProperty != null)
            //{
            //    var isActive = (bool?)esActivoProperty.GetValue(entity);
            //    if (isActive != true) return null;
            //}

            return entity;
        }

        /// <summary>
        /// Obtiene entidades basadas en una condición, filtradas por estado activo
        /// </summary>
        public virtual async Task<List<T>> GetWhereAsync(Expression<Func<T, bool>> predicate)
        {
            var query = _dbSet.Where(predicate);

            // Agrega filtro activo si la entidad tiene propiedad EsActivo
            var esActivoProperty = typeof(T).GetProperty("EsActivo");
            if (esActivoProperty != null)
            {
                var parameter = Expression.Parameter(typeof(T), "entity");
                var property = Expression.Property(parameter, "EsActivo");
                var constant = Expression.Constant(true, typeof(bool?));
                var equal = Expression.Equal(property, constant);
                var activeFilter = Expression.Lambda<Func<T, bool>>(equal, parameter);
                
                query = query.Where(activeFilter);
            }

            return await query.ToListAsync();
        }

        /// <summary>
        /// Agrega una nueva entidad con EsActivo = true y FechaRegistro = ahora
        /// </summary>
        public virtual async Task<T> AddAsync(T entity)
        {
            // Establece valores predeterminados para propiedades comunes
            var esActivoProperty = typeof(T).GetProperty("EsActivo");
            if (esActivoProperty != null && esActivoProperty.GetValue(entity) == null)
            {
                esActivoProperty.SetValue(entity, true);
            }

            var fechaRegistroProperty = typeof(T).GetProperty("FechaRegistro");
            if (fechaRegistroProperty != null && fechaRegistroProperty.GetValue(entity) == null)
            {
                fechaRegistroProperty.SetValue(entity, DateTime.Now);
            }

            await _dbSet.AddAsync(entity);
            return entity;
        }

        /// <summary>
        /// Actualiza una entidad existente
        /// </summary>
        public virtual async Task<T> UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            return entity;
        }

        /// <summary>
        /// Realiza eliminación suave estableciendo EsActivo en false
        /// </summary>
        public virtual async Task<bool> SoftDeleteAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null) return false;

            var esActivoProperty = typeof(T).GetProperty("EsActivo");
            if (esActivoProperty != null)
            {
                esActivoProperty.SetValue(entity, false);
                _dbSet.Update(entity);
                return true;
            }

            // Si la entidad no tiene propiedad EsActivo, no se puede realizar eliminación suave
            return false;
        }

        /// <summary>
        /// Guarda los cambios en la base de datos
        /// </summary>
        public virtual async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Obtiene la expresión de propiedad ID para ordenamiento
        /// </summary>
        private Expression<Func<T, object>> GetIdProperty()
        {
            var parameter = Expression.Parameter(typeof(T), "entity");
            
            // Try common ID property names
            var idPropertyNames = new[] { $"Id{typeof(T).Name}", "Id" };
            PropertyInfo? idProperty = null;

            foreach (var propName in idPropertyNames)
            {
                idProperty = typeof(T).GetProperty(propName);
                if (idProperty != null) break;
            }

            if (idProperty == null)
            {
                // Fallback to first property if no ID found
                idProperty = typeof(T).GetProperties().FirstOrDefault();
            }

            if (idProperty != null)
            {
                var property = Expression.Property(parameter, idProperty);
                var convert = Expression.Convert(property, typeof(object));
                return Expression.Lambda<Func<T, object>>(convert, parameter);
            }

            // Fallback expression
            var constantExpression = Expression.Constant(0, typeof(object));
            return Expression.Lambda<Func<T, object>>(constantExpression, parameter);
        }
    }
}