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
import { FaEyeSlash, FaEye } from "react-icons/fa";
import {
  exportToPDF,
  exportToExcel,
  applySearchFilter,
} from "../utils/exportHelpers";
import ModalPermisos from "../componentes/ModalPermisos";

const modeloUsuario = {
  idUsuario: 0,
  nombre: "",
  correo: "",
  telefono: "",
  idRol: 0,
  clave: "",
  esActivo: true,
  claveActual: "",
  claveNueva: "",
};

const Usuario = () => {
  const [usuario, setUsuario] = useState(modeloUsuario);
  const [pendiente, setPendiente] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [roles, setRoles] = useState([]);
  const [verModal, setVerModal] = useState(false);
  const [modoSoloLectura, setModoSoloLectura] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [cambiandoClave, setCambiandoClave] = useState(false);
  const [verModalPermisos, setVerModalPermisos] = useState(false);
  const [usuarioPermisos, setUsuarioPermisos] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value,
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
        { accessor: (item) => item.idRolNavigation?.descripcion || "" },
        { accessor: (item) => (item.esActivo ? "activo" : "no activo") },
      ];

      filtered = applySearchFilter(filtered, searchValue, searchFields);
    }

    return filtered;
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = applyFilters(usuarios, value, statusFilter);
    setFilteredUsuarios(filtered);
  };

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setStatusFilter(value);

    const filtered = applyFilters(usuarios, searchTerm, value);
    setFilteredUsuarios(filtered);
  };

  const exportToPDFHandler = () => {
    const columns = [
      { header: "Nombre", accessor: (row) => row.nombre },
      { header: "Correo", accessor: (row) => row.correo },
      { header: "Teléfono", accessor: (row) => row.telefono },
      {
        header: "Rol",
        accessor: (row) => row.idRolNavigation?.descripcion || "",
      },
      {
        header: "Estado",
        accessor: (row) => (row.esActivo ? "Activo" : "No Activo"),
      },
    ];

    exportToPDF(filteredUsuarios, columns, "Lista_de_Usuarios");
  };

  const exportToExcelHandler = () => {
    const excelData = filteredUsuarios.map((user) => ({
      ID: user.idUsuario,
      Nombre: user.nombre,
      Correo: user.correo,
      Teléfono: user.telefono,
      Rol: user.idRolNavigation?.descripcion || "",
      Estado: user.esActivo ? "Activo" : "No Activo",
    }));

    exportToExcel(excelData, "Usuarios");
  };

  const obtenerRoles = async () => {
    try {
      let response = await fetch("api/rol/Lista");
      if (response.ok) {
        let data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      Swal.fire("Error", "Error al obtener roles", "error");
    }
  };

  const obtenerUsuarios = async () => {
    try {
      let response = await fetch("api/usuario/Lista");
      if (response.ok) {
        let data = await response.json();
        setUsuarios(data);
        setFilteredUsuarios(data);
        setPendiente(false);
      }
    } catch (error) {
      Swal.fire("Error", "Error al obtener usuarios", "error");
    }
  };

  useEffect(() => {
    obtenerRoles();
    obtenerUsuarios();

  }, []);

  // Separate useEffect to handle search term and status filter changes
  useEffect(() => {
    const filtered = applyFilters(usuarios, searchTerm, statusFilter);
    setFilteredUsuarios(filtered);
  }, [searchTerm, statusFilter, usuarios]);

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
      name: "Rol",
      selector: (row) => row.idRolNavigation,
      sortable: true,
      cell: (row) => row.idRolNavigation?.descripcion || "Sin rol", // Manejo de nulos
    },
    {
      name: "Estado",
      selector: (row) => row.esActivo,
      sortable: true,
      cell: (row) => {
        let clase = row.esActivo
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
        <div className="d-flex">
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
          {row.idRolNavigation?.descripcion === "Empleado" && (
            <Button
              color="warning"
              size="sm"
              className="mr-2"
              onClick={() => abrirModalPermisos(row)}
              title="Gestionar Permisos"
            >
              <i className="fas fa-key"></i>
            </Button>
          )}
          <Button
            color="danger"
            size="sm"
            onClick={() => eliminarUsuario(row.idUsuario)}
          >
            <i className="fas fa-trash-alt"></i>
          </Button>
        </div>
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
    setUsuario({
      ...data,
      clave: "",
      claveActual: "",
      claveNueva: "",
    });
    setCambiandoClave(false);
    setModoSoloLectura(false);
    setVerModal(true);
  };

  const abrirVerModal = (data) => {
    setUsuario({
      ...data,
      clave: "",
      claveActual: "",
      claveNueva: "",
    });
    setCambiandoClave(false);
    setModoSoloLectura(true);
    setVerModal(true);
  };

  const abrirNuevoModal = () => {
    setUsuario(modeloUsuario);
    setCambiandoClave(false);
    setModoSoloLectura(false);
    setVerModal(true);
  };

  const abrirModalPermisos = (data) => {
    setUsuarioPermisos(data);
    setVerModalPermisos(true);
  };

  const cerrarModalPermisos = () => {
    setUsuarioPermisos(null);
    setVerModalPermisos(false);
  };

  const cerrarModal = () => {
    setUsuario(modeloUsuario);
    setVerModal(false);
    setVisiblePassword(false);
    setCambiandoClave(false);
    setModoSoloLectura(false);
  };

  const guardarCambios = async () => {
    try {
      let payload;
      let url;
      let method;

      if (usuario.idUsuario === 0) {
        // Nuevo usuario
        payload = { ...usuario };
        delete payload.idRolNavigation;
        url = "api/usuario/Guardar";
        method = "POST";
      } else {
        // Edición existente
        payload = {
          idUsuario: usuario.idUsuario,
          nombre: usuario.nombre,
          correo: usuario.correo,
          telefono: usuario.telefono,
          idRol: usuario.idRol,
          esActivo: usuario.esActivo === "true" || usuario.esActivo === true,
          claveActual: cambiandoClave ? usuario.claveActual : "",
          claveNueva: cambiandoClave ? usuario.claveNueva : "",
        };

        url = "api/usuario/Editar";
        method = "PATCH";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await obtenerUsuarios();
        cerrarModal();
        Swal.fire(
          `${usuario.idUsuario === 0 ? "Creado" : "Actualizado"}`,
          `El usuario fue ${
            usuario.idUsuario === 0 ? "agregado" : "actualizado"
          }`,
          "success"
        );
      } else {
        const error = await response.text();
        Swal.fire("Error", error, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error en la conexión con el servidor", "error");
    }
  };

  const eliminarUsuario = async (id) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "¿Desea eliminar este usuario permanentemente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`api/usuario/Eliminar/${id}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              obtenerUsuarios();
              Swal.fire("Eliminado!", "El usuario fue eliminado.", "success");
            } else {
              return response.text().then((error) => {
                Swal.fire("Error", error, "error");
              });
            }
          })
          .catch((error) => {
            Swal.fire("Error", "Error al conectar con el servidor", "error");
          });
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    guardarCambios();
  };

  const handleVisiblePassword = () => {
    setVisiblePassword((prev) => !prev);
  };

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader style={{ backgroundColor: "#4e73df", color: "white" }}>
              <Row>
                <Col sm="6">
                  <h5>Lista de Usuarios</h5>
                </Col>
                <Col sm="6" className="text-right">
                  <Button color="success" size="sm" onClick={abrirNuevoModal}>
                    <i className="fas fa-plus-circle mr-2"></i>
                    Nuevo Usuario
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
                      border: "2px solid #4e73df",
                      borderRadius: "5px",
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
                data={filteredUsuarios}
                customStyles={customStyles}
                pagination
                paginationComponentOptions={paginationComponentOptions}
                fixedHeader
                fixedHeaderScrollHeight="600px"
                progressPending={pendiente}
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

      {/* Modal Usuario */}
      <Modal isOpen={verModal} toggle={cerrarModal} centered>
        <form onSubmit={handleSubmit}>
          <ModalHeader toggle={cerrarModal}>
            {modoSoloLectura
              ? "Ver Usuario"
              : usuario.idUsuario === 0
              ? "Nuevo Usuario"
              : "Editar Usuario"}
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
                    value={usuario.nombre}
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
                    value={usuario.correo}
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
                    value={usuario.telefono}
                    readOnly={modoSoloLectura}
                  />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <Label>Rol *</Label>
                  <Input
                    bsSize="sm"
                    type="select"
                    name="idRol"
                    onChange={handleChange}
                    value={usuario.idRol}
                    required
                    disabled={modoSoloLectura}
                  >
                    <option value="">Seleccionar rol...</option>
                    {roles.map((item) => (
                      <option key={item.idRol} value={item.idRol}>
                        {item.descripcion}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            {/* Contraseña para nuevo usuario */}
            {usuario.idUsuario === 0 && !modoSoloLectura && (
              <Row>
                <Col sm="6">
                  <FormGroup>
                    <Label>Contraseña *</Label>
                    <div className="position-relative">
                      <Input
                        bsSize="sm"
                        name="clave"
                        onChange={handleChange}
                        value={usuario.clave}
                        type={visiblePassword ? "text" : "password"}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-sm position-absolute"
                        style={{ right: 5, top: 0, zIndex: 10 }}
                        onClick={handleVisiblePassword}
                      >
                        {visiblePassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label>Estado *</Label>
                    <Input
                      bsSize="sm"
                      type="select"
                      name="esActivo"
                      onChange={handleChange}
                      value={usuario.esActivo}
                      required
                      disabled={modoSoloLectura}
                    >
                      <option value={true}>Activo</option>
                      <option value={false}>Inactivo</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            )}

            {/* Campos para edición */}
            {usuario.idUsuario !== 0 && (
              <>
                <Row>
                  <Col sm="6">
                    <FormGroup>
                      <Label>Estado *</Label>
                      <Input
                        bsSize="sm"
                        type="select"
                        name="esActivo"
                        onChange={handleChange}
                        value={usuario.esActivo}
                        required
                        disabled={modoSoloLectura}
                      >
                        <option value={true}>Activo</option>
                        <option value={false}>Inactivo</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  {!modoSoloLectura && (
                    <Col sm="6">
                      <FormGroup className="d-flex align-items-center mt-4">
                        <Input
                          type="checkbox"
                          id="cambiarClave"
                          checked={cambiandoClave}
                          onChange={() => setCambiandoClave(!cambiandoClave)}
                          className="mr-2"
                        />
                        <Label for="cambiarClave" className="mb-0">
                          Cambiar contraseña
                        </Label>
                      </FormGroup>
                    </Col>
                  )}
                </Row>

                {cambiandoClave && !modoSoloLectura && (
                  <Row>
                    <Col sm="6">
                      <FormGroup>
                        <Label>Contraseña Actual *</Label>
                        <Input
                          bsSize="sm"
                          name="claveActual"
                          onChange={handleChange}
                          value={usuario.claveActual}
                          type="password"
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup>
                        <Label>Nueva Contraseña *</Label>
                        <Input
                          bsSize="sm"
                          name="claveNueva"
                          onChange={handleChange}
                          value={usuario.claveNueva}
                          type="password"
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {!modoSoloLectura && (
              <Button type="submit" size="sm" color="primary">
                {usuario.idUsuario === 0 ? "Crear Usuario" : "Guardar Cambios"}
              </Button>
            )}
            <Button size="sm" color="danger" onClick={cerrarModal}>
              Cerrar
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal de Permisos */}
      <ModalPermisos
        isOpen={verModalPermisos}
        toggle={cerrarModalPermisos}
        usuario={usuarioPermisos}
      />
    </>
  );
};

export default Usuario;
