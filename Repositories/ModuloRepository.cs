using Microsoft.EntityFrameworkCore;
using ReactVentas.Interfaces;
using ReactVentas.Models;

namespace ReactVentas.Repositories
{
    public class ModuloRepository : BaseRepository<Modulo>, IModuloRepository
    {
        public ModuloRepository(DBREACT_VENTAContext context) : base(context)
        {
        }

        public async Task<List<Modulo>> GetModulosActivosAsync()
        {
            return await _dbSet
                .Where(m => m.EsActivo == true)
                .OrderBy(m => m.Nombre)
                .ToListAsync();
        }
    }
}