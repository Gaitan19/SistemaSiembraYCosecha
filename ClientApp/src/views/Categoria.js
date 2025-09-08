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
import { useSignalR } from "../context/SignalRProvider";

const modeloCategoria = {
  idCategoria: 0,
  descripcion: "",
  esActivo: true,
};

const Categoria = () => {
  const [categoria, setCategoria] = useState(modeloCategoria);
  const [pendiente, setPendiente] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [verModal, setVerModal] = useState(false);
  const [modoSoloLectura, setModoSoloLectura] = useState(false);
  const { subscribe } = useSignalR();

  const handleChange = (e) => {
    let value =
      e.target.nodeName === "SELECT"
        ? e.target.value === "true"
          ? true
          : false
        : e.target.value;

    setCategoria({
      ...categoria,
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
        { accessor: (item) => item.descripcion },
        { accessor: (item) => (item.esActivo ? "activo" : "no activo") },
      ];

      filtered = applySearchFilter(filtered, searchValue, searchFields);
    }

    return filtered;
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = applyFilters(categorias, value, statusFilter);
    setFilteredCategorias(filtered);
  };

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setStatusFilter(value);

    const filtered = applyFilters(categorias, searchTerm, value);
    setFilteredCategorias(filtered);
  };

  const exportToPDFHandler = () => {
    const columns = [
      { header: "Descripción", accessor: (row) => row.descripcion },
      {
        header: "Estado",
        accessor: (row) => (row.esActivo ? "Activo" : "No Activo"),
      },
    ];

    exportToPDF(filteredCategorias, columns, "Lista_de_Categorias");
  };

  const exportToExcelHandler = () => {
    const excelData = filteredCategorias.map((cat) => ({
      ID: cat.idCategoria,
      Descripción: cat.descripcion,
      Estado: cat.esActivo ? "Activo" : "No Activo",
    }));

    exportToExcel(excelData, "Categorias");
  };

  const obtenerCategorias = async () => {
    let response = await fetch("api/categoria/Lista");

    if (response.ok) {
      let data = await response.json();
      setCategorias(() => data);
      setFilteredCategorias(() => data);
      setPendiente(false);
    }
  };

  useEffect(() => {
    obtenerCategorias();

    // Set up SignalR listeners for real-time updates
    const unsubscribeCreated = subscribe(
      "CategoriaCreated",
      (nuevaCategoria) => {
        setCategorias((prev) => {
          const newData = [nuevaCategoria, ...prev];
          // Apply current filters to new data
          const filtered = applyFilters(newData, searchTerm, statusFilter);
          setFilteredCategorias(filtered);
          return newData;
        });
        Swal.fire({
          position: "top-end",
          icon: "info",
          title: "Nueva categoría agregada",
          text: `Se agregó: ${nuevaCategoria.descripcion}`,
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        });
      }
    );

    const unsubscribeUpdated = subscribe(
      "CategoriaUpdated",
      (categoriaActualizada) => {
        setCategorias((prev) => {
          const newData = prev.map((cat) =>
            cat.idCategoria === categoriaActualizada.idCategoria
              ? categoriaActualizada
              : cat
          );
          // Apply current filters to new data
          const filtered = applyFilters(newData, searchTerm, statusFilter);
          setFilteredCategorias(filtered);
          return newData;
        });
        Swal.fire({
          position: "top-end",
          icon: "info",
          title: "Categoría actualizada",
          text: `Se actualizó: ${categoriaActualizada.descripcion}`,
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        });
      }
    );

    const unsubscribeDeleted = subscribe("CategoriaDeleted", (id) => {
      setCategorias((prev) => {
        const newData = prev.map((cat) =>
          cat.idCategoria === id ? { ...cat, esActivo: false } : cat
        );
        // Apply current filters to new data
        const filtered = applyFilters(newData, searchTerm, statusFilter);
        setFilteredCategorias(filtered);
        return newData;
      });

      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Categoría eliminada",
        text: "Una categoría fue eliminada",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
    });

    // Cleanup function
    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe]); // Removed searchTerm dependency

  // Separate useEffect to handle search term and status filter changes
  useEffect(() => {
    const filtered = applyFilters(categorias, searchTerm, statusFilter);
    setFilteredCategorias(filtered);
  }, [searchTerm, statusFilter, categorias]);

  const columns = [
    {
      name: "Descripcion",
      selector: (row) => row.descripcion,
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
            onClick={() => eliminarCategoria(row.idCategoria)}
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
    setCategoria(data);
    setModoSoloLectura(false);
    setVerModal(!verModal);
  };

  const abrirVerModal = (data) => {
    setCategoria(data);
    setModoSoloLectura(true);
    setVerModal(!verModal);
  };

  const cerrarModal = () => {
    setCategoria(modeloCategoria);
    setModoSoloLectura(false);
    setVerModal(!verModal);
  };

  const guardarCambios = async () => {
    let response;
    if (categoria.idCategoria === 0) {
      response = await fetch("api/categoria/Guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(categoria),
      });
    } else {
      response = await fetch("api/categoria/Editar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(categoria),
      });
    }

    if (response.ok) {
      await obtenerCategorias();
      setCategoria(modeloCategoria);
      setVerModal(!verModal);
      Swal.fire(
        `${categoria.idCategoria === 0 ? "Guardada" : "Actualizada"}`,
        `La categoria fue ${
          categoria.idCategoria === 0 ? "Agregada" : "Actualizada"
        }`,
        "success"
      );
    } else {
      alert("error al guardar");
    }
  };

  const eliminarCategoria = async (id) => {
    Swal.fire({
      title: "Esta seguro?",
      text: "Desesa eliminar esta categoria",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, continuar",
      cancelButtonText: "No, volver",
    }).then((result) => {
      if (result.isConfirmed) {
        // eslint-disable-next-line no-unused-vars
        const response = fetch("api/categoria/Eliminar/" + id, {
          method: "DELETE",
        }).then((response) => {
          if (response.ok) {
            obtenerCategorias();

            Swal.fire("Eliminado!", "La categoria fue eliminada.", "success");
          }
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
                  <h5>Lista de Categorías</h5>
                </Col>
                <Col sm="6" className="text-right">
                  <Button
                    color="success"
                    size="sm"
                    onClick={() => setVerModal(!verModal)}
                  >
                    <i className="fas fa-plus-circle mr-2"></i>
                    Nueva Categoría
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
                data={filteredCategorias}
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

      <Modal isOpen={verModal} toggle={cerrarModal}>
        <form onSubmit={handleSubmit}>
          <ModalHeader toggle={cerrarModal}>
            {categoria.idCategoria === 0
              ? "Nueva Categoría"
              : modoSoloLectura
              ? "Ver Categoría"
              : "Editar Categoría"}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col sm={12}>
                <FormGroup>
                  <Label>Descripción</Label>
                  <Input
                    bsSize="sm"
                    name="descripcion"
                    onChange={handleChange}
                    value={categoria.descripcion}
                    required
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
                    value={categoria.esActivo}
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

export default Categoria;
