using System;

namespace ReactVentas.Models
{
    /// <summary>
    /// Represents a user permission entity that defines access rights to specific modules for users.
    /// </summary>
    public partial class UsuarioPermiso
    {
        /// <summary>
        /// Gets or sets the unique identifier for the user permission.
        /// </summary>
        public int IdUsuarioPermiso { get; set; }

        /// <summary>
        /// Gets or sets the user identifier for the permission.
        /// Optional field.
        /// </summary>
        public int? IdUsuario { get; set; }

        /// <summary>
        /// Gets or sets the module identifier for the permission.
        /// Optional field.
        /// </summary>
        public int? IdModulo { get; set; }

        /// <summary>
        /// Gets or sets whether the user has permission to access the module.
        /// Optional field. A value of true indicates the user has permission.
        /// </summary>
        public bool? TienePermiso { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the permission was registered.
        /// Optional field.
        /// </summary>
        public DateTime? FechaRegistro { get; set; }

        /// <summary>
        /// Navigation property to the user associated with this permission.
        /// </summary>
        public virtual Usuario? IdUsuarioNavigation { get; set; }

        /// <summary>
        /// Navigation property to the module associated with this permission.
        /// </summary>
        public virtual Modulo? IdModuloNavigation { get; set; }
    }
}