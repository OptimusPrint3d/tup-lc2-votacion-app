var url = window.location.href;
var ubicacionPag = url.substring(url.lastIndexOf("/") + 1);
console.log(ubicacionPag);
var tipoEleccion
if(ubicacionPag === "generales.html"){
     tipoEleccion = 2
}else if(ubicacionPag === "paso.html"){
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
    const selectElement = document.getElementById("filtroAño");
    
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
    const selectElement = document.getElementById("filtroAño");
    const selectedValue = selectElement.value;

    console.log(selectedValue)

    if(selectedValue && selectedValue != 0){
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
  
      const data = await response.json();  
      
      console.log("Datos obtenidos:", data);
    } catch (error) {
      console.error("Error en fetchAPI:", error);
    }
  }

