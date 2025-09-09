using Microsoft.EntityFrameworkCore;
using ReactVentas.Interfaces;
using ReactVentas.Models;

namespace ReactVentas.Repositories
{
    /// <summary>
    /// Implementación del repositorio para la entidad Proveedor
    /// </summary>
    public class ProveedorRepository : BaseRepository<Proveedor>, IProveedorRepository
    {
        public ProveedorRepository(DBREACT_VENTAContext context) : base(context)
        {
        }

        /// <summary>
        /// Obtiene proveedores con sus productos
        /// </summary>
        public async Task<List<Proveedor>> GetSuppliersWithProductsAsync()
        {
            return await _dbSet
                .Include(p => p.Productos.Where(prod => prod.EsActivo == true))
                .Include(p => p.IdSucursalNavigation)
                .Where(p => p.EsActivo == true)
                .OrderByDescending(p => p.IdProveedor)
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene proveedor por email
        /// </summary>
        public async Task<Proveedor?> GetByEmailAsync(string email)
        {
            return await _dbSet
                .FirstOrDefaultAsync(p => p.Correo == email && p.EsActivo == true);
        }

        /// <summary>
        /// Sobrescribe GetAllAsync para ordenar por IdProveedor descendente e incluir todos los registros
        /// </summary>
        public override async Task<List<Proveedor>> GetAllAsync()
        {
            return await _dbSet
                .Include(p => p.IdSucursalNavigation)
                .OrderByDescending(p => p.IdProveedor)
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene solo los proveedores activos
        /// </summary>
        public override async Task<List<Proveedor>> GetActiveAsync()
        {
            return await _dbSet
                .Include(p => p.IdSucursalNavigation)
                .Where(p => p.EsActivo == true)
                .OrderByDescending(p => p.IdProveedor)
                .ToListAsync();
        }
    }
}