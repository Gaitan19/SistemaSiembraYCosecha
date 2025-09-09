using Microsoft.AspNetCore.Mvc;
using ReactVentas.Interfaces;
using ReactVentas.Models;

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

        /// <summary>
        /// Gets all branches
        /// </summary>
        /// <returns>List of branches</returns>
        [HttpGet]
        public async Task<IActionResult> GetSucursales()
        {
            try
            {
                var sucursales = await _sucursalRepository.GetAllAsync();
                return Ok(sucursales);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving branches: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets all active branches
        /// </summary>
        /// <returns>List of active branches</returns>
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveSucursales()
        {
            try
            {
                var sucursales = await _sucursalRepository.GetActiveSucursalesAsync();
                return Ok(sucursales);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving active branches: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets a branch by ID
        /// </summary>
        /// <param name="id">Branch ID</param>
        /// <returns>Branch details</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSucursal(int id)
        {
            try
            {
                var sucursal = await _sucursalRepository.GetByIdAsync(id);
                if (sucursal == null)
                {
                    return NotFound($"Branch with ID {id} not found");
                }
                return Ok(sucursal);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving branch: {ex.Message}");
            }
        }

        /// <summary>
        /// Creates a new branch
        /// </summary>
        /// <param name="sucursal">Branch data</param>
        /// <returns>Created branch</returns>
        [HttpPost]
        public async Task<IActionResult> CreateSucursal([FromBody] Sucursal sucursal)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                sucursal.FechaRegistro = DateTime.Now;
                var createdSucursal = await _sucursalRepository.AddAsync(sucursal);
                
                return CreatedAtAction(
                    nameof(GetSucursal), 
                    new { id = createdSucursal.IdSucursal }, 
                    createdSucursal
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating branch: {ex.Message}");
            }
        }

        /// <summary>
        /// Updates an existing branch
        /// </summary>
        /// <param name="id">Branch ID</param>
        /// <param name="sucursal">Updated branch data</param>
        /// <returns>Updated branch</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSucursal(int id, [FromBody] Sucursal sucursal)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (id != sucursal.IdSucursal)
                {
                    return BadRequest("Branch ID mismatch");
                }

                var existingSucursal = await _sucursalRepository.GetByIdAsync(id);
                if (existingSucursal == null)
                {
                    return NotFound($"Branch with ID {id} not found");
                }

                var updatedSucursal = await _sucursalRepository.UpdateAsync(sucursal);
                return Ok(updatedSucursal);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating branch: {ex.Message}");
            }
        }

        /// <summary>
        /// Deletes a branch (soft delete by setting EsActivo to false)
        /// </summary>
        /// <param name="id">Branch ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSucursal(int id)
        {
            try
            {
                var existingSucursal = await _sucursalRepository.GetByIdAsync(id);
                if (existingSucursal == null)
                {
                    return NotFound($"Branch with ID {id} not found");
                }

                // Soft delete - set EsActivo to false
                existingSucursal.EsActivo = false;
                await _sucursalRepository.UpdateAsync(existingSucursal);

                return Ok(new { message = "Branch deactivated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deactivating branch: {ex.Message}");
            }
        }
    }
}