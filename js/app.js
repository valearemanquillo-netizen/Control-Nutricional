const URL = "https://script.google.com/macros/s/AKfycbzz1cEEN_lJlZ7opNcw_3yug9c7R9MZnxkRoZWa7fWYzJVXne3AelaELq5-HRooF0eDtA/exec";

// =======================
// NAVEGACIÓN
// =======================
function mostrar(id) {
  document.querySelectorAll('.pantalla')
    .forEach(p => p.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

mostrar('perfil');
cargarPerfil();

// =======================
// PERFIL
// =======================
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

  localStorage.setItem("perfilUsuario", JSON.stringify(data));

  fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(() => {
    generarGuiaNutricional(data);
    mostrar('registro');
  })
  .catch(err => console.error("Error al guardar perfil", err));
}

// =======================
// CARGAR PERFIL
// =======================
function cargarPerfil() {
  const perfil = localStorage.getItem("perfilUsuario");
  if (!perfil) return;

  const data = JSON.parse(perfil);

  peso.value = data.peso;
  altura.value = data.altura;
  edad.value = data.edad;
  sexo.value = data.sexo;
  grasa.value = data.grasa;
  actividad.value = data.actividad;

  generarGuiaNutricional(data);
  mostrar('registro');
}

// =======================
// GUÍA NUTRICIONAL
// =======================
function generarGuiaNutricional(p) {
  const peso = +p.peso;
  const altura = +p.altura;
  const edad = +p.edad;

  let tmb = p.sexo === "H"
    ? (10 * peso + 6.25 * altura - 5 * edad + 5)
    : (10 * peso + 6.25 * altura - 5 * edad - 161);

  const calorias = tmb * +p.actividad;
  const proteina = peso * 2;
  const grasas = peso * 0.8;
  const carbos = (calorias - (proteina * 4 + grasas * 9)) / 4;

  resultado.innerHTML = `
    <h3>Guía diaria</h3>
    <p>Calorías: ${calorias.toFixed(0)}</p>
    <p>Proteína: ${proteina.toFixed(0)} g</p>
    <p>Carbohidratos: ${carbos.toFixed(0)} g</p>
    <p>Grasas: ${grasas.toFixed(0)} g</p>
  `;
}

// =======================
// REGISTRO DIARIO
// =======================
function guardarRegistro() {
  const proteina = (+pd.value + +pa.value + +pc.value);
  const carbos = (+cd.value + +ca.value + +cc.value);
  const grasas = (+gd.value + +ga.value + +gc.value);
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

  fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(() => {
    resultado.innerHTML += `
      <hr>
      <p><strong>Consumido hoy</strong></p>
      <p>Proteína: ${proteina} g</p>
      <p>Carbos: ${carbos} g</p>
      <p>Grasas: ${grasas} g</p>
      <p>Calorías: ${calorias}</p>
    `;
    limpiarInputs();
    mostrar('resumen');
  })
  .catch(err => console.error("Error registro", err));
}

// =======================
// LIMPIAR INPUTS
// =======================
function limpiarInputs() {
  pd.value = cd.value = gd.value = "";
  pa.value = ca.value = ga.value = "";
  pc.value = cc.value = gc.value = "";
}
