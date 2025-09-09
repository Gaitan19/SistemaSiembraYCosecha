using System;
using System.Collections.Generic;

namespace ReactVentas.Models
{
    /// <summary>
    /// Represents a document number entity that tracks registration dates and sequential numbering per branch.
    /// </summary>
    public partial class NumeroDocumento
    {
        /// <summary>
        /// Gets or sets the unique identifier for the document number.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the identifier for the branch where the document number sequence is maintained.
        /// Optional field.
        /// </summary>
        public int? IdSucursal { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the document number was registered.
        /// Optional field.
        /// </summary>
        public DateTime? FechaRegistro { get; set; }

        /// <summary>
        /// Navigation property to the related branch entity.
        /// </summary>
        public virtual Sucursal? IdSucursalNavigation { get; set; }
    }
}
