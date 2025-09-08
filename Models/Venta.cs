using System;
using System.Collections.Generic;

namespace ReactVentas.Models
{
    /// <summary>
    /// Represents a sales transaction in the system, including details like document type, customer information, and totals.
    /// </summary>
    public partial class Venta
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Venta"/> class.
        /// Sets up the collection of sale details (DetalleVenta) associated with this transaction.
        /// </summary>
        public Venta()
        {
            DetalleVenta = new HashSet<DetalleVenta>();
        }

        /// <summary>
        /// Gets or sets the unique identifier for the sale.
        /// </summary>
        public int IdVenta { get; set; }

        /// <summary>
        /// Gets or sets the document number for the sale.
        /// Optional field.
        /// </summary>
        public string? NumeroDocumento { get; set; }



        /// <summary>
        /// Gets or sets the date and time when the sale was registered.
        /// Optional field.
        /// </summary>
        public DateTime? FechaRegistro { get; set; }

        /// <summary>
        /// Gets or sets the identifier of the user who registered the sale.
        /// Optional field.
        /// </summary>
        public int? IdUsuario { get; set; }

        /// <summary>
        /// Gets or sets the client's document number (e.g., tax ID).
        /// Optional field.
        /// </summary>
        public string? DocumentoCliente { get; set; }

        /// <summary>
        /// Gets or sets the client's name.
        /// Optional field.
        /// </summary>
        public string? NombreCliente { get; set; }





        /// <summary>
        /// Gets or sets the total amount for the sale, including taxes.
        /// Optional field.
        /// </summary>
        public decimal? Total { get; set; }

        /// <summary>
        /// Gets or sets the payment type for the sale (Efectivo, Transferencia).
        /// Optional field.
        /// </summary>
        public string? TipoPago { get; set; }

        /// <summary>
        /// Gets or sets the currency type for the sale (Cordobas, Dolares).
        /// Optional field.
        /// </summary>
        public string? TipoDinero { get; set; }

        /// <summary>
        /// Gets or sets the client's RUC number.
        /// Optional field.
        /// </summary>
        public string? NumeroRuc { get; set; }

        /// <summary>
        /// Gets or sets the amount paid by the customer.
        /// Optional field.
        /// </summary>
        public decimal? MontoPago { get; set; }

        /// <summary>
        /// Gets or sets the change amount given to the customer.
        /// Optional field.
        /// </summary>
        public decimal? Vuelto { get; set; }

        /// <summary>
        /// Navigation property to the user associated with this sale.
        /// </summary>
        public virtual Usuario? IdUsuarioNavigation { get; set; }

        /// <summary>
        /// Navigation property to the collection of sale details associated with this sale.
        /// </summary>
        public virtual ICollection<DetalleVenta> DetalleVenta { get; set; }
    }
}
