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
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/apiHelpers";

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
    let value =
      e.target.nodeName === "SELECT"
        ? e.target.value === "true"
          ? true
          : false
        : e.target.value;

    setSucursal({
      ...sucursal,
      [e.target.name]: value,
    });
  };

  const obtenerSucursales = async () => {
    setPendiente(true);
    try {
      const response = await apiGet("api/sucursal/Lista");
      
      if (response.ok) {
        const data = await response.json();
        setSucursales(data);
        setFilteredSucursales(data);
      } else {
        throw new Error('Failed to fetch sucursales');
      }
    } catch (error) {
      console.error('Error fetching sucursales:', error);
      Swal.fire("Error", "No se pudieron cargar las sucursales", "error");
    } finally {
      setPendiente(false);
    }
  };

  useEffect(() => {
    obtenerSucursales();
  }, []);

  useEffect(() => {
    const filtered = applySearchFilter(
      sucursales,
      searchTerm,
      statusFilter,
      ["departamento", "direccion"]
    );
    setFilteredSucursales(filtered);
  }, [searchTerm, statusFilter, sucursales]);

  const abrirModal = (modelo = null, soloLectura = false) => {
    setSucursal(modelo || modeloSucursal);
    setModoSoloLectura(soloLectura);
    setVerModal(true);
  };

  const cerrarModal = () => {
    setVerModal(false);
  };

  const guardar = async () => {
    if (sucursal.departamento.trim() === "" || sucursal.direccion.trim() === "") {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    try {
      if (sucursal.idSucursal === 0) {
        // Create new sucursal
        const response = await apiPost("api/sucursal/Guardar", sucursal);
        
        if (response.ok) {
          cerrarModal();
          await obtenerSucursales();
          Swal.fire("Éxito", "Sucursal creada correctamente", "success");
        } else {
          throw new Error('Failed to create sucursal');
        }
      } else {
        // Update existing sucursal
        const response = await apiPut("api/sucursal/Editar", sucursal);
        
        if (response.ok) {
          cerrarModal();
          await obtenerSucursales();
          Swal.fire("Éxito", "Sucursal actualizada correctamente", "success");
        } else {
          throw new Error('Failed to update sucursal');
        }
      }
    } catch (error) {
      console.error('Error saving sucursal:', error);
      Swal.fire("Error", "No se pudo guardar la sucursal", "error");
    }
  };

  const eliminar = (sucursalEliminar) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: `Desea eliminar la sucursal "${sucursalEliminar.departamento}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await apiDelete(`api/sucursal/Eliminar/${sucursalEliminar.idSucursal}`);
          
          if (response.ok) {
            await obtenerSucursales();
            Swal.fire("Eliminado", "La sucursal ha sido eliminada", "success");
          } else {
            throw new Error('Failed to delete sucursal');
          }
        } catch (error) {
          console.error('Error deleting sucursal:', error);
          Swal.fire("Error", "No se pudo eliminar la sucursal", "error");
        }
      }
    });
  };

  const columnas = [
    {
      name: "Departamento",
      selector: (row) => row.departamento,
      sortable: true,
    },
    {
      name: "Dirección",
      selector: (row) => row.direccion,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => (row.esActivo ? "Activo" : "Inactivo"),
      sortable: true,
      cell: (row) => (
        <span
          className={`badge ${row.esActivo ? "badge-success" : "badge-danger"}`}
        >
          {row.esActivo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="d-flex">
          <Button
            className="btn btn-primary btn-sm me-2"
            onClick={() => abrirModal(row, true)}
          >
            <i className="fas fa-eye"></i>
          </Button>
          <Button
            className="btn btn-warning btn-sm me-2"
            onClick={() => abrirModal(row, false)}
          >
            <i className="fas fa-pen"></i>
          </Button>
          <Button
            className="btn btn-danger btn-sm"
            onClick={() => eliminar(row)}
          >
            <i className="fas fa-trash"></i>
          </Button>
        </div>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontSize: "13px",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        fontSize: "12px",
      },
    },
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Row>
            <Col sm="6">
              <h5>Lista de Sucursales</h5>
            </Col>
            <Col sm="6" className="text-right">
              <Button
                size="sm"
                color="success"
                onClick={() => abrirModal(null, false)}
              >
                <i className="fas fa-plus"></i> Nueva Sucursal
              </Button>
              <Button
                size="sm"
                color="info"
                className="ms-2"
                onClick={() => exportToPDF(filteredSucursales, "sucursales", ["departamento", "direccion", "esActivo"])}
              >
                <i className="fas fa-file-pdf"></i> PDF
              </Button>
              <Button
                size="sm"
                color="success"
                className="ms-2"
                onClick={() => exportToExcel(filteredSucursales, "sucursales")}
              >
                <i className="fas fa-file-excel"></i> Excel
              </Button>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Row className="mb-3">
            <Col sm="6">
              <Input
                placeholder="Buscar sucursal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col sm="6">
              <Input
                type="select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </Input>
            </Col>
          </Row>
          <DataTable
            columns={columnas}
            data={filteredSucursales}
            progressPending={pendiente}
            pagination
            customStyles={customStyles}
            noDataComponent="No se encontraron sucursales"
          />
        </CardBody>
      </Card>

      <Modal isOpen={verModal} toggle={cerrarModal} size="md">
        <ModalHeader toggle={cerrarModal}>
          {modoSoloLectura ? "Ver Sucursal" : sucursal.idSucursal === 0 ? "Nueva Sucursal" : "Editar Sucursal"}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Departamento</Label>
            <Input
              name="departamento"
              type="text"
              value={sucursal.departamento}
              onChange={handleChange}
              readOnly={modoSoloLectura}
            />
          </FormGroup>
          <FormGroup>
            <Label>Dirección</Label>
            <Input
              name="direccion"
              type="text"
              value={sucursal.direccion}
              onChange={handleChange}
              readOnly={modoSoloLectura}
            />
          </FormGroup>
          <FormGroup>
            <Label>Estado</Label>
            <Input
              name="esActivo"
              type="select"
              value={sucursal.esActivo}
              onChange={handleChange}
              disabled={modoSoloLectura}
            >
              <option value={true}>Activo</option>
              <option value={false}>Inactivo</option>
            </Input>
          </FormGroup>
        </ModalBody>
        {!modoSoloLectura && (
          <ModalFooter>
            <Button color="primary" onClick={guardar}>
              {sucursal.idSucursal === 0 ? "Crear" : "Actualizar"}
            </Button>
            <Button color="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
          </ModalFooter>
        )}
      </Modal>
    </>
  );
};

export default Sucursal;