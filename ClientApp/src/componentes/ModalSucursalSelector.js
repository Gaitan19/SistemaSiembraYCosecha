import { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Swal from "sweetalert2";

const ModalSucursalSelector = ({ isOpen, onSucursalSelected }) => {
  const [sucursales, setSucursales] = useState([]);
  const [selectedSucursalId, setSelectedSucursalId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      obtenerSucursalesActivas();
    }
  }, [isOpen]);

  const obtenerSucursalesActivas = () => {
    setLoading(true);
    fetch("api/sucursal/active", {
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
          // Auto-select the first branch if only one exists
          if (dataJson.length === 1) {
            setSelectedSucursalId(dataJson[0].idSucursal.toString());
          }
        } else {
          setSucursales([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setSucursales([]);
        setLoading(false);
        Swal.fire("Error", "No se pudieron cargar las sucursales", "error");
      });
  };

  const handleSeleccionar = () => {
    if (!selectedSucursalId || selectedSucursalId === "") {
      Swal.fire("Advertencia", "Debe seleccionar una sucursal", "warning");
      return;
    }

    const sucursalSeleccionada = sucursales.find(
      (s) => s.idSucursal.toString() === selectedSucursalId
    );

    if (sucursalSeleccionada) {
      onSucursalSelected(sucursalSeleccionada);
    }
  };

  const handleCambioSucursal = (e) => {
    setSelectedSucursalId(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} backdrop="static" keyboard={false}>
      <ModalHeader>
        <i className="fas fa-building"></i> Seleccionar Sucursal
      </ModalHeader>
      <ModalBody>
        <div className="text-center mb-3">
          <p className="mb-1">
            <strong>¡Bienvenido Administrador!</strong>
          </p>
          <p className="text-muted">
            Seleccione la sucursal con la que desea trabajar.
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Cargando...</span>
            </div>
            <p className="mt-2">Cargando sucursales...</p>
          </div>
        ) : (
          <FormGroup>
            <Label for="sucursalSelect">
              <strong>Sucursal:</strong>
            </Label>
            <Input
              type="select"
              id="sucursalSelect"
              value={selectedSucursalId}
              onChange={handleCambioSucursal}
            >
              <option value="">Seleccione una sucursal...</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.idSucursal} value={sucursal.idSucursal}>
                  {sucursal.departamento} - {sucursal.direccion}
                </option>
              ))}
            </Input>
          </FormGroup>
        )}

        <div className="alert alert-info" role="alert">
          <small>
            <i className="fas fa-info-circle"></i> Puede cambiar de sucursal en
            cualquier momento desde el menú superior.
          </small>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={handleSeleccionar}
          disabled={loading || !selectedSucursalId}
        >
          <i className="fas fa-check"></i> Continuar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalSucursalSelector;