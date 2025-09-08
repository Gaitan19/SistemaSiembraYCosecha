using Microsoft.EntityFrameworkCore;
using ReactVentas.Interfaces;
using ReactVentas.Models;

namespace ReactVentas.Repositories
{
    /// <summary>
    /// Implementación del repositorio para la entidad Rol
    /// </summary>
    public class RolRepository : BaseRepository<Rol>, IRolRepository
    {
        public RolRepository(DBREACT_VENTAContext context) : base(context)
        {
        }

        /// <summary>
        /// Obtiene roles con sus usuarios
        /// </summary>
        public async Task<List<Rol>> GetRolesWithUsersAsync()
        {
            return await _dbSet
                .Include(r => r.Usuarios.Where(u => u.EsActivo == true))
                .Where(r => r.EsActivo == true)
                .OrderByDescending(r => r.IdRol)
                .ToListAsync();
        }

        /// <summary>
        /// Sobrescribe GetAllAsync para ordenar por IdRol descendente e incluir todos los registros
        /// </summary>
        public override async Task<List<Rol>> GetAllAsync()
        {
            return await _dbSet
                .OrderByDescending(r => r.IdRol)
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene solo los roles activos
        /// </summary>
        public override async Task<List<Rol>> GetActiveAsync()
        {
            return await _dbSet
                .Where(r => r.EsActivo == true)
                .OrderByDescending(r => r.IdRol)
                .ToListAsync();
        }
    }
}