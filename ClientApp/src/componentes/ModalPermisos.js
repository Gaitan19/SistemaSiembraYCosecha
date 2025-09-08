import React, { useState, useEffect, useCallback } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Table } from 'reactstrap';
import Swal from 'sweetalert2';

const ModalPermisos = ({ isOpen, toggle, usuario }) => {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarPermisosUsuario = useCallback(async () => {
    setLoading(true);
    try {
      // Primero obtenemos todos los empleados con sus permisos
      const response = await fetch('api/permisos/Empleados');
      if (response.ok) {
        const empleados = await response.json();
        const empleadoActual = empleados.find(emp => emp.idUsuario === usuario.idUsuario);
        
        if (empleadoActual) {
          setPermisos(empleadoActual.permisos);
        } else {
          // Si no está en la lista, obtener módulos y crear permisos vacíos
          const modulosResponse = await fetch('api/permisos/Modulos');
          if (modulosResponse.ok) {
            const modulos = await modulosResponse.json();
            const permisosVacios = modulos.map(modulo => ({
              idModulo: modulo.idModulo,
              nombreModulo: modulo.nombre,
              descripcionModulo: modulo.descripcion || modulo.nombre,
              tienePermiso: false
            }));
            setPermisos(permisosVacios);
          }
        }
      }
    } catch (error) {
      console.error('Error cargando permisos:', error);
      Swal.fire('Error', 'No se pudieron cargar los permisos', 'error');
    }
    setLoading(false);
  }, [usuario]);

  useEffect(() => {
    if (isOpen && usuario && usuario.idUsuario) {
      cargarPermisosUsuario();
    }
  }, [isOpen, usuario, cargarPermisosUsuario]);

  const handlePermisoChange = (idModulo, tienePermiso) => {
    setPermisos(prev => 
      prev.map(permiso => 
        permiso.idModulo === idModulo 
          ? { ...permiso, tienePermiso: tienePermiso }
          : permiso
      )
    );
  };

  const guardarPermisos = async () => {
    setLoading(true);
    try {
      const payload = {
        idUsuario: usuario.idUsuario,
        permisos: permisos.map(p => ({
          idModulo: p.idModulo,
          tienePermiso: p.tienePermiso
        }))
      };

      const response = await fetch('api/permisos/ActualizarPermisos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        Swal.fire('Éxito', 'Permisos actualizados correctamente', 'success');
        toggle();
      } else {
        const error = await response.text();
        Swal.fire('Error', error, 'error');
      }
    } catch (error) {
      console.error('Error guardando permisos:', error);
      Swal.fire('Error', 'No se pudieron guardar los permisos', 'error');
    }
    setLoading(false);
  };

  const toggleTodosPermisos = (habilitar) => {
    setPermisos(prev => 
      prev.map(permiso => ({ ...permiso, tienePermiso: habilitar }))
    );
  };

  if (!usuario || usuario.idRolNavigation?.descripcion !== "Empleado") {
    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Gestión de Permisos</ModalHeader>
        <ModalBody>
          <p>Los permisos solo se pueden gestionar para usuarios de tipo Empleado.</p>
          <p>Los usuarios Administradores tienen acceso a todos los módulos.</p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cerrar</Button>
        </ModalFooter>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        Gestión de Permisos - {usuario.nombre}
      </ModalHeader>
      <ModalBody>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Cargando...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <Button 
                color="success" 
                size="sm" 
                className="me-2"
                onClick={() => toggleTodosPermisos(true)}
              >
                Habilitar Todos
              </Button>
              <Button 
                color="warning" 
                size="sm"
                onClick={() => toggleTodosPermisos(false)}
              >
                Deshabilitar Todos
              </Button>
            </div>
            
            <Table striped>
              <thead>
                <tr>
                  <th>Módulo</th>
                  <th>Descripción</th>
                  <th className="text-center">Acceso</th>
                </tr>
              </thead>
              <tbody>
                {permisos.map((permiso, index) => (
                  <tr key={permiso.idModulo || index}>
                    <td>
                      <strong>{permiso.nombreModulo}</strong>
                    </td>
                    <td>{permiso.descripcionModulo}</td>
                    <td className="text-center">
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={permiso.tienePermiso}
                            onChange={(e) => handlePermisoChange(permiso.idModulo, e.target.checked)}
                          />
                          {permiso.tienePermiso ? 'Permitido' : 'Denegado'}
                        </Label>
                      </FormGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={loading}>
          Cancelar
        </Button>
        <Button color="primary" onClick={guardarPermisos} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Permisos'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalPermisos;