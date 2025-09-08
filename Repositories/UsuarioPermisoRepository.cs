using Microsoft.EntityFrameworkCore;
using ReactVentas.Interfaces;
using ReactVentas.Models;
using ReactVentas.Models.DTO;

namespace ReactVentas.Repositories
{
    public class UsuarioPermisoRepository : BaseRepository<UsuarioPermiso>, IUsuarioPermisoRepository
    {
        public UsuarioPermisoRepository(DBREACT_VENTAContext context) : base(context)
        {
        }

        public async Task<List<UsuarioPermiso>> GetPermisosByUsuarioAsync(int idUsuario)
        {
            return await _dbSet
                .Include(up => up.IdModuloNavigation)
                .Where(up => up.IdUsuario == idUsuario)
                .ToListAsync();
        }

        public async Task<List<DtoUsuarioPermiso>> GetPermisosAllUsuariosEmpleadosAsync()
        {
            var usuariosEmpleados = await _context.Usuarios
                .Include(u => u.IdRolNavigation)
                .Include(u => u.UsuarioPermisos)
                    .ThenInclude(up => up.IdModuloNavigation)
                .Where(u => u.IdRolNavigation != null && u.IdRolNavigation.Descripcion == "Empleado")
                .ToListAsync();

            var resultado = new List<DtoUsuarioPermiso>();

            foreach (var usuario in usuariosEmpleados)
            {
                var dtoUsuario = new DtoUsuarioPermiso
                {
                    IdUsuario = usuario.IdUsuario,
                    NombreUsuario = usuario.Nombre ?? "",
                    Permisos = new List<DtoModuloPermiso>()
                };

                var modulos = await _context.Modulo
                    .Where(m => m.EsActivo == true)
                    .OrderBy(m => m.Nombre)
                    .ToListAsync();

                foreach (var modulo in modulos)
                {
                    var permiso = usuario.UsuarioPermisos
                        .FirstOrDefault(up => up.IdModulo == modulo.IdModulo);

                    dtoUsuario.Permisos.Add(new DtoModuloPermiso
                    {
                        IdModulo = modulo.IdModulo,
                        NombreModulo = modulo.Nombre ?? "",
                        DescripcionModulo = modulo.Descripcion ?? "",
                        TienePermiso = permiso?.TienePermiso ?? false
                    });
                }

                resultado.Add(dtoUsuario);
            }

            return resultado;
        }

        public async Task<bool> ActualizarPermisosUsuarioAsync(DtoActualizarPermisos permisos)
        {
            try
            {
                foreach (var permiso in permisos.Permisos)
                {
                    var usuarioPermiso = await _dbSet
                        .FirstOrDefaultAsync(up => up.IdUsuario == permisos.IdUsuario && up.IdModulo == permiso.IdModulo);

                    if (usuarioPermiso != null)
                    {
                        usuarioPermiso.TienePermiso = permiso.TienePermiso;
                        _context.Update(usuarioPermiso);
                    }
                    else
                    {
                        // Si no existe el permiso, crear uno nuevo
                        var nuevoPermiso = new UsuarioPermiso
                        {
                            IdUsuario = permisos.IdUsuario,
                            IdModulo = permiso.IdModulo,
                            TienePermiso = permiso.TienePermiso,
                            FechaRegistro = DateTime.Now
                        };
                        await _dbSet.AddAsync(nuevoPermiso);
                    }
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<DtoPermisoUsuario> GetPermisosUsuarioAsync(int idUsuario)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.IdRolNavigation)
                .Include(u => u.UsuarioPermisos)
                    .ThenInclude(up => up.IdModuloNavigation)
                .FirstOrDefaultAsync(u => u.IdUsuario == idUsuario);

            if (usuario == null)
            {
                return new DtoPermisoUsuario();
            }

            var resultado = new DtoPermisoUsuario
            {
                EsAdministrador = usuario.IdRolNavigation?.Descripcion == "Administrador"
            };

            if (resultado.EsAdministrador)
            {
                // Si es administrador, tiene acceso a todos los módulos
                var todosModulos = await _context.Modulo
                    .Where(m => m.EsActivo == true)
                    .Select(m => m.Nombre)
                    .ToListAsync();
                
                resultado.ModulosPermitidos = todosModulos.Where(m => m != null).Cast<string>().ToList();
            }
            else
            {
                // Si es empleado, solo los módulos con permiso
                resultado.ModulosPermitidos = usuario.UsuarioPermisos
                    .Where(up => up.TienePermiso == true && up.IdModuloNavigation?.EsActivo == true)
                    .Select(up => up.IdModuloNavigation?.Nombre)
                    .Where(nombre => nombre != null)
                    .Cast<string>()
                    .ToList();
            }

            return resultado;
        }

        public async Task CrearPermisosIniciales(int idUsuario)
        {
            // Crear permisos iniciales para un nuevo usuario empleado
            var modulos = await _context.Modulo
                .Where(m => m.EsActivo == true)
                .ToListAsync();

            foreach (var modulo in modulos)
            {
                var permisoExiste = await _dbSet
                    .AnyAsync(up => up.IdUsuario == idUsuario && up.IdModulo == modulo.IdModulo);

                if (!permisoExiste)
                {
                    var permiso = new UsuarioPermiso
                    {
                        IdUsuario = idUsuario,
                        IdModulo = modulo.IdModulo,
                        TienePermiso = modulo.Nombre == "ventas" || modulo.Nombre == "historialventas", // Solo ventas por defecto
                        FechaRegistro = DateTime.Now
                    };
                    await _dbSet.AddAsync(permiso);
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}