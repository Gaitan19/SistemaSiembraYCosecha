using ReactVentas.Models;

namespace ReactVentas.Interfaces
{
    public interface IModuloRepository : IBaseRepository<Modulo>
    {
        Task<List<Modulo>> GetModulosActivosAsync();
    }
}