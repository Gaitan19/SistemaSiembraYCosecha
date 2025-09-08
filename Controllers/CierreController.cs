using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactVentas.Models;
using ReactVentas.Models.DTO;
using ReactVentas.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ReactVentas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CierreController : ControllerBase
    {
        private readonly IIngresoRepository _ingresoRepository;
        private readonly IEgresoRepository _egresoRepository;

        public CierreController(IIngresoRepository ingresoRepository, IEgresoRepository egresoRepository)
        {
            _ingresoRepository = ingresoRepository;
            _egresoRepository = egresoRepository;
        }

        [HttpGet]
        [Route("Calcular")]
        public async Task<IActionResult> CalcularCierre(
            [FromQuery] string fechaInicio,
            [FromQuery] string fechaFin,
            [FromQuery] string tipoPago,
            [FromQuery] string tipoDinero)
        {
            try
            {
                // Parse the dates
                if (!DateTime.TryParseExact(fechaInicio, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out DateTime startDate) ||
                    !DateTime.TryParseExact(fechaFin, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out DateTime endDate))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Formato de fecha inválido. Use dd/MM/yyyy");
                }

                // Adjust end date to include the entire day
                endDate = endDate.Date.AddDays(1).AddSeconds(-1);

                // Get context for raw queries
                var ingresoContext = _ingresoRepository.GetContext();
                var egresoContext = _egresoRepository.GetContext();

                // Query filtered Ingresos
                var ingresosQuery = from i in ingresoContext.Ingresos
                                   join u in ingresoContext.Usuarios on i.IdUsuario equals u.IdUsuario
                                   where i.EsActivo == true &&
                                         i.FechaRegistro >= startDate &&
                                         i.FechaRegistro <= endDate &&
                                         i.TipoPago == tipoPago &&
                                         i.TipoDinero == tipoDinero
                                   orderby i.FechaRegistro descending
                                   select new DtoIngresoFiltrado
                                   {
                                       IdIngreso = i.IdIngreso,
                                       Descripcion = i.Descripcion ?? "",
                                       FechaRegistro = i.FechaRegistro.HasValue ? i.FechaRegistro.Value.ToString("dd/MM/yyyy HH:mm") : "",
                                       Monto = i.Monto.HasValue ? i.Monto.Value.ToString("F2") : "0.00",
                                       TipoPago = i.TipoPago ?? "",
                                       TipoDinero = i.TipoDinero ?? "",
                                       NombreUsuario = u.Nombre ?? ""
                                   };

                // Query filtered Egresos
                var egresosQuery = from e in egresoContext.Egresos
                                  join u in egresoContext.Usuarios on e.IdUsuario equals u.IdUsuario
                                  where e.EsActivo == true &&
                                        e.FechaRegistro >= startDate &&
                                        e.FechaRegistro <= endDate &&
                                        e.TipoPago == tipoPago &&
                                        e.TipoDinero == tipoDinero
                                  orderby e.FechaRegistro descending
                                  select new DtoEgresoFiltrado
                                  {
                                      IdEgreso = e.IdEgreso,
                                      Descripcion = e.Descripcion ?? "",
                                      FechaRegistro = e.FechaRegistro.HasValue ? e.FechaRegistro.Value.ToString("dd/MM/yyyy HH:mm") : "",
                                      Monto = e.Monto.HasValue ? e.Monto.Value.ToString("F2") : "0.00",
                                      TipoPago = e.TipoPago ?? "",
                                      TipoDinero = e.TipoDinero ?? "",
                                      NombreUsuario = u.Nombre ?? ""
                                  };

                // Execute queries
                var ingresos = await ingresosQuery.ToListAsync();
                var egresos = await egresosQuery.ToListAsync();

                // Calculate totals
                var totalIngresos = ingresos.Sum(i => decimal.Parse(i.Monto));
                var totalEgresos = egresos.Sum(e => decimal.Parse(e.Monto));
                var saldoCierre = totalIngresos - totalEgresos;

                // Get currency symbol
                var monedaSimbolo = tipoDinero == "Dolares" ? "$" : "C$";

                var resultado = new DtoCierre
                {
                    TotalIngresos = totalIngresos,
                    TotalEgresos = totalEgresos,
                    SaldoCierre = saldoCierre,
                    MonedaSimbolo = monedaSimbolo,
                    Ingresos = ingresos,
                    Egresos = egresos
                };

                return StatusCode(StatusCodes.Status200OK, resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }
    }
}