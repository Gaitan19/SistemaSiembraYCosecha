using System;
using System.Collections.Generic;

namespace ReactVentas.Models
{
    /// <summary>
    /// Represents a module entity that defines different sections/features of the system.
    /// </summary>
    public partial class Modulo
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Modulo"/> class.
        /// Sets up the collection of user permissions associated with this module.
        /// </summary>
        public Modulo()
        {
            UsuarioPermisos = new HashSet<UsuarioPermiso>();
        }

        /// <summary>
        /// Gets or sets the unique identifier for the module.
        /// </summary>
        public int IdModulo { get; set; }

        /// <summary>
        /// Gets or sets the name of the module.
        /// Optional field.
        /// </summary>
        public string? Nombre { get; set; }

        /// <summary>
        /// Gets or sets the description of the module.
        /// Optional field.
        /// </summary>
        public string? Descripcion { get; set; }

        /// <summary>
        /// Gets or sets the active status of the module.
        /// Optional field. A value of true indicates the module is active.
        /// </summary>
        public bool? EsActivo { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the module was registered.
        /// Optional field.
        /// </summary>
        public DateTime? FechaRegistro { get; set; }

        /// <summary>
        /// Navigation property to the collection of user permissions associated with this module.
        /// </summary>
        public virtual ICollection<UsuarioPermiso> UsuarioPermisos { get; set; }
    }
}