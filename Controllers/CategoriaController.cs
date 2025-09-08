﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactVentas.Models;
using ReactVentas.Interfaces;
using Microsoft.AspNetCore.SignalR;
using ReactVentas.Hubs;

namespace ReactVentas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly IHubContext<NotificationHub> _hubContext;

        public CategoriaController(ICategoriaRepository categoriaRepository, IHubContext<NotificationHub> hubContext)
        {
            _categoriaRepository = categoriaRepository;
            _hubContext = hubContext;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista()
        {
            // Retrieves a list of active categories ordered by their ID in descending order.
            try
            {
                var lista = await _categoriaRepository.GetAllAsync();
                return StatusCode(StatusCodes.Status200OK, lista);
            }
            catch (Exception ex)
            {
                // Returns a 500 Internal Server Error status if an exception occurs.
                return StatusCode(StatusCodes.Status500InternalServerError, new List<Categoria>());
            }
        }

        [HttpPost]
        [Route("Guardar")]
        public async Task<IActionResult> Guardar([FromBody] Categoria request)
        {
            // Adds a new category to the database.
            try
            {
                await _categoriaRepository.AddAsync(request);
                await _categoriaRepository.SaveChangesAsync();

                // Notify all clients about the new category
                await _hubContext.Clients.Group("FerreteriaSistema").SendAsync("CategoriaCreated", request);

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
        public async Task<IActionResult> Editar([FromBody] Categoria request)
        {
            // Updates an existing category in the database.
            try
            {
                await _categoriaRepository.UpdateAsync(request);
                await _categoriaRepository.SaveChangesAsync();

                // Notify all clients about the updated category
                await _hubContext.Clients.Group("FerreteriaSistema").SendAsync("CategoriaUpdated", request);

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
                var result = await _categoriaRepository.SoftDeleteAsync(id);
                if (result)
                {
                    await _categoriaRepository.SaveChangesAsync();
                    
                    // Notify all clients about the deleted category
                    await _hubContext.Clients.Group("FerreteriaSistema").SendAsync("CategoriaDeleted", id);
                    
                    return StatusCode(StatusCodes.Status200OK, "ok");
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound, "Categoria not found");
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
