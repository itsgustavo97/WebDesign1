
const hideFilters = (param) => document.getElementById(param).className.includes('desplegar') ? $(`#${param}`).removeClass('desplegar') : $(`#${param}`).addClass('desplegar');

const ObtenerTiposTramites = () => {

    fns.CallGetAsync('api/Tramites/GetT', '', (data) => {
        if (data != null) {
            fns.LlenarSelect(data, 'txtTipoTramite', 'codigo_tramite', 'nombre', false, undefined);
        }
    })
}

const ObtenerTramites = () => {
    let datos = {
        anio: $("#txtAnio").val(),
        tabla: $("#txtTipoTramite").val(),
        expediente: $('#txtExpediente').val()
    };
    fns.sweetAlertLoad('Cargando expedientes por favor espere...');
    fns.CallGetAsync("api/values/Getall", datos, function (requestData) {
        fns.GenerarTabla({
            idDiv: 'divTabla',
            idTabla: 'tblExpedientes',
            cabeceras: ['Expediente', 'Estado del Trámite', 'Proyecto', 'Municipio', 'Tiempo Respuesta (Días hábiles)', 'Acciones'],
            estilos: 'width: 100%;',
            claseCss: 'table table-sm table-hover table-striped animated fadeInRight',
            propiedadesPersonalizadas: ''
        }, {
            data: requestData,
            columns: [
                { data: "numeroExpediente" },
                {
                    data: "descripcionEstado",
                    render: function (data, type, full, meta) {
                        let content = '';
                        if (data == 'Favorable') {
                            content = `<a href="#" class="btn btn-sm btn-outline-success rounded-pill text-capitalize">Favorable</a>`;
                        } else if (data == 'Memo') {
                            content = '<a href="#" class="btn btn-sm btn-outline-warning rounded-pill text-capitalize">Memo</a>';
                        } else if (data == 'Denegado') {
                            content = '<a href="#" class="btn btn-sm btn-outline-danger rounded-pill text-capitalize">Denegado</a>';
                        } else {
                            content = '<a href="#" class="btn btn-sm btn-outline-info rounded-pill text-capitalize">En Trámite</a>';
                        }
                        return content;
                    }
                },
                { data: "nomProy" },
                { data: "municipio" },
                { data: "tiempoRespuesta" },
                {
                    data: "numeroExpediente",
                    render: function (data, type, full, meta) {
                        return `<a href="#" onclick="GetDetailData('${data}')" class="btn btn-sm btnOpamss rounded-3 text-capitalize" data-bs-toggle="modal" data-bs-target="#modal"><i class="fa fa-eye" aria-hidden="true"></i> Ver</a>`;
                    }
                }
            ],
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"
            },

        });
        swal.close();
    })
}

const SoloNumeros = (evt) => {
        // code is the decimal ASCII representation of the pressed key.
        var code = (evt.which) ? evt.which : evt.keyCode;
        if (code == 8) { // backspace.
            return true;
        }
        else if (code >= 48 && code <= 57) { // is a number.
            return true;
        } else { // other keys.
            return false;
        }
    }

    $(() => {
        $('#dtExpedientes').DataTable({
            language: {
                "url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"
            },});
        ObtenerTiposTramites();
    });