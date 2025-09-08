import { useEffect, useState } from "react";
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
import {
  exportToPDF,
  exportToExcel,
  applySearchFilter,
} from "../utils/exportHelpers";
import { useSignalR } from "../context/SignalRProvider"; // Importa el hook de SignalR

const modeloProveedor = {
  idProveedor: 0,
  nombre: "",
  correo: "",
  telefono: "",
  esActivo: true,
  fechaRegistro: "",
};

const Proveedor = () => {
  const [proveedor, setProveedor] = useState(modeloProveedor);
  const [pendiente, setPendiente] = useState(true);
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [verModal, setVerModal] = useState(false);
  const [modoSoloLectura, setModoSoloLectura] = useState(false);
  const { subscribe } = useSignalR(); // Obtiene la función subscribe del contexto

  const handleChange = (e) => {
    let value;
    if (e.target.name === "esActivo") {
      value = e.target.value === "true" ? true : false;
    } else {
      value = e.target.value;
    }

    setProveedor({
      ...proveedor,
      [e.target.name]: value,
    });
  };

  // Combined filtering function that applies both search and status filters
  const applyFilters = (data, searchValue, statusValue) => {
    let filtered = data;

    // Apply status filter
    if (statusValue === "activos") {
      filtered = filtered.filter((item) => item.esActivo === true);
    } else if (statusValue === "inactivos") {
      filtered = filtered.filter((item) => item.esActivo === false);
    }
    // "todos" shows all items, no additional filtering needed

    // Apply search filter
    if (searchValue && searchValue !== "") {
      const searchFields = [
        { accessor: (item) => item.nombre },
        { accessor: (item) => item.correo },
        { accessor: (item) => item.telefono },
        { accessor: (item) => (item.esActivo ? "activo" : "no activo") },
      ];

      filtered = applySearchFilter(filtered, searchValue, searchFields);
    }

    return filtered;
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = applyFilters(proveedores, value, statusFilter);
    setFilteredProveedores(filtered);
  };

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setStatusFilter(value);

    const filtered = applyFilters(proveedores, searchTerm, value);
    setFilteredProveedores(filtered);
  };

  const exportToPDFHandler = () => {
    const columns = [
      { header: "Nombre", accessor: (row) => row.nombre },
      { header: "Correo", accessor: (row) => row.correo },
      { header: "Teléfono", accessor: (row) => row.telefono },
      {
        header: "Estado",
        accessor: (row) => (row.esActivo ? "Activo" : "No Activo"),
      },
    ];

    exportToPDF(filteredProveedores, columns, "Lista_de_Proveedores");
  };

  const exportToExcelHandler = () => {
    const excelData = filteredProveedores.map((prov) => ({
      ID: prov.idProveedor,
      Nombre: prov.nombre,
      Correo: prov.correo,
      Teléfono: prov.telefono,
      "Fecha Registro": prov.fechaRegistro,
      Estado: prov.esActivo ? "Activo" : "No Activo",
    }));

    exportToExcel(excelData, "Proveedores");
  };

  const obtenerProveedores = async () => {
    try {
      let response = await fetch("api/proveedor/Lista");
      if (response.ok) {
        let data = await response.json();
        setProveedores(data);
        setFilteredProveedores(data);
        setPendiente(false);
      }
    } catch (error) {
      console.error("Error obteniendo proveedores:", error);
      setPendiente(false);
    }
  };

  useEffect(() => {
    obtenerProveedores();

    // Configurar suscripciones a eventos de SignalR
    const unsubscribeCreated = subscribe(
      "ProveedorCreated",
      (nuevoProveedor) => {
        // Agrega el nuevo proveedor al inicio de la lista
        setProveedores((prev) => {
          const newData = [nuevoProveedor, ...prev];
          // Apply current filters to new data
          const filtered = applyFilters(newData, searchTerm, statusFilter);
          setFilteredProveedores(filtered);
          return newData;
        });

        // Muestra notificación toast
        Swal.fire({
          position: "top-end",
          icon: "info",
          title: "Nuevo proveedor agregado",
          text: `Se agregó: ${nuevoProveedor.nombre}`,
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        });
      }
    );

    const unsubscribeUpdated = subscribe(
      "ProveedorUpdated",
      (proveedorActualizado) => {
        // Actualiza el proveedor en la lista
        setProveedores((prev) => {
          const newData = prev.map((prov) =>
            prov.idProveedor === proveedorActualizado.idProveedor
              ? proveedorActualizado
              : prov
          );
          // Apply current filters to new data
          const filtered = applyFilters(newData, searchTerm, statusFilter);
          setFilteredProveedores(filtered);
          return newData;
        });

        // Muestra notificación toast
        Swal.fire({
          position: "top-end",
          icon: "info",
          title: "Proveedor actualizado",
          text: `Se actualizó: ${proveedorActualizado.nombre}`,
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        });
      }
    );

    const unsubscribeDeleted = subscribe("ProveedorDeleted", (id) => {
      // Marca el proveedor como inactivo
      setProveedores((prev) => {
        const newData = prev.map((prov) =>
          prov.idProveedor === id ? { ...prov, esActivo: false } : prov
        );
        // Apply current filters to new data
        const filtered = applyFilters(newData, searchTerm, statusFilter);
        setFilteredProveedores(filtered);
        return newData;
      });

      // Muestra notificación toast
      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Proveedor eliminado",
        text: "Un proveedor fue eliminado",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
    });

    // Limpieza de suscripciones al desmontar el componente
    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe]); // Removed searchTerm dependency

  // Separate useEffect to handle search term and status filter changes
  useEffect(() => {
    const filtered = applyFilters(proveedores, searchTerm, statusFilter);
    setFilteredProveedores(filtered);
  }, [searchTerm, statusFilter, proveedores]);

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "Correo",
      selector: (row) => row.correo,
      sortable: true,
    },
    {
      name: "Telefono",
      selector: (row) => row.telefono,
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
      name: "",
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
            onClick={() => eliminarProveedor(row.idProveedor)}
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

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  const abrirEditarModal = (data) => {
    setProveedor(data);
    setModoSoloLectura(false);
    setVerModal(!verModal);
  };

  const abrirVerModal = (data) => {
    setProveedor(data);
    setModoSoloLectura(true);
    setVerModal(!verModal);
  };

  const cerrarModal = () => {
    setProveedor(modeloProveedor);
    setModoSoloLectura(false);
    setVerModal(!verModal);
  };

  const guardarCambios = async () => {
    try {
      let response;
      if (proveedor.idProveedor === 0) {
        const newProveedor = {
          nombre: proveedor.nombre,
          correo: proveedor.correo,
          telefono: proveedor.telefono,
          esActivo: proveedor.esActivo,
        };

        response = await fetch("api/proveedor/Guardar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(newProveedor),
        });
      } else {
        response = await fetch("api/proveedor/Editar", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(proveedor),
        });
      }

      if (response.ok) {
        // No es necesario actualizar manualmente, SignalR se encargará
        setProveedor(modeloProveedor);
        setVerModal(!verModal);
        Swal.fire(
          `${proveedor.idProveedor === 0 ? "Guardado" : "Actualizado"}`,
          `El proveedor fue ${
            proveedor.idProveedor === 0 ? "agregado" : "actualizado"
          }`,
          "success"
        );
      } else {
        const errorData = await response.json();
        Swal.fire("Error", errorData.message || "Error al guardar", "error");
      }
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
      Swal.fire("Error", "Ocurrió un error inesperado", "error");
    }
  };

  const eliminarProveedor = async (id) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Desea eliminar el proveedor",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "No, volver",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let response = await fetch(`api/proveedor/Eliminar/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            // No es necesario actualizar manualmente, SignalR se encargará
            Swal.fire("Eliminado!", "El proveedor fue eliminado.", "success");
          } else {
            const errorData = await response.json();
            Swal.fire(
              "Error",
              errorData.message || "Error al eliminar",
              "error"
            );
          }
        } catch (error) {
          console.error("Error eliminando proveedor:", error);
          Swal.fire("Error", "Ocurrió un error inesperado", "error");
        }
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    guardarCambios();
  };

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader style={{ backgroundColor: "#4e73df", color: "white" }}>
              <Row>
                <Col sm="6">
                  <h5>Lista de Proveedores</h5>
                </Col>
                <Col sm="6" className="text-right">
                  <Button
                    color="success"
                    size="sm"
                    onClick={() => setVerModal(!verModal)}
                  >
                    <i className="fas fa-plus-circle mr-2"></i>
                    Nuevo Proveedor
                  </Button>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Row className="mb-3">
                <Col sm="2">
                  <Input
                    type="select"
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    bsSize="sm"
                    style={{
                      border: "2px solid #4e73df",
                      borderRadius: "5px",
                    }}
                  >
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                  </Input>
                </Col>
                <Col sm="3">
                  <Input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearch}
                    bsSize="sm"
                    style={{
                      border: "2px solid #4e73df",
                      borderRadius: "5px",
                    }}
                  />
                </Col>
                <Col sm="7" className="text-right">
                  <Button
                    color="danger"
                    size="sm"
                    className="mr-2"
                    onClick={exportToPDFHandler}
                  >
                    <i className="fas fa-file-pdf mr-1"></i>
                    PDF
                  </Button>
                  <Button
                    color="success"
                    size="sm"
                    onClick={exportToExcelHandler}
                  >
                    <i className="fas fa-file-excel mr-1"></i>
                    Excel
                  </Button>
                </Col>
              </Row>

              <DataTable
                columns={columns}
                data={filteredProveedores}
                progressPending={pendiente}
                pagination
                paginationComponentOptions={paginationComponentOptions}
                customStyles={customStyles}
                fixedHeader
                fixedHeaderScrollHeight="600px"
                noDataComponent={
                  <div className="text-center p-4">
                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                    <p className="text-muted">
                      No se encontraron registros coincidentes
                    </p>
                  </div>
                }
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal Proveedor */}
      <Modal isOpen={verModal} toggle={cerrarModal} centered>
        <form onSubmit={handleSubmit}>
          <ModalHeader toggle={cerrarModal}>
            {proveedor.idProveedor === 0
              ? "Nuevo Proveedor"
              : modoSoloLectura
              ? "Ver Proveedor"
              : "Editar Proveedor"}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col sm={6}>
                <FormGroup>
                  <Label>Nombre *</Label>
                  <Input
                    bsSize="sm"
                    name="nombre"
                    onChange={handleChange}
                    value={proveedor.nombre}
                    required
                    readOnly={modoSoloLectura}
                  />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <Label>Correo *</Label>
                  <Input
                    bsSize="sm"
                    name="correo"
                    onChange={handleChange}
                    value={proveedor.correo}
                    type="email"
                    required
                    readOnly={modoSoloLectura}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col sm={6}>
                <FormGroup>
                  <Label>Teléfono</Label>
                  <Input
                    bsSize="sm"
                    name="telefono"
                    onChange={handleChange}
                    value={proveedor.telefono}
                    readOnly={modoSoloLectura}
                  />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <Label>Estado</Label>
                  <Input
                    bsSize="sm"
                    type="select"
                    name="esActivo"
                    onChange={handleChange}
                    value={proveedor.esActivo}
                    disabled={modoSoloLectura}
                  >
                    <option value={true}>Activo</option>
                    <option value={false}>No Activo</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
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

export default Proveedor;
