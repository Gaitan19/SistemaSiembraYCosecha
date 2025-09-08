using System;
using System.Collections.Generic;

namespace ReactVentas.Models
{
    /// <summary>
    /// Represents a product entity with details such as code, name, brand, description, category, and stock.
    /// </summary>
    public partial class Producto
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Producto"/> class.
        /// Sets up the collection of sale details (DetalleVenta) associated with this product.
        /// </summary>
        public Producto()
        {
            DetalleVenta = new HashSet<DetalleVenta>();
        }

        /// <summary>
        /// Gets or sets the unique identifier for the product.
        /// </summary>
        public int IdProducto { get; set; }



        /// <summary>
        /// Gets or sets the name of the product.
        /// Optional field.
        /// </summary>
        public string? Nombre { get; set; }



        /// <summary>
        /// Gets or sets the description of the product.
        /// Optional field.
        /// </summary>
        public string? Descripcion { get; set; }

        /// <summary>
        /// Gets or sets the identifier for the category to which the product belongs.
        /// Optional field.
        /// </summary>
        public int? IdCategoria { get; set; }

        /// <summary>  
        /// Gets or sets the identifier for the supplier of the product.  
        /// Optional field.  
        /// </summary>  
        public int? IdProveedor { get; set; }



        /// <summary>
        /// Gets or sets the price of the product.
        /// Optional field.
        /// </summary>
        public decimal? Precio { get; set; }

        /// <summary>
        /// Gets or sets the active status of the product.
        /// Optional field. A value of true indicates the product is active.
        /// </summary>
        public bool? EsActivo { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the product was registered.
        /// Optional field.
        /// </summary>
        public DateTime? FechaRegistro { get; set; }

        /// <summary>
        /// Navigation property to the related category entity.
        /// </summary>
        public virtual Categoria? IdCategoriaNavigation { get; set; }

        /// <summary>  
        /// Navigation property to the related supplier entity.  
        /// </summary>  
        public virtual Proveedor? IdProveedorNavigation { get; set; }

        /// <summary>
        /// Navigation property to the collection of sale details associated with the product.
        /// </summary>
        public virtual ICollection<DetalleVenta> DetalleVenta { get; set; }
    }
}
