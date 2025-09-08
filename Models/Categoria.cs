using System;
using System.Collections.Generic;

namespace ReactVentas.Models
{
    /// <summary>
    /// Represents a category entity for products.
    /// </summary>
    public partial class Categoria
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Categoria"/> class.
        /// Sets up a collection of related products.
        /// </summary>
        public Categoria()
        {
            Productos = new HashSet<Producto>();
        }

        /// <summary>
        /// Gets or sets the unique identifier for the category.
        /// </summary>
        public int IdCategoria { get; set; }

        /// <summary>
        /// Gets or sets the description of the category.
        /// Optional field.
        /// </summary>
        public string? Descripcion { get; set; }

        /// <summary>
        /// Gets or sets the active status of the category.
        /// Optional field. A value of true indicates the category is active.
        /// </summary>
        public bool? EsActivo { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the category was registered.
        /// Optional field.
        /// </summary>
        public DateTime? FechaRegistro { get; set; }

        /// <summary>
        /// Navigation property that represents the collection of products related to this category.
        /// </summary>
        public virtual ICollection<Producto> Productos { get; set; }
    }
}
