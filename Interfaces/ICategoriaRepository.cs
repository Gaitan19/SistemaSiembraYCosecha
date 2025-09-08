using ReactVentas.Models;

namespace ReactVentas.Interfaces
{
    /// <summary>
    /// Interfaz del repositorio para operaciones de la entidad Categoria
    /// </summary>
    public interface ICategoriaRepository : IBaseRepository<Categoria>
    {
        /// <summary>
        /// Obtiene categorías con sus productos relacionados
        /// </summary>
        /// <returns>Lista de categorías con productos</returns>
        Task<List<Categoria>> GetCategoriasWithProductsAsync();
    }
}