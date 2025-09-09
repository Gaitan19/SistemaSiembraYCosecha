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

const modeloSucursal = {
  idSucursal: 0,
  departamento: "",
  direccion: "",
  esActivo: true,
};

const Sucursal = () => {
  const [sucursal, setSucursal] = useState(modeloSucursal);
  const [pendiente, setPendiente] = useState(true);
  const [sucursales, setSucursales] = useState([]);
  const [filteredSucursales, setFilteredSucursales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [verModal, setVerModal] = useState(false);
  const [modoSoloLectura, setModoSoloLectura] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSucursal({
      ...sucursal,
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
        { accessor: (item) => item.departamento },
        { accessor: (item) => item.direccion },
        { accessor: (item) => (item.esActivo ? "activo" : "no activo") },
      ];

      filtered = applySearchFilter(filtered, searchValue, searchFields);
    }

    return filtered;
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = applyFilters(sucursales, value, statusFilter);
    setFilteredSucursales(filtered);
  };

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setStatusFilter(value);

    const filtered = applyFilters(sucursales, searchTerm, value);
    setFilteredSucursales(filtered);
  };

  const obtenerSucursales = () => {
    fetch("api/sucursal", {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    })
      .then((response) => {
        return response.ok ? response.json() : Promise.reject(response);
      })
      .then((dataJson) => {
        if (Array.isArray(dataJson)) {
          setSucursales(dataJson);
          const filtered = applyFilters(dataJson, searchTerm, statusFilter);
          setFilteredSucursales(filtered);
        } else {
          setSucursales([]);
          setFilteredSucursales([]);
        }
        setPendiente(false);
      })
      .catch((error) => {
        console.log(error);
        setSucursales([]);
        setFilteredSucursales([]);
        setPendiente(false);
      });
  };

  useEffect(() => {
    obtenerSucursales();
  }, []);

  useEffect(() => {
    const filtered = applyFilters(sucursales, searchTerm, statusFilter);
    setFilteredSucursales(filtered);
  }, [sucursales, searchTerm, statusFilter]);

  const abrirModal = (modelo = modeloSucursal, modoLectura = false, editar = false) => {
    setSucursal(modelo);
    setModoSoloLectura(modoLectura);
    setVerModal(true);
  };

  const cerrarModal = () => {
    setSucursal(modeloSucursal);
    setModoSoloLectura(false);
    setVerModal(false);
  };

  const guardarSucursal = () => {
    if (sucursal.departamento.trim() === "" || sucursal.direccion.trim() === "") {
      Swal.fire("Oops!", "Complete todos los campos", "warning");
      return;
    }

    const request = {
      method: sucursal.idSucursal === 0 ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(sucursal),
    };

    const endpoint =
      sucursal.idSucursal === 0
        ? "api/sucursal"
        : `api/sucursal/${sucursal.idSucursal}`;

    fetch(endpoint, request)
      .then((response) => {
        return response.ok ? response.json() : Promise.reject(response);
      })
      .then(() => {
        obtenerSucursales();
        cerrarModal();
        Swal.fire(
          "¡Éxito!",
          "La sucursal se guardó correctamente.",
          "success"
        );
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Oops!", "No se pudo guardar la sucursal", "error");
      });
  };

  const eliminarSucursal = (sucursal) => {
    Swal.fire({
      title: "¿Desactivar sucursal?",
      text: `Desactivará la sucursal "${sucursal.departamento}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`api/sucursal/${sucursal.idSucursal}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        })
          .then((response) => {
            return response.ok ? response.json() : Promise.reject(response);
          })
          .then(() => {
            obtenerSucursales();
            Swal.fire(
              "¡Éxito!",
              "La sucursal se desactivó correctamente.",
              "success"
            );
          })
          .catch((error) => {
            console.log(error);
            Swal.fire("Oops!", "No se pudo desactivar la sucursal", "error");
          });
      }
    });
  };

  const columnas = [
    {
      name: "Departamento",
      selector: (fila) => fila.departamento,
      sortable: true,
      width: "200px",
    },
    {
      name: "Dirección",
      selector: (fila) => fila.direccion,
      sortable: true,
      width: "300px",
    },
    {
      name: "Estado",
      selector: (fila) => (fila.esActivo ? "Activo" : "No Activo"),
      sortable: true,
      width: "120px",
    },
    {
      name: "Acciones",
      cell: (fila) => (
        <>
          <Button
            className="me-2"
            size="sm"
            color="primary"
            onClick={() => abrirModal(fila, false, true)}
          >
            <i className="fas fa-pen"></i>
          </Button>

          <Button
            size="sm"
            color="danger"
            onClick={() => eliminarSucursal(fila)}
          >
            <i className="fas fa-trash-alt"></i>
          </Button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "120px",
    },
  ];

  const exportToPdf = () => {
    const columnsForExport = [
      { header: "Departamento", dataKey: "departamento" },
      { header: "Dirección", dataKey: "direccion" },
      {
        header: "Estado",
        dataKey: "esActivo",
        formatter: (value) => (value ? "Activo" : "No Activo"),
      },
    ];
    exportToPDF(filteredSucursales, columnsForExport, "Sucursales");
  };

  const exportToExc = () => {
    const columnsForExport = [
      { header: "Departamento", dataKey: "departamento" },
      { header: "Dirección", dataKey: "direccion" },
      {
        header: "Estado",
        dataKey: "esActivo",
        formatter: (value) => (value ? "Activo" : "No Activo"),
      },
    ];
    exportToExcel(filteredSucursales, columnsForExport, "Sucursales");
  };

  return (
    <div className="container-fluid">
      <Card>
        <CardHeader style={{ backgroundColor: "#4e73df", color: "white" }}>
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">
                <i className="fas fa-building"></i> Sucursales
              </h4>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Row className="mb-3">
            <Col md={3}>
              <Button
                size="sm"
                color="success"
                onClick={() => abrirModal()}
              >
                <i className="fas fa-plus-circle"></i> Nuevo
              </Button>
            </Col>
            <Col md={3}>
              <Input
                type="select"
                value={statusFilter}
                onChange={handleStatusFilter}
              >
                <option value="todos">Todos los estados</option>
                <option value="activos">Solo activos</option>
                <option value="inactivos">Solo inactivos</option>
              </Input>
            </Col>
            <Col md={3}>
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </Col>
            <Col md={3} className="text-end">
              <Button
                size="sm"
                color="danger"
                className="me-2"
                onClick={exportToPdf}
              >
                <i className="fas fa-file-pdf"></i> PDF
              </Button>
              <Button size="sm" color="success" onClick={exportToExc}>
                <i className="fas fa-file-excel"></i> Excel
              </Button>
            </Col>
          </Row>

          <DataTable
            columns={columnas}
            data={filteredSucursales}
            progressPending={pendiente}
            pagination
            paginationComponentOptions={{
              rowsPerPageText: "Filas por página:",
              rangeSeparatorText: "de",
              selectAllRowsItem: true,
              selectAllRowsItemText: "Todos",
            }}
          />
        </CardBody>
      </Card>

      <Modal isOpen={verModal} toggle={cerrarModal}>
        <ModalHeader toggle={cerrarModal}>
          {sucursal.idSucursal === 0 ? "Nueva Sucursal" : "Editar Sucursal"}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Departamento</Label>
            <Input
              type="text"
              name="departamento"
              placeholder="Ingrese el departamento"
              value={sucursal.departamento}
              onChange={handleChange}
              readOnly={modoSoloLectura}
            />
          </FormGroup>
          <FormGroup>
            <Label>Dirección</Label>
            <Input
              type="textarea"
              name="direccion"
              placeholder="Ingrese la dirección completa"
              value={sucursal.direccion}
              onChange={handleChange}
              readOnly={modoSoloLectura}
            />
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                name="esActivo"
                checked={sucursal.esActivo}
                onChange={(e) =>
                  setSucursal({ ...sucursal, esActivo: e.target.checked })
                }
                disabled={modoSoloLectura}
              />
              Sucursal activa
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          {!modoSoloLectura && (
            <Button color="primary" onClick={guardarSucursal}>
              Guardar
            </Button>
          )}
          <Button color="secondary" onClick={cerrarModal}>
            {modoSoloLectura ? "Cerrar" : "Cancelar"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Sucursal;