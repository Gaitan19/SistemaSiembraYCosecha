import {
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
  Table,
  Button,
} from "reactstrap";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { useContext, useEffect, useState, useCallback } from "react";
import "./css/Venta.css";
import { UserContext } from "../context/UserProvider";
import { generateCode } from "../utils/generateCode";
import printJS from "print-js";
import Ticket from "../componentes/Ticket";

const Venta = () => {
  const { user } = useContext(UserContext);

  const [a_Productos, setA_Productos] = useState([]);
  const [a_Busqueda, setA_Busqueda] = useState("");
  const [mostrarProductos, setMostrarProductos] = useState(false);

  const [documentoCliente, setDocumentoCliente] = useState(generateCode());
  const [nombreCliente, setNombreCliente] = useState("");

  const [productos, setProductos] = useState([]);
  const [productsCart, setProductsCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [tempProducts, setTempProducts] = useState([]);

  // New fields for payment
  const [tipoPago, setTipoPago] = useState("Efectivo");
  const [tipoDinero, setTipoDinero] = useState("Cordobas");
  const [numeroRuc, setNumeroRuc] = useState("");
  const [montoPago, setMontoPago] = useState(0);
  const [vuelto, setVuelto] = useState(0);
  const [tipoCambio, setTipoCambio] = useState(0);

  // Estado para la última venta (para imprimir)
  const [ultimaVenta, setUltimaVenta] = useState({});

  const reestablecer = () => {
    setDocumentoCliente(generateCode());
    setNombreCliente("");
    setProductos([]);
    setTotal(0);
    setTipoPago("Efectivo");
    setTipoDinero("Cordobas");
    setNumeroRuc("");
    setMontoPago(0);
    setVuelto(0);
    setTipoCambio(0);
  };

  const obtenerProductos = async () => {
    let response = await fetch("api/producto/Lista");

    if (response.ok) {
      let data = await response.json();
      setTempProducts(() => data);
    }
  };

  const calcularVuelto = useCallback(
    (pagoCliente) => {
      // For Transferencia, no change is calculated (exact payment)
      if (tipoPago === "Transferencia") {
        setVuelto(0);
        return;
      }

      const totalVenta = parseFloat(total) || 0;
      const pago = parseFloat(pagoCliente) || 0;

      // For Dolares, convert to cordobas using exchange rate
      if (tipoDinero === "Dolares") {
        // convertir a córdobas usando tipo de cambio
        const montoConvertido = pago * (parseFloat(tipoCambio) || 0);
        const cambio = montoConvertido - totalVenta;
        setVuelto(cambio >= 0 ? cambio : 0);
        return;
      }

      // For Cordobas, calculate change normally
      const cambio = pago - totalVenta;
      setVuelto(cambio >= 0 ? cambio : 0);
    },
    [tipoCambio, tipoPago, tipoDinero, total]
  );

  useEffect(() => {
    obtenerProductos();
  }, []);

  // Recalculate change when payment type changes
  useEffect(() => {
    if (tipoPago === "Transferencia" || tipoPago === "Tarjeta") {
      // Si el tipo de dinero es dólares, convertir
      if (tipoDinero === "Dolares") {
        if (tipoCambio > 0) {
          const montoEnDolares = (
            parseFloat(total) / parseFloat(tipoCambio)
          ).toFixed(2);
          setMontoPago(montoEnDolares);
        }
      } else {
        // Si es en córdobas, asignar el mismo total
        setMontoPago(parseFloat(total).toFixed(2));
      }
      setVuelto(0);
    } else {
      // For Cordobas and dollars, recalculate automatically
      calcularVuelto(montoPago);
    }
  }, [tipoPago, tipoDinero, total, montoPago, calcularVuelto, tipoCambio]);

  // Buscar productos para mostrar en la tabla
  const buscarProductos = (value) => {
    if (value.length >= 2) {
      fetch("api/venta/Productos/" + value)
        .then((response) => {
          return response.ok ? response.json() : Promise.reject(response);
        })
        .then((dataJson) => {
          // Filtrar productos que no estén en el carrito
          const filteredProducts = dataJson
            .filter((item) => {
              const isInCart = productsCart.some(
                (cartItem) => cartItem[0].idProducto === item.idProducto
              );

              const tempStock = tempProducts.find(
                (item2) => item2.idProducto === item.idProducto
              );

              return (
                item.precio > 0 && !isInCart && tempStock && tempStock.esActivo
              );
            })
            .map((item) => {
              const tempStock = tempProducts.find(
                (p) => p.idProducto === item.idProducto
              );
              return {
                ...item,
                unidades: tempStock ? tempStock.unidades : 0, // 👈 ahora sí unidades
              };
            });

          setA_Productos(filteredProducts);
          setMostrarProductos(true);
        })
        .catch((error) => {
          console.log("No se pudo obtener datos, mayor detalle: ", error);
          setA_Productos([]);
          setMostrarProductos(false);
        });
    } else {
      setA_Productos([]);
      setMostrarProductos(false);
    }
  };

  // Evento cuando cambie el valor del texto de búsqueda
  const onChange = (e) => {
    const value = e.target.value;
    setA_Busqueda(value);
    buscarProductos(value);
  };

  const agregarProductoAlCarrito = async (producto) => {
    const unidadesDisponibles = producto.unidades ?? 0;
    const tieneUnidadesGestionadas =
      producto.unidades !== null && producto.unidades !== undefined;

    Swal.fire({
      title: producto.nombre || producto.descripcion,
      text: tieneUnidadesGestionadas
        ? `Ingrese la cantidad (Stock disponible: ${unidadesDisponibles} unidades)`
        : `Ingrese la cantidad (Este producto no gestiona stock)`,
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
        placeholder: tieneUnidadesGestionadas
          ? `Máximo ${unidadesDisponibles} unidades`
          : "Cantidad deseada",
      },
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Volver",
      showLoaderOnConfirm: true,
      preConfirm: (inputValue) => {
        obtenerProductos();

        if (isNaN(parseFloat(inputValue))) {
          Swal.showValidationMessage("Debe ingresar un valor númerico");
        } else if (parseInt(inputValue) < 1) {
          Swal.showValidationMessage(`La cantidad debe ser mayor a "0"`);
        } else {
          // Solo validar stock si el producto gestiona unidades
          if (tieneUnidadesGestionadas) {
            const cantidadSolicitada = parseInt(inputValue);
            const unidadesDisponibles = producto.unidades || 0;

            if (cantidadSolicitada > unidadesDisponibles) {
              Swal.showValidationMessage(
                `La cantidad solicitada (${cantidadSolicitada}) supera el stock disponible (${unidadesDisponibles} unidades)`
              );
              return;
            }
          }

          const tempStock = tempProducts.filter(
            (item) => item.idProducto === producto.idProducto
          );

          setProductsCart(() => [...productsCart, tempStock]);

          let nuevoProducto = {
            idProducto: producto.idProducto,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            cantidad: parseInt(inputValue),
            precio: producto.precio,
            total: producto.precio * parseFloat(inputValue),
          };
          let arrayProductos = [];
          arrayProductos.push(...productos);
          arrayProductos.push(nuevoProducto);

          setProductos((anterior) => [...anterior, nuevoProducto]);
          calcularTotal(arrayProductos);

          // Ocultar la tabla y limpiar búsqueda
          setA_Busqueda("");
          setA_Productos([]);
          setMostrarProductos(false);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  // Columnas para la tabla de productos
  const columnasProductos = [
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
      width: "200px",
    },
    {
      name: "Descripción",
      selector: (row) => row.descripcion,
      sortable: true,
      width: "250px",
    },
    {
      name: "Precio",
      selector: (row) => row.precio,
      sortable: true,
      cell: (row) => `C$${row.precio}`,
      width: "100px",
    },
    {
      name: "Unidades",
      selector: (row) => row.unidades,
      sortable: true,
      cell: (row) => row.unidades ?? "Sin gestión",
      width: "100px",
    },
    {
      name: "Acción",
      cell: (row) => (
        <Button
          color="success"
          size="sm"
          onClick={() => agregarProductoAlCarrito(row)}
        >
          <i className="fas fa-cart-plus"></i> Agregar
        </Button>
      ),
      width: "120px",
    },
  ];

  // Función para modificar cantidad en el carrito
  const modificarCantidadCarrito = async (producto) => {
    Swal.fire({
      title: `Modificar cantidad - ${producto.descripcion}`,
      text: "Ingrese la nueva cantidad",
      input: "text",
      inputValue: producto.cantidad,
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: (inputValue) => {
        if (isNaN(parseFloat(inputValue))) {
          Swal.showValidationMessage("Debe ingresar un valor númerico");
        } else if (parseInt(inputValue) < 1) {
          Swal.showValidationMessage(`La cantidad debe ser mayor a "0"`);
        } else {
          // Actualizar la cantidad del producto en el carrito
          const nuevaCantidad = parseInt(inputValue);
          const nuevoTotal = producto.precio * nuevaCantidad;

          // Actualizar el producto en la lista de productos del carrito
          const productosActualizados = productos.map((p) =>
            p.idProducto === producto.idProducto
              ? { ...p, cantidad: nuevaCantidad, total: nuevoTotal }
              : p
          );

          setProductos(productosActualizados);
          calcularTotal(productosActualizados);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const eliminarProducto = (id) => {
    let listaproductos = productos.filter((p) => p.idProducto !== id);
    const tempProductsCart = productsCart.filter(
      (item) => item[0].idProducto !== id
    );
    setProductsCart(() => tempProductsCart);
    setProductos(listaproductos);
    calcularTotal(listaproductos);
  };

  const calcularTotal = (arrayProductos) => {
    let t = 0; // total

    if (arrayProductos.length > 0) {
      arrayProductos.forEach((p) => {
        t += p.total; // aquí p.total = precio * cantidad
      });
    }

    setTotal(t.toFixed(2));
  };
  // Función para obtener detalles de una venta específica
  const obtenerDetalleVenta = async (numeroVenta) => {
    try {
      let options = { year: "numeric", month: "2-digit", day: "2-digit" };
      let fecha = new Date().toLocaleDateString("es-PE", options);

      const response = await fetch(
        `api/venta/Listar?buscarPor=numero&numeroVenta=${numeroVenta}&fechaInicio=${fecha}&fechaFin=${fecha}`
      );

      if (response.ok) {
        const dataJson = await response.json();
        if (dataJson.length > 0) {
          setUltimaVenta(dataJson[0]);
          console.log("Detalle de venta obtenido:", dataJson[0]);
          return dataJson[0];
        }
      }
      return null;
    } catch (error) {
      console.error("Error al obtener detalle de venta:", error);
      return null;
    }
  };

  // Función para imprimir el ticket (igual que en HistorialVenta)
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

  const terminarVenta = () => {
    if (productos.length < 1) {
      Swal.fire("Opps!", "No existen productos", "error");
      return;
    }

    // Validation for required fields
    if (!tipoPago) {
      Swal.fire("Opps!", "Debe seleccionar un tipo de pago", "error");
      return;
    }

    if (montoPago <= 0) {
      Swal.fire("Opps!", "Debe ingresar el monto que paga el cliente", "error");
      return;
    }

    // For Dolares payment, validate exchange rate and use conversion
    if (tipoDinero === "Dolares") {
      if (tipoCambio <= 0) {
        Swal.fire(
          "Opps!",
          "Debe ingresar un tipo de cambio válido (mayor a 0)",
          "error"
        );
        return;
      }

      const montoConvertido = parseFloat(montoPago) * parseFloat(tipoCambio);
      if (montoConvertido < parseFloat(total)) {
        Swal.fire(
          "Opps!",
          "El monto pagado debe ser mayor o igual al total de la venta",
          "error"
        );
        return;
      }
    } else {
      // For other payment types, validate normally
      if (montoPago < parseFloat(total)) {
        Swal.fire(
          "Opps!",
          "El monto pagado debe ser mayor o igual al total de la venta",
          "error"
        );
        return;
      }
    }

    let venta = {
      documentoCliente: documentoCliente,
      nombreCliente: nombreCliente,
      idUsuario: JSON.parse(user).idUsuario,
      total: parseFloat(total),
      tipoPago: tipoPago,
      tipoDinero: tipoDinero,
      numeroRuc: numeroRuc || "",
      montoPago: parseFloat(montoPago),
      vuelto: parseFloat(vuelto),
      tipoCambio: parseFloat(tipoCambio) || 0,
      listaProductos: productos,
    };

    setProductsCart([]);

    fetch("api/venta/Registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(venta),
    })
      .then((response) => {
        return response.ok ? response.json() : Promise.reject(response);
      })
      .then(async (dataJson) => {
        reestablecer();
        var data = dataJson;

        // Mostrar mensaje de éxito con opción de imprimir
        const result = await Swal.fire({
          title: "Venta Creada!",
          text: `Número de venta: ${data.numeroDocumento}`,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Imprimir Ticket",
          cancelButtonText: "Cerrar",
          confirmButtonColor: "#4e73df",
          cancelButtonColor: "#6c757d",
        });

        // Si el usuario quiere imprimir
        if (result.isConfirmed) {
          // Obtener los detalles de la venta para imprimir
          const detalleVenta = await obtenerDetalleVenta(data.numeroDocumento);
          if (detalleVenta) {
            // Dar un pequeño tiempo para que se rendericen los elementos
            setTimeout(() => {
              imprimirTicket();
            }, 500);
          } else {
            Swal.fire(
              "Error",
              "No se pudo obtener los detalles para imprimir",
              "error"
            );
          }
        }

        obtenerProductos();
      })
      .catch((error) => {
        Swal.fire("Opps!", "No se pudo crear la venta", "error");
        console.log("No se pudo enviar la venta ", error);
      });
  };

  return (
    <>
      <Row>
        <Col sm={8}>
          <Row className="mb-2">
            <Col sm={12}>
              <Card>
                <CardHeader
                  style={{ backgroundColor: "#4e73df", color: "white" }}
                >
                  Cliente
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm={6}>
                      <FormGroup>
                        <Label>Cod Documento</Label>
                        <Input
                          bsSize="sm"
                          value={documentoCliente}
                          onChange={(e) => setDocumentoCliente(e.target.value)}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={6}>
                      <FormGroup>
                        <Label>Nombre</Label>
                        <Input
                          bsSize="sm"
                          value={nombreCliente}
                          onChange={(e) => setNombreCliente(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <FormGroup>
                        <Label>Número RUC (Opcional)</Label>
                        <Input
                          bsSize="sm"
                          value={numeroRuc}
                          onChange={(e) => setNumeroRuc(e.target.value)}
                          placeholder="RUC del cliente"
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={6}>
                      <FormGroup>
                        <Label>
                          Tipo de Pago <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Input
                          type="select"
                          bsSize="sm"
                          value={tipoPago}
                          onChange={(e) => {
                            const value = e.target.value;
                            setTipoPago(value);

                            // Si es tarjeta, forzar siempre Cordobas
                            if (value === "Tarjeta") {
                              setTipoDinero("Cordobas");
                            }
                          }}
                        >
                          <option value="Efectivo">Efectivo</option>
                          <option value="Transferencia">Transferencia</option>
                          <option value="Tarjeta">Tarjeta</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <FormGroup>
                        <Label>
                          Tipo de Moneda <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Input
                          type="select"
                          bsSize="sm"
                          value={tipoDinero}
                          onChange={(e) => setTipoDinero(e.target.value)}
                          disabled={tipoPago === "Tarjeta"} // Siempre en córdobas si es tarjeta
                        >
                          <option value="Cordobas">Córdobas</option>
                          <option value="Dolares">Dólares</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  {tipoDinero === "Dolares" && (
                    <Row>
                      <Col sm={6}>
                        <FormGroup>
                          <Label>
                            Tipo de Cambio (C$ por US$){" "}
                            <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            bsSize="sm"
                            value={tipoCambio}
                            onChange={(e) => setTipoCambio(e.target.value)}
                            placeholder="Ej: 36.6"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Card>
                <CardHeader
                  style={{ backgroundColor: "#4e73df", color: "white" }}
                >
                  Productos
                </CardHeader>
                <CardBody>
                  <Row className="mb-2">
                    <Col sm={12}>
                      <FormGroup>
                        <Input
                          type="text"
                          placeholder="Buscar producto"
                          value={a_Busqueda}
                          onChange={onChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {mostrarProductos && a_Productos.length > 0 && (
                    <Row className="mb-3">
                      <Col sm={12}>
                        <DataTable
                          columns={columnasProductos}
                          data={a_Productos}
                          noDataComponent="No se encontraron productos"
                          dense
                          striped
                          responsive
                          highlightOnHover
                          pagination={false}
                        />
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col sm={12}>
                      <Table striped size="sm">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Producto</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {productos.length < 1 ? (
                            <tr>
                              <td colSpan="6">Sin productos</td>
                            </tr>
                          ) : (
                            productos.map((item) => (
                              <tr key={item.idProducto}>
                                <td>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() =>
                                      eliminarProducto(item.idProducto)
                                    }
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </Button>
                                </td>
                                <td>{item.nombre}</td>
                                <td>{item.descripcion}</td>
                                <td>{item.cantidad}</td>
                                <td>C${item.precio}</td>
                                <td>C${item.total}</td>
                                <td>
                                  <Button
                                    color="warning"
                                    size="sm"
                                    onClick={() =>
                                      modificarCantidadCarrito(item)
                                    }
                                  >
                                    <i className="fas fa-edit"></i>
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
        </Col>

        <Col sm={4}>
          <Row className="mb-2">
            <Col sm={12}>
              <Card>
                <CardHeader
                  style={{ backgroundColor: "#4e73df", color: "white" }}
                >
                  Detalle
                </CardHeader>
                <CardBody>
                  <Row className="mb-2">
                    <Col sm={12}>
                      <InputGroup size="sm">
                        <InputGroupText>Total:C$</InputGroupText>
                        <Input disabled value={total} />
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={12}>
                      <InputGroup size="sm">
                        <InputGroupText>
                          Paga con <span style={{ color: "red" }}>*</span>:
                        </InputGroupText>
                        <Input
                          type="number"
                          step="0.01"
                          value={montoPago}
                          onChange={(e) => {
                            if (tipoPago !== "Transferencia" || tipoPago !== "Tarjeta") {
                              // Solo permitir modificar si NO es transferencia
                              const valor = e.target.value;
                              setMontoPago(valor);
                              calcularVuelto(valor);
                            }
                          }}
                          readOnly={tipoPago === "Transferencia" || tipoPago === "Tarjeta"} // For Transferencia, montoPago is always equal to total
                          placeholder="Monto que paga el cliente"
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <InputGroup size="sm">
                        <InputGroupText>Vuelto:C$</InputGroupText>
                        <Input
                          disabled
                          value={vuelto.toFixed(2)}
                          type="number"
                          step="0.01"
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Card>
                <CardBody>
                  <Button color="success" block onClick={terminarVenta}>
                    <i className="fas fa-money-check"></i> Terminar Venta
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Ticket oculto para impresión */}
      <div style={{ display: "none" }}>
        <Ticket detalleVenta={ultimaVenta} />
      </div>
    </>
  );
};

export default Venta;
