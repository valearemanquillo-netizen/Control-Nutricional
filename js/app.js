const URL = "https://script.google.com/macros/s/AKfycbzq95bWyWNDTuULrHoTs65HN2wS97rtPXAwdCbsUQJ2hqkzxG_oI-VC7wp67c_tMb9UDw/exec";

let macros = {};

function mostrar(id) {
  document.querySelectorAll(".pantalla").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
}
mostrar("perfil");

function guardarPerfil() {
  const cc = ccInput.value;
  const pesoVal = +peso.value;
  const alturaVal = +altura.value;
  const edadVal = +edad.value;
  const sexoVal = sexo.value;
  const actividadVal = +actividad.value;

  let tmb = sexoVal === "H"
    ? 88.36 + 13.4 * pesoVal + 4.8 * alturaVal - 5.7 * edadVal
    : 447.6 + 9.2 * pesoVal + 3.1 * alturaVal - 4.3 * edadVal;

  const calorias = Math.round(tmb * actividadVal);
  const proteina = Math.round(pesoVal * 2);
  const grasas = Math.round((calorias * 0.25) / 9);
  const carbos = Math.round((calorias - proteina * 4 - grasas * 9) / 4);

  macros = { proteina, carbos, grasas };

  fetch(`${URL}?accion=guardarUsuario&cc=${cc}&peso=${pesoVal}&altura=${alturaVal}&edad=${edadVal}&sexo=${sexoVal}&actividad=${actividadVal}&calorias=${calorias}&proteina=${proteina}&carbos=${carbos}&grasas=${grasas}`)
    .then(() => {
      mostrar("registro");
      mostrarGuia();
    });
}

function mostrarGuia() {
  const p = Math.round(macros.proteina / 3);
  const c = Math.round(macros.carbos / 3);
  const g = Math.round(macros.grasas / 3);

  resultado.innerHTML = `
    <p><b>Desayuno:</b> ${p}g proteína | ${c}g carbos | ${g}g grasas</p>
    <p><b>Almuerzo:</b> ${p}g proteína | ${c}g carbos | ${g}g grasas</p>
    <p><b>Cena:</b> ${p}g proteína | ${c}g carbos | ${g}g grasas</p>
  `;
}

function buscarResumen() {
  fetch(`${URL}?accion=buscarRegistros&cc=${ccBuscar.value}`)
    .then(r => r.json())
    .then(data => {
      resumenResultado.innerHTML = data.length
        ? data.map(d => `<p>${d.fecha} → ${d.peso} kg</p>`).join("")
        : "<p>No hay registros</p>";
    });
}
