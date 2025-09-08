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
            Usuario usuario = new Usuario();
            try
            {
                usuario = await _usuarioRepository.GetByEmailAsync(request.correo);

                if (usuario == null ||
                    !_passwordService.VerifyPassword(request.clave, usuario.Clave))
                {
                    usuario = new Usuario();
                    return StatusCode(StatusCodes.Status401Unauthorized, usuario);
                }

                return StatusCode(StatusCodes.Status200OK, usuario);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, usuario);
            }
        }
    }
}