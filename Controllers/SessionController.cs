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
                    return StatusCode(StatusCodes.Status401Unauthorized, new DtoUsuarioSesion());
                }

                // Create session DTO with necessary information
                var usuarioSesion = new DtoUsuarioSesion
                {
                    IdUsuario = usuario.IdUsuario,
                    Nombre = usuario.Nombre,
                    Correo = usuario.Correo,
                    Telefono = usuario.Telefono,
                    IdRol = usuario.IdRol,
                    DescripcionRol = usuario.IdRolNavigation?.Descripcion,
                    IdSucursal = usuario.IdSucursal,
                    NombreSucursal = usuario.IdSucursalNavigation?.Departamento,
                    EsActivo = usuario.EsActivo,
                    EsAdministrador = usuario.IdRolNavigation?.Descripcion?.ToLower() == "administrador"
                };

                return StatusCode(StatusCodes.Status200OK, usuarioSesion);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new DtoUsuarioSesion());
            }
        }
    }
}