using ReactVentas.Models;
using ReactVentas.Models.DTO;

namespace ReactVentas.Interfaces
{
    /// <summary>
    /// Interfaz del repositorio para operaciones de la entidad Ingreso
    /// </summary>
    public interface IIngresoRepository : IBaseRepository<Ingreso>
    {
        /// <summary>
        /// Obtiene ingresos con información del usuario que registró
        /// </summary>
        /// <returns>Lista de ingresos con usuario</returns>
        Task<List<DtoIngreso>> GetIngresosWithUserAsync();
        
        /// <summary>
        /// Obtiene el contexto de la base de datos
        /// </summary>
        /// <returns>Contexto de la base de datos</returns>
        DBREACT_VENTAContext GetContext();
    }
}