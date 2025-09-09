namespace ReactVentas.Helpers
{
    /// <summary>
    /// Helper methods for sucursal context operations
    /// </summary>
    public static class SucursalContextHelper
    {
        /// <summary>
        /// Gets the sucursal ID from the HTTP context
        /// </summary>
        /// <param name="httpContext">The HTTP context</param>
        /// <returns>The sucursal ID if present, null otherwise</returns>
        public static int? GetSucursalIdFromContext(HttpContext httpContext)
        {
            if (httpContext?.Items?.ContainsKey("SucursalId") == true)
            {
                return (int?)httpContext.Items["SucursalId"];
            }
            return null;
        }
    }
}