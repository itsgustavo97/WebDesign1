const urlBase = 'https://consultatramites.opamss.org.sv/', fns = {
    CallGetAsync: function (ruta, data, callBack) {
        $.ajax({
            url: urlBase + ruta,
            type: "GET",
            data: data,
            async: true
        }).done(function (data) {
            callBack(data);
        }).fail(function (xhr, textStatus, errorThrown) {
            Swal.fire({
                icon: 'error',
                title: 'Oops... ' + textStatus,
                text: 'Algo no salió bien o bien puede que no hayan registros',
            })
            //swal.close();
        });
    },
    GenerarTabla: (configuracionTable, configuracionDataTable = null) => {
        const { idDiv, idTabla, cabeceras, estilos, claseCss, propiedadesPersonalizadas } = configuracionTable;
        let contenedor = document.getElementById(idDiv);
        if (contenedor != undefined) {
            contenedor.innerHTML = '';
            let contentHtml = `<table class="${claseCss}" id="${idTabla}" style="${estilos}" ${propiedadesPersonalizadas}><thead><tr>`;
            for (let i = 0; i < cabeceras.length; i++) {
                contentHtml += `<th>${cabeceras[i].toUpperCase()}</th>`;
            }
            contentHtml += `</tr></thead><tbody></tbody></table>`;
            contenedor.innerHTML = contentHtml;
            configuracionDataTable != null ? $('#' + idTabla).DataTable(configuracionDataTable) : $('#' + idTabla).DataTable({ 'language': lenguajeEspanniolDataTable });
        } else {
            this.sweetAlertWarning('No se encontró él contenedor donde se tiene que pintar la tabla');
        }
    },
    LlenarSelect: function (objetoJson, idSelect, value, texto, mensajeInicial = true, texto2 = null) {
        let contentHtml = mensajeInicial ? '<option value="">Seleccione una opción</option>': '', objetoActual = null, mensaje2 = '';
        for (let i = 0; i < objetoJson.length; i++) {
            objetoActual = objetoJson[i];
            mensaje2 = texto2 != null ? objetoActual[texto2] : '';
            contentHtml += '<option value="' + objetoActual[value] + '" >' + objetoActual[texto] + ' ' + mensaje2 + '</option>';
        }
        if ($('#' + idSelect) != undefined)
            $('#' + idSelect).html(contentHtml);
        else
            alert('No se encontro el combo box');
    },
    sweetAlertLoad: (mensaje) => {
        Swal.fire({
            title: `<div><p>${mensaje}</p>
                    <center><i style="color:#184C8E" class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></center></div>`,
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false
        });
    },
}