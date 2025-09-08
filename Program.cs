using Microsoft.EntityFrameworkCore;
using ReactVentas.Models;
using Microsoft.AspNetCore.ResponseCompression;
using ReactVentas.Services;
using ReactVentas.Interfaces;
using ReactVentas.Repositories;
using ReactVentas.Hubs;
using Microsoft.AspNetCore.Http.Connections;
using System.IO.Compression;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<DBREACT_VENTAContext>(options => {
    options.UseSqlServer(builder.Configuration.GetConnectionString("cadenaSQL"));
});

// Configuración CORS mejorada
builder.Services.AddCors(options =>
{
    options.AddPolicy("SignalRPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetIsOriginAllowed(_ => true);
    });
});

// Configuración avanzada de SignalR - CORREGIDO
builder.Services.AddSignalR()
    .AddJsonProtocol(options => {
        options.PayloadSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    })
    .AddHubOptions<NotificationHub>(hubOptions =>
    {
        hubOptions.EnableDetailedErrors = builder.Environment.IsDevelopment();
        hubOptions.KeepAliveInterval = TimeSpan.FromSeconds(15);
        hubOptions.ClientTimeoutInterval = TimeSpan.FromMinutes(2);
        hubOptions.HandshakeTimeout = TimeSpan.FromSeconds(15);
    });

// Configuración mejorada de compresión de respuesta
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
    options.Providers.Add<BrotliCompressionProvider>();
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
        new[] {
            "application/octet-stream",  // Para SignalR
            "text/plain",
            "text/css",
            "application/javascript",
            "text/html",
            "application/xml",
            "text/xml",
            "application/json",
            "text/json"
        });
});

builder.Services.Configure<GzipCompressionProviderOptions>(options =>
{
    options.Level = CompressionLevel.Optimal;
});

// Registrar servicio de contraseñas
builder.Services.AddScoped<IPasswordService, PasswordService>();

// Registrar repositorios
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();
builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IProveedorRepository, ProveedorRepository>();
builder.Services.AddScoped<IRolRepository, RolRepository>();
builder.Services.AddScoped<IIngresoRepository, IngresoRepository>();
builder.Services.AddScoped<IEgresoRepository, EgresoRepository>();
builder.Services.AddScoped<IModuloRepository, ModuloRepository>();
builder.Services.AddScoped<IUsuarioPermisoRepository, UsuarioPermisoRepository>();

builder.Services.AddControllers().AddJsonOptions(option =>
{
    option.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Habilitar compresión de respuesta
app.UseResponseCompression();

// Habilitar HTTPS Redirection
app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseRouting();

// Aplicar política CORS
app.UseCors("SignalRPolicy");

// Configuración de endpoints
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();

    // Configurar hub con transporte explícito
    endpoints.MapHub<NotificationHub>("/notificationHub", options =>
    {
        options.Transports =
            HttpTransportType.WebSockets |
            HttpTransportType.LongPolling;
    });
});

app.MapFallbackToFile("index.html");

app.Run();