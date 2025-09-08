using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactVentas.Models;
using ReactVentas.Interfaces;

namespace ReactVentas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EgresoController : ControllerBase
    {
        private readonly IEgresoRepository _egresoRepository;

        public EgresoController(IEgresoRepository egresoRepository)
        {
            _egresoRepository = egresoRepository;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista()
        {
            // Retrieves a list of expense records with user information ordered by ID in descending order.
            try
            {
                var lista = await _egresoRepository.GetEgresosWithUserAsync();
                return StatusCode(StatusCodes.Status200OK, lista);
            }
            catch (Exception ex)
            {
                // Returns a 500 Internal Server Error status if an exception occurs.
                return StatusCode(StatusCodes.Status500InternalServerError, new List<Models.DTO.DtoEgreso>());
            }
        }

        [HttpPost]
        [Route("Guardar")]
        public async Task<IActionResult> Guardar([FromBody] Egreso request)
        {
            // Adds a new expense record to the database.
            try
            {
                // Set the registration date and default active status
                request.FechaRegistro = DateTime.Now;
                request.EsActivo = true;
                
                await _egresoRepository.AddAsync(request);
                await _egresoRepository.SaveChangesAsync();

                // Returns a 200 OK status on successful save.
                return StatusCode(StatusCodes.Status200OK, "ok");
            }
            catch (Exception ex)
            {
                // Returns a 500 Internal Server Error status if an exception occurs during saving.
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPatch]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] Egreso request)
        {
            // Partially updates an existing expense record in the database (excludes FechaRegistro).
            try
            {
                // Get the existing record to preserve the original FechaRegistro
                var existingEgreso = await _egresoRepository.GetByIdAsync(request.IdEgreso);
                if (existingEgreso == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, "Egreso not found");
                }

                // Update only the fields that should be modifiable, preserve FechaRegistro
                existingEgreso.Descripcion = request.Descripcion;
                existingEgreso.Monto = request.Monto;
                existingEgreso.TipoDinero = request.TipoDinero;
                existingEgreso.EsActivo = request.EsActivo;
                // Keep existing FechaRegistro unchanged

                await _egresoRepository.UpdateAsync(existingEgreso);
                await _egresoRepository.SaveChangesAsync();

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
            // Soft deletes an expense record (sets EsActivo = false).
            try
            {
                var egreso = await _egresoRepository.GetByIdAsync(id);
                if (egreso != null)
                {
                    // Soft delete: set EsActivo to false instead of removing from database
                    egreso.EsActivo = false;
                    
                    await _egresoRepository.UpdateAsync(egreso);
                    await _egresoRepository.SaveChangesAsync();
                    
                    return StatusCode(StatusCodes.Status200OK, "ok");
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound, "Egreso not found");
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