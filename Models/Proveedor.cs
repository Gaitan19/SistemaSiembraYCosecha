using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactVentas.Models
{
    /// <summary>
    /// Represents a supplier entity in the system, containing basic information such as name, email, and phone.
    /// </summary>
    [Table("Proveedor")]
    public partial class Proveedor
    {

        public Proveedor()  
        {  
            Productos = new HashSet<Producto>();  
        } 
        /// <summary>
        /// Gets or sets the unique identifier for the supplier.
        /// </summary>
        public int IdProveedor { get; set; }

        /// <summary>
        /// Gets or sets the name of the supplier.
        /// Optional field.
        /// </summary>
        public string? Nombre { get; set; }

        /// <summary>
        /// Gets or sets the email address of the supplier.
        /// Optional field.
        /// </summary>
        public string? Correo { get; set; }

        /// <summary>
        /// Gets or sets the phone number of the supplier.
        /// Optional field.
        /// </summary>
        public string? Telefono { get; set; }

        public bool? EsActivo { get; set; }

        /// <summary>
        /// Gets or sets the identifier for the branch where the supplier is registered.
        /// Optional field.
        /// </summary>
        public int? IdSucursal { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the supplier was registered.
        /// </summary>
        public DateTime FechaRegistro { get; set; }

        /// <summary>
        /// Navigation property to the related branch entity.
        /// </summary>
        public virtual Sucursal? IdSucursalNavigation { get; set; }

        /// <summary>  
        /// Navigation property to the collection of products supplied by this provider.  
        /// </summary>  
        public virtual ICollection<Producto> Productos { get; set; }
    }
}
