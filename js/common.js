// import { mapas } from './mapas.js';

// console.log(mapas);

var url = window.location.href;
var ubicacionPag = url.substring(url.lastIndexOf("/") + 1);
console.log(ubicacionPag);
var tipoEleccion;
const tipoRecuento = 1;

if (ubicacionPag === "generales.html") {
    tipoEleccion = 2
} else if (ubicacionPag === "paso.html") {
    tipoEleccion = 1
}

function display_loader(status) {
    // Para mostrar el mensaje y el spinner
    document.querySelector('.loader-container').style.display = status;

    if (status == 'block') {
        document.getElementById('boton-filtrar').disabled = true;
    } else {
        document.getElementById('boton-filtrar').disabled = false;
    }
}

async function fetchData() {
    display_loader('block');
    try {
        const response = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");
        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }
        const años = await response.json();

        console.log(años)
        return años; // Devuelve los datos
    } catch (error) {
        console.error("Error en fetchData:", error);
        throw error; // Lanza el error nuevamente
    }
}

function cargaDatosAños(años) {
    var selectElement = document.getElementById("filtroAño");

    let selectHTML = '<option value="0">Año</option>';

    selectHTML += años.map(año => {
        return `<option value="${año}">${año}</option>`;
    }).join('');

    selectElement.innerHTML = selectHTML;
    display_loader('none');
}

// Ahora puedes llamar a las funciones en secuencia
fetchData()
    .then(años => {
        cargaDatosAños(años);
    })
    .catch(error => {
        console.error("Error:", error);
    });

function getAñoSeleccionado() {
    var selectElement = document.getElementById("filtroAño");
    var selectedValue = selectElement.value;
    const miAtributo = selectElement.getAttribute("tipoEleccion");

    console.log(miAtributo);
    console.log(selectedValue)

    if (selectedValue && selectedValue != 0) {
        fetchCargos(selectedValue);
    }
}

async function fetchCargos(selectedValue) {

    console.log(tipoEleccion);
    try {
        const response = await fetch("https://resultados.mininterior.gob.ar/api/menu?año=" + selectedValue);

        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }

        var data = await response.json();
        tipoEleccion == 2 ? data = data[0] : data = data[1];
        guardarYMostrarCargos(data);

    } catch (error) {
        console.error("Error en fetchAPI:", error);
    }
}

var datosCargosYDistritos;
function guardarYMostrarCargos(data) {
    // EN DATA ESTÁN LOS DATOS DEL AÑO. 
    var selectElement = document.getElementById("filtroCargo");

    let selectHTML = '<option value="0">Cargo</option>';

    datosCargosYDistritos = data
    var cargosAMostrar = [] // Se crea el array para llenar el segundo combo

    cargosAMostrar = data.Cargos.map((dato) => { // Se filtra los datos y solo se devuelve el cargo en forma de array 
        //return dato.Cargo;
        return {
            cargo: dato.Cargo,
            cargo_id: dato.IdCargo
        };
    })
    console.log(cargosAMostrar)
    /* console.log("Cargos guardados y mostrados:", data); */

    selectHTML += cargosAMostrar.map(cargo => {
        return `<option value="${cargo.cargo}" cargo_id="${cargo.cargo_id}">${cargo.cargo}</option>`;
    }).join('');

    selectElement.innerHTML = selectHTML;
}

var arrayAñoMasCargo;
function getCargoSeleccionado() {
    //ESTA FUNCION CAPTURA EL CARGO SELECCIONADO PARA LUEGO MOSTRAR LOS DISTRITOS DISPONIBLES
    arrayAñoMasCargo = datosCargosYDistritos.Cargos;
    console.log(arrayAñoMasCargo);
    var selectElement = document.getElementById("filtroCargo");
    var selectedValue = selectElement.value;

    console.log(selectedValue)
    if (selectedValue != 0 && selectedValue) {
        var arrayFiltrado = arrayAñoMasCargo.filter(obj => obj.Cargo === selectedValue);
        arrayAñoMasCargo = arrayFiltrado
        console.log(arrayAñoMasCargo)
        //var arrayDistritos = arrayFiltrado[0].Distritos;

        //var arrayDistritos = arrayFiltrado[0].Distritos.map(obj => obj.Distrito);

        var arrayDistritos = arrayFiltrado[0].Distritos.map(obj => {
            return {
                Distrito: obj.Distrito,
                IdDistrito: obj.IdDistrito
            };
        });
        console.log(arrayDistritos);

        mostrarDistritos(arrayDistritos);
    }
}

function mostrarDistritos(arrayDistritos) {
    console.log(arrayDistritos);

    var selectElement = document.getElementById("filtroDistrito");

    let selectHTML = '<option value="0">Distrito</option>';

    selectHTML += arrayDistritos.map(distrito => {
        return `<option value="${distrito.IdDistrito}">${distrito.Distrito}</option>`;
    }).join('');

    selectElement.innerHTML = selectHTML;
}

function getDistritoSeleccionado() {

    var selectElement = document.getElementById("filtroDistrito");
    var selectedValue = selectElement.value; //EL valor ID
    var selectedOption = selectElement.options[selectElement.selectedIndex].text; // EL valor del texto

    console.log(selectedValue);
    console.log(arrayAñoMasCargo); // ESTE ARRAY ES EL QUE SE VA ARMANDO - EN ESTE PUNTO TIENE AÑO + CARGO

    var seccionesAMostrar = [];

    // Filtrar los datos para encontrar la sección correspondiente al valor seleccionado
    seccionesAMostrar = arrayAñoMasCargo[0].Distritos.filter(obj => obj.Distrito === selectedOption);

    if (seccionesAMostrar.length > 0) {
        // Si se encontró una coincidencia, extraer las secciones
        //seccionesAMostrar = seccionesAMostrar[0].SeccionesProvinciales[0].Secciones.map(dato => dato.Seccion);

        seccionesAMostrar = seccionesAMostrar[0].SeccionesProvinciales[0].Secciones.map(obj => {
            return {
                Seccion: obj.Seccion,
                IdSeccion: obj.IdSeccion
            };
        });

        console.log(seccionesAMostrar);

        mostrarSecciones(seccionesAMostrar);
    } else {
        console.log("No se encontraron secciones para el valor seleccionado.");
    }
}

function mostrarSecciones(seccionesAMostrar) {
    //Funcion para mostrar las secciones.
    var selectElement = document.getElementById("filtroSeccion");

    let selectHTML = '<option value="0">Seccion</option>';

    selectHTML += seccionesAMostrar.map(seccion => {
        return `<option value="${seccion.IdSeccion}">${seccion.Seccion}</option>`;
    }).join('');

    selectElement.innerHTML = selectHTML;
}

function getSeccionSeleccionada() {
    var selectElement = document.getElementById("filtroSeccion");
    var selectedValue = selectElement.value; //EL valor ID
    var selectedOption = selectElement.options[selectElement.selectedIndex].text; // EL valor del texto

    console.log(selectedValue)
    console.log(selectedOption)
}

function filtrarDatos() {
    var anio = document.getElementById("filtroAño");
    var tipoEleccion = anio.getAttribute("tipoEleccion");
    var categoria  = document.getElementById("filtroCargo");
    var distrito   = document.getElementById("filtroDistrito");
    var seccion    = document.getElementById("filtroSeccion");
    var datos={
        anioEleccion:anio.value,
        tipoRecuento:1,
        tipoEleccion:tipoEleccion,
        tipoEleccionText:parseInt(tipoEleccion) == 1 ? "Paso" : "Generales",
        categoria:categoria,
        categoriaId:categoria.options[categoria.selectedIndex].getAttribute("cargo_id"),
        categoriaText:categoria.value,
        distritoId:distrito.value,
        distritoText:distrito.options[distrito.selectedIndex].text,
        seccionId:seccion.value,
        seccionText:seccion.options[seccion.selectedIndex].text,
        seccionProvincialId:null
    }

    var newTitle = `Elecciones ${datos.anioEleccion} | ${datos.tipoEleccionText}`;

    var tituloEleccion = document.getElementById("tituloEleccion");
    tituloEleccion.textContent = newTitle;

    var newSubtitle = `${datos.anioEleccion} > ${datos.tipoEleccionText} > Provisorio > ${datos.categoriaText} > ${datos.distritoText} > ${datos.seccionText}`;

    var subtituloEleccion = document.getElementById("subtituloEleccion");
    subtituloEleccion.textContent = newSubtitle;
    
    fetchVotos(datos);
    var warningMensaje = document.querySelector('.warning');
    warningMensaje.style.display = 'block';

    // Programa la ocultación del mensaje de advertencia después de 4 segundos
    setTimeout(function () {
        warningMensaje.style.display = 'none';
    }, 4000); // 4000 milisegundos (4 segundos)
}

async function fetchVotos(datos) {
    try {
        const response = await fetch(
            "https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=" + datos.anioEleccion +
            "&tipoRecuento=" + datos.tipoRecuento + "&tipoEleccion=" + datos.tipoEleccion + "&categoriaId=" + datos.categoriaId +
            "&distritoId=" + datos.distritoId + "&seccionProvincialId&seccionId=" + datos.seccionId + "&circuitoId&mesaId");
        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }
        const votos = await response.json(); // Respuesta de la api
        var votosTotalizados = votos.valoresTotalizadosPositivos; // Array que tiene los datos que van en el BOX de la izquierda

        console.log(votosTotalizados);
        console.log("--------------------------------------------")
        console.log(votos)
        console.log("--------------------------------------------")

        mostrarVotos(datos, votos); // Funcion que muestra los valores MESAS ESCRUTADAS , ELECTORES , PARTICIPACION 
        mostrarVotosTotalizados(votosTotalizados);

    } catch (error) {
        console.error("Error en fetchVotos:", error);
        throw error; // Lanza el error nuevamente
    }
}

function mostrarVotosTotalizados(votosTotalizados) { // Funcion que muestra el box de la izquierda y el de la derecha 
    var coloresPartidosPoliticos = [
        {
            nombre: "JUNTOS POR EL CAMBIO",
            color: "#fae525"
        }, {
            nombre: "FRENTE DE TODOS",
            color: "#1ee8de"
        }
    ]

    // Obtén el contenedor donde deseas agregar las agrupaciones
    const agrupacionesContainer = document.querySelector('.agrupaciones-container');
    const grid = document.querySelector('.grid');
    let template = '';

    votosTotalizados.forEach(agrupacion => {
        const template = `
            <div class="agrupacion">
                <h3>${agrupacion.nombreAgrupacion}</h3>
                <div class="separador"></div>
                <div class="agrupacion-texto">
                    <h3>VERDE</h3>
                    <div>
                        <p>${agrupacion.votosPorcentaje}%</p>
                        <p>${agrupacion.votos} VOTOS</p>
                    </div>
                </div>
                <div class="progress" style="background: var(--grafica-verde-claro)">
                    <div class="progress-bar" style="width: ${agrupacion.votosPorcentaje}%; background: var(--grafica-verde)">
                        <span class="progress-bar-text">${agrupacion.votosPorcentaje}%</span>
                    </div>
                </div>                
            </div>
        `;

        agrupacionesContainer.innerHTML += template;
    });

    votosTotalizados.forEach(item => {
        template += `
            <div class="bar" style="--bar-value: ${item.votosPorcentaje}%" data-name="${item.nombreAgrupacion}" title="${item.nombreAgrupacion}"></div>
        `;
    });

    grid.innerHTML = template;
}

function mostrarVotos(datos, votosAMostrar) {
    document.getElementById("porcentajeMesas").textContent = votosAMostrar.estadoRecuento.mesasTotalizadas;
    document.getElementById("porcentajeElectores").textContent = votosAMostrar.estadoRecuento.cantidadElectores;
    document.getElementById("porcentajeParticipacion").textContent = votosAMostrar.estadoRecuento.participacionPorcentaje + "%";

    var divElement = document.getElementById('mapas');
    var svgPath = mapas[parseInt(datos.distritoId)];
    divElement.innerHTML = `<h3>${datos.distritoText}</h3> ${svgPath}`;

    saveLocalStorage(datos);
}

function saveLocalStorage() {
    var saved = localStorage.getItem("INFORMES");
    var datosSeleccionados = [datos.anioEleccion, datos.tipoRecuento, datos.tipoEleccion, datos.categoriaId, datos.distritoId, datos.seccionId];
    var jsonString = JSON.stringify(datosSeleccionados);

    var bandera = 0;
    if (saved != null) {
        var informesObject = JSON.parse(saved);
        var totalKeys = Object.keys(informesObject).length;

        for (var i = 1; i <= totalKeys; i++) {
            var clave = i;
            var array = informesObject[clave - 1];
            var informesObjectString = JSON.stringify(array);
            if (informesObjectString == jsonString) {
                bandera = 1;
                break;
            }
        }
    } else {
        var object = { 0: datosSeleccionados };
        var objectJsonString = JSON.stringify(object);
        localStorage.setItem("INFORMES", objectJsonString);
    }

    if (bandera == 0 && saved != null) {
        var informesObject = JSON.parse(saved);
        var totalKeys = Object.keys(informesObject).length;
        informesObject[totalKeys] = datosSeleccionados;
        var objectJsonString = JSON.stringify(informesObject);
        localStorage.setItem("INFORMES", objectJsonString);
    }
}