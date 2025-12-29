const URL = "https://script.google.com/macros/s/AKfycbySAXW-_bKS6kS8JbrIlRTxT1RInfseNnTqtWL13CnCfPoaiBgyUbkHx5kaz6l0qjuf/exec"; // Reemplaza con tu URL


function guardarPerfil() {
  const cc = document.getElementById("cc").value.trim();
  const peso = +document.getElementById("peso").value;
  const altura = +document.getElementById("altura").value;
  const edad = +document.getElementById("edad").value;
  const sexo = document.getElementById("sexo").value;
  const actividad = +document.getElementById("actividad").value;

  if (!cc || !peso || !altura || !edad || !sexo || !actividad) {
    return alert("Completa todos los datos del perfil");
  }

  const data = {
    tipo: "usuario",
    cc,
    peso,
    altura,
    edad,
    sexo,
    actividad
  };

  fetch(URL, { method: "POST", body: JSON.stringify(data) })
    .then(res => res.json())
    .then(resp => {
      if(resp.estado === "OK") {
        // Guardar en localStorage para usar en guía diaria
        localStorage.setItem("usuario", JSON.stringify(data));
        window.location.href = "guia.html";
      }
    })
    .catch(err => console.error("Error al guardar perfil:", err));
}


function mostrarGuiaDiaria(guia) {
  const cont = document.getElementById("guia");
  if (!guia) return;

  const proteina = Math.round(guia.peso * 2); // ejemplo
  const carbo = Math.round(guia.peso * 4); // ejemplo
  const grasas = Math.round(guia.peso * 1); // ejemplo
  const calorias = proteina*4 + carbo*4 + grasas*9;

  const imc = (guia.peso / ((guia.altura/100)**2)).toFixed(1);
  let imcTexto = "";
  if (imc < 18.5) imcTexto = "Bajo peso";
  else if (imc < 25) imcTexto = "Normal";
  else if (imc < 30) imcTexto = "Sobrepeso";
  else imcTexto = "Obesidad";

  const guiaData = {
    cc: guia.cc,
    peso: guia.peso,
    proteina,
    carbo,
    grasas,
    calorias
  };

  localStorage.setItem("guia", JSON.stringify(guiaData));

  cont.innerHTML = `
    <ul>
      <li>Proteínas: <b>${proteina} g</b></li>
      <li>Carbohidratos: <b>${carbo} g</b></li>
      <li>Grasas: <b>${grasas} g</b></li>
      <li>Calorías: <b>${calorias}</b></li>
      <li>IMC: <b>${imc} (${imcTexto})</b></li>
    </ul>
  `;
}

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

  fetch(URL, { method: "POST", body: JSON.stringify(data) })
    .then(res => res.json())
    .then(resp => {
      if (resp.estado === "OK") mostrarModal("Guía diaria guardada correctamente");
      else mostrarModal("Error al guardar guía diaria");
    })
    .catch(err => mostrarModal("Error: " + err));
}


function mostrarModal(texto) {
  const modal = document.getElementById("modal-mensaje");
  const modalTexto = document.getElementById("modal-texto");
  const cerrarBtn = document.getElementById("cerrar-modal");

  modalTexto.textContent = texto;
  modal.style.display = "flex";

  cerrarBtn.onclick = () => modal.style.display = "none";
  window.onclick = (e) => { if(e.target == modal) modal.style.display = "none"; };
}


function irResumen() {
  window.location.href = "resumen.html";
}


async function consultarResumen() {
  const ccInput = document.getElementById("ccResumen").value.trim();
  if (!ccInput) return alert("Ingresa tu CC para buscar tus registros");

  try {
    const res = await fetch(`${URL}?hoja=REGISTROS`);
    const data = await res.json();

    const registros = data.filter(r => r[1] == ccInput);
    if (!registros.length) return alert("No se encontraron registros");

    registros.sort((a,b) => new Date(a[0]) - new Date(b[0]));

    const cont = document.getElementById("resumen");
    cont.innerHTML = "";

    registros.forEach(reg => {
      const fecha = new Date(reg[0]);
      const fechaStr = fecha.toLocaleDateString("es-ES");

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

    document.querySelectorAll(".fecha-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const detalle = btn.nextElementSibling;
        detalle.style.display = detalle.style.display === "block" ? "none" : "block";
      });
    });

  } catch(err) {
    console.error(err);
    alert("Error al consultar los registros");
  }
}
function irInicio() {
  window.location.href = "inicio.html";
}


window.addEventListener("load", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (usuario && document.getElementById("guia")) mostrarGuiaDiaria(usuario);
});
