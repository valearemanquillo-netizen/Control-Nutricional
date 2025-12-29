const URL = "https://script.google.com/macros/s/AKfycbySAXW-_bKS6kS8JbrIlRTxT1RInfseNnTqtWL13CnCfPoaiBgyUbkHx5kaz6l0qjuf/exec"; // Cambia por tu Apps Script

// Guardar perfil
function guardarPerfil() {
  const cc = document.getElementById("cc").value;
  const peso = parseFloat(document.getElementById("peso").value);
  const altura = parseFloat(document.getElementById("altura").value);
  const edad = parseInt(document.getElementById("edad").value);
  const sexo = document.getElementById("sexo").value;
  const actividad = parseFloat(document.getElementById("actividad").value);

  if (!cc || !peso || !altura || !edad || !sexo || !actividad) {
    alert("Completa todos los campos");
    return;
  }

  // Calculo estimado de calorías, proteínas, carbos y grasas
  const calorias = Math.round((10*peso + 6.25*altura - 5*edad + (sexo==="H"?5:-161))*actividad);
  const proteina = Math.round(calorias*0.23/4);
  const carbos = Math.round(calorias*0.52/4);
  const grasas = Math.round(calorias*0.25/9);

  const data = {
    tipo: "usuario",
    cc,
    peso,
    altura,
    edad,
    sexo,
    actividad,
    calorias,
    proteina,
    carbos,
    grasas
  };

  fetch(URL, {
    method: "POST",
    body: JSON.stringify(data)
  }).then(res => res.json())
    .then(resp => {
      if (resp.estado === "OK") {
        // Guardamos localmente para la guía
        localStorage.setItem("guia", JSON.stringify(data));
        window.location.href = "guia.html"; // Redirige a guía diaria
      } else alert("Error al guardar perfil");
    })
    .catch(e => alert("Error al guardar perfil: "+e));
}

// Cargar guía diaria con IMC
function cargarGuia() {
  const guia = JSON.parse(localStorage.getItem("guia"));
  if (!guia) return;

  const alturaM = guia.altura/100;
  const imc = (guia.peso/(alturaM*alturaM)).toFixed(1);
  let imcCategoria = "";
  if (imc < 18.5) imcCategoria = "Bajo peso";
  else if (imc < 25) imcCategoria = "Normal";
  else if (imc < 30) imcCategoria = "Sobrepeso";
  else imcCategoria = "Obesidad";

  document.getElementById("guia").innerHTML = `
    <ul>
      <li>🥩 Proteína: <b>${guia.proteina} g</b></li>
      <li>🍚 Carbohidratos: <b>${guia.carbos} g</b></li>
      <li>🥑 Grasas: <b>${guia.grasas} g</b></li>
      <li>🔥 Calorías: <b>${guia.calorias}</b></li>
      <li>⚖️ IMC: <b>${imc} (${imcCategoria})</b></li>
    </ul>
  `;
}

if(document.getElementById("guia")) cargarGuia();


function mostrarModal(texto) {
  const modal = document.getElementById("modal-mensaje");
  const modalTexto = document.getElementById("modal-texto");
  const cerrarBtn = document.getElementById("cerrar-modal");

  modalTexto.textContent = texto;
  modal.style.display = "flex";

  cerrarBtn.onclick = () => {
    modal.style.display = "none";
  };

  // cerrar al hacer click fuera del contenido
  window.onclick = (e) => {
    if (e.target == modal) modal.style.display = "none";
  };
}

// Guardar guía diaria en REGISTROS
function guardarGuia() {
  const guia = JSON.parse(localStorage.getItem("guia"));
  if (!guia) return mostrarModal("No hay datos de guía para guardar");

  const data = {
    tipo: "registro",
    cc: guia.cc,
    peso: guia.peso,
    proteina: guia.proteina,
    carbos: guia.carbo,
    grasas: guia.grasas,
    calorias: guia.calorias
  };

  fetch(URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(resp => {
    if (resp.estado === "OK") {
      mostrarModal("Guía diaria guardada correctamente");
    } else {
      mostrarModal("Error al guardar guía diaria");
    }
  })
  .catch(err => mostrarModal("Error: " + err));
}



// Ir a la página de resumen
function irResumen() {
  window.location.href = "./resumen.html"; // asegura que busque en la misma carpeta
}


// CONSULTAR RESUMEN
async function consultarResumen() {
  const ccInput = document.getElementById("ccResumen").value.trim();
  if (!ccInput) return alert("Ingresa tu CC para buscar tus registros");

  try {
    const res = await fetch(`${URL}?hoja=REGISTROS`);
    const data = await res.json();

    // Filtrar por CC
    const registros = data.filter(r => r[1] == ccInput); // r[1] = CC
    if (!registros.length) return alert("No se encontraron registros");

    // Ordenar por fecha (r[0] = fecha)
    registros.sort((a, b) => new Date(a[0]) - new Date(b[0]));

    // Mostrar registros
    const cont = document.getElementById("resumen");
    cont.innerHTML = "";

    registros.forEach(reg => {
      const fecha = new Date(reg[0]);
      const fechaStr = fecha.toLocaleDateString("es-ES"); // dd/mm/yyyy

      const div = document.createElement("div");
      div.classList.add("registro");

      div.innerHTML = `
        <button class="fecha-btn">${fechaStr}</button>
        <div class="detalle">
          <p>Peso: <b>${reg[2]} kg</b></p>
          <p>Proteínas: <b>${reg[3]} g</b></p>
          <p>Carbohidratos: <b>${reg[4]} g</b></p>
          <p>Grasas: <b>${reg[5]} g</b></p>
          <p>Calorías: <b>${reg[6]}</b></p>
        </div>
      `;

      cont.appendChild(div);
    });

    // Desplegable por fecha
    document.querySelectorAll(".fecha-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const detalle = btn.nextElementSibling;
        detalle.style.display = detalle.style.display === "block" ? "none" : "block";
      });
    });

  } catch (err) {
    console.error(err);
    alert("Error al consultar los registros");
  }
}


// Toggle desplegable
function toggleRegistro(i) {
  const detalle = document.getElementById(`detalle-${i}`);
  if(!detalle) return;
  detalle.style.display = detalle.style.display === "block" ? "none" : "block";
}
