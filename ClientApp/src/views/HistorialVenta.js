import {
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import React, { useState } from "react";
import Ticket from "../componentes/Ticket";
import printJS from "print-js";

import "react-datepicker/dist/react-datepicker.css";

const HistorialVenta = () => {
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [nroVenta, setNumeroVenta] = useState("");
  const [buscarPor, setBuscarPor] = useState("fecha");

  const [verModal, setVerModal] = useState(false);
  const [detalleVenta, setDetalleVenta] = useState({});
  const [ventas, setVentas] = useState([]);

  // Función para buscar ventas
  const buscarVenta = () => {
    let options = { year: "numeric", month: "2-digit", day: "2-digit" };

    let _fechaInicio = fechaInicio.toLocaleDateString("es-PE", options);
    let _fechaFin = fechaFin.toLocaleDateString("es-PE", options);

    fetch(
      `api/venta/Listar?buscarPor=${buscarPor}&numeroVenta=${nroVenta}&fechaInicio=${_fechaInicio}&fechaFin=${_fechaFin}`
    )
      .then((response) => {
        return response.ok ? response.json() : Promise.reject(response);
      })
      .then((dataJson) => {
        var data = dataJson;
        if (data.length < 1) {
          Swal.fire("Opps!", "No se encontraron resultados", "warning");
        }
        setVentas(data);
      })
      .catch((error) => {
        setVentas([]);
        Swal.fire("Opps!", "No se pudo encontrar información", "error");
      });
  };

  // Función para mostrar detalles en el modal
  const mostrarModal = (data) => {
    setDetalleVenta(data);
    setVerModal(true);
  };

  // Función para imprimir el ticket
  const imprimirTicket = () => {
    printJS({
      printable: "ticket-impresion",
      type: "html",
      style: `
        .ticket {
       .ticket {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    line-height: 1.4;
    margin: 0 auto;
    padding: 0;
    text-align: left;
    width: 80mm; /* Ancho específico del ticket */
    word-wrap: break-word;
}

.ticket__header,
.ticket__body,
.ticket__footer {
    margin-bottom: 5px;
    text-align: center; /* Centrado en la sección */
}

.ticket__title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
    text-transform: uppercase;
}

.ticket__address {
    font-size: 10px;
    margin: 3px 0;
}

.ticket__separator {
    border: none;
    border-top: 1px dashed #000;
    margin: 3px 0;
}

.ticket__info {
    font-size: 12px;
    margin: 2px 0;
    text-align: left;
}

.ticket__table {
    border-collapse: collapse;
    font-size: 12px;
    margin-top: 5px;
    width: 100%;
}

.ticket__table-header,
.ticket__table-cell {
    padding: 0;
}

.ticket__table-header {
    font-weight: bold;
    text-align: left;
}

.ticket__table-cell {
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.ticket__table-cell--center {
    text-align: center;
}

.ticket__table-cell--right {
    text-align: right;
}

.ticket__footer {
    border-top: 1px dashed #000;
    font-size: 10px;
    padding-top: 5px;
    text-align: center;
}

.ticket__footer-title {
    font-size: 12px;
    font-weight: bold;
}

@media print {
    body {
        align-items: flex-start;
        display: flex;
        justify-content: center; /* Centrar el ticket en la página */
        margin: 0;
        padding: 0;
    }

    .ticket {
        font-size: 12px; /* Tamaño adecuado para impresión térmica */
        margin: 0;
        page-break-inside: avoid; /* Evitar que el ticket se parta */
        width: 80mm; /* Mantener el tamaño exacto */
    }
}

      `,
    });
  };

  return (
    <>
      <Row>
        <Col sm={12}>
          <Card>
            <CardHeader style={{ backgroundColor: "#4e73df", color: "white" }}>
              Historial de ventas
            </CardHeader>
            <CardBody>
              <Row className="align-items-end">
                <Col sm={3}>
                  <FormGroup>
                    <Label>Buscar por: </Label>
                    <Input
                      type="select"
                      bsSize="sm"
                      onChange={(e) => setBuscarPor(e.target.value)}
                      value={buscarPor}
                    >
                      <option value="fecha">Fechas</option>
                      <option value="numero">Numero Venta</option>
                    </Input>
                  </FormGroup>
                </Col>
                {buscarPor === "fecha" ? (
                  <>
                    <Col sm={3}>
                      <FormGroup>
                        <Label>Fecha Inicio:</Label>
                        <DatePicker
                          className="form-control form-control-sm"
                          selected={fechaInicio}
                          onChange={(date) => setFechaInicio(date)}
                          dateFormat="dd/MM/yyyy"
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={3}>
                      <FormGroup>
                        <Label>Fecha Fin:</Label>
                        <DatePicker
                          className="form-control form-control-sm"
                          selected={fechaFin}
                          onChange={(date) => setFechaFin(date)}
                          dateFormat="dd/MM/yyyy"
                        />
                      </FormGroup>
                    </Col>
                  </>
                ) : (
                  <Col sm={3}>
                    <FormGroup>
                      <Label>Numero venta:</Label>
                      <Input
                        bsSize="sm"
                        value={nroVenta}
                        onChange={(e) => setNumeroVenta(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                )}
                <Col sm={3}>
                  <FormGroup>
                    <Button
                      color="success"
                      size="sm"
                      block
                      onClick={buscarVenta}
                    >
                      <i className="fa fa-search" aria-hidden="true"></i> Buscar
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm="12">
                  <Table striped responsive size="sm">
                    <thead>
                      <tr>
                        <th>Fecha Registro</th>
                        <th>Numero Venta</th>
                        <th>Documento Cliente</th>
                        <th>Nombre Cliente</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventas.length < 1 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center" }}>
                            Sin resultados
                          </td>
                        </tr>
                      ) : (
                        ventas.map((item) => (
                          <tr key={item.numeroDocumento}>
                            <td>{item.fechaRegistro}</td>
                            <td>{item.numeroDocumento}</td>
                            <td>{item.documentoCliente}</td>
                            <td>{item.nombreCliente}</td>
                            <td>C${item.total}</td>
                            <td>
                              <Button
                                size="sm"
                                color="info"
                                outline
                                onClick={() => mostrarModal(item)}
                              >
                                <i className="fa fa-eye" aria-hidden="true"></i>{" "}
                                Ver detalle
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal size="lg" isOpen={verModal}>
        <ModalHeader>Detalle Venta</ModalHeader>
        <ModalBody>
          <Row>
            <Col sm={4}>
              <FormGroup>
                <Label>Fecha Registro:</Label>
                <Input
                  bsSize="sm"
                  disabled
                  value={detalleVenta.fechaRegistro}
                />
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup>
                <Label>Numero Venta:</Label>
                <Input
                  bsSize="sm"
                  disabled
                  value={detalleVenta.numeroDocumento}
                />
              </FormGroup>
            </Col>

            <Col sm={4}>
              <FormGroup>
                <Label>Usuario Registro:</Label>
                <Input
                  bsSize="sm"
                  disabled
                  value={detalleVenta.usuarioRegistro}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <FormGroup>
                <Label>Documento Cliente:</Label>
                <Input
                  bsSize="sm"
                  disabled
                  value={detalleVenta.documentoCliente}
                />
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup>
                <Label>Nombre Cliente:</Label>
                <Input
                  bsSize="sm"
                  disabled
                  value={detalleVenta.nombreCliente || "N/A"}
                />
              </FormGroup>
            </Col>

            <Col sm={4}>
              <FormGroup>
                <Label>Numero Ruc:</Label>
                <Input
                  bsSize="sm"
                  disabled
                  value={detalleVenta.numeroRuc || "N/A"}
                />
              </FormGroup>
            </Col>
          </Row>
           <Row>
            <Col sm={4}>
              <FormGroup>
                <Label>Tipo Pago:</Label>
                <Input
                  bsSize="sm"
                  disabled
                  value={detalleVenta.tipoPago || "N/A"}
                />
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup>
                <Label>Moneda:</Label>
                <Input
                  bsSize="sm"
                  disabled
                  value={detalleVenta.tipoDinero || "N/A"}
                />
              </FormGroup>
            </Col>

            <Col sm={4}>
              <FormGroup>
                <Label>Monto Pago:</Label>
                <Input
                  bsSize="sm"
                  disabled
                  value={`${detalleVenta.tipoDinero === 'Cordobas' ? 'C$' : '$'}${detalleVenta.montoPago || "N/A"}`}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <FormGroup>
                <Label>Monto Cambio:</Label>
                <Input
                  bsSize="sm"
                  disabled
                  value={`C$${detalleVenta.vuelto || "0"}`}
                />
              </FormGroup>
            </Col>
          </Row>
          <Table striped responsive size="sm">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {detalleVenta.detalle ? (
                detalleVenta.detalle.map((item, index) => (
                  <tr key={index}>
                    <td>{item.producto}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.cantidad}</td>
                    <td>C${item.precio}</td>
                    <td>C${item.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Sin resultados
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <Row>
           
            <Col sm={4}>
              <FormGroup>
                <Label>Total:</Label>
                <Input bsSize="sm" disabled value={`C$${detalleVenta.total}`} />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button size="sm" color="primary" onClick={imprimirTicket}>
            Imprimir
          </Button>
          <Button size="sm" color="danger" onClick={() => setVerModal(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      <div style={{ display: "none" }}>
        <Ticket detalleVenta={detalleVenta} />
      </div>
    </>
  );
};

export default HistorialVenta;
