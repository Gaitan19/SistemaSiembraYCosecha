using ReactVentas.Services;
using ReactVentas.Interfaces;

namespace ReactVentas.Middleware
{
    /// <summary>
    /// Middleware to handle sucursal context from HTTP headers
    /// </summary>
    public class SucursalContextMiddleware
    {
        private readonly RequestDelegate _next;

        public SucursalContextMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ISucursalContextService sucursalContext, IUsuarioRepository usuarioRepository)
        {
            // Extract user context from headers
            if (context.Request.Headers.ContainsKey("X-User-Id"))
            {
                if (int.TryParse(context.Request.Headers["X-User-Id"], out int userId))
                {
                    sucursalContext.SetUserId(userId);

                    // Get user information to determine if admin and sucursal
                    try
                    {
                        var usuario = await usuarioRepository.GetUserWithRelatedDataByIdAsync(userId);
                        if (usuario != null)
                        {
                            // Set admin status
                            bool isAdmin = usuario.IdRolNavigation?.Descripcion?.ToLower() == "administrador";
                            sucursalContext.SetIsAdmin(isAdmin);

                            // For non-admin users, use their assigned sucursal
                            if (!isAdmin && usuario.IdSucursal.HasValue)
                            {
                                sucursalContext.SetSucursalId(usuario.IdSucursal.Value);
                            }
                            // For admin users, use the sucursal from header if provided
                            else if (isAdmin && context.Request.Headers.ContainsKey("X-Sucursal-Id"))
                            {
                                if (int.TryParse(context.Request.Headers["X-Sucursal-Id"], out int sucursalId))
                                {
                                    sucursalContext.SetSucursalId(sucursalId);
                                }
                            }
                        }
                    }
                    catch
                    {
                        // If we can't get user info, continue without context
                        // This allows the request to proceed but without sucursal filtering
                    }
                }
            }

            await _next(context);
        }
    }

    /// <summary>
    /// Extension method to register the middleware
    /// </summary>
    public static class SucursalContextMiddlewareExtensions
    {
        public static IApplicationBuilder UseSucursalContext(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<SucursalContextMiddleware>();
        }
    }
}