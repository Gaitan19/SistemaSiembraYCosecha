# Guía de Despliegue para Somee.com

Este documento explica cómo publicar el proyecto **Sistema de Siembra y Cosecha** en Somee.com usando FTP.

## Problema Resuelto

El error original se debía a que FontAwesome incluía miles de archivos SVG (1612+ archivos) que causaban fallos en la subida FTP:
```
Unable to add folder 'wwwroot/vendor/fontawesome-free/svgs/solid' to the Web site.
```

**Solución implementada:** Se modificó el archivo `ReactVentas.csproj` para excluir automáticamente los directorios SVG durante el proceso de publicación, manteniendo solo los archivos CSS y webfonts necesarios.

## Pasos para el Despliegue

### 1. Compilar el Proyecto
```bash
dotnet publish ReactVentas.csproj -c Release -o ./publish
```

### 2. Archivos a Subir via FTP
Después de la compilación, sube **SOLO** el contenido de la carpeta `./publish/` a tu servidor Somee.com:

**Datos FTP:**
- Servidor: `ftp://siembraycosecha.somee.com/www.SiembraYCosecha.somee.com`
- Usuario: `vhromero` 
- Contraseña: `RomeroEspinoza2024@`

### 3. Estructura de Archivos Optimizada
Los archivos FontAwesome incluidos son:
- ✅ `wwwroot/vendor/fontawesome-free/css/` (archivos CSS)
- ✅ `wwwroot/vendor/fontawesome-free/webfonts/` (fuentes web)
- ❌ `svgs/` (excluidos automáticamente)

### 4. Configuración de Base de Datos
Asegúrate de actualizar `appsettings.json` con la cadena de conexión de Somee.com:

```json
{
  "ConnectionStrings": {
    "cadenaSQL": "TU_CADENA_DE_CONEXION_SOMEE"
  }
}
```

## Características Implementadas

### ✅ Responsivo para Todos los Dispositivos
- **Bootstrap/SB-Admin-2**: Framework CSS con 85+ media queries
- **Viewport configurado**: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **Compatible con**: Celulares, tablets, computadoras

### ✅ Sin Pérdida de Funcionalidad
- FontAwesome funcionando con iconos CSS (`fas fa-*`)
- Todas las funcionalidades existentes mantenidas
- Performance optimizada sin archivos innecesarios

## Verificación Post-Despliegue

1. **Iconos FontAwesome**: Verifica que los iconos se muestren correctamente
2. **Responsive Design**: Prueba en diferentes tamaños de pantalla
3. **Funcionalidad**: Confirma que todas las características funcionen

## Troubleshooting

Si experimentas problemas:
1. Verifica que todos los archivos se subieron correctamente
2. Revisa los logs de Somee.com para errores específicos
3. Confirma la configuración de la base de datos

---
**Fecha:** Septiembre 2024  
**Versión:** .NET 8.0 con React