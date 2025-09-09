import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useSucursal } from '../context/SucursalProvider'
import Swal from 'sweetalert2'

const SucursalSelectionModal = ({ show, onClose, onSucursalSelected }) => {
    const { sucursales, cargarSucursales } = useSucursal()
    const [selectedSucursal, setSelectedSucursal] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (show) {
            setLoading(true)
            cargarSucursales()
                .then(() => setLoading(false))
                .catch((error) => {
                    console.error('Error loading sucursales:', error)
                    setLoading(false)
                    Swal.fire(
                        'Error',
                        'No se pudieron cargar las sucursales',
                        'error'
                    )
                })
        }
    }, [show, cargarSucursales])

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (!selectedSucursal) {
            Swal.fire(
                'Atención',
                'Debe seleccionar una sucursal para continuar',
                'warning'
            )
            return
        }

        const sucursal = sucursales.find(s => s.idSucursal === parseInt(selectedSucursal))
        if (sucursal) {
            onSucursalSelected(sucursal)
        }
    }

    const handleCangePassword = () => {
        // For now, just show a message. In a real app, you might want to redirect to a different route
        Swal.fire(
            'Información',
            'Para cambiar la sucursal más tarde, puede hacerlo desde el menú de usuario',
            'info'
        )
    }

    return (
        <Modal show={show} onHide={onClose} backdrop="static" keyboard={false} centered>
            <Modal.Header>
                <Modal.Title>Seleccionar Sucursal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center mb-3">
                    <p className="text-muted">
                        Como administrador, debe seleccionar la sucursal con la que desea trabajar
                    </p>
                </div>
                
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Cargando...</span>
                        </div>
                        <p className="mt-2">Cargando sucursales...</p>
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Sucursal</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedSucursal}
                                onChange={(e) => setSelectedSucursal(e.target.value)}
                                required
                            >
                                <option value="">Seleccione una sucursal...</option>
                                {sucursales.map((sucursal) => (
                                    <option key={sucursal.idSucursal} value={sucursal.idSucursal}>
                                        {sucursal.departamento} - {sucursal.direccion}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        
                        <div className="d-flex justify-content-between">
                            <Button variant="secondary" type="button" onClick={handleCangePassword}>
                                Cambiar después
                            </Button>
                            <Button variant="primary" type="submit" disabled={!selectedSucursal}>
                                Continuar
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    )
}

export default SucursalSelectionModal