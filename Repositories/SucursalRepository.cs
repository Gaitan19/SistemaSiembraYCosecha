using Microsoft.EntityFrameworkCore;
using ReactVentas.Interfaces;
using ReactVentas.Models;

namespace ReactVentas.Repositories
{
    /// <summary>
    /// Implementation of the repository for the Sucursal entity
    /// </summary>
    public class SucursalRepository : BaseRepository<Sucursal>, ISucursalRepository
    {
        public SucursalRepository(DBREACT_VENTAContext context) : base(context)
        {
        }

        /// <summary>
        /// Gets all active branches
        /// </summary>
        public async Task<List<Sucursal>> GetActiveSucursalesAsync()
        {
            return await _dbSet
                .Where(s => s.EsActivo == true)
                .OrderBy(s => s.Departamento)
                .ToListAsync();
        }

        /// <summary>
        /// Overrides GetAllAsync to order by IdSucursal descending and include all records
        /// </summary>
        public override async Task<List<Sucursal>> GetAllAsync()
        {
            return await _dbSet
                .OrderByDescending(s => s.IdSucursal)
                .ToListAsync();
        }
    }
}