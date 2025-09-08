using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactVentas.Models;
using ReactVentas.Interfaces;
using Microsoft.AspNetCore.SignalR;
using ReactVentas.Hubs;

namespace ReactVentas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoController : ControllerBase
    {
        private readonly IProductoRepository _productoRepository;
        private readonly IHubContext<NotificationHub> _hubContext;

        public ProductoController(IProductoRepository productoRepository, IHubContext<NotificationHub> hubContext)
        {
            _productoRepository = productoRepository;
            _hubContext = hubContext;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista()
        {
            // Retrieves a list of active products including their category and supplier information, ordered by product ID in descending order.
            try
            {
                var lista = await _productoRepository.GetProductsWithRelatedDataAsync();
                return StatusCode(StatusCodes.Status200OK, lista);
            }
            catch (Exception ex)
            {
                // Returns a 500 Internal Server Error status if an exception occurs.
                return StatusCode(StatusCodes.Status500InternalServerError, new List<Producto>());
            }
        }

        [HttpPost]
        [Route("Guardar")]
        public async Task<IActionResult> Guardar([FromBody] Producto request)
        {
            // Adds a new product to the database.
            try
            {
                // Convert 0 to null for optional foreign keys to allow saving without provider
                if (request.IdProveedor == 0)
                    request.IdProveedor = null;
                if (request.IdCategoria == 0)
                    request.IdCategoria = null;

               var newProduct = await _productoRepository.AddAsync(request);
                await _productoRepository.SaveChangesAsync();

                // Obtener el producto con relaciones después de guardar
                var productoConRelaciones = await _productoRepository.GetProductWithRelatedDataByIdAsync(newProduct.IdProducto);

                // Notificar con el objeto completo incluyendo relaciones
                await _hubContext.Clients.Group("FerreteriaSistema").SendAsync("ProductoCreated", productoConRelaciones);

                // Returns a 200 OK status on successful save.
                return StatusCode(StatusCodes.Status200OK, "ok");
            }
            catch (Exception ex)
            {
                // Returns a 500 Internal Server Error status if an exception occurs during saving.
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] Producto request)
        {
            // Updates an existing product in the database.
            try
            {
                // Convert 0 to null for optional foreign keys to allow saving without provider
                if (request.IdProveedor == 0)
                    request.IdProveedor = null;
                if (request.IdCategoria == 0)
                    request.IdCategoria = null;

                await _productoRepository.UpdateAsync(request);
                await _productoRepository.SaveChangesAsync();

                // Obtener el producto con relaciones después de actualizar
                var productoConRelaciones = await _productoRepository.GetProductWithRelatedDataByIdAsync(request.IdProducto);

                // Notificar con el objeto completo incluyendo relaciones
                await _hubContext.Clients.Group("FerreteriaSistema").SendAsync("ProductoUpdated", productoConRelaciones);

                // Returns a 200 OK status on successful update.
                return StatusCode(StatusCodes.Status200OK, "ok");
            }
            catch (Exception ex)
            {
                // Returns a 500 Internal Server Error status if an exception occurs during update.
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            // Performs soft delete by setting EsActivo to false instead of removing the record.
            try
            {
                var result = await _productoRepository.SoftDeleteAsync(id);
                if (result)
                {
                    await _productoRepository.SaveChangesAsync();
                    
                    // Notify all clients about the deleted product
                    await _hubContext.Clients.Group("FerreteriaSistema").SendAsync("ProductoDeleted", id);
                    
                    return StatusCode(StatusCodes.Status200OK, "ok");
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound, "Producto not found");
                }
            }
            catch (Exception ex)
            {
                // Returns a 500 Internal Server Error status if an exception occurs during deletion.
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
