
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
      viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
      <style>
          svg {
              fill: #ffffff
          }
      </style>
      <path
          d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
  </svg>
  <h3 class="mensajes">Error. Se produjo un error al intentar consultar los resultados</h3>

  `;
    
  contMsj.appendChild(mensajeErrorDiv);  
  setTimeout(() => {
    contMsj.removeChild(mensajeErrorDiv);
  }, 3000);
}

async function realizarLlamadasAPI(datos) {
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
        var distritoId = valor[4];
        var seccionId = valor[5];

        
        var url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionId=${seccionId}`;

        
        var response = await fetch(url);

        
        var data = await response.json();
        console.log(`Llamada a la API para ${key}:`, data);
      }
    }
  }
}
