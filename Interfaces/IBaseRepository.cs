using System.Linq.Expressions;

namespace ReactVentas.Interfaces
{
    /// <summary>
    /// Interfaz del repositorio base que define operaciones comunes para entidades
    /// </summary>
    /// <typeparam name="T">Tipo de entidad</typeparam>
    public interface IBaseRepository<T> where T : class
    {
        /// <summary>
        /// Obtiene todas las entidades (tanto activas como inactivas)
        /// </summary>
        /// <returns>Lista de todas las entidades</returns>
        Task<List<T>> GetAllAsync();

        /// <summary>
        /// Obtiene solo las entidades activas (donde EsActivo = true)
        /// </summary>
        /// <returns>Lista de entidades activas</returns>
        Task<List<T>> GetActiveAsync();

        /// <summary>
        /// Obtiene una entidad por su id
        /// </summary>
        /// <param name="id">Identificador de la entidad</param>
        /// <returns>Entidad si se encuentra, null en caso contrario</returns>
        Task<T?> GetByIdAsync(int id);

        /// <summary>
        /// Obtiene entidades basadas en una condición
        /// </summary>
        /// <param name="predicate">Condición de filtro</param>
        /// <returns>Lista filtrada de entidades</returns>
        Task<List<T>> GetWhereAsync(Expression<Func<T, bool>> predicate);

        /// <summary>
        /// Agrega una nueva entidad
        /// </summary>
        /// <param name="entity">Entidad a agregar</param>
        /// <returns>Entidad agregada</returns>
        Task<T> AddAsync(T entity);

        /// <summary>
        /// Actualiza una entidad existente
        /// </summary>
        /// <param name="entity">Entidad a actualizar</param>
        /// <returns>Entidad actualizada</returns>
        Task<T> UpdateAsync(T entity);

        /// <summary>
        /// Realiza eliminación suave estableciendo EsActivo en false
        /// </summary>
        /// <param name="id">Identificador de la entidad</param>
        /// <returns>True si la eliminación fue exitosa, false en caso contrario</returns>
        Task<bool> SoftDeleteAsync(int id);

        /// <summary>
        /// Guarda los cambios en la base de datos
        /// </summary>
        /// <returns>Número de filas afectadas</returns>
        Task<int> SaveChangesAsync();
    }
}