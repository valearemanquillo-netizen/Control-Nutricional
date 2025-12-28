// =======================================
// URL GOOGLE APPS SCRIPT
// =======================================
const URL = "https://script.google.com/macros/s/AKfycbzEWiNtrkoOgteflcxaTyu62G2pJxlPEg3KsRYXf39Wx7EzUe0hbWAPeKDt6i543lPXqg/exec";

// =======================================
// NAVEGACIÓN ENTRE PANTALLAS
// =======================================
function mostrar(id) {
  document.querySelectorAll('.pantalla')
    .forEach(p => p.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// =======================================
// CARGAR PERFIL SI EXISTE
// =======================================
function cargarPerfil() {
  const perfilGuardado = localStorage.getItem("perfilUsuario");

  if (perfilGuardado) {
    const perfil = JSON.parse(perfilGuardado);

    peso.value = perfil.peso;
    altura.value = perfil.altura;
    edad.value = perfil.edad;
    sexo.value = perfil.sexo;
    grasa.value = perfil.grasa;
    actividad.value = perfil.actividad;

    generarGuiaNutricional(perfil);
    mostrar('registro');
  } else {
    mostrar('perfil');
  }
}

// =======================================
// GUARDAR PERFIL (UNA SOLA VEZ)
// =======================================
function guardarPerfil() {

  const perfil = {
    tipo: "usuario",
    peso: Number(peso.value),
    altura: Number(altura.value),
    edad: Number(edad.value),
    sexo: sexo.value,
    grasa: Number(grasa.value),
    actividad: Number(actividad.value)
  };

  // Guardar localmente
  localStorage.setItem("perfilUsuario", JSON.stringify(perfil));

  // Guardar en Google Sheets
  fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(perfil)
  })
  .then(res => res.json())
  .then(() => {
    generarGuiaNutricional(perfil);
    mostrar('registro');
  })
  .catch(err => {
    console.error("Error perfil:", err);
    alert("Error al guardar perfil");
  });
}

// =======================================
// GUÍA NUTRICIONAL AUTOMÁTICA
// =======================================
function generarGuiaNutricional(perfil) {

  const peso = perfil.peso;
  const altura = perfil.altura;
  const edad = perfil.edad;
  const sexo = perfil.sexo;
  const actividad = perfil.actividad;

  let tmb = sexo === "H"
    ? (10 * peso + 6.25 * altura - 5 * edad + 5)
    : (10 * peso + 6.25 * altura - 5 * edad - 161);

  const calorias = tmb * actividad;

  const proteina = peso * 2;
  const grasas = peso * 0.8;
  const carbos = (calorias - (proteina * 4 + grasas * 9)) / 4;

  document.getElementById("resultado").innerHTML = `
    <h3>Guía diaria recomendada</h3>
    <p>Calorías <span>${calorias.toFixed(0)}</span></p>
    <p>Proteína <span>${proteina.toFixed(0)} g</span></p>
    <p>Carbohidratos <span>${carbos.toFixed(0)} g</span></p>
    <p>Grasas <span>${grasas.toFixed(0)} g</span></p>
  `;
}

// =======================================
// GUARDAR REGISTRO DIARIO
// =======================================
function guardarRegistro() {

  const perfil = JSON.parse(localStorage.getItem("perfilUsuario"));
  if (!perfil) {
    alert("No hay perfil cargado");
    return;
  }

  const proteina = (+pd.value || 0) + (+pa.value || 0) + (+pc.value || 0);
  const carbos   = (+cd.value || 0) + (+ca.value || 0) + (+cc.value || 0);
  const grasas   = (+gd.value || 0) + (+ga.value || 0) + (+gc.value || 0);
  const calorias = (proteina * 4) + (carbos * 4) + (grasas * 9);

  const registro = {
    tipo: "registro",
    peso: perfil.peso,
    proteina,
    carbos,
    grasas,
    calorias
  };

  fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registro)
  })
  .then(res => res.json())
  .then(() => {

    document.getElementById("resultado").innerHTML += `
      <h3>Consumo del día</h3>
      <p>Proteína <span>${proteina} g</span></p>
      <p>Carbohidratos <span>${carbos} g</span></p>
      <p>Grasas <span>${grasas} g</span></p>
      <p>Calorías <span>${calorias}</span></p>
    `;

    // Limpiar inputs
    pd.value = cd.value = gd.value = "";
    pa.value = ca.value = ga.value = "";
    pc.value = cc.value = gc.value = "";

    mostrar('resumen');
  })
  .catch(err => {
    console.error("Error registro:", err);
    alert("Error al guardar registro");
  });
}

// =======================================
// INICIALIZAR APP
// =======================================
cargarPerfil();
