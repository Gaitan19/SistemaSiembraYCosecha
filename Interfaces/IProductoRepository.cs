using ReactVentas.Models;

namespace ReactVentas.Interfaces
{
    /// <summary>
    /// Interfaz del repositorio para operaciones de la entidad Producto
    /// </summary>
    public interface IProductoRepository : IBaseRepository<Producto>
    {
        /// <summary>
        /// Obtiene productos con su información de categoría y proveedor
        /// </summary>
        /// <returns>Lista de productos con datos relacionados</returns>
        Task<List<Producto>> GetProductsWithRelatedDataAsync();

        /// <summary>
        /// Obtiene productos por categoría
        /// </summary>
        /// <param name="categoriaId">Identificador de la categoría</param>
        /// <returns>Lista de productos de la categoría especificada</returns>
        Task<List<Producto>> GetProductsByCategoryAsync(int categoriaId);

        /// <summary>
        /// Obtiene productos por proveedor
        /// </summary>
        /// <param name="proveedorId">Identificador del proveedor</param>
        /// <returns>Lista de productos del proveedor especificado</returns>
        Task<List<Producto>> GetProductsBySupplierAsync(int proveedorId);

        /// <summary>
        /// Obtiene un producto con su información de categoría y proveedor por su identificador
        /// </summary>
        /// <param name="id">Identificador del producto</param>
        /// <returns>Producto con datos relacionados</returns>
        Task<Producto> GetProductWithRelatedDataByIdAsync(int id);
    }
}