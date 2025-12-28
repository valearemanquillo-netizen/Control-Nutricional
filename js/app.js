const URL = "https://script.google.com/macros/s/AKfycbxN1J4AS2MY8SQGr2F8KLwJMoOtV7SGM2uFfLSdGiISq95UjpdMMjfG4XcJ_KUnnhrAfg/exec";

// =====================
// NAVEGACIÓN
// =====================
function mostrar(id) {
  document.querySelectorAll(".pantalla").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
}

mostrar("perfil");
cargarPerfil();

// =====================
// GUARDAR PERFIL
// =====================
function guardarPerfil() {

  const data = {
    tipo: "perfil",
    cc: ccUsuario.value,
    peso: peso.value,
    altura: altura.value,
    edad: edad.value,
    sexo: sexo.value,
    grasa: grasa.value,
    actividad: actividad.value
  };

  localStorage.setItem("perfil_" + data.cc, JSON.stringify(data));

  const params = new URLSearchParams(data).toString();

  fetch(`${URL}?${params}`)
    .then(() => {
      generarGuia(data);
      mostrar("registro");
    });
}

// =====================
// CARGAR PERFIL
// =====================
function cargarPerfil() {
  const cc = localStorage.getItem("ccActual");
  if (!cc) return;

  const data = JSON.parse(localStorage.getItem("perfil_" + cc));
  if (!data) return;

  ccUsuario.value = data.cc;
  peso.value = data.peso;
  altura.value = data.altura;
  edad.value = data.edad;
  sexo.value = data.sexo;
  grasa.value = data.grasa;
  actividad.value = data.actividad;

  generarGuia(data);
  mostrar("registro");
}

// =====================
// GUÍA NUTRICIONAL
// =====================
function generarGuia(p) {
  const tmb = p.sexo === "H"
    ? 10*p.peso + 6.25*p.altura - 5*p.edad + 5
    : 10*p.peso + 6.25*p.altura - 5*p.edad - 161;

  const calorias = tmb * p.actividad;
  const proteina = p.peso * 2;
  const grasas = p.peso * 0.8;
  const carbos = (calorias - (proteina*4 + grasas*9)) / 4;

  resultado.innerHTML = `
    <h3>Guía diaria</h3>
    <p>Calorías: ${calorias.toFixed(0)}</p>
    <p>Proteína: ${proteina.toFixed(0)} g</p>
    <p>Carbos: ${carbos.toFixed(0)} g</p>
    <p>Grasas: ${grasas.toFixed(0)} g</p>
  `;
}

// =====================
// GUARDAR REGISTRO
// =====================
function guardarRegistro() {

  const perfil = JSON.parse(localStorage.getItem("perfil_" + ccUsuario.value));
  localStorage.setItem("ccActual", ccUsuario.value);

  const proteina = (+pd.value + +pa.value + +pc.value);
  const carbos = (+cd.value + +ca.value + +cc.value);
  const grasas = (+gd.value + +ga.value + +gc.value);
  const calorias = proteina*4 + carbos*4 + grasas*9;

  const data = {
    tipo: "registro",
    cc: perfil.cc,
    peso: perfil.peso,
    proteina,
    carbos,
    grasas,
    calorias
  };

  const params = new URLSearchParams(data).toString();

  fetch(`${URL}?${params}`)
    .then(() => {
      mostrar("resumen");
    });
}
