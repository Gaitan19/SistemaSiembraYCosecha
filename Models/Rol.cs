using System;
using System.Collections.Generic;

namespace ReactVentas.Models
{
    /// <summary>
    /// Represents a role entity that defines the permissions and access level for users in the system.
    /// </summary>
    public partial class Rol
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Rol"/> class.
        /// Sets up the collection of users associated with this role.
        /// </summary>
        public Rol()
        {
            Usuarios = new HashSet<Usuario>();
        }

        /// <summary>
        /// Gets or sets the unique identifier for the role.
        /// </summary>
        public int IdRol { get; set; }

        /// <summary>
        /// Gets or sets the description of the role.
        /// Optional field.
        /// </summary>
        public string? Descripcion { get; set; }

        /// <summary>
        /// Gets or sets the active status of the role.
        /// Optional field. A value of true indicates the role is active.
        /// </summary>
        public bool? EsActivo { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the role was registered.
        /// Optional field.
        /// </summary>
        public DateTime? FechaRegistro { get; set; }

        /// <summary>
        /// Navigation property to the collection of users associated with this role.
        /// </summary>
        public virtual ICollection<Usuario> Usuarios { get; set; }
    }
}
