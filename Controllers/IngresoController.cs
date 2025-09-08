using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactVentas.Models;
using ReactVentas.Interfaces;

namespace ReactVentas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngresoController : ControllerBase
    {
        private readonly IIngresoRepository _ingresoRepository;

        public IngresoController(IIngresoRepository ingresoRepository)
        {
            _ingresoRepository = ingresoRepository;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista()
        {
            // Retrieves a list of income records with user information ordered by ID in descending order.
            try
            {
                var lista = await _ingresoRepository.GetIngresosWithUserAsync();
                return StatusCode(StatusCodes.Status200OK, lista);
            }
            catch (Exception ex)
            {
                // Returns a 500 Internal Server Error status if an exception occurs.
                return StatusCode(StatusCodes.Status500InternalServerError, new List<Models.DTO.DtoIngreso>());
            }
        }

        [HttpPost]
        [Route("Guardar")]
        public async Task<IActionResult> Guardar([FromBody] Ingreso request)
        {
            // Adds a new income record to the database.
            try
            {
                // Set the registration date and default active status
                request.FechaRegistro = DateTime.Now;
                request.EsActivo = true;
                
                await _ingresoRepository.AddAsync(request);
                await _ingresoRepository.SaveChangesAsync();

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
        public async Task<IActionResult> Editar([FromBody] Ingreso request)
        {
            // Partially updates an existing income record in the database (excludes FechaRegistro).
            try
            {
                // Get the existing record to preserve the original FechaRegistro
                var existingIngreso = await _ingresoRepository.GetByIdAsync(request.IdIngreso);
                if (existingIngreso == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, "Ingreso not found");
                }

                // Update only the fields that should be modifiable, preserve FechaRegistro
                existingIngreso.Descripcion = request.Descripcion;
                existingIngreso.Monto = request.Monto;
                existingIngreso.TipoDinero = request.TipoDinero;
                existingIngreso.EsActivo = request.EsActivo;
                // Keep existing FechaRegistro unchanged

                await _ingresoRepository.UpdateAsync(existingIngreso);
                await _ingresoRepository.SaveChangesAsync();

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
            // Soft deletes an income record (sets EsActivo = false).
            try
            {
                var ingreso = await _ingresoRepository.GetByIdAsync(id);
                if (ingreso != null)
                {
                    // Soft delete: set EsActivo to false instead of removing from database
                    ingreso.EsActivo = false;
                    
                    await _ingresoRepository.UpdateAsync(ingreso);
                    await _ingresoRepository.SaveChangesAsync();
                    
                    return StatusCode(StatusCodes.Status200OK, "ok");
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound, "Ingreso not found");
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