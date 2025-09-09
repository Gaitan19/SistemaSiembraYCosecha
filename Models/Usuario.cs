using System;
using System.Collections.Generic;

namespace ReactVentas.Models
{
    /// <summary>
    /// Represents a user entity in the system, containing user details such as name, email, phone, and role.
    /// </summary>
    public partial class Usuario
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Usuario"/> class.
        /// Sets up the collection of sales (Venta) associated with this user.
        /// </summary>
        public Usuario()
        {
            Venta = new HashSet<Venta>();
            Ingresos = new HashSet<Ingreso>();
            Egresos = new HashSet<Egreso>();
            UsuarioPermisos = new HashSet<UsuarioPermiso>();
        }

        /// <summary>
        /// Gets or sets the unique identifier for the user.
        /// </summary>
        public int IdUsuario { get; set; }

        /// <summary>
        /// Gets or sets the name of the user.
        /// Optional field.
        /// </summary>
        public string? Nombre { get; set; }

        /// <summary>
        /// Gets or sets the email address of the user.
        /// Optional field.
        /// </summary>
        public string? Correo { get; set; }

        /// <summary>
        /// Gets or sets the phone number of the user.
        /// Optional field.
        /// </summary>
        public string? Telefono { get; set; }

        /// <summary>
        /// Gets or sets the role identifier for the user.
        /// Optional field.
        /// </summary>
        public int? IdRol { get; set; }

        /// <summary>
        /// Gets or sets the branch identifier for the user.
        /// Optional field.
        /// </summary>
        public int? IdSucursal { get; set; }

        /// <summary>
        /// Gets or sets the password for the user.
        /// Optional field.
        /// </summary>
        public string? Clave { get; set; }

        /// <summary>
        /// Gets or sets the active status of the user.
        /// Optional field. A value of true indicates the user is active.
        /// </summary>
        public bool? EsActivo { get; set; }

        /// <summary>
        /// Navigation property to the role associated with the user.
        /// </summary>
        public virtual Rol? IdRolNavigation { get; set; }

        /// <summary>
        /// Navigation property to the branch associated with the user.
        /// </summary>
        public virtual Sucursal? IdSucursalNavigation { get; set; }

        /// <summary>
        /// Navigation property to the collection of sales associated with the user.
        /// </summary>
        public virtual ICollection<Venta> Venta { get; set; }

        /// <summary>
        /// Navigation property to the collection of income records associated with the user.
        /// </summary>
        public virtual ICollection<Ingreso> Ingresos { get; set; }

        /// <summary>
        /// Navigation property to the collection of expense records associated with the user.
        /// </summary>
        public virtual ICollection<Egreso> Egresos { get; set; }

        /// <summary>
        /// Navigation property to the collection of user permissions associated with the user.
        /// </summary>
        public virtual ICollection<UsuarioPermiso> UsuarioPermisos { get; set; }
    }
}
