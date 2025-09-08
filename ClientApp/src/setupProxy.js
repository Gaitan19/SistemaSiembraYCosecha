const createProxyMiddleware = require("http-proxy-middleware");
const { env } = require("process");

const target = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : env.ASPNETCORE_URLS
  ? env.ASPNETCORE_URLS.split(";")[0]
  : "http://localhost:32214";

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
  "/notificationHub",
];

module.exports = function (app) {
  const appProxy = createProxyMiddleware(context, {
    target: target,
    secure: false,
    ws: true, // Enable WebSocket proxying for SignalR
  });

  app.use(appProxy);
};
