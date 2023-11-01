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




async function fetchData() {
    try {
        const response = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");
        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }
        const años = await response.json();
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
        return dato.Cargo;
    })
    console.log(cargosAMostrar)
    /* console.log("Cargos guardados y mostrados:", data); */

    selectHTML += cargosAMostrar.map(cargo => {
        return `<option value="${cargo}">${cargo}</option>`;
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

function mostrarSecciones(seccionesAMostrar){
    //Funcion para mostrar las secciones.
    var selectElement = document.getElementById("filtroSeccion");

    let selectHTML = '<option value="0">Seccion</option>';

    selectHTML += seccionesAMostrar.map(seccion => {
        return `<option value="${seccion.IdSeccion}">${seccion.Seccion}</option>`;
    }).join('');

    selectElement.innerHTML = selectHTML;
}

function getSeccionSeleccionada(){
    var selectElement = document.getElementById("filtroSeccion");
    var selectedValue = selectElement.value; //EL valor ID
    var selectedOption = selectElement.options[selectElement.selectedIndex].text; // EL valor del texto

    console.log(selectedValue)
    console.log(selectedOption)
}


function filtrarDatos(){
   
    /*
            anioEleccion
        o tipoRecuento => Por defecto 1
        o tipoElección => 1 o 2 dependiendo si está en generales o paso
        o categoriaId: 2 (valor por defecto)
        o distritoId => 
        o seccionProvincialId
        o seccionId =>lo tenemos 
        o circuitoId: “” (valor por defecto)
        o mesaId: “” (valor por defecto)
    
    */
}