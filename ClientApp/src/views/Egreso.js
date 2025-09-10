import { useEffect, useState, useContext } from "react";
import DataTable from "react-data-table-component";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  FormGroup,
  ModalFooter,
  Row,
  Col,
} from "reactstrap";
import Swal from "sweetalert2";
import { exportToPDF, exportToExcel, applySearchFilter } from "../utils/exportHelpers";
import { UserContext } from "../context/UserProvider";

const modeloEgreso = {
  idEgreso: 0,
  descripcion: "",
  monto: 0,
  tipoPago: "Efectivo",
  tipoDinero: "Cordobas",
  idUsuario: 0,
  esActivo: true,
  fechaRegistro: null,
};

const Egreso = () => {
  const { user } = useContext(UserContext);
  const [egreso, setEgreso] = useState(modeloEgreso);
  const [pendiente, setPendiente] = useState(true);
  const [egresos, setEgresos] = useState([]);
  const [filteredEgresos, setFilteredEgresos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [verModal, setVerModal] = useState(false);
  const [modoSoloLectura, setModoSoloLectura] = useState(false);

  const handleChange = (e) => {
  let { name, value } = e.target;

  if (name === "monto") {
    value = parseFloat(value) || 0;
  }

  if (name === "tipoPago" && value === "Tarjeta") {
    setEgreso({
      ...egreso,
      [name]: value,
      tipoDinero: "Cordobas", // 👈 se fuerza Cordobas
    });
  } else {
    setEgreso({
      ...egreso,
      [name]: value,
    });
  }
};


  // Combined filtering function that applies both search and status filters
  const applyFilters = (data, searchValue, statusValue) => {
    let filtered = data;

    // Apply status filter
    if (statusValue === "activos") {
      filtered = filtered.filter(item => item.esActivo === true);
    } else if (statusValue === "inactivos") {
      filtered = filtered.filter(item => item.esActivo === false);
    }
    // "todos" shows all items, no additional filtering needed

    // Apply search filter
    if (searchValue && searchValue !== "") {
      const searchFields = [
        { accessor: (item) => item.descripcion },
        { accessor: (item) => item.monto },
        { accessor: (item) => item.tipoDinero },
        { accessor: (item) => item.nombreUsuario },
        { accessor: (item) => item.esActivo ? "activo" : "no activo" }
      ];
      
      filtered = applySearchFilter(filtered, searchValue, searchFields);
    }

    return filtered;
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    const filtered = applyFilters(egresos, value, statusFilter);
    setFilteredEgresos(filtered);
  };

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    
    const filtered = applyFilters(egresos, searchTerm, value);
    setFilteredEgresos(filtered);
  };

  const exportToPDFHandler = () => {
    const columns = [
      { header: 'Descripción', accessor: (row) => row.descripcion },
      { header: 'Fecha', accessor: (row) => row.fechaRegistro },
      { header: 'Monto', accessor: (row) => `$${row.monto}` },
      { header: 'Tipo', accessor: (row) => row.tipoDinero },
      { header: 'Usuario', accessor: (row) => row.nombreUsuario },
      { header: 'Estado', accessor: (row) => row.esActivo ? "Activo" : "No Activo" }
    ];
    
    exportToPDF(filteredEgresos, columns, 'Lista_de_Egresos');
  };

  const exportToExcelHandler = () => {
    const excelData = filteredEgresos.map(egr => ({
      'ID': egr.idEgreso,
      'Descripción': egr.descripcion,
      'Fecha': egr.fechaRegistro,
      'Monto': egr.monto,
      'Tipo': egr.tipoDinero,
      'Usuario': egr.nombreUsuario,
      'Estado': egr.esActivo ? "Activo" : "No Activo"
    }));

    exportToExcel(excelData, 'Egresos');
  };

  const obtenerEgresos = async () => {
    try {
      let response = await fetch("api/egreso/Lista");

      if (response.ok) {
        let data = await response.json();
        setEgresos(data);
        setFilteredEgresos(data);
        setPendiente(false);
      }
    } catch (error) {
      console.error("Error al obtener egresos:", error);
      setPendiente(false);
    }
  };

  const abrirEditarModal = (data) => {
    setEgreso({
      idEgreso: data.idEgreso,
      descripcion: data.descripcion,
      monto: parseFloat(data.monto) || 0,
      tipoPago: data.tipoPago || "Efectivo",
      tipoDinero: data.tipoDinero,
      idUsuario: data.idUsuario,
      esActivo: data.esActivo,
      fechaRegistro: data.fechaRegistro
    });
    setModoSoloLectura(false);
    setVerModal(!verModal);
  };

  const abrirVerModal = (data) => {
    setEgreso({
      ...data,
      monto: parseFloat(data.monto) || 0
    });
    setModoSoloLectura(true);
    setVerModal(!verModal);
  };

  const cerrarModal = () => {
    setEgreso(modeloEgreso);
    setModoSoloLectura(false);
    setVerModal(!verModal);
  };

  const guardarCambios = async () => {
    try {
      // Get current user data
      const userData = JSON.parse(user);
      
      // Prepare data for sending with PascalCase property names for backend
      const egresoParaEnviar = {
        Descripcion: egreso.descripcion,
        Monto: egreso.monto,
        TipoPago: egreso.tipoPago,
        TipoDinero: egreso.tipoDinero,
        IdUsuario: userData.idUsuario,
        EsActivo: egreso.esActivo
      };

      // For edit operations, include the ID but never include FechaRegistro
      if (egreso.idEgreso !== 0) {
        egresoParaEnviar.IdEgreso = egreso.idEgreso;
      }

      let response;
      if (egreso.idEgreso === 0) {
        response = await fetch("api/egreso/Guardar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(egresoParaEnviar),
        });
      } else {
        response = await fetch("api/egreso/Editar", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(egresoParaEnviar),
        });
      }

      if (response.ok) {
        // Refresh the list
        await obtenerEgresos();
        setEgreso(modeloEgreso);
        setVerModal(!verModal);

        Swal.fire(
          `${egreso.idEgreso === 0 ? "Guardado" : "Actualizado"}`,
          `El egreso fue ${
            egreso.idEgreso === 0 ? "agregado" : "actualizado"
          }`,
          "success"
        );
      } else {
        const errorText = await response.text();
        Swal.fire("Opp!", `No se pudo guardar: ${errorText}`, "warning");
      }
    } catch (error) {
      Swal.fire("Error", "Error en la conexión con el servidor", "error");
    }
  };

  const eliminarEgreso = async (id) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "¿Desea eliminar este egreso permanentemente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`api/egreso/Eliminar/${id}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              // Refresh the list
              obtenerEgresos();
              Swal.fire("Eliminado!", "El egreso fue eliminado.", "success");
            } else {
              return response.text().then((error) => {
                Swal.fire("Error", error, "error");
              });
            }
          })
          .catch((error) => {
            Swal.fire("Error", "Error en la conexión con el servidor", "error");
          });
      }
    });
  };

  useEffect(() => {
    obtenerEgresos();
  }, []);

  // Update filtered list when search term or egresos change
  useEffect(() => {
    const filtered = applyFilters(egresos, searchTerm, statusFilter);
    setFilteredEgresos(filtered);
  }, [searchTerm, statusFilter, egresos]);

  const columns = [
    {
      name: "Descripción",
      selector: (row) => row.descripcion,
      sortable: true,
    },
    {
      name: "Fecha",
      selector: (row) => row.fechaRegistro,
      sortable: true,
    },
    {
      name: "Monto",
      selector: (row) => row.monto,
      sortable: true,
      cell: (row) => `${parseFloat(row.monto).toFixed(2)}`,
    },
    {
      name: "Tipo",
      selector: (row) => row.tipoDinero,
      sortable: true,
      cell: (row) => (
          `${row.tipoDinero}`
      ),
    },
    {
      name: "Usuario",
      selector: (row) => row.nombreUsuario,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => row.esActivo,
      sortable: true,
      cell: (row) => {
        let clase;
        clase = row.esActivo
          ? "badge badge-info p-2"
          : "badge badge-danger p-2";
        return (
          <span className={clase}>{row.esActivo ? "Activo" : "No Activo"}</span>
        );
      },
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <Button
            color="info"
            size="sm"
            className="mr-2"
            onClick={() => abrirVerModal(row)}
          >
            <i className="fas fa-eye"></i>
          </Button>

          <Button
            color="primary"
            size="sm"
            className="mr-2"
            onClick={() => abrirEditarModal(row)}
          >
            <i className="fas fa-pen-alt"></i>
          </Button>

          <Button
            color="danger"
            size="sm"
            onClick={() => eliminarEgreso(row.idEgreso)}
          >
            <i className="fas fa-trash-alt"></i>
          </Button>
        </>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontSize: "13px",
        fontWeight: 800,
      },
    },
    headRow: {
      style: {
        backgroundColor: "#eee",
      },
    },
  };

  const paginationOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader style={{ backgroundColor: "#4e73df", color: "white" }}>
              <Row>
                <Col sm="6">
                  <h5>Lista de Egresos</h5>
                </Col>
                <Col sm="6" className="text-right">
                  <Button
                    color="success"
                    size="sm"
                    onClick={() => setVerModal(!verModal)}
                  >
                    <i className="fas fa-plus-circle mr-2"></i>
                    Nuevo Egreso
                  </Button>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Row className="mb-3">
                <Col sm="2" className="mb-3 my-sm-0">
                  <Input
                    type="select"
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    bsSize="sm"
                    style={{
                      border: '2px solid #4e73df',
                      borderRadius: '5px'
                    }}
                  >
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                  </Input>
                </Col>
                <Col sm="3" className="mb-3 my-sm-0">
                  <Input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearch}
                    bsSize="sm"
                    style={{
                      border: '2px solid #4e73df',
                      borderRadius: '5px'
                    }}
                  />
                </Col>
                <Col sm="7" className="text-right">
                  <Button color="danger" size="sm" className="mr-2" onClick={exportToPDFHandler}>
                    <i className="fas fa-file-pdf mr-1"></i>
                    PDF
                  </Button>
                  <Button color="success" size="sm" onClick={exportToExcelHandler}>
                    <i className="fas fa-file-excel mr-1"></i>
                    Excel
                  </Button>
                </Col>
              </Row>
              
              <DataTable
                columns={columns}
                data={filteredEgresos}
                customStyles={customStyles}
                pagination
                paginationComponentOptions={paginationOptions}
                fixedHeader
                fixedHeaderScrollHeight="600px"
                progressPending={pendiente}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={verModal} toggle={cerrarModal} size="lg">
        <form onSubmit={(e) => { e.preventDefault(); guardarCambios(); }}>
          <ModalHeader toggle={cerrarModal}>
            {egreso.idEgreso === 0 ? "Nuevo Egreso" : "Editar Egreso"}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col sm={12}>
                <FormGroup>
                  <Label>Descripción</Label>
                  <Input
                    bsSize="sm"
                    type="text"
                    name="descripcion"
                    onChange={handleChange}
                    value={egreso.descripcion}
                    placeholder="Descripción del egreso"
                    required
                    readOnly={modoSoloLectura}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <FormGroup>
                  <Label>Monto</Label>
                  <Input
                    bsSize="sm"
                    type="number"
                    name="monto"
                    onChange={handleChange}
                    value={egreso.monto}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    readOnly={modoSoloLectura}
                  />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <Label>Tipo de Pago</Label>
                  <Input
                    bsSize="sm"
                    type="select"
                    name="tipoPago"
                    onChange={handleChange}
                    value={egreso.tipoPago}
                    disabled={modoSoloLectura}
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
                  <Label>Tipo de Dinero</Label>
                  <Input
                    bsSize="sm"
                    type="select"
                    name="tipoDinero"
                    onChange={handleChange}
                    value={egreso.tipoDinero}
                    disabled={modoSoloLectura || egreso.tipoPago === "Tarjeta"}
                  >
                    <option value="Cordobas">Cordobas</option>
                    <option value="Dolares">Dolares</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            {/* Only show date and status fields for existing records */}
            {egreso.idEgreso !== 0 && (
              <Row>
               
                <Col sm={6}>
                  <FormGroup>
                    <Label>Estado</Label>
                    <Input
                      bsSize="sm"
                      type="select"
                      name="esActivo"
                      onChange={(e) => {
                        const value = e.target.value === "true";
                        setEgreso({
                          ...egreso,
                          esActivo: value
                        });
                      }}
                      value={egreso.esActivo ? "true" : "false"}
                      disabled={modoSoloLectura}
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            )}
            {/* Show only status field for new records */}
            {egreso.idEgreso === 0 && (
              <Row>
                <Col sm={6}>
                  <FormGroup>
                    <Label>Estado</Label>
                    <Input
                      bsSize="sm"
                      type="select"
                      name="esActivo"
                      onChange={(e) => {
                        const value = e.target.value === "true";
                        setEgreso({
                          ...egreso,
                          esActivo: value
                        });
                      }}
                      value={egreso.esActivo ? "true" : "false"}
                      disabled={modoSoloLectura}
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            )}
          </ModalBody>
          <ModalFooter>
            {!modoSoloLectura && (
              <Button type="submit" size="sm" color="primary">
                Guardar
              </Button>
            )}
            <Button size="sm" color="danger" onClick={cerrarModal}>
              Cerrar
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default Egreso;