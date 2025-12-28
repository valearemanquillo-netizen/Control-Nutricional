const data = JSON.parse(localStorage.getItem("macros"));
const r = document.getElementById("resultado");

const comidas = [
  { nombre: "Desayuno", p: 0.3 },
  { nombre: "Almuerzo", p: 0.4 },
  { nombre: "Cena", p: 0.3 }
];

let html = "<table><tr><th>Comida</th><th>Proteína</th><th>Carbos</th><th>Grasas</th></tr>";

comidas.forEach(c => {
  html += `<tr>
    <td>${c.nombre}</td>
    <td>${Math.round(data.proteina * c.p)} g</td>
    <td>${Math.round(data.carbos * c.p)} g</td>
    <td>${Math.round(data.grasas * c.p)} g</td>
  </tr>`;
});

html += "</table>";
r.innerHTML = html;
