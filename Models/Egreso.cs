using System;
using System.Collections.Generic;

namespace ReactVentas.Models
{
    public partial class Egreso
    {
        public int IdEgreso { get; set; }
        public string? Descripcion { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public decimal? Monto { get; set; }
        public string? TipoPago { get; set; }
        public string? TipoDinero { get; set; }
        public int? IdUsuario { get; set; }
        public int? IdSucursal { get; set; }
        public bool? EsActivo { get; set; }

        public virtual Usuario? IdUsuarioNavigation { get; set; }
        public virtual Sucursal? IdSucursalNavigation { get; set; }
    }
}