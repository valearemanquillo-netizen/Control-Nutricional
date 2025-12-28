// ===============================
// URL DE GOOGLE APPS SCRIPT
// ===============================
const URL = "https://script.google.com/macros/s/AKfycbzEWiNtrkoOgteflcxaTyu62G2pJxlPEg3KsRYXf39Wx7EzUe0hbWAPeKDt6i543lPXqg/exec";

// ===============================
// NAVEGACIÓN ENTRE PANTALLAS
// ===============================
function mostrar(id) {
  document.querySelectorAll('.pantalla')
    .forEach(p => p.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// Pantalla inicial
mostrar('perfil');

// ===============================
// GUARDAR PERFIL
// ===============================
function guardarPerfil() {

  const data = {
    tipo: "usuario",
    peso: peso.value,
    altura: altura.value,
    edad: edad.value,
    sexo: sexo.value,
    grasa: grasa.value,
    actividad: actividad.value
  };

  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(() => {
    alert("Perfil guardado correctamente");
    mostrar('registro');
  })
  .catch(err => {
    console.error("Error al guardar perfil:", err);
    alert("Error al guardar perfil");
  });
}

// ===============================
// GUARDAR REGISTRO DIARIO
// ===============================
function guardarRegistro() {

  // Convertir a números y evitar NaN
  const proteina = (+pd.value || 0) + (+pa.value || 0) + (+pc.value || 0);
  const carbos   = (+cd.value || 0) + (+ca.value || 0) + (+cc.value || 0);
  const grasas   = (+gd.value || 0) + (+ga.value || 0) + (+gc.value || 0);

  const calorias = (proteina * 4) + (carbos * 4) + (grasas * 9);

  const data = {
    tipo: "registro",
    peso: peso.value,
    proteina: proteina,
    carbos: carbos,
    grasas: grasas,
    calorias: calorias
  };

  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(() => {

    // Mostrar resumen
    document.getElementById("resultado").innerHTML = `
      <p>Proteína <span>${proteina} g</span></p>
      <p>Carbohidratos <span>${carbos} g</span></p>
      <p>Grasas <span>${grasas} g</span></p>
      <p>Calorías <span>${calorias}</span></p>
    `;

    // Limpiar inputs DESPUÉS de guardar
    pd.value = cd.value = gd.value = "";
    pa.value = ca.value = ga.value = "";
    pc.value = cc.value = gc.value = "";

    mostrar('resumen');
  })
  .catch(err => {
    console.error("Error al guardar registro:", err);
    alert("Error al guardar el registro diario");
  });
}
