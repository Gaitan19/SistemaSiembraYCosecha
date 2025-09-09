// import React from "react";
// import "../views/css/Ticket.css";

// const Ticket = React.forwardRef(({ detalleVenta }, ref) => {
//   console.log("detalleVenta :>> ", detalleVenta);

//   return (
//     <div
//       ref={ref}
//       className="ticket"
//       style={{
//         width: "80mm", // Aseguramos el ancho
//         overflow: "hidden", // Evitar scroll al imprimir
//         pageBreakInside: "avoid", // Evitar cortes en el medio del ticket
//       }}
//     >
//       <div className="ticket__header">
//         <h4 className="ticket__title">Ferretería la Unión</h4>
//         <p className="ticket__address">Maxi Pali Waspan Sur, 1 1/2c. Arriba</p>
//         <hr className="ticket__separator" />
//       </div>
//       <div className="ticket__body">
//         <p className="ticket__info">
//           <strong>Pago:</strong> Contado
//         </p>
//         <p className="ticket__info">
//           <strong>Fecha Registro:</strong> {detalleVenta.fechaRegistro}
//         </p>
//         <p className="ticket__info">
//           <strong>Celular:</strong> 8764-4751
//         </p>
//         <p className="ticket__info">
//           <strong>Numero Venta:</strong> {detalleVenta.numeroDocumento}
//         </p>
//         <p className="ticket__info">
//           <strong>Vendedor:</strong> {detalleVenta.usuarioRegistro}
//         </p>
//         <hr className="ticket__separator" />
//         <table className="ticket__table">
//           <thead>
//             <tr>
//               <th className="ticket__table-header ticket__table-header--left">
//                 Producto
//               </th>
//               <th className="ticket__table-header ticket__table-header--center">
//                 Cant.
//               </th>
//               <th className="ticket__table-header ticket__table-header--center">
//                 Precio
//               </th>
//               <th className="ticket__table-header ticket__table-header--right">
//                 Total
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {detalleVenta.detalle && detalleVenta.detalle.length > 0 ? (
//               detalleVenta.detalle.map((item, index) => (
//                 <tr key={index} className="ticket__table-row">
//                   <td className="ticket__table-cell">{item.producto}</td>
//                   <td className="ticket__table-cell ticket__table-cell--center">
//                     {item.cantidad}
//                   </td>
//                   <td className="ticket__table-cell ticket__table-cell--center">
//                     C${item.precio}
//                   </td>
//                   <td className="ticket__table-cell ticket__table-cell--right">
//                     C${item.total}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="4"
//                   className="ticket__table-cell ticket__table-cell--center"
//                 >
//                   Sin resultados
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         <hr className="ticket__separator" />
//         <p className="ticket__info">
//           <strong>Total:</strong> C${detalleVenta.total}
//         </p>
//       </div>
//       <div className="ticket__footer">
//         <p className="ticket__footer-title">
//           <strong>Datos del Cliente:</strong>
//         </p>
//         <p className="ticket__info">
//           <strong>Nombre Cliente:</strong> {detalleVenta.nombreCliente}
//         </p>
//       </div>
//     </div>
//   );
// });

// export default Ticket;

import React from "react";
import "../views/css/Ticket.css";

const Ticket = React.forwardRef(({ detalleVenta }, ref) => {
  return (
    <div ref={ref} id="ticket-impresion" className="ticket">
      <div className="ticket__header">
        <p className="ticket__title">
          SIEMBRAS & COSECHAS
          <br />
          <span style={{ fontSize: "10px", textTransform: "none" }}>
            Expertos en batidos
          </span>
        </p>

        <p className="ticket__address">Empalme San Benito</p>

        <hr className="ticket__separator" />
      </div>
      <div className="ticket__body">
        <p className="ticket__info">
          <strong>Tipo Pago:</strong> {detalleVenta.tipoPago}
        </p>
        <p className="ticket__info">
          <strong>Moneda:</strong> {detalleVenta.tipoDinero}
        </p>
        <p className="ticket__info">
          <strong>Fecha Registro:</strong> {detalleVenta.fechaRegistro}{" "}
          {detalleVenta.horaRegistro}
        </p>

        <p className="ticket__info">
          <strong>Ticket N.º:</strong> {detalleVenta.numeroDocumento}
        </p>
        <p className="ticket__info">
          <strong>Vendedor:</strong> {detalleVenta.usuarioRegistro}
        </p>
        <hr className="ticket__separator" />
        <table className="ticket__table">
          <thead>
            <tr>
              <th className="ticket__table-header">Producto</th>
              <th className="ticket__table-header ticket__table-cell--center">
                Cant.
              </th>
              <th className="ticket__table-header ticket__table-cell--center">
                Precio
              </th>
              <th className="ticket__table-header ticket__table-cell--right">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {detalleVenta.detalle && detalleVenta.detalle.length > 0 ? (
              detalleVenta.detalle.map((item, index) => (
                <tr key={index}>
                  <td className="ticket__table-cell">-{item.producto}</td>
                  <td className="ticket__table-cell ticket__table-cell--center">
                    {item.cantidad}
                  </td>
                  <td className="ticket__table-cell ticket__table-cell--center">
                    C${Math.trunc(item.precio)}
                  </td>
                  <td className="ticket__table-cell ticket__table-cell--right">
                    C${Math.trunc(item.total)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="ticket__table-cell ticket__table-cell--center"
                >
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <hr className="ticket__separator" />

        <p className="ticket__info">
          <strong>Total a pagar:</strong> C${detalleVenta.total}
        </p>
        <p className="ticket__info">
          <strong>Efectivo entregado:</strong>{" "}
          {detalleVenta.tipoDinero === "Cordobas" ? "C$" : "$"}
          {detalleVenta.montoPago || "N/A"}
        </p>
        {(detalleVenta.tipoDinero === "Dolares" && detalleVenta.tipoPago === "Efectivo") && (
          <>
            <p className="ticket__info">
              <strong>Tipo de cambio dólar:</strong> C${detalleVenta.tipoCambio}
            </p>

             <p className="ticket__info">
              <strong>Efectivo en Córdoba:</strong> C${detalleVenta.montoPago * detalleVenta.tipoCambio}
            </p>
          </>
        )}
        <p className="ticket__info">
          <strong>Cambio:</strong>{" "}
          {detalleVenta.vuelto > 0 && `C$${detalleVenta.vuelto}`}
        </p>
      </div>
      {(detalleVenta.nombreCliente || detalleVenta.numeroRuc) && (
        <div className="ticket__footer">
          <p className="ticket__footer-title" style={{ textAlign: "left" }}>
            <strong>Datos del Cliente:</strong>
          </p>

          {detalleVenta.nombreCliente && (
            <p className="ticket__info">
              <strong>Nombre Cliente:</strong> {detalleVenta.nombreCliente}
            </p>
          )}

          {detalleVenta.numeroRuc && (
            <p className="ticket__info">
              <strong>Ruc N.º:</strong> {detalleVenta.numeroRuc}
            </p>
          )}
        </div>
      )}
      <div className="ticket__footer" style={{ textAlign: "center" }}>
        <p className="ticket__footer-title">
          <strong>¡Gracias por su preferencia!</strong>
        </p>
      </div>
    </div>
  );
});

export default Ticket;
