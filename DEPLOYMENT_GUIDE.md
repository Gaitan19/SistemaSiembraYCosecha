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
El proyecto ya está configurado con la cadena de conexión de Somee.com:

```json
{
  "ConnectionStrings": {
    "cadenaSQL": "workstation id=DBREACT_VENTA.mssql.somee.com;packet size=4096;user id=vhromero_SQLLogin_1;pwd=m5zmtmub73;data source=DBREACT_VENTA.mssql.somee.com;persist security info=False;initial catalog=DBREACT_VENTA;TrustServerCertificate=True"
  }
}
```

**Importante:** Esta configuración debe mantenerse para el correcto funcionamiento en producción.

## Características Implementadas

### ✅ Compatibilidad Móvil Mejorada
- **Carga optimizada**: Indicador de carga específico para conexiones lentas
- **Meta tags mejorados**: Soporte completo para iOS Safari y navegadores móviles
- **Viewport adaptativo**: Previene zoom no deseado en formularios
- **CSS móvil personalizado**: Optimizaciones específicas para touch e interacciones móviles
- **PWA mejorada**: Manifest actualizado para mejor experiencia de aplicación

### ✅ Responsivo para Todos los Dispositivos
- **Bootstrap/SB-Admin-2**: Framework CSS con 85+ media queries
- **Viewport configurado**: Meta tags mejorados para móviles y tablets
- **Compatible con**: Celulares, tablets, computadoras
- **Soporte alta resolución**: Optimizado para pantallas Retina/HiDPI

### ✅ Conectividad Mejorada
- **Base de datos**: Configuración de producción para Somee.com
- **CORS extendido**: Headers expuestos para mejor compatibilidad
- **Manejo de errores**: Mensajes específicos según el tipo de error de conexión
- **Detección de errores**: Distinción entre errores de servidor, red y credenciales

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

### Problemas de Conectividad/API
1. **Error 500 en login**: Verifica que la cadena de conexión de base de datos esté configurada correctamente
2. **Conexión lenta**: El indicador de carga ayudará a identificar problemas de red
3. **Errores CORS**: Los headers están configurados para máxima compatibilidad

### Problemas Móviles
1. **Página en blanco en móvil**: 
   - Verifica que JavaScript esté habilitado
   - Espera a que aparezca el indicador de carga
   - Asegúrate de tener buena conexión a internet
2. **Zoom no deseado en formularios**: El sistema está optimizado para prevenirlo automáticamente
3. **Problemas de touch**: Los elementos están optimizados para interacciones táctiles (mínimo 44px)

### Verificación General
1. Confirma que todos los archivos se subieron correctamente via FTP
2. Revisa los logs de Somee.com para errores específicos
3. Prueba la aplicación en diferentes dispositivos y navegadores

---
**Fecha:** Septiembre 2024  
**Versión:** .NET 8.0 con React