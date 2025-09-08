using Microsoft.AspNetCore.Mvc;
using ReactVentas.Interfaces;
using ReactVentas.Models.DTO;

namespace ReactVentas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermisosController : ControllerBase
    {
        private readonly IUsuarioPermisoRepository _usuarioPermisoRepository;
        private readonly IModuloRepository _moduloRepository;

        public PermisosController(IUsuarioPermisoRepository usuarioPermisoRepository, IModuloRepository moduloRepository)
        {
            _usuarioPermisoRepository = usuarioPermisoRepository;
            _moduloRepository = moduloRepository;
        }

        [HttpGet]
        [Route("Usuario/{idUsuario}")]
        public async Task<IActionResult> GetPermisosUsuario(int idUsuario)
        {
            try
            {
                var permisos = await _usuarioPermisoRepository.GetPermisosUsuarioAsync(idUsuario);
                return StatusCode(StatusCodes.Status200OK, permisos);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [Route("Empleados")]
        public async Task<IActionResult> GetPermisosEmpleados()
        {
            try
            {
                var permisos = await _usuarioPermisoRepository.GetPermisosAllUsuariosEmpleadosAsync();
                return StatusCode(StatusCodes.Status200OK, permisos);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [Route("Modulos")]
        public async Task<IActionResult> GetModulos()
        {
            try
            {
                var modulos = await _moduloRepository.GetModulosActivosAsync();
                return StatusCode(StatusCodes.Status200OK, modulos);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut]
        [Route("ActualizarPermisos")]
        public async Task<IActionResult> ActualizarPermisos([FromBody] DtoActualizarPermisos request)
        {
            try
            {
                var resultado = await _usuarioPermisoRepository.ActualizarPermisosUsuarioAsync(request);
                
                if (resultado)
                {
                    return StatusCode(StatusCodes.Status200OK, "Permisos actualizados correctamente");
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Error al actualizar permisos");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}