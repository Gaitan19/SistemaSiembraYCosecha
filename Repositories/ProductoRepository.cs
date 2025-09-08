using Microsoft.EntityFrameworkCore;
using ReactVentas.Interfaces;
using ReactVentas.Models;

namespace ReactVentas.Repositories
{
    /// <summary>
    /// Implementación del repositorio para la entidad Producto
    /// </summary>
    public class ProductoRepository : BaseRepository<Producto>, IProductoRepository
    {
        public ProductoRepository(DBREACT_VENTAContext context) : base(context)
        {
        }

        /// <summary>
        /// Obtiene productos con su información de categoría y proveedor (todos los registros)
        /// </summary>
        public async Task<List<Producto>> GetProductsWithRelatedDataAsync()
        {
            return await _dbSet
                .Include(p => p.IdCategoriaNavigation)
                .Include(p => p.IdProveedorNavigation)
                .OrderByDescending(p => p.IdProducto)
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene productos activos con su información de categoría y proveedor
        /// </summary>
        public async Task<List<Producto>> GetActiveProductsWithRelatedDataAsync()
        {
            return await _dbSet
                .Include(p => p.IdCategoriaNavigation)
                .Include(p => p.IdProveedorNavigation)
                .Where(p => p.EsActivo == true)
                .OrderByDescending(p => p.IdProducto)
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene productos por categoría
        /// </summary>
        public async Task<List<Producto>> GetProductsByCategoryAsync(int categoriaId)
        {
            return await _dbSet
                .Include(p => p.IdCategoriaNavigation)
                .Include(p => p.IdProveedorNavigation)
                .Where(p => p.IdCategoria == categoriaId && p.EsActivo == true)
                .OrderByDescending(p => p.IdProducto)
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene productos por proveedor
        /// </summary>
        public async Task<List<Producto>> GetProductsBySupplierAsync(int proveedorId)
        {
            return await _dbSet
                .Include(p => p.IdCategoriaNavigation)
                .Include(p => p.IdProveedorNavigation)
                .Where(p => p.IdProveedor == proveedorId && p.EsActivo == true)
                .OrderByDescending(p => p.IdProducto)
                .ToListAsync();
        }

        /// <summary>
        /// Sobrescribe GetAllAsync para incluir datos relacionados y ordenamiento apropiado
        /// </summary>
        public override async Task<List<Producto>> GetAllAsync()
        {
            return await GetProductsWithRelatedDataAsync();
        }

        /// <summary>
        ///     obtiene un producto con sus relaciones
        public async Task<Producto> GetProductWithRelatedDataByIdAsync(int id)
        {
            return await _dbSet
                .Include(p => p.IdCategoriaNavigation)
                .Include(p => p.IdProveedorNavigation)
                .FirstOrDefaultAsync(p => p.IdProducto == id);
        }
    }
}