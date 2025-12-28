const URL = "https://script.google.com/macros/s/AKfycbyRJmpae74_163u5nDbIdW_IoJuoaoP0BSK0vCQib7TeMnIcH31A4Thmdu3BQRVzH6IEw/exec";

function guardarPerfil() {
  const cc = cc.value;
  const peso = +peso.value;
  const altura = +altura.value;
  const edad = +edad.value;
  const sexo = document.getElementById("sexo").value;
  const actividad = +document.getElementById("actividad").value;

  const tmb = sexo === "H"
    ? 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * edad)
    : 447.6 + (9.2 * peso) + (3.1 * altura) - (4.3 * edad);

  const calorias = Math.round(tmb * actividad);
  const proteina = Math.round(peso * 2);
  const grasas = Math.round((calorias * 0.25) / 9);
  const carbos = Math.round((calorias - (proteina*4 + grasas*9)) / 4);

  fetch(URL, {
    method: "POST",
    body: JSON.stringify({
      tipo: "usuario",
      cc, peso, altura, edad, sexo,
      grasa: grasas,
      actividad
    }),
    headers: { "Content-Type": "application/json" },
    mode: "no-cors"
  });

  fetch(URL, {
    method: "POST",
    body: JSON.stringify({
      tipo: "registro",
      cc, peso, proteina, carbos, grasas, calorias
    }),
    headers: { "Content-Type": "application/json" },
    mode: "no-cors"
  });

  localStorage.setItem("macros", JSON.stringify({ calorias, proteina, carbos, grasas }));
  window.location.href = "guia.html";
}
