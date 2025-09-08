using ReactVentas.Models;

namespace ReactVentas.Interfaces
{
    /// <summary>
    /// Interfaz del repositorio para operaciones de la entidad Proveedor
    /// </summary>
    public interface IProveedorRepository : IBaseRepository<Proveedor>
    {
        /// <summary>
        /// Obtiene proveedores con sus productos
        /// </summary>
        /// <returns>Lista de proveedores con productos</returns>
        Task<List<Proveedor>> GetSuppliersWithProductsAsync();

        /// <summary>
        /// Obtiene proveedor por email
        /// </summary>
        /// <param name="email">Email del proveedor</param>
        /// <returns>Proveedor si se encuentra, null en caso contrario</returns>
        Task<Proveedor?> GetByEmailAsync(string email);
    }
}