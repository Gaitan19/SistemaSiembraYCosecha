using ReactVentas.Models;
using ReactVentas.Models.DTO;

namespace ReactVentas.Interfaces
{
    /// <summary>
    /// Interfaz del repositorio para operaciones de la entidad Egreso
    /// </summary>
    public interface IEgresoRepository : IBaseRepository<Egreso>
    {
        /// <summary>
        /// Obtiene egresos con información del usuario que registró
        /// </summary>
        /// <returns>Lista de egresos con usuario</returns>
        Task<List<DtoEgreso>> GetEgresosWithUserAsync();
        
        /// <summary>
        /// Obtiene el contexto de la base de datos
        /// </summary>
        /// <returns>Contexto de la base de datos</returns>
        DBREACT_VENTAContext GetContext();
    }
}