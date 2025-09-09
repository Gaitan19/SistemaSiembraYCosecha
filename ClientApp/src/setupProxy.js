const createProxyMiddleware = require("http-proxy-middleware");
const { env } = require("process");

const target = "http://localhost:5000"; // Force backend URL for development

const context = [
  "/weatherforecast",
  "/api/rol",
  "/api/categoria",
  "/api/usuario",
  "/api/producto",
  "/api/venta",
  "/api/utilidad",
  "/api/session",
  "/api/proveedor",
  "/api/ingreso",
  "/api/egreso",
  "/api/cierre",
  "/api/permisos",
  "/api/sucursal",
];

module.exports = function (app) {
  const appProxy = createProxyMiddleware(context, {
    target: target,
    secure: false,
    ws: true, // Enable WebSocket proxying
  });

  app.use(appProxy);
};
