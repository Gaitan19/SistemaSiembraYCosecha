using System;
using System.Collections.Generic;

namespace ReactVentas.Models
{
    /// <summary>
    /// Represents a branch (sucursal) entity in the system, containing branch details such as department, address, and status.
    /// </summary>
    public partial class Sucursal
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Sucursal"/> class.
        /// Sets up the collections associated with this branch.
        /// </summary>
        public Sucursal()
        {
            Usuarios = new HashSet<Usuario>();
            Productos = new HashSet<Producto>();
            Ventas = new HashSet<Venta>();
            Ingresos = new HashSet<Ingreso>();
            Egresos = new HashSet<Egreso>();
            Proveedores = new HashSet<Proveedor>();
            Categorias = new HashSet<Categoria>();
            NumeroDocumentos = new HashSet<NumeroDocumento>();
        }

        /// <summary>
        /// Gets or sets the unique identifier for the branch.
        /// </summary>
        public int IdSucursal { get; set; }

        /// <summary>
        /// Gets or sets the department name of the branch.
        /// Optional field.
        /// </summary>
        public string? Departamento { get; set; }

        /// <summary>
        /// Gets or sets the address of the branch.
        /// Optional field.
        /// </summary>
        public string? Direccion { get; set; }

        /// <summary>
        /// Gets or sets the active status of the branch.
        /// Optional field. A value of true indicates the branch is active.
        /// </summary>
        public bool? EsActivo { get; set; }

        /// <summary>
        /// Gets or sets the registration date of the branch.
        /// </summary>
        public DateTime FechaRegistro { get; set; }

        /// <summary>
        /// Navigation property to the collection of users associated with the branch.
        /// </summary>
        public virtual ICollection<Usuario> Usuarios { get; set; }

        /// <summary>
        /// Navigation property to the collection of products associated with the branch.
        /// </summary>
        public virtual ICollection<Producto> Productos { get; set; }

        /// <summary>
        /// Navigation property to the collection of sales associated with the branch.
        /// </summary>
        public virtual ICollection<Venta> Ventas { get; set; }

        /// <summary>
        /// Navigation property to the collection of income records associated with the branch.
        /// </summary>
        public virtual ICollection<Ingreso> Ingresos { get; set; }

        /// <summary>
        /// Navigation property to the collection of expense records associated with the branch.
        /// </summary>
        public virtual ICollection<Egreso> Egresos { get; set; }

        /// <summary>
        /// Navigation property to the collection of suppliers associated with the branch.
        /// </summary>
        public virtual ICollection<Proveedor> Proveedores { get; set; }

        /// <summary>
        /// Navigation property to the collection of categories associated with the branch.
        /// </summary>
        public virtual ICollection<Categoria> Categorias { get; set; }

        /// <summary>
        /// Navigation property to the collection of document numbers associated with the branch.
        /// </summary>
        public virtual ICollection<NumeroDocumento> NumeroDocumentos { get; set; }
    }
}