using Microsoft.EntityFrameworkCore;
using ReactVentas.Interfaces;
using ReactVentas.Models;

namespace ReactVentas.Repositories
{
    /// <summary>
    /// Implementación del repositorio para la entidad Categoria
    /// </summary>
    public class CategoriaRepository : BaseRepository<Categoria>, ICategoriaRepository
    {
        public CategoriaRepository(DBREACT_VENTAContext context) : base(context)
        {
        }

        /// <summary>
        /// Obtiene categorías con sus productos relacionados
        /// </summary>
        public async Task<List<Categoria>> GetCategoriasWithProductsAsync()
        {
            return await _dbSet
                .Include(c => c.Productos.Where(p => p.EsActivo == true))
                .Include(c => c.IdSucursalNavigation)
                .Where(c => c.EsActivo == true)
                .OrderByDescending(c => c.IdCategoria)
                .ToListAsync();
        }

        /// <summary>
        /// Sobrescribe GetAllAsync para ordenar por IdCategoria descendente e incluir todos los registros
        /// </summary>
        public override async Task<List<Categoria>> GetAllAsync()
        {
            return await _dbSet
                .Include(c => c.IdSucursalNavigation)
                .OrderByDescending(c => c.IdCategoria)
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene solo las categorías activas
        /// </summary>
        public override async Task<List<Categoria>> GetActiveAsync()
        {
            return await _dbSet
                .Include(c => c.IdSucursalNavigation)
                .Where(c => c.EsActivo == true)
                .OrderByDescending(c => c.IdCategoria)
                .ToListAsync();
        }
    }
}