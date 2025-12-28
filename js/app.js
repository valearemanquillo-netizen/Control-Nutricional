// ===============================
// CONFIGURACIÓN
// ===============================
const URL = "https://script.google.com/macros/s/AKfycbwM-TM4n__28ssBzpkgaVpNn8onE5lsKjdj25lFpnhImqpBQGa_iXNRZPAEbhpzdZKvXg/exec";

// ===============================
// NAVEGACIÓN ENTRE PANTALLAS
// ===============================
function mostrar(id) {
  document.querySelectorAll(".pantalla").forEach(p => {
    p.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

// ===============================
// INICIO
// ===============================
mostrar("perfil");
cargarPerfil();

// ===============================
// GUARDAR PERFIL (GET - SIN CORS)
// ===============================
function guardarPerfil() {

  const data = {
    tipo: "perfil",
    usuario: "usuario_unico",
    peso: peso.value,
    altura: altura.value,
    edad: edad.value,
    sexo: sexo.value,
    grasa: grasa.value,
    actividad: actividad.value
  };

  // Guardar localmente
  localStorage.setItem("perfilUsuario", JSON.stringify(data));

  // Enviar a Sheets
  const params = new URLSearchParams(data).toString();

  fetch(`${URL}?${params}`)
    .then(() => {
      generarGuiaNutricional(data);
      mostrar("registro");
    })
    .catch(err => console.error("Error al guardar perfil:", err));
}

// ===============================
// CARGAR PERFIL SI EXISTE
// ===============================
function cargarPerfil() {
  const perfilGuardado = localStorage.getItem("perfilUsuario");
  if (!perfilGuardado) return;

  const data = JSON.parse(perfilGuardado);

  peso.value = data.peso;
  altura.value = data.altura;
  edad.value = data.edad;
  sexo.value = data.sexo;
  grasa.value = data.grasa;
  actividad.value = data.actividad;

  generarGuiaNutricional(data);
  mostrar("registro");
}

// ===============================
// GUÍA NUTRICIONAL AUTOMÁTICA
// ===============================
function generarGuiaNutricional(p) {

  const pesoNum = Number(p.peso);
  const alturaNum = Number(p.altura);
  const edadNum = Number(p.edad);
  const actividadNum = Number(p.actividad);

  let tmb;
  if (p.sexo === "H") {
    tmb = 10 * pesoNum + 6.25 * alturaNum - 5 * edadNum + 5;
  } else {
    tmb = 10 * pesoNum + 6.25 * alturaNum - 5 * edadNum - 161;
  }

  const calorias = tmb * actividadNum;
  const proteina = pesoNum * 2;
  const grasas = pesoNum * 0.8;
  const carbos = (calorias - (proteina * 4 + grasas * 9)) / 4;

  resultado.innerHTML = `
    <h3>Guía diaria recomendada</h3>
    <p>Calorías: <strong>${calorias.toFixed(0)}</strong></p>
    <p>Proteína: <strong>${proteina.toFixed(0)} g</strong></p>
    <p>Carbohidratos: <strong>${carbos.toFixed(0)} g</strong></p>
    <p>Grasas: <strong>${grasas.toFixed(0)} g</strong></p>
  `;
}

// ===============================
// GUARDAR REGISTRO DIARIO
// ===============================
function guardarRegistro() {

  const proteina = (+pd.value || 0) + (+pa.value || 0) + (+pc.value || 0);
  const carbos   = (+cd.value || 0) + (+ca.value || 0) + (+cc.value || 0);
  const grasas   = (+gd.value || 0) + (+ga.value || 0) + (+gc.value || 0);
  const calorias = proteina * 4 + carbos * 4 + grasas * 9;

  const perfil = JSON.parse(localStorage.getItem("perfilUsuario"));

  const data = {
    tipo: "registro",
    usuario: "usuario_unico",
    peso: perfil.peso,
    proteina,
    carbos,
    grasas,
    calorias
  };

  const params = new URLSearchParams(data).toString();

  fetch(`${URL}?${params}`)
    .then(() => {
      resultado.innerHTML += `
        <hr>
        <h4>Consumo del día</h4>
        <p>Proteína: ${proteina} g</p>
        <p>Carbohidratos: ${carbos} g</p>
        <p>Grasas: ${grasas} g</p>
        <p>Calorías: ${calorias}</p>
      `;
      limpiarInputs();
      mostrar("resumen");
    })
    .catch(err => console.error("Error al guardar registro:", err));
}

// ===============================
// LIMPIAR INPUTS DE COMIDAS
// ===============================
function limpiarInputs() {
  pd.value = cd.value = gd.value = "";
  pa.value = ca.value = ga.value = "";
  pc.value = cc.value = gc.value = "";
}
