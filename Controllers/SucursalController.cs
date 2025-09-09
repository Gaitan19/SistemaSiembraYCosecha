using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactVentas.Models;
using ReactVentas.Interfaces;

namespace ReactVentas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SucursalController : ControllerBase
    {
        private readonly ISucursalRepository _sucursalRepository;

        public SucursalController(ISucursalRepository sucursalRepository)
        {
            _sucursalRepository = sucursalRepository;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista()
        {
            // Retrieves a list of all branches
            try
            {
                var lista = await _sucursalRepository.GetAllAsync();
                return StatusCode(StatusCodes.Status200OK, lista);
            }
            catch (Exception ex)
            {
                // Returns a 500 Internal Server Error status if an exception occurs.
                return StatusCode(StatusCodes.Status500InternalServerError, new List<Sucursal>());
            }
        }

        [HttpGet]
        [Route("Activas")]
        public async Task<IActionResult> GetActivas()
        {
            // Retrieves a list of active branches only
            try
            {
                var lista = await _sucursalRepository.GetActiveSucursalesAsync();
                return StatusCode(StatusCodes.Status200OK, lista);
            }
            catch (Exception ex)
            {
                // Returns a 500 Internal Server Error status if an exception occurs.
                return StatusCode(StatusCodes.Status500InternalServerError, new List<Sucursal>());
            }
        }

        [HttpGet]
        [Route("ConDatos")]
        public async Task<IActionResult> GetConDatos()
        {
            // Retrieves branches with their related data
            try
            {
                var lista = await _sucursalRepository.GetSucursalesWithRelatedDataAsync();
                return StatusCode(StatusCodes.Status200OK, lista);
            }
            catch (Exception ex)
            {
                // Returns a 500 Internal Server Error status if an exception occurs.
                return StatusCode(StatusCodes.Status500InternalServerError, new List<Sucursal>());
            }
        }

        [HttpPost]
        [Route("Guardar")]
        public async Task<IActionResult> Guardar([FromBody] Sucursal request)
        {
            // Adds a new branch to the database.
            try
            {
                // Ensure active status is set
                if (!request.EsActivo.HasValue)
                    request.EsActivo = true;

                await _sucursalRepository.AddAsync(request);
                await _sucursalRepository.SaveChangesAsync();

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
        public async Task<IActionResult> Editar([FromBody] Sucursal request)
        {
            // Updates an existing branch in the database.
            try
            {
                await _sucursalRepository.UpdateAsync(request);
                await _sucursalRepository.SaveChangesAsync();

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
                var result = await _sucursalRepository.SoftDeleteAsync(id);
                if (result)
                {
                    await _sucursalRepository.SaveChangesAsync();
                    
                    return StatusCode(StatusCodes.Status200OK, "ok");
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound, "Sucursal not found");
                }
            }
            catch (Exception ex)
            {
                // Returns a 500 Internal Server Error status if an exception occurs during deletion.
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Obtener(int id)
        {
            // Gets a specific branch by ID
            try
            {
                var sucursal = await _sucursalRepository.GetByIdAsync(id);
                if (sucursal == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, "Sucursal not found");
                }

                return StatusCode(StatusCodes.Status200OK, sucursal);
            }
            catch (Exception ex)
            {
                // Returns a 500 Internal Server Error status if an exception occurs.
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}