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

const modeloProducto = {
  idProducto: 0,
  nombre: "",
  descripcion: "",
  idCategoria: 0,
  idProveedor: 0,
  precio: 0,
  unidades: 0,
  esActivo: true,
};

const Producto = () => {
  const [producto, setProducto] = useState(modeloProducto);
  const [pendiente, setPendiente] = useState(true);
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [verModal, setVerModal] = useState(false);
  const [modoSoloLectura, setModoSoloLectura] = useState(false);
  const [verModalUnidades, setVerModalUnidades] = useState(false);
  const [productoParaUnidades, setProductoParaUnidades] = useState(null);
  const [unidadesAAgregar, setUnidadesAAgregar] = useState("");

  const handleChange = (e) => {
    let value;

    if (e.target.name === "idCategoria" || e.target.name === "idProveedor") {
      value = e.target.value;
    } else if (e.target.name === "esActivo") {
      value = e.target.value === "true" ? true : false;
    } else if (e.target.name === "unidades") {
      value = parseInt(e.target.value) || 0;
    } else {
      value = e.target.value;
    }

    setProducto({
      ...producto,
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
        { accessor: (item) => item.descripcion },
        { accessor: (item) => item.idCategoriaNavigation?.descripcion || "" },
        { accessor: (item) => item.idProveedorNavigation?.nombre || "" },
        { accessor: (item) => (item.esActivo ? "activo" : "no activo") },
      ];

      filtered = applySearchFilter(filtered, searchValue, searchFields);
    }

    return filtered;
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = applyFilters(productos, value, statusFilter);
    setFilteredProductos(filtered);
  };

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setStatusFilter(value);

    const filtered = applyFilters(productos, searchTerm, value);
    setFilteredProductos(filtered);
  };

  const exportToPDFHandler = () => {
    const columns = [
      { header: "Nombre", accessor: (row) => row.nombre },
      { header: "Descripción", accessor: (row) => row.descripcion },
      {
        header: "Categoría",
        accessor: (row) => row.idCategoriaNavigation?.descripcion || "",
      },
      {
        header: "Proveedor",
        accessor: (row) => row.idProveedorNavigation?.nombre || "",
      },
      { header: "Precio", accessor: (row) => `C$${row.precio}` },
      {
        header: "Estado",
        accessor: (row) => (row.esActivo ? "Activo" : "No Activo"),
      },
    ];

    exportToPDF(filteredProductos, columns, "Lista_de_Productos");
  };

  const exportToExcelHandler = () => {
    const excelData = filteredProductos.map((prod) => ({
      ID: prod.idProducto,
      Nombre: prod.nombre,
      Descripción: prod.descripcion,
      Categoría: prod.idCategoriaNavigation?.descripcion || "",
      Proveedor: prod.idProveedorNavigation?.nombre || "",
      Precio: `C$${prod.precio}`,
      Estado: prod.esActivo ? "Activo" : "No Activo",
    }));

    exportToExcel(excelData, "Productos");
  };

  const obtenerCategorias = async () => {
    try {
      let response = await fetch("api/categoria/Lista");
      if (response.ok) {
        let data = await response.json();
        setCategorias(() => data.filter((item) => item.esActivo));
      }
    } catch (error) {
      console.error("Error obteniendo categorías:", error);
    }
  };

  const obtenerProveedores = async () => {
    try {
      let response = await fetch("api/proveedor/Lista");
      if (response.ok) {
        let data = await response.json();
        setProveedores(() => data.filter((item) => item.esActivo));
      }
    } catch (error) {
      console.error("Error obteniendo proveedores:", error);
    }
  };

  const obtenerProductos = async () => {
    try {
      let response = await fetch("api/producto/Lista");
      if (response.ok) {
        let data = await response.json();
        setProductos(() => data);
        setFilteredProductos(() => data);
        setPendiente(false);
      }
    } catch (error) {
      console.error("Error obteniendo productos:", error);
      setPendiente(false);
    }
  };

  useEffect(() => {
    obtenerCategorias();
    obtenerProveedores();
    obtenerProductos();

  }, []);

  // Separate useEffect to handle search term and status filter changes
  useEffect(() => {
    const filtered = applyFilters(productos, searchTerm, statusFilter);
    setFilteredProductos(filtered);
  }, [searchTerm, statusFilter, productos]);

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "Descripcion",
      selector: (row) => row.descripcion,
      sortable: true,
    },
    {
      name: "Categoria",
      selector: (row) => row.idCategoriaNavigation,
      sortable: true,
      cell: (row) => row.idCategoriaNavigation.descripcion,
    },
    {
      name: "Proveedor",
      selector: (row) => row.idProveedorNavigation,
      sortable: true,
      cell: (row) => row.idProveedorNavigation?.nombre || "Sin proveedor",
    },
    {
      name: "Unidades",
      selector: (row) => row.unidades,
      sortable: true,
      cell: (row) => row.unidades || 0,
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
            color="success"
            size="sm"
            className="mr-2"
            onClick={() => abrirModalAgregarUnidades(row)}
            title="Agregar Unidades"
          >
            + Unidades
          </Button>

          <Button
            color="danger"
            size="sm"
            onClick={() => eliminarProducto(row.idProducto)}
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
    setProducto(data);
    setModoSoloLectura(false);
    setVerModal(!verModal);
  };

  const abrirVerModal = (data) => {
    setProducto(data);
    setModoSoloLectura(true);
    setVerModal(!verModal);
  };

  const cerrarModal = () => {
    setProducto(modeloProducto);
    setModoSoloLectura(false);
    setVerModal(!verModal);
  };

  const abrirModalAgregarUnidades = (data) => {
    setProductoParaUnidades(data);
    setUnidadesAAgregar("");
    setVerModalUnidades(true);
  };

  const cerrarModalUnidades = () => {
    setProductoParaUnidades(null);
    setUnidadesAAgregar("");
    setVerModalUnidades(false);
  };

  const agregarUnidades = async () => {
    try {
      // Validations
      if (!unidadesAAgregar || unidadesAAgregar.trim() === "") {
        Swal.fire("Advertencia", "Debe ingresar una cantidad de unidades", "warning");
        return;
      }

      const unidades = parseInt(unidadesAAgregar);
      if (isNaN(unidades)) {
        Swal.fire("Advertencia", "Debe ingresar un número entero válido", "warning");
        return;
      }

      if (unidades <= 0) {
        Swal.fire("Advertencia", "Debe ingresar un número positivo", "warning");
        return;
      }

      const response = await fetch(`api/producto/AgregarUnidades/${productoParaUnidades.idProducto}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(unidades),
      });

      if (response.ok) {
        await obtenerProductos();
        cerrarModalUnidades();
        
        Swal.fire(
          "Éxito",
          `Se agregaron ${unidades} unidades al producto`,
          "success"
        );
      } else {
        const errorText = await response.text();
        Swal.fire("Error", `No se pudieron agregar las unidades: ${errorText}`, "error");
      }
    } catch (error) {
      console.error("Error al agregar unidades:", error);
      Swal.fire("Error", "Ocurrió un error inesperado", "error");
    }
  };

  const guardarCambios = async () => {
    try {
      // Eliminar propiedades de navegación para evitar problemas en la serialización
      const productoParaEnviar = { ...producto };
      delete productoParaEnviar.idCategoriaNavigation;
      delete productoParaEnviar.idProveedorNavigation;

      let response;
      if (productoParaEnviar.idProducto === 0) {
        response = await fetch("api/producto/Guardar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(productoParaEnviar),
        });
      } else {
        response = await fetch("api/producto/Editar", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(productoParaEnviar),
        });
      }

      if (response.ok) {
        await obtenerProductos();
        setProducto(modeloProducto);
        setVerModal(!verModal);

        Swal.fire(
          `${productoParaEnviar.idProducto === 0 ? "Guardado" : "Actualizado"}`,
          `El producto fue ${
            productoParaEnviar.idProducto === 0 ? "Agregado" : "Actualizado"
          }`,
          "success"
        );
      } else {
        const errorText = await response.text();
        Swal.fire("Opp!", `No se pudo guardar: ${errorText}`, "warning");
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      Swal.fire("Error", "Ocurrió un error inesperado", "error");
    }
  };

  const eliminarProducto = async (id) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Desea eliminar el producto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "No, volver",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("api/producto/Eliminar/" + id, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              obtenerProductos();
              Swal.fire("Eliminado!", "El producto fue eliminado.", "success");
            } else {
              response.text().then((errorText) => {
                Swal.fire("Error", `Error al eliminar: ${errorText}`, "error");
              });
            }
          })
          .catch((error) => {
            console.error("Error eliminando producto:", error);
            Swal.fire("Error", "Ocurrió un error inesperado", "error");
          });
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
                  <h5>Lista de Productos</h5>
                </Col>
                <Col sm="6" className="text-right">
                  <Button
                    color="success"
                    size="sm"
                    onClick={() => setVerModal(!verModal)}
                  >
                    <i className="fas fa-plus-circle mr-2"></i>
                    Nuevo Producto
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
                data={filteredProductos}
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

      <Modal isOpen={verModal} toggle={cerrarModal} size="lg">
        <form onSubmit={handleSubmit}>
          <ModalHeader toggle={cerrarModal}>
            {producto.idProducto === 0
              ? "Nuevo Producto"
              : modoSoloLectura
              ? "Ver Producto"
              : "Editar Producto"}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col sm={6}>
                <FormGroup>
                  <Label>Nombre</Label>
                  <Input
                    bsSize="sm"
                    name="nombre"
                    onChange={handleChange}
                    value={producto.nombre}
                    required
                    readOnly={modoSoloLectura}
                  />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <Label>Descripción</Label>
                  <Input
                    bsSize="sm"
                    name="descripcion"
                    onChange={handleChange}
                    value={producto.descripcion}
                    required
                    readOnly={modoSoloLectura}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <FormGroup>
                  <Label>Categoría</Label>
                  <Input
                    bsSize="sm"
                    type="select"
                    name="idCategoria"
                    onChange={handleChange}
                    value={producto.idCategoria}
                    required
                    disabled={modoSoloLectura}
                  >
                    <option value={0}>Seleccionar</option>
                    {categorias.map((item) => (
                      <option key={item.idCategoria} value={item.idCategoria}>
                        {item.descripcion}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <Label>Proveedor</Label>
                  <Input
                    bsSize="sm"
                    type="select"
                    name="idProveedor"
                    onChange={handleChange}
                    value={producto.idProveedor}
                    disabled={modoSoloLectura}
                  >
                    <option value={0}>Seleccionar</option>
                    {proveedores.map((item) => (
                      <option key={item.idProveedor} value={item.idProveedor}>
                        {item.nombre}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <FormGroup>
                  <Label>Precio</Label>
                  <Input
                    bsSize="sm"
                    name="precio"
                    type="number"
                    min={0.01}
                    step="0.01"
                    onChange={handleChange}
                    value={producto.precio}
                    required
                    readOnly={modoSoloLectura}
                  />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <Label>Unidades</Label>
                  <Input
                    bsSize="sm"
                    name="unidades"
                    type="number"
                    min={0}
                    step="1"
                    onChange={handleChange}
                    value={producto.unidades}
                    readOnly={modoSoloLectura}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <FormGroup>
                  <Label>Estado</Label>
                  <Input
                    bsSize="sm"
                    type="select"
                    name="esActivo"
                    onChange={handleChange}
                    value={producto.esActivo}
                    disabled={modoSoloLectura}
                  >
                    <option value={true}>Activo</option>
                    <option value={false}>Inactivo</option>
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

      {/* Modal para agregar unidades */}
      <Modal isOpen={verModalUnidades} toggle={cerrarModalUnidades}>
        <ModalHeader toggle={cerrarModalUnidades}>
          Agregar Unidades - {productoParaUnidades?.nombre}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Unidades actuales: {productoParaUnidades?.unidades || 0}</Label>
          </FormGroup>
          <FormGroup>
            <Label>Ingrese las unidades a agregar:</Label>
            <Input
              type="number"
              min="1"
              step="1"
              value={unidadesAAgregar}
              onChange={(e) => setUnidadesAAgregar(e.target.value)}
              placeholder="Ingrese un número entero positivo"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={agregarUnidades}>
            Agregar
          </Button>
          <Button color="secondary" onClick={cerrarModalUnidades}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Producto;
