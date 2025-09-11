# Guía de Despliegue para Somee.com

## Cambios Realizados para Mejorar la Compatibilidad Móvil

### 1. Correcciones de JavaScript
- ✅ Corregido error en `sb-admin-2.js` que causaba que la aplicación no cargara en móviles
- ✅ Agregado manejo de eventos para parámetro `e` faltante en funciones de jQuery
- ✅ Añadidos polyfills para compatibilidad con navegadores móviles antiguos

### 2. Mejoras de CSS Responsivo
- ✅ Agregados estilos específicos para móviles en `mobile-fixes.css`
- ✅ Mejorada la navegación lateral para dispositivos móviles
- ✅ Botones y elementos táctiles optimizados (min-height: 44px)
- ✅ Sidebar con overlay para mejor experiencia móvil
- ✅ Estilos para diferentes tamaños de pantalla (768px, 480px)

### 3. Mejoras en index.html
- ✅ Meta tags optimizados para móviles
- ✅ Soporte para PWA (Progressive Web App)
- ✅ Theme colors para navegadores móviles
- ✅ Apple Touch Icons
- ✅ Viewport mejorado con user-scalable

### 4. Compatibilidad de Navegadores
- ✅ Polyfills para Array.includes y Object.assign
- ✅ Manejo global de errores para evitar crashes
- ✅ Soporte para eventos táctiles
- ✅ Prevención de zoom involuntario en iOS

## Pasos para Desplegar en Somee.com

### Paso 1: Preparar la Aplicación
```bash
cd ClientApp
npm run build
```

### Paso 2: Preparar Archivos para Despliegue
Los archivos que se deben subir al FTP están en:
- `ClientApp/build/` - Archivos estáticos del frontend React
- Archivos .NET del backend (todos los archivos .cs, .csproj, etc.)

### Paso 3: Configuración de Conexión FTP
- **Servidor FTP**: ftp://siembracosecha.somee.com/www.siembraCosecha.somee.com
- **Usuario**: kenley1906
- **Contraseña**: kenleyG#1906

### Paso 4: Estructura de Archivos en el Servidor
```
www.siembraCosecha.somee.com/
├── wwwroot/
│   ├── static/ (desde ClientApp/build/static/)
│   ├── index.html (desde ClientApp/build/)
│   ├── manifest.json
│   ├── css/
│   ├── js/
│   ├── vendor/
│   └── imagen/
├── Controllers/
├── Models/
├── Services/
├── Repositories/
├── Program.cs
├── ReactVentas.csproj
└── appsettings.json
```

### Paso 5: Comandos para Despliegue

1. **Construir la aplicación**:
```bash
dotnet publish -c Release -o ./publish
```

2. **Subir archivos al FTP**:
   - Copiar todo el contenido de `ClientApp/build/` a `wwwroot/`
   - Copiar archivos del backend (.NET) a la raíz del sitio
   - Asegurar que `web.config` esté configurado correctamente

### Paso 6: Verificación Post-Despliegue

#### Pruebas de Escritorio
- ✅ Navegación lateral funciona
- ✅ Todas las funcionalidades existentes preservadas
- ✅ Login y autenticación funcionan

#### Pruebas Móviles (Crítico)
- ✅ La aplicación carga completamente en móviles
- ✅ No más pantalla blanca en dispositivos móviles
- ✅ Navegación lateral responsive funciona
- ✅ Botones son táctiles y del tamaño adecuado
- ✅ Formularios son utilizables en móviles
- ✅ Tablas tienen scroll horizontal
- ✅ Modales se ajustan a pantallas pequeñas

### Configuración Adicional Requerida

#### web.config para IIS (crear en la raíz si no existe):
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>
  </system.webServer>
</configuration>
```

## Características Móviles Implementadas

### Navegación Móvil
- Sidebar que se desliza desde la izquierda
- Overlay oscuro cuando el menú está abierto
- Botón hamburguesa en la parte superior para abrir/cerrar
- Cierre automático al tocar fuera del menú

### Elementos Táctiles
- Todos los botones tienen mínimo 44px de altura
- Área de toque ampliada para mejor usabilidad
- Feedback visual al tocar elementos

### Formularios Móviles
- Inputs con tamaño de fuente 16px para evitar zoom en iOS
- Campos de formulario optimizados para móviles
- Botones de envío accesibles y del tamaño adecuado

### Tablas Responsivas
- Scroll horizontal automático en pantallas pequeñas
- Headers ocultos en pantallas muy pequeñas
- Contenido optimizado para lectura móvil

## Solución de Problemas

### Si la aplicación sigue mostrando pantalla blanca en móviles:
1. Verificar que todos los archivos JavaScript se hayan subido correctamente
2. Revisar la consola del navegador móvil para errores JavaScript
3. Asegurar que el `web.config` esté configurado para SPAs
4. Verificar que la ruta base sea correcta en `index.html`

### Si la navegación no funciona en móviles:
1. Verificar que jQuery esté cargando correctamente
2. Revisar que `sb-admin-2.js` se haya subido con las correcciones
3. Asegurar que Bootstrap JavaScript esté funcionando

## Contacto para Soporte
En caso de problemas durante el despliegue, revisar:
1. Los logs del servidor en Somee.com
2. La consola del navegador para errores JavaScript
3. Verificar que todas las dependencias estén correctamente instaladas