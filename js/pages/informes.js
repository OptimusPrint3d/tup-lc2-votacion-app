
console.log("Hola");

var saved = localStorage.getItem("INFORMES");

var contMsj = document.getElementById("mensajes-info");

if (saved) {
  
  var datos = JSON.parse(saved); 
  realizarLlamadasAPI(datos);
} else if(saved == null) {
    
  
  var mensajeErrorDiv = document.createElement('div');
  mensajeErrorDiv.classList.add('error');  
  mensajeErrorDiv.innerHTML = `
 
  <svg class="img-icono" height="40" xmlns="http://www.w3.org/2000/svg" height="1em"
  viewBox="0 0 64 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
  <style>
      svg {
          fill: #ffffff
      }
  </style>
  <path
      d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V320c0 17.7 14.3 32 32 32s32-14.3 32-32V64zM32 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
</svg>
<h3 class="mensajes">No tiene resultados agregados en el informe</h3>

  `;
    
  contMsj.appendChild(mensajeErrorDiv);  
  setTimeout(() => {
    contMsj.removeChild(mensajeErrorDiv);
  }, 3000);
}

async function realizarLlamadasAPI(datos) {
  console.log(datos);
  var arrayDatos = [];
  // Recorrer las propiedades del objeto
  for (var key in datos) {
    if (datos.hasOwnProperty(key)) {
      // Obtener el valor correspondiente a la propiedad actual
      var valor = datos[key];

      // Verificar si el valor es un array y tiene al menos 6 elementos
      if (Array.isArray(valor) && valor.length >= 6) {
        // Extraer los elementos necesarios para la llamada a la API
        var anioEleccion = valor[0];
        var tipoRecuento = valor[1];
        var tipoEleccion = valor[2];
        var categoriaId = valor[3];
        var distritoId = valor[5];
        var seccionId = valor[6];

        console.log(anioEleccion, tipoRecuento, tipoEleccion, categoriaId, distritoId, seccionId);
       



        
        //var url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionId=${seccionId}`;

        const response = await fetch(
          "https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=" + anioEleccion +
          "&tipoRecuento=" + tipoRecuento + "&tipoEleccion=" + tipoEleccion + "&categoriaId=" + categoriaId +
          "&distritoId=" + distritoId + "&seccionProvincialId&seccionId=" + seccionId + "&circuitoId&mesaId");
        
        //var response = await fetch(url);

        
        var data = await response.json();
        console.log(data);
        console.log(`Llamada a la API para ${key}:`, data);
        arrayDatos.push(data)
      }
    }
  }
  console.log(arrayDatos);
  //mostrarObjetosInformes(arrayDatos);
}

