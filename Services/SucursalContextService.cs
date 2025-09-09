namespace ReactVentas.Services
{
    /// <summary>
    /// Service for handling sucursal context in HTTP requests
    /// </summary>
    public class SucursalContextService : ISucursalContextService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SucursalContextService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int? GetSucursalId()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context?.Items.ContainsKey("SucursalId") == true)
            {
                return context.Items["SucursalId"] as int?;
            }

            // Try to get from header
            if (context?.Request.Headers.ContainsKey("X-Sucursal-Id") == true)
            {
                if (int.TryParse(context.Request.Headers["X-Sucursal-Id"], out int sucursalId))
                {
                    return sucursalId;
                }
            }

            return null;
        }

        public void SetSucursalId(int? sucursalId)
        {
            var context = _httpContextAccessor.HttpContext;
            if (context != null)
            {
                context.Items["SucursalId"] = sucursalId;
            }
        }

        public int? GetUserId()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context?.Items.ContainsKey("UserId") == true)
            {
                return context.Items["UserId"] as int?;
            }

            // Try to get from header
            if (context?.Request.Headers.ContainsKey("X-User-Id") == true)
            {
                if (int.TryParse(context.Request.Headers["X-User-Id"], out int userId))
                {
                    return userId;
                }
            }

            return null;
        }

        public void SetUserId(int? userId)
        {
            var context = _httpContextAccessor.HttpContext;
            if (context != null)
            {
                context.Items["UserId"] = userId;
            }
        }

        public bool IsAdmin()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context?.Items.ContainsKey("IsAdmin") == true)
            {
                return context.Items["IsAdmin"] as bool? ?? false;
            }

            // Try to get from header
            if (context?.Request.Headers.ContainsKey("X-Is-Admin") == true)
            {
                if (bool.TryParse(context.Request.Headers["X-Is-Admin"], out bool isAdmin))
                {
                    return isAdmin;
                }
            }

            return false;
        }

        public void SetIsAdmin(bool isAdmin)
        {
            var context = _httpContextAccessor.HttpContext;
            if (context != null)
            {
                context.Items["IsAdmin"] = isAdmin;
            }
        }
    }
}