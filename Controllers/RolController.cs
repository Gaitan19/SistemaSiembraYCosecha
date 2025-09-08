using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactVentas.Models;
using ReactVentas.Interfaces;

namespace ReactVentas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolController : ControllerBase
    {
        private readonly IRolRepository _rolRepository;

        public RolController(IRolRepository rolRepository)
        {
            _rolRepository = rolRepository;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista() 
        {
            // Retrieves a list of active roles from the database.
            try 
            {
                var lista = await _rolRepository.GetAllAsync();
                
                // Returns a 200 OK status along with the list of roles.
                return StatusCode(StatusCodes.Status200OK, lista);
            }
            catch 
            {
                // Returns a 500 Internal Server Error status if an exception occurs.
                return StatusCode(StatusCodes.Status500InternalServerError, new List<Rol>());
            }
        }
    }
}
