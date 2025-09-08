import { Card, CardBody, CardHeader, Col, FormGroup, Label, Row, Button } from "reactstrap";
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { exportToPDF, exportToExcel } from '../utils/exportHelpers';

const Cierre = () => {
    // State for filters
    const [dateRange, setDateRange] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tipoPago, setTipoPago] = useState("");
    const [tipoDinero, setTipoDinero] = useState("");
    
    // State for data
    const [pendiente, setPendiente] = useState(false);
    const [cierreData, setCierreData] = useState(null);
    const [ingresos, setIngresos] = useState([]);
    const [egresos, setEgresos] = useState([]);
    
    // State for calculations
    const [totalIngresos, setTotalIngresos] = useState(0);
    const [totalEgresos, setTotalEgresos] = useState(0);
    const [saldoCierre, setSaldoCierre] = useState(0);
    const [monedaSimbolo, setMonedaSimbolo] = useState("");

    // Handle date range selection
    const handleDateRangeChange = (value) => {
        setDateRange(value);
        setShowDatePicker(value === "Elegir Rango");
        
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        switch (value) {
            case "Hoy":
                setStartDate(today);
                setEndDate(today);
                break;
            case "Ayer":
                setStartDate(yesterday);
                setEndDate(yesterday);
                break;
            case "Esta Semana":
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                setStartDate(startOfWeek);
                setEndDate(today);
                break;
            case "Este Mes":
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                setStartDate(startOfMonth);
                setEndDate(today);
                break;
            default:
                break;
        }
    };

    // Calculate closure when all filters are selected
    const calcularCierre = async () => {
        // Validate required filters
        if (!dateRange) {
            Swal.fire('Error', 'Debe seleccionar un rango de fechas', 'error');
            return;
        }
        if (!tipoPago) {
            Swal.fire('Error', 'Debe seleccionar un tipo de pago', 'error');
            return;
        }
        if (!tipoDinero) {
            Swal.fire('Error', 'Debe seleccionar un tipo de moneda', 'error');
            return;
        }

        setPendiente(true);
        
        try {
            const fechaInicio = startDate.toLocaleDateString('en-GB'); // dd/MM/yyyy format
            const fechaFin = endDate.toLocaleDateString('en-GB');
            
            const url = `api/cierre/Calcular?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&tipoPago=${tipoPago}&tipoDinero=${tipoDinero}`;
            
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                setCierreData(data);
                setIngresos(data.ingresos);
                setEgresos(data.egresos);
                setTotalIngresos(data.totalIngresos);
                setTotalEgresos(data.totalEgresos);
                setSaldoCierre(data.saldoCierre);
                setMonedaSimbolo(data.monedaSimbolo);
                
                if (data.ingresos.length === 0 && data.egresos.length === 0) {
                    Swal.fire('Información', 'No se encontraron registros para los filtros seleccionados', 'info');
                }
            } else {
                throw new Error('Error al obtener datos');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudo calcular el cierre contable', 'error');
        } finally {
            setPendiente(false);
        }
    };

    // Reset data when filters change (calculation only happens on button click)
    useEffect(() => {
        if (cierreData) {
            // Clear results when filters change after a calculation has been done
            setCierreData(null);
            setIngresos([]);
            setEgresos([]);
            setTotalIngresos(0);
            setTotalEgresos(0);
            setSaldoCierre(0);
            setMonedaSimbolo("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange, startDate, endDate, tipoPago, tipoDinero]);

    // Columns for Ingresos table
    const ingresosColumns = [
        {
            name: "Descripción",
            selector: (row) => row.descripcion,
            sortable: true,
            grow: 2,
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
            cell: (row) => `${monedaSimbolo}${parseFloat(row.monto).toFixed(2)}`,
        },
        {
            name: "Tipo Pago",
            selector: (row) => row.tipoPago,
            sortable: true,
        },
        {
            name: "Usuario",
            selector: (row) => row.nombreUsuario,
            sortable: true,
        },
    ];

    // Columns for Egresos table
    const egresosColumns = [
        {
            name: "Descripción",
            selector: (row) => row.descripcion,
            sortable: true,
            grow: 2,
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
            cell: (row) => `${monedaSimbolo}${parseFloat(row.monto).toFixed(2)}`,
        },
        {
            name: "Tipo Pago",
            selector: (row) => row.tipoPago,
            sortable: true,
        },
        {
            name: "Usuario",
            selector: (row) => row.nombreUsuario,
            sortable: true,
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                fontSize: '13px',
                fontWeight: 800,
            },
        },
        headRow: {
            style: {
                backgroundColor: "#eee",
            }
        }
    };

    // Export functions
    const exportToExcelHandler = () => {
        if (!cierreData) {
            Swal.fire('Error', 'No hay datos para exportar', 'error');
            return;
        }

        const excelData = [
            {
                'Concepto': 'RESUMEN CIERRE CONTABLE',
                'Valor': ''
            },
            {
                'Concepto': `Total Ingresos`,
                'Valor': `${monedaSimbolo}${totalIngresos.toFixed(2)}`
            },
            {
                'Concepto': `Total Egresos`,
                'Valor': `${monedaSimbolo}${totalEgresos.toFixed(2)}`
            },
            {
                'Concepto': `Saldo Cierre`,
                'Valor': `${monedaSimbolo}${saldoCierre.toFixed(2)}`
            },
            {},
            {
                'Concepto': 'DETALLE INGRESOS',
                'Valor': ''
            },
            ...ingresos.map(ing => ({
                'Concepto': ing.descripcion,
                'Fecha': ing.fechaRegistro,
                'Monto': `${monedaSimbolo}${parseFloat(ing.monto).toFixed(2)}`,
                'Tipo Pago': ing.tipoPago,
                'Usuario': ing.nombreUsuario
            })),
            {},
            {
                'Concepto': 'DETALLE EGRESOS',
                'Valor': ''
            },
            ...egresos.map(egr => ({
                'Concepto': egr.descripcion,
                'Fecha': egr.fechaRegistro,
                'Monto': `${monedaSimbolo}${parseFloat(egr.monto).toFixed(2)}`,
                'Tipo Pago': egr.tipoPago,
                'Usuario': egr.nombreUsuario
            }))
        ];

        exportToExcel(excelData, 'Cierre_Contable');
    };

    const exportToPDFHandler = () => {
        if (!cierreData) {
            Swal.fire('Error', 'No hay datos para exportar', 'error');
            return;
        }

        const columns = [
            { header: 'Tipo', accessor: (row) => row.tipo },
            { header: 'Descripción', accessor: (row) => row.descripcion },
            { header: 'Fecha', accessor: (row) => row.fechaRegistro },
            { header: 'Monto', accessor: (row) => `${monedaSimbolo}${parseFloat(row.monto).toFixed(2)}` },
            { header: 'Usuario', accessor: (row) => row.nombreUsuario }
        ];

        const pdfData = [
            ...ingresos.map(ing => ({ ...ing, tipo: 'Ingreso' })),
            ...egresos.map(egr => ({ ...egr, tipo: 'Egreso' }))
        ];

        const analytics = {
            type: 'closure',
            totalIngresos: `${monedaSimbolo}${totalIngresos.toFixed(2)}`,
            totalEgresos: `${monedaSimbolo}${totalEgresos.toFixed(2)}`,
            saldoCierre: `${monedaSimbolo}${saldoCierre.toFixed(2)}`
        };

        exportToPDF(pdfData, columns, 'Cierre_Contable', analytics);
    };

    return (
        <>
            <Row>
                <Col sm={12}>
                    <Card>
                        <CardHeader style={{ backgroundColor: '#4e73df', color: "white" }}>
                            Cierre Contable
                        </CardHeader>
                        <CardBody>
                            {/* Filters Section */}
                            <Row className="align-items-end mb-3">
                                <Col sm={3}>
                                    <FormGroup>
                                        <Label>Rango de fechas:</Label>
                                        <select 
                                            className="form-control form-control-sm"
                                            value={dateRange}
                                            onChange={(e) => handleDateRangeChange(e.target.value)}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Hoy">Hoy</option>
                                            <option value="Ayer">Ayer</option>
                                            <option value="Esta Semana">Esta Semana</option>
                                            <option value="Este Mes">Este Mes</option>
                                            <option value="Elegir Rango">Elegir Rango</option>
                                        </select>
                                    </FormGroup>
                                </Col>

                                {showDatePicker && (
                                    <>
                                        <Col sm={2}>
                                            <FormGroup>
                                                <Label>Fecha inicio:</Label>
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={(date) => setStartDate(date)}
                                                    className="form-control form-control-sm"
                                                    dateFormat="dd/MM/yyyy"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm={2}>
                                            <FormGroup>
                                                <Label>Fecha fin:</Label>
                                                <DatePicker
                                                    selected={endDate}
                                                    onChange={(date) => setEndDate(date)}
                                                    className="form-control form-control-sm"
                                                    dateFormat="dd/MM/yyyy"
                                                />
                                            </FormGroup>
                                        </Col>
                                    </>
                                )}

                                <Col sm={showDatePicker ? 2 : 3}>
                                    <FormGroup>
                                        <Label>Tipo de pago:</Label>
                                        <select 
                                            className="form-control form-control-sm"
                                            value={tipoPago}
                                            onChange={(e) => setTipoPago(e.target.value)}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Transferencia">Transferencia</option>
                                            <option value="Efectivo">Efectivo</option>
                                        </select>
                                    </FormGroup>
                                </Col>

                                <Col sm={showDatePicker ? 2 : 3}>
                                    <FormGroup>
                                        <Label>Tipo de moneda:</Label>
                                        <select 
                                            className="form-control form-control-sm"
                                            value={tipoDinero}
                                            onChange={(e) => setTipoDinero(e.target.value)}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Cordobas">Cordobas</option>
                                            <option value="Dolares">Dolares</option>
                                        </select>
                                    </FormGroup>
                                </Col>

                                <Col sm={1}>
                                    <FormGroup>
                                        <Button 
                                            color="primary" 
                                            size="sm" 
                                            block 
                                            onClick={calcularCierre}
                                            disabled={!dateRange || !tipoPago || !tipoDinero}
                                        >
                                            <i className="fa fa-calculator" aria-hidden="true"></i>
                                        </Button>
                                    </FormGroup>
                                </Col>
                            </Row>

                            {/* Results Summary */}
                            {cierreData && (
                                <Row className="mb-4">
                                    <Col sm={12}>
                                        <Card className="border-left-primary shadow h-100 py-2">
                                            <CardBody>
                                                <Row className="no-gutters align-items-center">
                                                    <Col sm={4} className="text-center">
                                                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                            Total Ingresos
                                                        </div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                            {monedaSimbolo}{totalIngresos.toFixed(2)}
                                                        </div>
                                                    </Col>
                                                    <Col sm={4} className="text-center">
                                                        <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                                            Total Egresos
                                                        </div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                            {monedaSimbolo}{totalEgresos.toFixed(2)}
                                                        </div>
                                                    </Col>
                                                    <Col sm={4} className="text-center">
                                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                            Saldo Cierre
                                                        </div>
                                                        <div className={`h4 mb-0 font-weight-bold ${saldoCierre >= 0 ? 'text-success' : 'text-danger'}`}>
                                                            {monedaSimbolo}{saldoCierre.toFixed(2)}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            )}

                            {/* Export Buttons */}
                            {cierreData && (
                                <Row className="mb-3">
                                    <Col sm={6}>
                                        <Button color="success" size="sm" onClick={exportToExcelHandler}>
                                            <i className="fa fa-file-excel" aria-hidden="true"></i> Exportar Excel
                                        </Button>
                                    </Col>
                                    <Col sm={6} className="text-right">
                                        <Button color="danger" size="sm" onClick={exportToPDFHandler}>
                                            <i className="fa fa-file-pdf" aria-hidden="true"></i> Exportar PDF
                                        </Button>
                                    </Col>
                                </Row>
                            )}

                            {/* Tables Section */}
                            {cierreData && (
                                <>
                                    <hr />
                                    <Row>
                                        <Col sm={6}>
                                            <h5 className="text-success">Ingresos ({ingresos.length})</h5>
                                            <DataTable
                                                progressPending={pendiente}
                                                columns={ingresosColumns}
                                                data={ingresos}
                                                customStyles={customStyles}
                                                pagination
                                                paginationPerPage={10}
                                                noDataComponent="No hay ingresos para mostrar"
                                            />
                                        </Col>
                                        <Col sm={6}>
                                            <h5 className="text-danger">Egresos ({egresos.length})</h5>
                                            <DataTable
                                                progressPending={pendiente}
                                                columns={egresosColumns}
                                                data={egresos}
                                                customStyles={customStyles}
                                                pagination
                                                paginationPerPage={10}
                                                noDataComponent="No hay egresos para mostrar"
                                            />
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Cierre;