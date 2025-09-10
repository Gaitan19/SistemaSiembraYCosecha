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
    const [reportMode, setReportMode] = useState("");
    const [tipoPago, setTipoPago] = useState("");
    const [tipoDinero, setTipoDinero] = useState("");
    const [tipoCambioDolar, setTipoCambioDolar] = useState("");
    
    // State for data
    const [pendiente, setPendiente] = useState(false);
    const [cierreData, setCierreData] = useState(null);
    const [ingresos, setIngresos] = useState([]);
    const [egresos, setEgresos] = useState([]);
    const [consolidatedData, setConsolidatedData] = useState(null);
    
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
        if (!reportMode) {
            Swal.fire('Error', 'Debe seleccionar un tipo de reporte', 'error');
            return;
        }
        
        if (reportMode === "Segmentación por método y moneda") {
            if (!tipoPago) {
                Swal.fire('Error', 'Debe seleccionar un tipo de pago', 'error');
                return;
            }
            if (!tipoDinero) {
                Swal.fire('Error', 'Debe seleccionar un tipo de moneda', 'error');
                return;
            }
        } else if (reportMode === "Consolidado general") {
            if (!tipoCambioDolar || parseFloat(tipoCambioDolar) <= 0) {
                Swal.fire('Error', 'Debe ingresar un tipo de cambio válido', 'error');
                return;
            }
        }

        setPendiente(true);
        
        try {
            const fechaInicio = startDate.toLocaleDateString('en-GB'); // dd/MM/yyyy format
            const fechaFin = endDate.toLocaleDateString('en-GB');
            
            if (reportMode === "Segmentación por método y moneda") {
                // Existing logic for segmented report
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
                    setConsolidatedData(null);
                    
                    if (data.ingresos.length === 0 && data.egresos.length === 0) {
                        Swal.fire('Información', 'No se encontraron registros para los filtros seleccionados', 'info');
                    }
                } else {
                    throw new Error('Error al obtener datos');
                }
            } else {
                // New logic for consolidated report using real API calls
                const tipoCambio = parseFloat(tipoCambioDolar);
                
                // Define the 5 combinations we need to fetch
                const combinations = [
                    { tipoPago: "Efectivo", tipoDinero: "Cordobas" },
                    { tipoPago: "Efectivo", tipoDinero: "Dolares" },
                    { tipoPago: "Transferencia", tipoDinero: "Cordobas" },
                    { tipoPago: "Transferencia", tipoDinero: "Dolares" },
                    { tipoPago: "Tarjeta", tipoDinero: "Cordobas" }
                ];
                
                try {
                    // Make all 5 API calls in parallel
                    const promises = combinations.map(combo => {
                        const url = `api/cierre/Calcular?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&tipoPago=${combo.tipoPago}&tipoDinero=${combo.tipoDinero}`;
                        return fetch(url).then(response => {
                            if (response.ok) {
                                return response.json().then(data => ({ ...data, ...combo }));
                            } else {
                                throw new Error(`Error fetching data for ${combo.tipoPago}-${combo.tipoDinero}`);
                            }
                        });
                    });
                    
                    const results = await Promise.all(promises);
                    
                    // Process results - keep original amounts, only convert balance for dollars
                    const resumenPorTipo = results.map(result => {
                        const isDolares = result.tipoDinero === "Dolares";
                        
                        // Keep original amounts for ingresos and egresos
                        const totalIngresos = result.totalIngresos;
                        const totalEgresos = result.totalEgresos;
                        const saldoCierre = totalIngresos - totalEgresos;
                        
                        // For dollars, also calculate córdoba equivalent for balance only
                        const saldoCierreCordobas = isDolares ? saldoCierre * tipoCambio : null;
                        
                        return {
                            tipoPago: result.tipoPago,
                            tipoMoneda: result.tipoDinero,
                            totalIngresos,
                            totalEgresos,
                            saldoCierre,
                            saldoCierreCordobas, // Only balance is converted for dollars
                            ingresos: result.ingresos, // Keep original transaction data
                            egresos: result.egresos  // Keep original transaction data
                        };
                    });
                    
                    const consolidatedData = { resumenPorTipo };
                    
                    setConsolidatedData(consolidatedData);
                    setCierreData(null);
                    setIngresos([]);
                    setEgresos([]);
                    
                    // Calculate overall totals - convert dollar amounts to córdobas for global total
                    let totalIngresosConsolidado = 0;
                    let totalEgresosConsolidado = 0;
                    
                    consolidatedData.resumenPorTipo.forEach(item => {
                        const isDolares = item.tipoMoneda === "Dolares";
                        const conversionFactor = isDolares ? tipoCambio : 1;
                        
                        totalIngresosConsolidado += item.totalIngresos * conversionFactor;
                        totalEgresosConsolidado += item.totalEgresos * conversionFactor;
                    });
                    
                    setTotalIngresos(totalIngresosConsolidado);
                    setTotalEgresos(totalEgresosConsolidado);
                    setSaldoCierre(totalIngresosConsolidado - totalEgresosConsolidado);
                    setMonedaSimbolo("C$");
                    
                    if (consolidatedData.resumenPorTipo.every(item => item.ingresos.length === 0 && item.egresos.length === 0)) {
                        Swal.fire('Información', 'No se encontraron registros para los filtros seleccionados', 'info');
                    }
                } catch (error) {
                    console.error('Error fetching consolidated data:', error);
                    Swal.fire('Error', 'No se pudo obtener los datos del cierre consolidado', 'error');
                }
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
        if (cierreData || consolidatedData) {
            // Clear results when filters change after a calculation has been done
            setCierreData(null);
            setConsolidatedData(null);
            setIngresos([]);
            setEgresos([]);
            setTotalIngresos(0);
            setTotalEgresos(0);
            setSaldoCierre(0);
            setMonedaSimbolo("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange, startDate, endDate, reportMode, tipoPago, tipoDinero, tipoCambioDolar]);

    // Auto-select Cordobas when Tarjeta is selected
    useEffect(() => {
        if (tipoPago === "Tarjeta") {
            setTipoDinero("Cordobas");
        }
    }, [tipoPago]);

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
        if (!cierreData && !consolidatedData) {
            Swal.fire('Error', 'No hay datos para exportar', 'error');
            return;
        }

        let excelData = [];

        if (consolidatedData) {
            // Export consolidated data with detailed transactions
            excelData = [
                {
                    'Concepto': 'RESUMEN CIERRE CONSOLIDADO',
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
                {}
            ];

            // Add detailed information for each payment type/currency combination
            consolidatedData.resumenPorTipo.forEach(item => {
                const currencySymbol = item.tipoMoneda === "Dolares" ? "$" : "C$";
                
                // Category header
                excelData.push({
                    'Concepto': `${item.tipoPago.toUpperCase()} - ${item.tipoMoneda.toUpperCase()}`,
                    'Valor': ''
                });
                
                // Category summary
                excelData.push({
                    'Concepto': `Total Ingresos`,
                    'Valor': `${currencySymbol}${item.totalIngresos.toFixed(2)}`
                });
                excelData.push({
                    'Concepto': `Total Egresos`,
                    'Valor': `${currencySymbol}${item.totalEgresos.toFixed(2)}`
                });
                excelData.push({
                    'Concepto': `Saldo`,
                    'Valor': `${currencySymbol}${item.saldoCierre.toFixed(2)}`
                });
                
                // Add córdoba equivalent for dollar categories
                if (item.tipoMoneda === "Dolares") {
                    excelData.push({
                        'Concepto': `Saldo en Córdobas`,
                        'Valor': `C$${item.saldoCierreCordobas.toFixed(2)}`
                    });
                }
                
                excelData.push({});
                
                // Detailed Ingresos
                if (item.ingresos && item.ingresos.length > 0) {
                    excelData.push({
                        'Concepto': `INGRESOS DETALLADOS (${item.ingresos.length})`,
                        'Valor': ''
                    });
                    
                    item.ingresos.forEach(ing => {
                        excelData.push({
                            'Descripción': ing.descripcion,
                            'Fecha': ing.fechaRegistro,
                            'Monto': `${currencySymbol}${parseFloat(ing.monto).toFixed(2)}`,
                            'Tipo Pago': ing.tipoPago,
                            'Usuario': ing.nombreUsuario
                        });
                    });
                    
                    excelData.push({});
                }
                
                // Detailed Egresos
                if (item.egresos && item.egresos.length > 0) {
                    excelData.push({
                        'Concepto': `EGRESOS DETALLADOS (${item.egresos.length})`,
                        'Valor': ''
                    });
                    
                    item.egresos.forEach(egr => {
                        excelData.push({
                            'Descripción': egr.descripcion,
                            'Fecha': egr.fechaRegistro,
                            'Monto': `${currencySymbol}${parseFloat(egr.monto).toFixed(2)}`,
                            'Tipo Pago': egr.tipoPago,
                            'Usuario': egr.nombreUsuario
                        });
                    });
                    
                    excelData.push({});
                }
            });
        } else {
            // Export segmented data (existing logic)
            excelData = [
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
        }

        exportToExcel(excelData, 'Cierre_Contable');
    };

    const exportToPDFHandler = () => {
        if (!cierreData && !consolidatedData) {
            Swal.fire('Error', 'No hay datos para exportar', 'error');
            return;
        }

        let columns, pdfData, analytics;

        if (consolidatedData) {
            // Columnas para consolidado
            columns = [
                { header: 'Categoría', accessor: (row) => row.categoria },
                { header: 'Tipo', accessor: (row) => row.tipo },
                { header: 'Descripción', accessor: (row) => row.descripcion },
                { header: 'Fecha', accessor: (row) => row.fechaRegistro },
                { header: 'Monto', accessor: (row) => row.monto },
                { header: 'Usuario', accessor: (row) => row.nombreUsuario }
            ];

            pdfData = [];

            // Resumen general consolidado (totales globales en córdobas)
            pdfData.push({
                categoria: 'CONSOLIDADO',
                tipo: 'RESUMEN GENERAL',
                descripcion: `Total Ingresos: ${monedaSimbolo}${totalIngresos.toFixed(2)} | Total Egresos: ${monedaSimbolo}${totalEgresos.toFixed(2)} | Saldo: ${monedaSimbolo}${saldoCierre.toFixed(2)}`,
                fechaRegistro: '',
                monto: '',
                nombreUsuario: ''
            });

            // Línea vacía separadora
            pdfData.push({
                categoria: '',
                tipo: '',
                descripcion: '',
                fechaRegistro: '',
                monto: '',
                nombreUsuario: ''
            });

            // Detalle por categoría
            consolidatedData.resumenPorTipo.forEach(item => {
                const currencySymbol = item.tipoMoneda === "Dolares" ? "$" : "C$";
                const categoria = `${item.tipoPago} - ${item.tipoMoneda}`;

                // Resumen por categoría
                pdfData.push({
                    categoria,
                    tipo: 'RESUMEN',
                    descripcion: `Ingresos: ${currencySymbol}${item.totalIngresos.toFixed(2)} | Egresos: ${currencySymbol}${item.totalEgresos.toFixed(2)} | Saldo: ${currencySymbol}${item.saldoCierre.toFixed(2)}${item.tipoMoneda === "Dolares" ? ` (C$${item.saldoCierreCordobas.toFixed(2)})` : ''}`,
                    fechaRegistro: '',
                    monto: '',
                    nombreUsuario: ''
                });

                // Ingresos
                if (item.ingresos && item.ingresos.length > 0) {
                    item.ingresos.forEach(ing => {
                        pdfData.push({
                            categoria,
                            tipo: 'Ingreso',
                            descripcion: ing.descripcion,
                            fechaRegistro: ing.fechaRegistro,
                            monto: `${currencySymbol}${parseFloat(ing.monto).toFixed(2)}`,
                            nombreUsuario: ing.nombreUsuario
                        });
                    });
                }

                // Egresos
                if (item.egresos && item.egresos.length > 0) {
                    item.egresos.forEach(egr => {
                        pdfData.push({
                            categoria,
                            tipo: 'Egreso',
                            descripcion: egr.descripcion,
                            fechaRegistro: egr.fechaRegistro,
                            monto: `${currencySymbol}${parseFloat(egr.monto).toFixed(2)}`,
                            nombreUsuario: egr.nombreUsuario
                        });
                    });
                }

                // Separador entre categorías
                pdfData.push({
                    categoria: '',
                    tipo: '',
                    descripcion: '',
                    fechaRegistro: '',
                    monto: '',
                    nombreUsuario: ''
                });
            });

            analytics = {
                type: 'consolidated_closure_detailed',
                totalIngresos: `${monedaSimbolo}${totalIngresos.toFixed(2)}`,
                totalEgresos: `${monedaSimbolo}${totalEgresos.toFixed(2)}`,
                saldoCierre: `${monedaSimbolo}${saldoCierre.toFixed(2)}`,
                details: consolidatedData.resumenPorTipo.map(item => ({
                    category: `${item.tipoPago} - ${item.tipoMoneda}`,
                    ingresos: `${item.tipoMoneda === "Dolares" ? "$" : "C$"}${item.totalIngresos.toFixed(2)}`,
                    egresos: `${item.tipoMoneda === "Dolares" ? "$" : "C$"}${item.totalEgresos.toFixed(2)}`,
                    saldo: `${item.tipoMoneda === "Dolares" ? "$" : "C$"}${item.saldoCierre.toFixed(2)}`,
                    saldoCordobas: item.tipoMoneda === "Dolares" ? `C$${item.saldoCierreCordobas.toFixed(2)}` : null
                }))
            };
        } else {
            // Segmentado
            columns = [
                { header: 'Tipo', accessor: (row) => row.tipo },
                { header: 'Descripción', accessor: (row) => row.descripcion },
                { header: 'Fecha', accessor: (row) => row.fechaRegistro },
                { header: 'Monto', accessor: (row) => `${monedaSimbolo}${parseFloat(row.monto).toFixed(2)}` },
                { header: 'Usuario', accessor: (row) => row.nombreUsuario }
            ];

            pdfData = [
                ...ingresos.map(ing => ({ ...ing, tipo: 'Ingreso' })),
                ...egresos.map(egr => ({ ...egr, tipo: 'Egreso' }))
            ];

            analytics = {
                type: 'closure',
                totalIngresos: `${monedaSimbolo}${totalIngresos.toFixed(2)}`,
                totalEgresos: `${monedaSimbolo}${totalEgresos.toFixed(2)}`,
                saldoCierre: `${monedaSimbolo}${saldoCierre.toFixed(2)}`
            };
        }

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

                                <Col sm={showDatePicker ? 3 : 4}>
                                    <FormGroup>
                                        <Label>Tipo de reporte:</Label>
                                        <select 
                                            className="form-control form-control-sm"
                                            value={reportMode}
                                            onChange={(e) => setReportMode(e.target.value)}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Consolidado general">Consolidado general</option>
                                            <option value="Segmentación por método y moneda">Segmentación por método y moneda</option>
                                        </select>
                                    </FormGroup>
                                </Col>

                                {reportMode === "Segmentación por método y moneda" && (
                                    <>
                                        <Col sm={showDatePicker ? 2 : 2}>
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
                                                    <option value="Tarjeta">Tarjeta</option>
                                                </select>
                                            </FormGroup>
                                        </Col>

                                        <Col sm={showDatePicker ? 2 : 2}>
                                            <FormGroup>
                                                <Label>Tipo de moneda:</Label>
                                                <select 
                                                    className="form-control form-control-sm"
                                                    value={tipoDinero}
                                                    onChange={(e) => setTipoDinero(e.target.value)}
                                                    disabled={tipoPago === "Tarjeta"}
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    <option value="Cordobas">Cordobas</option>
                                                    <option value="Dolares">Dolares</option>
                                                </select>
                                            </FormGroup>
                                        </Col>
                                    </>
                                )}

                                {reportMode === "Consolidado general" && (
                                    <Col sm={showDatePicker ? 3 : 3}>
                                        <FormGroup>
                                            <Label>Tipo de cambio del dólar:</Label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="form-control form-control-sm"
                                                value={tipoCambioDolar}
                                                onChange={(e) => setTipoCambioDolar(e.target.value)}
                                                placeholder="Ej: 36.50"
                                            />
                                        </FormGroup>
                                    </Col>
                                )}

                                <Col sm={1}>
                                    <FormGroup>
                                        <Button 
                                            color="primary" 
                                            size="sm" 
                                            block 
                                            onClick={calcularCierre}
                                            disabled={!dateRange || !reportMode || 
                                                (reportMode === "Segmentación por método y moneda" && (!tipoPago || !tipoDinero)) ||
                                                (reportMode === "Consolidado general" && (!tipoCambioDolar || parseFloat(tipoCambioDolar) <= 0))
                                            }
                                        >
                                            <i className="fa fa-calculator" aria-hidden="true"></i>
                                        </Button>
                                    </FormGroup>
                                </Col>
                            </Row>

                            {/* Results Summary */}
                            {(cierreData || consolidatedData) && (
                                <Row className="mb-4 resumen-row">
                                    <Col sm={12}>
                                        <Card className="border-left-primary shadow h-100 py-2">
                                            <CardBody>
                                                <Row className="no-gutters align-items-center resumen-row">
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
                            {(cierreData || consolidatedData) && (
                                <Row className="mb-3 export-buttons-row">
                                    <Col sm={6} className="export-btn-col">
                                        <Button color="success" size="sm" onClick={exportToExcelHandler}>
                                            <i className="fa fa-file-excel" aria-hidden="true"></i> Exportar Excel
                                        </Button>
                                    </Col>
                                    <Col sm={6} className="text-right export-btn-col">
                                        <Button color="danger" size="sm" onClick={exportToPDFHandler}>
                                            <i className="fa fa-file-pdf" aria-hidden="true"></i> Exportar PDF
                                        </Button>
                                    </Col>
                                </Row>
                            )}

                            {/* Consolidated Report Details */}
                            {consolidatedData && (
                                <Row className="mb-4 resumen-row-consolidado">
                                    <Col sm={12}>
                                        <h5 className="text-primary mb-3">Detalle por Tipo de Pago y Moneda:</h5>
                                        <Row className="resumen-row-consolidado">
                                            {consolidatedData.resumenPorTipo.map((item, index) => (
                                                <Col sm={6} key={index} className="mb-4">
                                                    <Card className="border-left-info shadow">
                                                        <CardBody>
                                                            <h6 className="text-info font-weight-bold">
                                                                {item.tipoPago} - {item.tipoMoneda}
                                                            </h6>
                                                            <Row className="no-gutters mb-3">
                                                                <Col sm={4} className="text-center">
                                                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                                        Ingresos
                                                                    </div>
                                                                    <div className="h6 mb-0 text-gray-800">
                                                                        {item.tipoMoneda === "Dolares" ? "$" : "C$"}{item.totalIngresos.toFixed(2)}
                                                                    </div>
                                                                </Col>
                                                                <Col sm={4} className="text-center">
                                                                    <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                                                        Egresos
                                                                    </div>
                                                                    <div className="h6 mb-0 text-gray-800">
                                                                        {item.tipoMoneda === "Dolares" ? "$" : "C$"}{item.totalEgresos.toFixed(2)}
                                                                    </div>
                                                                </Col>
                                                                <Col sm={4} className="text-center">
                                                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                                        Saldo
                                                                    </div>
                                                                    <div className={`h6 mb-0 font-weight-bold ${item.saldoCierre >= 0 ? 'text-success' : 'text-danger'}`}>
                                                                        {item.tipoMoneda === "Dolares" ? "$" : "C$"}{item.saldoCierre.toFixed(2)}
                                                                    </div>
                                                                    {item.tipoMoneda === "Dolares" && (
                                                                        <div className="text-xs text-muted mt-1">
                                                                            <strong>Saldo en Córdobas:</strong> C${item.saldoCierreCordobas.toFixed(2)}
                                                                        </div>
                                                                    )}
                                                                </Col>
                                                            </Row>
                                                            
                                                                            <Row className="resumen-row-consolidado">
                                                                                <Col sm={6}>
                                                                                    <h6 className="text-success">Ingresos ({item.ingresos ? item.ingresos.length : 0})</h6>
                                                                                    <DataTable
                                                                                        columns={[
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
                                                                                                cell: (row) => `${item.tipoMoneda === "Dolares" ? "$" : "C$"}${parseFloat(row.monto).toFixed(2)}`,
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
                                                                                        ]}
                                                                                        data={item.ingresos || []}
                                                                                        customStyles={customStyles}
                                                                                        pagination
                                                                                        paginationPerPage={5}
                                                                                        noDataComponent="No hay ingresos para mostrar"
                                                                                        dense
                                                                                    />
                                                                                </Col>
                                                                                <Col sm={6}>
                                                                                    <h6 className="text-danger">Egresos ({item.egresos ? item.egresos.length : 0})</h6>
                                                                                    <DataTable
                                                                                        columns={[
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
                                                                                                cell: (row) => `${item.tipoMoneda === "Dolares" ? "$" : "C$"}${parseFloat(row.monto).toFixed(2)}`,
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
                                                                                        ]}
                                                                                        data={item.egresos || []}
                                                                                        customStyles={customStyles}
                                                                                        pagination
                                                                                        paginationPerPage={5}
                                                                                        noDataComponent="No hay egresos para mostrar"
                                                                                        dense
                                                                                    />
                                                                                </Col>
                                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Col>
                                </Row>
                            )}

                            

                            {/* Tables Section - Only show in segmentation mode */}
                            {cierreData && reportMode === "Segmentación por método y moneda" && (
                                <>
                                    <hr />
                                    <Row className="resumen-row">
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