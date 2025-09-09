namespace ReactVentas.Services
{
    /// <summary>
    /// Interface for handling sucursal context in requests
    /// </summary>
    public interface ISucursalContextService
    {
        /// <summary>
        /// Gets the sucursal ID from the current request context
        /// </summary>
        /// <returns>Sucursal ID if available, null otherwise</returns>
        int? GetSucursalId();

        /// <summary>
        /// Sets the sucursal ID for the current request context
        /// </summary>
        /// <param name="sucursalId">Sucursal ID to set</param>
        void SetSucursalId(int? sucursalId);

        /// <summary>
        /// Gets the user ID from the current request context
        /// </summary>
        /// <returns>User ID if available, null otherwise</returns>
        int? GetUserId();

        /// <summary>
        /// Sets the user ID for the current request context
        /// </summary>
        /// <param name="userId">User ID to set</param>
        void SetUserId(int? userId);

        /// <summary>
        /// Checks if the current user is an administrator
        /// </summary>
        /// <returns>True if admin, false otherwise</returns>
        bool IsAdmin();

        /// <summary>
        /// Sets whether the current user is an administrator
        /// </summary>
        /// <param name="isAdmin">Admin status</param>
        void SetIsAdmin(bool isAdmin);
    }
}