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

function mostrarMensaje(tipo, mensaje, tiempo) {
    const contenedor = document.getElementById('todos-alertas');

    // Definir la plantilla de mensaje con el SVG correspondiente
    const template = `
      <div class="mensaje ${tipo}">
        ${getSVG(tipo)}
        <h3 class="mensajes">${mensaje}</h3>
      </div>
    `;

    // Crear un elemento div y establecer su contenido HTML utilizando la plantilla
    const mensajeDiv = document.createElement('div');
    mensajeDiv.innerHTML = template;

    // Agregar el mensaje al contenedor principal
    contenedor.appendChild(mensajeDiv);

    // Programar la eliminación del mensaje después de un tiempo específico
    setTimeout(() => {
      contenedor.removeChild(mensajeDiv);
    }, tiempo);
  }

  // Función para obtener el SVG según el tipo
  function getSVG(tipo) {
    switch (tipo) {
      case 'exito':
        return `
          <svg class="img-icono" height="40" xmlns="http://www.w3.org/2000/svg" height="0.875em" viewBox="0 0 512 512">
            <path d="M104 224H24c-13.255 0-24 10.745-24 24v240c0 13.255 10.745 24 24 24h80c13.255 0 24-10.745 24-24V248c0-13.255-10.745-24-24-24zM64 472c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24zM384 81.452c0 42.416-25.97 66.208-33.277 94.548h101.723c33.397 0 59.397 27.746 59.553 58.098.084 17.938-7.546 37.249-19.439 49.197l-.11.11c9.836 23.337 8.237 56.037-9.308 79.469 8.681 25.895-.069 57.704-16.382 74.757 4.298 17.598 2.244 32.575-6.148 44.632C440.202 511.587 389.616 512 346.839 512l-2.845-.001c-48.287-.017-87.806-17.598-119.56-31.725-15.957-7.099-36.821-15.887-52.651-16.178-6.54-.12-11.783-5.457-11.783-11.998v-213.77c0-3.2 1.282-6.271 3.558-8.521 39.614-39.144 56.648-80.587 89.117-113.111 14.804-14.832 20.188-37.236 25.393-58.902C282.515 39.293 291.817 0 312 0c24 0 72 8 72 81.452z" />
          </svg>
        `;
      case 'error':
        return `
          <svg class="img-icono" height="40" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
            <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
          </svg>
        `;
      case 'warning':
        return `
          <svg class="img-icono" height="40" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 64 512">
            <path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V320c0 17.7 14.3 32 32 32s32-14.3 32-32V64zM32 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
          </svg>
        `;
      default:
        return '';
    }
  }

  // Llamar a la función para mostrar mensajes con mensajes y SVG diferentes durante 3 segundos
  /*mostrarMensaje('exito', 'Se agregó con éxito el resultado al informe', 3000);
   mostrarMensaje('error', 'Error. Se produjo un error al intentar consultar los resultados', 3000);
  mostrarMensaje('warning', 'No tiene resultados agregados en el informe', 3000); */





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
        console.log(datos);
        mostrarVotos(datos, votos); // Funcion que muestra los valores MESAS ESCRUTADAS , ELECTORES , PARTICIPACION 
        mostrarVotosTotalizados(votosTotalizados);

    } catch (error) {
        console.error("Error en fetchVotos:", error);
        mostrarMensaje('error', 'Error. Se produjo un error al intentar consultar los resultados', 3000);
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
    console.log(votosTotalizados);
    console.log("Entro")
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