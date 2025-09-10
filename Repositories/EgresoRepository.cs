using Microsoft.EntityFrameworkCore;
using ReactVentas.Interfaces;
using ReactVentas.Models;
using ReactVentas.Models.DTO;

namespace ReactVentas.Repositories
{
    /// <summary>
    /// Implementación del repositorio para la entidad Egreso
    /// </summary>
    public class EgresoRepository : BaseRepository<Egreso>, IEgresoRepository
    {
        public EgresoRepository(DBREACT_VENTAContext context) : base(context)
        {
        }

        /// <summary>
        /// Obtiene el contexto de la base de datos
        /// </summary>
        public DBREACT_VENTAContext GetContext()
        {
            return _context;
        }

        /// <summary>
        /// Obtiene egresos con información del usuario que registró
        /// </summary>
        public async Task<List<DtoEgreso>> GetEgresosWithUserAsync()
        {
            var query = from e in _dbSet
                        join u in _context.Usuarios on e.IdUsuario equals u.IdUsuario
                        orderby e.IdEgreso descending
                        select new DtoEgreso
                        {
                            IdEgreso = e.IdEgreso,
                            Descripcion = e.Descripcion ?? "",
                            FechaRegistro = e.FechaRegistro.HasValue ? e.FechaRegistro.Value.ToString("dd/MM/yyyy HH:mm") : "",
                            Monto = e.Monto.HasValue ? e.Monto.Value.ToString("F2") : "0.00",
                            TipoPago = e.TipoPago ?? "",
                            TipoDinero = e.TipoDinero ?? "",
                            IdUsuario = e.IdUsuario ?? 0,
                            NombreUsuario = u.Nombre ?? "",
                            EsActivo = e.EsActivo
                        };

            return await query.ToListAsync();
        }

        /// <summary>
        /// Sobrescribe GetAllAsync para ordenar por IdEgreso descendente 
        /// </summary>
        public override async Task<List<Egreso>> GetAllAsync()
        {
            return await _dbSet
                .Include(e => e.IdUsuarioNavigation)
                .OrderByDescending(e => e.IdEgreso)
                .ToListAsync();
        }

        /// <summary>
        /// Sobrescribe GetAllAsync para ordenar por IdEgreso descendente y filtrar activos
        /// </summary>
        public async Task<List<Egreso>> GetAllActiveAsync()
        {
            return await _dbSet
                .Where(e => e.EsActivo == true)
                .Include(e => e.IdUsuarioNavigation)
                .OrderByDescending(e => e.IdEgreso)
                .ToListAsync();
        }
    }
}