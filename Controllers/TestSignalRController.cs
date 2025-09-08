using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ReactVentas.Hubs;

namespace ReactVentas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestSignalRController : ControllerBase
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public TestSignalRController(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost("test-categoria-created")]
        public async Task<IActionResult> TestCategoriaCreated()
        {
            var testCategoria = new
            {
                idCategoria = 999,
                descripcion = "Categoría de Prueba SignalR",
                esActivo = true
            };

            await _hubContext.Clients.Group("FerreteriaSistema").SendAsync("CategoriaCreated", testCategoria);
            return Ok("Notification sent");
        }

        [HttpPost("test-producto-created")]
        public async Task<IActionResult> TestProductoCreated()
        {
            var testProducto = new
            {
                idProducto = 999,
                nombre = "Producto de Prueba SignalR",
                precio = 99.99,
                stock = 10,
                esActivo = true
            };

            await _hubContext.Clients.Group("FerreteriaSistema").SendAsync("ProductoCreated", testProducto);
            return Ok("Notification sent");
        }

        [HttpPost("test-venta-created")]
        public async Task<IActionResult> TestVentaCreated()
        {
            var testVenta = new
            {
                numeroDocumento = "V00999",
                cliente = "Cliente de Prueba SignalR",
                total = 199.99,
                fecha = DateTime.Now
            };

            await _hubContext.Clients.Group("FerreteriaSistema").SendAsync("VentaCreated", testVenta);
            return Ok("Notification sent");
        }

        [HttpGet("connection-test")]
        public IActionResult ConnectionTest()
        {
            return Ok(new { message = "SignalR Hub is working!", timestamp = DateTime.Now });
        }
    }
}