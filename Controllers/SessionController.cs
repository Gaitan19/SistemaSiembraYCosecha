using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactVentas.Models;
using ReactVentas.Models.DTO;
using ReactVentas.Services;
using ReactVentas.Interfaces;

namespace ReactVentas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IPasswordService _passwordService;

        public SessionController(IUsuarioRepository usuarioRepository, IPasswordService passwordService)
        {
            _usuarioRepository = usuarioRepository;
            _passwordService = passwordService;
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] Dtosesion request)
        {
            try
            {
                var usuario = await _usuarioRepository.GetByEmailAsync(request.correo);

                if (usuario == null ||
                    !_passwordService.VerifyPassword(request.clave, usuario.Clave))
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new { message = "Invalid credentials" });
                }

                // Create session response with sucursal and role information
                var sessionResponse = new DtoSesionResponse
                {
                    IdUsuario = usuario.IdUsuario,
                    Nombre = usuario.Nombre,
                    Correo = usuario.Correo,
                    Telefono = usuario.Telefono,
                    IdRol = usuario.IdRol,
                    RolDescripcion = usuario.IdRolNavigation?.Descripcion,
                    IdSucursal = usuario.IdSucursal,
                    SucursalDepartamento = usuario.IdSucursalNavigation?.Departamento,
                    SucursalDireccion = usuario.IdSucursalNavigation?.Direccion,
                    EsActivo = usuario.EsActivo,
                    EsAdministrador = usuario.IdRolNavigation?.Descripcion?.ToLower() == "administrador"
                };

                return StatusCode(StatusCodes.Status200OK, sessionResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}