using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactVentas.Models;
using ReactVentas.Models.DTO;

namespace ReactVentas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UtilidadController : ControllerBase
    {
        private readonly DBREACT_VENTAContext _context;

        public UtilidadController(DBREACT_VENTAContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("Dashboard")]
        public async Task<IActionResult> Dashboard(
            string? dateRange = "Esta semana",
            string? startDate = null,
            string? endDate = null,
            string? productSort = "most"
        )
        {
            // Initialize a new dashboard configuration object.
            DtoDashboard config = new DtoDashboard();

            // Calculate date ranges based on parameters
            DateTime fecha, fecha2;
            
            if (dateRange == "Elegir rango" && !string.IsNullOrEmpty(startDate) && !string.IsNullOrEmpty(endDate))
            {
                fecha = DateTime.ParseExact(startDate, "yyyy-MM-dd", null);
                fecha2 = DateTime.ParseExact(endDate, "yyyy-MM-dd", null);
            }
            else if (dateRange == "Este mes")
            {
                var today = DateTime.Now;
                fecha = new DateTime(today.Year, today.Month, 1);
                fecha2 = today;
            }
            else // Default: "Esta semana"
            {
                fecha2 = DateTime.Now;
                fecha = fecha2.AddDays(-7);
            }

            // For total stats, we'll use a 30-day period regardless of chart filters
            DateTime fechaStats = DateTime.Now.AddDays(-30);

            try
            {
                // Calculate total sales in the last 30 days.
                config.TotalVentas = _context.Venta
                    .Where(v => v.FechaRegistro >= fechaStats)
                    .Count()
                    .ToString();

                // Calculate total revenue in the last 30 days.
                config.TotalIngresos = _context.Venta
                    .Where(v => v.FechaRegistro >= fechaStats)
                    .Sum(v => v.Total)
                    .ToString();

                // Calculate the total number of active products.
                config.TotalProductos = _context.Productos
                    .Where(p => p.EsActivo == true)
                    .Count()
                    .ToString();

                // Calculate the total number of active categories.
                config.TotalCategorias = _context.Categoria
                    .Where(c => c.EsActivo == true)
                    .Count()
                    .ToString();

                // Get products sold based on the specified date range and sort order
                var productQueryBase = from p in _context.Productos
                                       join d in _context.DetalleVenta on p.IdProducto equals d.IdProducto
                                       join v in _context.Venta on d.IdVenta equals v.IdVenta
                                       where v.FechaRegistro >= fecha && v.FechaRegistro <= fecha2
                                       group p by p.Descripcion into g
                                       select new 
                                       {
                                           Producto = g.Key,
                                           Count = g.Count()
                                       };

                // Apply sorting based on productSort parameter
                if (productSort == "least")
                {
                    config.ProductosVendidos = productQueryBase
                        .OrderBy(p => p.Count)
                        .Take(4)
                        .Select(p => new DtoProductoVendidos
                        {
                            Producto = p.Producto,
                            Total = p.Count.ToString()
                        })
                        .ToList();
                }
                else // "most" (default)
                {
                    config.ProductosVendidos = productQueryBase
                        .OrderByDescending(p => p.Count)
                        .Take(4)
                        .Select(p => new DtoProductoVendidos
                        {
                            Producto = p.Producto,
                            Total = p.Count.ToString()
                        })
                        .ToList();
                }

                // Get sales count grouped by day for the specified date range
                config.VentasporDias = (from v in _context.Venta
                                        where v.FechaRegistro.Value.Date >= fecha.Date && v.FechaRegistro.Value.Date <= fecha2.Date
                                        group v by v.FechaRegistro.Value.Date into g
                                        orderby g.Key ascending
                                        select new DtoVentasDias { Fecha = g.Key.ToString("dd/MM/yyyy"), Total = g.Count().ToString() })
                                        .ToList();

                // Return the dashboard configuration with a 200 OK status.
                return StatusCode(StatusCodes.Status200OK, config);
            }
            catch (Exception ex)
            {
                // Return a 500 Internal Server Error status if an exception occurs.
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = ex.Message });
            }
        }
    }
}
