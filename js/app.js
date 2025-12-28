const URL = "PEGA_AQUI_LA_URL_DEL_APPS_SCRIPT";

function mostrar(id) {
  document.querySelectorAll('.pantalla')
    .forEach(p => p.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}
mostrar('perfil');

// PERFIL
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
    body: JSON.stringify(data)
  });
  alert("Perfil guardado");
}

// REGISTRO
function guardarRegistro() {
  const proteina = (+pd.value + +pa.value + +pc.value);
  const carbos = (+cd.value + +ca.value + +cc.value);
  const grasas = (+gd.value + +ga.value + +gc.value);
  const calorias = proteina*4 + carbos*4 + grasas*9;

  const data = {
    tipo: "registro",
    peso: peso.value,
    proteina,
    carbos,
    grasas,
    calorias
  };

  fetch(URL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  document.getElementById("resultado").innerHTML = `
    <p>Proteína: ${proteina} g</p>
    <p>Carbos: ${carbos} g</p>
    <p>Grasas: ${grasas} g</p>
    <p>Calorías: ${calorias}</p>
  `;

  mostrar('resumen');
}
