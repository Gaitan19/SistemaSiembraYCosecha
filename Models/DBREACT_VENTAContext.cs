using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ReactVentas.Models
{
    public partial class DBREACT_VENTAContext : DbContext
    {
        public DBREACT_VENTAContext()
        {
        }

        public DBREACT_VENTAContext(DbContextOptions<DBREACT_VENTAContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Categoria> Categoria { get; set; } = null!;
        public virtual DbSet<DetalleVenta> DetalleVenta { get; set; } = null!;
        public virtual DbSet<Egreso> Egresos { get; set; } = null!;
        public virtual DbSet<Ingreso> Ingresos { get; set; } = null!;
        public virtual DbSet<Modulo> Modulo { get; set; } = null!;
        public virtual DbSet<NumeroDocumento> NumeroDocumentos { get; set; } = null!;
        public virtual DbSet<Producto> Productos { get; set; } = null!;
        public virtual DbSet<Proveedor> Proveedores { get; set; } = null!;
        public virtual DbSet<Rol> Rols { get; set; } = null!;
        public virtual DbSet<Sucursal> Sucursales { get; set; } = null!;
        public virtual DbSet<Usuario> Usuarios { get; set; } = null!;
        public virtual DbSet<UsuarioPermiso> UsuarioPermiso { get; set; } = null!;
        public virtual DbSet<Venta> Venta { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.HasKey(e => e.IdCategoria)
                    .HasName("PK__Categori__8A3D240CED1907F1");

                entity.Property(e => e.IdCategoria).HasColumnName("idCategoria");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("descripcion");

                entity.Property(e => e.IdSucursal).HasColumnName("idSucursal");

                entity.Property(e => e.EsActivo).HasColumnName("esActivo");

                entity.Property(e => e.FechaRegistro)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaRegistro")
                    .HasDefaultValueSql("(getdate())");

                entity.HasOne(d => d.IdSucursalNavigation)
                    .WithMany(p => p.Categorias)
                    .HasForeignKey(d => d.IdSucursal)
                    .IsRequired(false)
                    .HasConstraintName("FK__Categoria__idSucursal__48CFD27E");
            });

            modelBuilder.Entity<DetalleVenta>(entity =>
            {
                entity.HasKey(e => e.IdDetalleVenta)
                    .HasName("PK__DetalleV__BFE2843F851DE491");

                entity.Property(e => e.IdDetalleVenta).HasColumnName("idDetalleVenta");

                entity.Property(e => e.Cantidad).HasColumnName("cantidad");

                entity.Property(e => e.IdProducto).HasColumnName("idProducto");

                entity.Property(e => e.IdVenta).HasColumnName("idVenta");

                entity.Property(e => e.Precio)
                    .HasColumnType("decimal(10, 2)")
                    .HasColumnName("precio");

                entity.Property(e => e.Total)
                    .HasColumnType("decimal(10, 2)")
                    .HasColumnName("total");

                entity.HasOne(d => d.IdProductoNavigation)
                    .WithMany(p => p.DetalleVenta)
                    .HasForeignKey(d => d.IdProducto)
                    .HasConstraintName("FK__DetalleVe__idPro__60A75C0F");

                entity.HasOne(d => d.IdVentaNavigation)
                    .WithMany(p => p.DetalleVenta)
                    .HasForeignKey(d => d.IdVenta)
                    .HasConstraintName("FK__DetalleVe__idVen__5FB337D6");
            });

            modelBuilder.Entity<NumeroDocumento>(entity =>
            {
                entity.ToTable("NumeroDocumento");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("id");

                entity.Property(e => e.FechaRegistro)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaRegistro")
                    .HasDefaultValueSql("(getdate())");
            });

            modelBuilder.Entity<Producto>(entity =>
            {
                entity.HasKey(e => e.IdProducto)
                    .HasName("PK__Producto__07F4A132B3DE1441");

                entity.ToTable("Producto");

                entity.Property(e => e.IdProducto).HasColumnName("idProducto");

                entity.Property(e => e.Nombre)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("nombre");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("descripcion");

                entity.Property(e => e.EsActivo).HasColumnName("esActivo");

                entity.Property(e => e.FechaRegistro)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaRegistro")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.IdCategoria).HasColumnName("idCategoria");
                entity.Property(e => e.IdProveedor).HasColumnName("idProveedor");  
                entity.Property(e => e.IdSucursal).HasColumnName("idSucursal");  


                entity.Property(e => e.Precio)
                    .HasColumnType("decimal(10, 2)")
                    .HasColumnName("precio");

                entity.HasOne(d => d.IdCategoriaNavigation)
                    .WithMany(p => p.Productos)
                    .HasForeignKey(d => d.IdCategoria)
                    .HasConstraintName("FK__Producto__idCate__5812160E");

  
                entity.HasOne(d => d.IdProveedorNavigation)  
                    .WithMany(p => p.Productos)  
                    .HasForeignKey(d => d.IdProveedor)  
                    .IsRequired(false)
                    .HasConstraintName("FK__Producto__idProv__45F365D3");

                entity.HasOne(d => d.IdSucursalNavigation)
                    .WithMany(p => p.Productos)
                    .HasForeignKey(d => d.IdSucursal)
                    .IsRequired(false)
                    .HasConstraintName("FK__Producto__idSucursal__47DBAE45");
            });

            modelBuilder.Entity<Proveedor>(entity =>
            {
                entity.HasKey(e => e.IdProveedor)
                    .HasName("PK__Proveedor__3213E83F");

                entity.Property(e => e.IdProveedor).HasColumnName("idProveedor");

                entity.Property(e => e.Nombre)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("nombre");

                entity.Property(e => e.Correo)
                    .HasMaxLength(80)
                    .IsUnicode(false)
                    .HasColumnName("correo");

                entity.Property(e => e.Telefono)
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("telefono");

                entity.Property(e => e.IdSucursal).HasColumnName("idSucursal");

                entity.Property(e => e.EsActivo).HasColumnName("esActivo");

                entity.Property(e => e.FechaRegistro)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaRegistro")
                    .HasDefaultValueSql("(getdate())");

                entity.HasOne(d => d.IdSucursalNavigation)
                    .WithMany(p => p.Proveedores)
                    .HasForeignKey(d => d.IdSucursal)
                    .IsRequired(false)
                    .HasConstraintName("FK__Proveedor__idSucursal__49C3F6B7");
            });

            modelBuilder.Entity<Rol>(entity =>
            {
                entity.HasKey(e => e.IdRol)
                    .HasName("PK__Rol__3C872F76D60D3150");

                entity.ToTable("Rol");

                entity.Property(e => e.IdRol).HasColumnName("idRol");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("descripcion");

                entity.Property(e => e.EsActivo).HasColumnName("esActivo");

                entity.Property(e => e.FechaRegistro)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaRegistro")
                    .HasDefaultValueSql("(getdate())");
            });

            modelBuilder.Entity<Sucursal>(entity =>
            {
                entity.HasKey(e => e.IdSucursal)
                    .HasName("PK__Sucursal__4C2F8B1A6E5D0C22");

                entity.ToTable("Sucursal");

                entity.Property(e => e.IdSucursal).HasColumnName("idSucursal");

                entity.Property(e => e.Departamento)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("departamento");

                entity.Property(e => e.Direccion)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("direccion");

                entity.Property(e => e.EsActivo).HasColumnName("esActivo");

                entity.Property(e => e.FechaRegistro)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaRegistro")
                    .HasDefaultValueSql("(getdate())");
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.IdUsuario)
                    .HasName("PK__Usuario__645723A6E137D226");

                entity.ToTable("Usuario");

                entity.Property(e => e.IdUsuario).HasColumnName("idUsuario");

                entity.Property(e => e.Clave)
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("clave");

                entity.Property(e => e.Correo)
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("correo");

                entity.Property(e => e.EsActivo).HasColumnName("esActivo");

                entity.Property(e => e.IdRol).HasColumnName("idRol");

                entity.Property(e => e.IdSucursal).HasColumnName("idSucursal");

                entity.Property(e => e.Nombre)
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("nombre");

                entity.Property(e => e.Telefono)
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("telefono");

                entity.HasOne(d => d.IdRolNavigation)
                    .WithMany(p => p.Usuarios)
                    .HasForeignKey(d => d.IdRol)
                    .HasConstraintName("FK__Usuario__idRol__3A81B327");

                entity.HasOne(d => d.IdSucursalNavigation)
                    .WithMany(p => p.Usuarios)
                    .HasForeignKey(d => d.IdSucursal)
                    .IsRequired(false)
                    .HasConstraintName("FK__Usuario__idSucursal__3B75D760");
            });

            modelBuilder.Entity<Ingreso>(entity =>
            {
                entity.HasKey(e => e.IdIngreso)
                    .HasName("PK__Ingreso__B4B2A66F9E8B9F1A");

                entity.ToTable("Ingreso");

                entity.Property(e => e.IdIngreso).HasColumnName("idIngreso");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("descripcion");

                entity.Property(e => e.FechaRegistro)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaRegistro")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Monto)
                    .HasColumnType("decimal(10, 2)")
                    .HasColumnName("monto");

                entity.Property(e => e.TipoDinero)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("tipoDinero");

                entity.Property(e => e.IdUsuario).HasColumnName("idUsuario");

                entity.Property(e => e.IdSucursal).HasColumnName("idSucursal");

                entity.Property(e => e.EsActivo)
                    .HasColumnName("esActivo")
                    .HasDefaultValue(true);

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.Ingresos)
                    .HasForeignKey(d => d.IdUsuario)
                    .HasConstraintName("FK__Ingreso__idUsuario__71D1E811");

                entity.HasOne(d => d.IdSucursalNavigation)
                    .WithMany(p => p.Ingresos)
                    .HasForeignKey(d => d.IdSucursal)
                    .IsRequired(false)
                    .HasConstraintName("FK__Ingreso__idSucursal__72C60C4A");
            });

            modelBuilder.Entity<Egreso>(entity =>
            {
                entity.HasKey(e => e.IdEgreso)
                    .HasName("PK__Egreso__B4B2A66F9E8B9F1B");

                entity.ToTable("Egreso");

                entity.Property(e => e.IdEgreso).HasColumnName("idEgreso");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("descripcion");

                entity.Property(e => e.FechaRegistro)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaRegistro")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Monto)
                    .HasColumnType("decimal(10, 2)")
                    .HasColumnName("monto");

                entity.Property(e => e.TipoDinero)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("tipoDinero");

                entity.Property(e => e.IdUsuario).HasColumnName("idUsuario");

                entity.Property(e => e.IdSucursal).HasColumnName("idSucursal");

                entity.Property(e => e.EsActivo)
                    .HasColumnName("esActivo")
                    .HasDefaultValue(true);

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.Egresos)
                    .HasForeignKey(d => d.IdUsuario)
                    .HasConstraintName("FK__Egreso__idUsuario__74AE54BC");

                entity.HasOne(d => d.IdSucursalNavigation)
                    .WithMany(p => p.Egresos)
                    .HasForeignKey(d => d.IdSucursal)
                    .IsRequired(false)
                    .HasConstraintName("FK__Egreso__idSucursal__75A278F5");
            });

            modelBuilder.Entity<Venta>(entity =>
            {
                entity.HasKey(e => e.IdVenta)
                    .HasName("PK__Venta__077D5614D2880592");

                entity.Property(e => e.IdVenta).HasColumnName("idVenta");

                entity.Property(e => e.DocumentoCliente)
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("documentoCliente");

                entity.Property(e => e.FechaRegistro)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaRegistro")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.IdUsuario).HasColumnName("idUsuario");

                entity.Property(e => e.IdSucursal).HasColumnName("idSucursal");

                entity.Property(e => e.NombreCliente)
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("nombreCliente");

                entity.Property(e => e.NumeroDocumento)
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("numeroDocumento");

                entity.Property(e => e.Total)
                    .HasColumnType("decimal(10, 2)")
                    .HasColumnName("total");

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.Venta)
                    .HasForeignKey(d => d.IdUsuario)
                    .HasConstraintName("FK__Venta__idUsuario__5CD6CB2B");

                entity.HasOne(d => d.IdSucursalNavigation)
                    .WithMany(p => p.Ventas)
                    .HasForeignKey(d => d.IdSucursal)
                    .IsRequired(false)
                    .HasConstraintName("FK__Venta__idSucursal__5DCAEF64");
            });

            modelBuilder.Entity<Modulo>(entity =>
            {
                entity.HasKey(e => e.IdModulo);

                entity.Property(e => e.IdModulo).HasColumnName("idModulo");

                entity.Property(e => e.Nombre)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("nombre");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("descripcion");

                entity.Property(e => e.EsActivo)
                    .HasDefaultValue(true)
                    .HasColumnName("esActivo");

                entity.Property(e => e.FechaRegistro)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnName("fechaRegistro");
            });

            modelBuilder.Entity<UsuarioPermiso>(entity =>
            {
                entity.HasKey(e => e.IdUsuarioPermiso);

                entity.HasIndex(e => new { e.IdUsuario, e.IdModulo })
                    .IsUnique();

                entity.Property(e => e.IdUsuarioPermiso).HasColumnName("idUsuarioPermiso");

                entity.Property(e => e.IdUsuario).HasColumnName("idUsuario");

                entity.Property(e => e.IdModulo).HasColumnName("idModulo");

                entity.Property(e => e.TienePermiso)
                    .HasDefaultValue(false)
                    .HasColumnName("tienePermiso");

                entity.Property(e => e.FechaRegistro)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnName("fechaRegistro");

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.UsuarioPermisos)
                    .HasForeignKey(d => d.IdUsuario)
                    .HasConstraintName("FK__UsuarioPermiso__idUsuario");

                entity.HasOne(d => d.IdModuloNavigation)
                    .WithMany(p => p.UsuarioPermisos)
                    .HasForeignKey(d => d.IdModulo)
                    .HasConstraintName("FK__UsuarioPermiso__idModulo");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
