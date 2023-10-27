var url = window.location.href;
var ubicacionPag = url.substring(url.lastIndexOf("/") + 1);
console.log(ubicacionPag);
var tipoEleccion;



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
    
    cargosAMostrar = data.Cargos.map((dato)=>{ // Se filtra los datos y solo se devuelve el cargo en forma de array 
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
function getCargoSeleccionado(){
    //ESTA FUNCION CAPTURA EL CARGO SELECCIONADO PARA LUEGO MOSTRAR LOS DISTRITOS DISPONIBLES
    arrayAñoMasCargo = datosCargosYDistritos.Cargos;
    console.log(arrayAñoMasCargo);
    var selectElement = document.getElementById("filtroCargo");    
    var selectedValue = selectElement.value;

    console.log(selectedValue)
    if(selectedValue != 0 && selectedValue){
        var arrayFiltrado = arrayAñoMasCargo.filter(obj => obj.Cargo === selectedValue);
        arrayAñoMasCargo = arrayFiltrado
        console.log(arrayAñoMasCargo)
        //var arrayDistritos = arrayFiltrado[0].Distritos;

        var arrayDistritos = arrayFiltrado[0].Distritos.map(obj => obj.Distrito);


        console.log(arrayDistritos);

        mostrarDistritos(arrayDistritos);

    }
    
    


    
}

function mostrarDistritos(arrayDistritos){

    var selectElement = document.getElementById("filtroDistrito");
    
    let selectHTML = '<option value="0">Distrito</option>';

    selectHTML += arrayDistritos.map(distrito => {
        return `<option value="${distrito}">${distrito}</option>`;
    }).join('');

    selectElement.innerHTML = selectHTML;

}

function getDistritoSeleccionado(){
  
    var selectElement = document.getElementById("filtroDistrito");    
    var selectedValue = selectElement.value;

    console.log(selectedValue)
    console.log(arrayAñoMasCargo); // ESTE ARRAY ES EL QUE SE VA ARMANDO - EN ESTE PUNTO TIENE AÑO + CARGO 

    var seccionesAMostrar = []

    seccionesAMostrar = arrayAñoMasCargo[0].Distritos.filter(obj => obj.Distrito === selectedValue); 

    console.log(seccionesAMostrar[0].SeccionesProvinciales[0].Secciones);
    
}
