const URL = "https://script.google.com/macros/s/AKfycbw-lMyQV3bCJcma7gso0QAojZFK_AVdfrvNR75BQrmCTNaGGhToiv5HuEIKds9GKottfg/exec";

/* ==========================
   PERFIL
========================== */
function guardarPerfil() {
  const cc = document.getElementById("cc").value.trim();
  const peso = +document.getElementById("peso").value;
  const altura = +document.getElementById("altura").value;
  const edad = +document.getElementById("edad").value;
  const sexo = document.getElementById("sexo").value;
  const actividad = +document.getElementById("actividad").value;

  if (!cc || !peso || !altura || !edad || !sexo || !actividad) {
    alert("Complete todos los campos");
    return;
  }

  // Cálculo TMB (Mifflin)
  const tmb = sexo === "H"
    ? 10 * peso + 6.25 * altura - 5 * edad + 5
    : 10 * peso + 6.25 * altura - 5 * edad - 161;

  const calorias = Math.round(tmb * actividad);
  const proteina = Math.round(peso * 2);
  const grasas = Math.round(calorias * 0.25 / 9);
  const carbos = Math.round((calorias - (proteina * 4 + grasas * 9)) / 4);

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
  })
    .then(() => {
      localStorage.setItem("guia", JSON.stringify(data));
      window.location.href = "guia.html";
    });
}

/* ==========================
   GUIA
========================== */
9function cargarGuia() {
  const guia = JSON.parse(localStorage.getItem("guia"));
  if (!guia) return;

  // Calculamos IMC
  const alturaM = guia.altura / 100;
  const imc = (guia.peso / (alturaM * alturaM)).toFixed(1);

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

if (document.getElementById("guia")) {
  cargarGuia();
}


/* ==========================
   RESUMEN
========================== */
function consultarResumen() {
  const input = document.getElementById("ccBusqueda");
  if (!input) return;

  const cc = input.value.trim();
  if (!cc) {
    alert("Ingrese la cédula");
    return;
  }

  fetch(`${URL}?hoja=REGISTROS&cc=${cc}`)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.length <= 1) {
        document.getElementById("listaResumen").innerHTML =
          "<p>No hay registros</p>";
        return;
      }

      let html = "";

      data.slice(1).reverse().forEach((row, i) => {
        html += `
          <div class="registro">
            <button class="fecha-btn" onclick="toggleRegistro(${i})">
              📅 ${new Date(row[0]).toLocaleDateString()}
            </button>
            <div class="detalle" id="detalle-${i}">
              <p>Peso: ${row[2]} kg</p>
              <p>Proteína: ${row[3]} g</p>
              <p>Carbos: ${row[4]} g</p>
              <p>Grasas: ${row[5]} g</p>
              <p>Calorías: ${row[6]}</p>
            </div>
          </div>
        `;
      });

      document.getElementById("listaResumen").innerHTML = html;
    });
}

function toggleRegistro(i) {
  const detalle = document.getElementById(`detalle-${i}`);
  if (!detalle) return;

  detalle.style.display =
    detalle.style.display === "block" ? "none" : "block";
}

