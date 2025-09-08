using Microsoft.EntityFrameworkCore;
using ReactVentas.Interfaces;
using ReactVentas.Models;
using ReactVentas.Models.DTO;

namespace ReactVentas.Repositories
{
    /// <summary>
    /// Implementación del repositorio para la entidad Ingreso
    /// </summary>
    public class IngresoRepository : BaseRepository<Ingreso>, IIngresoRepository
    {
        public IngresoRepository(DBREACT_VENTAContext context) : base(context)
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
        /// Obtiene ingresos con información del usuario que registró
        /// </summary>
        public async Task<List<DtoIngreso>> GetIngresosWithUserAsync()
        {
            var query = from i in _dbSet
                        join u in _context.Usuarios on i.IdUsuario equals u.IdUsuario
                        orderby i.IdIngreso descending
                        select new DtoIngreso
                        {
                            IdIngreso = i.IdIngreso,
                            Descripcion = i.Descripcion ?? "",
                            FechaRegistro = i.FechaRegistro.HasValue ? i.FechaRegistro.Value.ToString("dd/MM/yyyy HH:mm") : "",
                            Monto = i.Monto.HasValue ? i.Monto.Value.ToString("F2") : "0.00",
                            TipoDinero = i.TipoDinero ?? "",
                            IdUsuario = i.IdUsuario ?? 0,
                            NombreUsuario = u.Nombre ?? "",
                            EsActivo = i.EsActivo
                        };

            return await query.ToListAsync();
        }

        /// <summary>
        /// Sobrescribe GetAllAsync para ordenar por IdIngreso descendente 
        /// </summary>
        public override async Task<List<Ingreso>> GetAllAsync()
        {
            return await _dbSet
                .Include(i => i.IdUsuarioNavigation)
                .OrderByDescending(i => i.IdIngreso)
                .ToListAsync();
        }

        /// <summary>
        /// Sobrescribe GetAllAsync para ordenar por IdIngreso descendente y filtrar activos
        /// </summary>
        public async Task<List<Ingreso>> GetAllActiveAsync()
        {
            return await _dbSet
                .Where(i => i.EsActivo == true)
                .Include(i => i.IdUsuarioNavigation)
                .OrderByDescending(i => i.IdIngreso)
                .ToListAsync();
        }
    }
}