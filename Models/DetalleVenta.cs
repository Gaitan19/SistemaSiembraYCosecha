using System;
using System.Collections.Generic;

namespace ReactVentas.Models
{
    /// <summary>
    /// Represents the details of a sale transaction.
    /// </summary>
    public partial class DetalleVenta
    {
        /// <summary>
        /// Gets or sets the unique identifier for the sale detail.
        /// </summary>
        public int IdDetalleVenta { get; set; }

        /// <summary>
        /// Gets or sets the identifier for the sale to which this detail belongs.
        /// Optional field.
        /// </summary>
        public int? IdVenta { get; set; }

        /// <summary>
        /// Gets or sets the identifier for the product in the sale.
        /// Optional field.
        /// </summary>
        public int? IdProducto { get; set; }

        /// <summary>
        /// Gets or sets the quantity of the product in the sale.
        /// Optional field.
        /// </summary>
        public int? Cantidad { get; set; }

        /// <summary>
        /// Gets or sets the price of the product at the time of the sale.
        /// Optional field.
        /// </summary>
        public decimal? Precio { get; set; }

        /// <summary>
        /// Gets or sets the total amount for this sale detail (quantity * price).
        /// Optional field.
        /// </summary>
        public decimal? Total { get; set; }

        /// <summary>
        /// Navigation property to the related product entity.
        /// </summary>
        public virtual Producto? IdProductoNavigation { get; set; }

        /// <summary>
        /// Navigation property to the related sale entity.
        /// </summary>
        public virtual Venta? IdVentaNavigation { get; set; }
    }
}
