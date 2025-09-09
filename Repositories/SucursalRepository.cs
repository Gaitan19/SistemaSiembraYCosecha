using Microsoft.EntityFrameworkCore;
using ReactVentas.Interfaces;
using ReactVentas.Models;

namespace ReactVentas.Repositories
{
    /// <summary>
    /// Repository for Sucursal entity operations
    /// </summary>
    public class SucursalRepository : BaseRepository<Sucursal>, ISucursalRepository
    {
        /// <summary>
        /// Initializes a new instance of the SucursalRepository class
        /// </summary>
        /// <param name="context">Database context</param>
        public SucursalRepository(DBREACT_VENTAContext context) : base(context)
        {
        }

        /// <summary>
        /// Gets branches with their related entities (users, products, etc.)
        /// </summary>
        /// <returns>List of branches with related data</returns>
        public async Task<List<Sucursal>> GetSucursalesWithRelatedDataAsync()
        {
            return await _dbSet
                .Include(s => s.Usuarios)
                .Include(s => s.Productos)
                .Where(s => s.EsActivo == true)
                .OrderBy(s => s.IdSucursal)
                .ToListAsync();
        }

        /// <summary>
        /// Gets active branches only
        /// </summary>
        /// <returns>List of active branches</returns>
        public async Task<List<Sucursal>> GetActiveSucursalesAsync()
        {
            return await _dbSet
                .Where(s => s.EsActivo == true)
                .OrderBy(s => s.Departamento)
                .ToListAsync();
        }
    }
}