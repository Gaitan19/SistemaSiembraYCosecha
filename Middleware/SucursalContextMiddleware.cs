using Microsoft.AspNetCore.Mvc;
using ReactVentas.Interfaces;
using System.Text.Json;

namespace ReactVentas.Middleware
{
    /// <summary>
    /// Middleware to handle sucursal context for multi-branch operations
    /// </summary>
    public class SucursalContextMiddleware
    {
        private readonly RequestDelegate _next;

        public SucursalContextMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Check if the request has X-Sucursal-Id header
            if (context.Request.Headers.TryGetValue("X-Sucursal-Id", out var sucursalIdValue))
            {
                if (int.TryParse(sucursalIdValue.FirstOrDefault(), out int sucursalId) && sucursalId > 0)
                {
                    // Store the sucursal ID in the context for use in controllers/repositories
                    context.Items["SucursalId"] = sucursalId;
                }
            }

            // Check for sucursalId in request body for POST/PUT requests
            if (context.Request.Method == "POST" || context.Request.Method == "PUT")
            {
                if (context.Request.ContentType?.Contains("application/json") == true)
                {
                    // Note: We don't read the body here as it would interfere with model binding
                    // Instead, we'll handle this in controllers where we have access to the deserialized model
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
        public static IApplicationBuilder UseSucursalContext(this IApplicationBuilder app)
        {
            return app.UseMiddleware<SucursalContextMiddleware>();
        }
    }
}