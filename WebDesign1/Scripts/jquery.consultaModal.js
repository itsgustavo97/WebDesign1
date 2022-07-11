let detailReques = [];
////////////////////////////// DETAILS EXPEDIENTE MODAL
function GetDetailData(NoExp) {

    //Modelo para request de data
    const datos = {
        anio: $("#txtAnio").val(),
        tabla: $("#txtTipoTramite").val(),
        expediente: NoExp
    };
    fns.CallGetAsync("api/values/Getall", datos, function (request) {

        const { numeroExpediente,
            nomProy,
            numeroIngreso,
            fechaIngreso,
            fechaAsignacion,
            descripcionEstado,
            descripcionCategoria,
            categoria,
            estado,
            uso_esp,
            codigo_uso,
            fechaSalRec,
            tiempoMinimo,
            tiempoMaximoDemora,
            tiempoMaximo,
            tiempoRespuesta } = request[0];


        //*********************TABLA DE DETALLE***********************//
        //Se obtiene el indice 1 del request ya que se envia en forma de lista aunque siempre trae 1

        validacion = uso_esp.substring(0, 3);
        validacion2 = codigo_uso.substring(0, 3);

        //LLENADO DE INFORMACION DEL DEATLLE
        $("#numExpediente").text(datos.tabla.toUpperCase() + "-" + numeroExpediente); //titulo modal
        $("#numExp").text(datos.tabla.toUpperCase() + "-" + numeroExpediente);
        $("#nomProy").text(nomProy);
        $("#dateIngre").text(fechaIngreso);
        $("#estado").text(descripcionEstado);
        $("#numIngr").text(numeroIngreso);
        $('#DiaTran').text(tiempoRespuesta);

        //if que mestra un icono y categoria si la tabla es permiso Construccion o Calificacion de lugar
        if (datos.tabla == "pc" || datos.tabla == "cl") {
            $('#catdt').html(' <i data-toggle="tooltip" title="" id="catInfo" class="fa fa-info-circle" style="color:#0095E8;font-size:20px" aria-hidden="true"></i> <label>Categoria:</label> ');
            $('#catInfo').attr("title", descripcionCategoria);
            $('#cat').text(categoria);
        }

        //********************* CARDS ESTADO **********************//

        AddClasesCard(estado);
        function removeColor() {
            const cards = $('[data-card]');
            for (let i = 0; i < cards.length; i++) {
                $(cards[i]).removeClass('green-card');
                $(cards[i]).removeClass('grey-card');
                $(cards[i]).removeClass('blue-card');
            }
        }
        function AddClasesCard(estadoTramite) {
            removeColor();
            let mensajeAsig, mensajeresp, mensajeAnali;
            switch (estadoTramite) {
                case "D"://DENEGADO
                case "F"://FAVORABLE
                    mensajeAsig = 'El expediente ya ha sido asignado al departamento correspondiente';
                    mensajeAnali = 'Los procesos de análisis ya han sido completados';
                    mensajeresp = 'La resolución ha sido retirada';
                    $("#asignacion-card").addClass("green-card");
                    $("#analisis-card").addClass("green-card");
                    $("#respuesta-card").addClass("green-card");
                    break;
                case "M"://MEMO
                    mensajeAsig = 'El expediente ya ha sido asignado al departamento correspondiente';
                    mensajeAnali = 'Los procesos de análisis ya han sido completados';
                    if (fechaSalRec != null) {

                        mensajeresp = 'La resolución ha sido retirada';
                    } else {

                        mensajeresp = 'La resolución se encuentra en ventanilla en espera de su retiro';

                    }
                    $("#asignacion-card").addClass("green-card");
                    $("#analisis-card").addClass("green-card");
                    $("#respuesta-card").addClass("blue-card");
                    break;

                case "T"://En tramite
                    if (fechaAsignacion != null) {
                        mensajeAsig = 'El expediente ya ha sido asignado al departamento correspondiente';
                        mensajeAnali = 'El expediente se encuentra en los procesos de análisis correspondientes';
                        mensajeresp = 'No iniciado';
                        $("#asignacion-card").addClass("green-card");
                        $("#analisis-card").addClass("blue-card");
                        $("#respuesta-card").addClass("grey-card");
                    } else {
                        mensajeAsig = 'Expediente en proceso de ser asignado al personal del departamento correpondiente';
                        mensajeresp = 'No iniciado';
                        mensajeAnali = 'No iniciado';
                        $("#asignacion-card").addClass("grey-card");
                        $("#analisis-card").addClass("grey-card");
                        $("#respuesta-card").addClass("grey-card");
                    }
                    break;

                default:
                    mensajeAsig = 'Expediente en proceso de ser asignado al personal del departamento correpondiente';
                    mensajeresp = 'No iniciado';
                    mensajeAnali = 'No iniciado';
                    $("#asignacion-card").addClass("grey-card");
                    $("#analisis-card").addClass("grey-card");
                    $("#respuesta-card").addClass("grey-card");
                    break;
            }
            //Se insertan los mensajes en los cards
            $("#textAsignacion").text(mensajeAsig);
            $("#textAnalisis").text(mensajeAnali);
            $("#textRespuesta").text(mensajeresp);
        }

        

        //Saber la fecha de HOY
        let d = new Date();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();
        let FechaHoy = d.getFullYear() + '/' +
            (('' + month).length < 2 ? '0' : '') + month + '/' +
            (('' + day).length < 2 ? '0' : '') + day;

        //********************* CARDS ESTADO **********************//

        //*********************RELOJES GAUGES***********************//
        //Hecho con JavaScript
        GenerarGaugeCanvas("gaugeTranscurrido", tiempoMinimo, tiempoMaximoDemora, tiempoMaximo, tiempoRespuesta, "Transcurridos");
        let setValueGauge = 0;
        let valor = (tiempoMaximoDemora - tiempoRespuesta);
        if (estado != "T" && estado != "M") {
            setValueGauge = 0;

        } else {
            setValueGauge = valor;
        }
        GenerarGaugeCanvas("gaugeRestante", tiempoMinimo, tiempoMaximoDemora, tiempoMaximo, setValueGauge, "Restantes");

        //*********************RELOJES GAUGES***********************//

    });

}

function GenerarGaugeCanvas(idcanva, minVal, maxVal, halfVal, setVal, MessageText) {


    let gauge = new RadialGauge({
        renderTo: idcanva,
        width: 200,
        height: 200,
        units: MessageText,
        valueDec: 0,
        valueInt: 2,
        minValue: minVal,
        startAngle: 90,
        ticksAngle: 180,
        valueBox: true,
        maxValue: maxVal,
        majorTicks: [
            minVal,
            halfVal,
            maxVal
        ],
        minorTicks: 4,
        strokeTicks: true,
        highlights: [
            { "from": halfVal, "to": maxVal, "color": "#007bff" }
        ],
        colorPlate: "#fff",
        borderShadowWidth: 0,
        borders: false,
        needleType: "arrow",
        needleWidth: 2,
        needleCircleSize: 7,
        needleCircleOuter: true,
        needleCircleInner: false,
        animationDuration: 1500,
        animationRule: "linear"
    }).draw();

    gauge.value = setVal;
}