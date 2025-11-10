/* const btnSubmit = document.getElementById("submit");
const inputName = document.getElementById("name");
const inputAge = document.getElementById("age");
const inputEmail = document.getElementById("email");

const btnList = document.getElementById("btnList");

const btnDelete = document.getElementById("btnDelete");

//Crear base de datos Pouch
const db = new PouchDB('personas');

btnSubmit.addEventListener('click', (event) => {
    event.preventDefault();

    const persona = {
        _id: new Date().toISOString(),
        name: inputName.value,
        age: inputAge.value,
        email: inputEmail.value,
        status: 'pending'
    };


db.put(persona)
.then((response) => {
    console.log(response);
    console.log("Persona guardada con exito");
    inputName.value = '';
    inputAge.value = '';
    inputEmail.value = '';
}).catch((err) => {
    console.error('Error al guardar la persona', err)
});
})

btnList.addEventListener('click', ()=>{
    db.allDocs({
        include_docs:true
    })
    .then((result) => {
        console.log('Personas');
        console.log(result);
    })
    .catch((err)=>{
        console.log("error al obtener las respuestas", err);
    });
});
*/

const btnSubmit = document.getElementById("submit");
const inputName = document.getElementById("name");
const inputAge = document.getElementById("age");
const inputEmail = document.getElementById("email");
const btnList = document.getElementById("btnList");
const listContainer = document.getElementById("listContainer");

// Crear base de datos
const db = new PouchDB('personas');

// --- GUARDAR PERSONA ---
btnSubmit.addEventListener('click', (event) => {
  event.preventDefault();

  const persona = {
    _id: new Date().toISOString(),
    name: inputName.value.trim(),
    age: inputAge.value.trim(),
    email: inputEmail.value.trim(),
    status: 'pending'
  };

  if (!persona.name || !persona.age || !persona.email) {
    alert("Por favor, completa todos los campos antes de guardar.");
    return;
  }

  db.put(persona)
    .then(() => {
      alert("Persona guardada con éxito.");
      inputName.value = '';
      inputAge.value = '';
      inputEmail.value = '';
      listarPersonas();
    })
    .catch((err) => console.error('Error al guardar la persona:', err));
});

// --- LISTAR PERSONAS ---
btnList.addEventListener('click', listarPersonas);

function listarPersonas() {
  db.allDocs({ include_docs: true, descending: true })
    .then((result) => {
      listContainer.innerHTML = "";

      if (result.rows.length === 0) {
        listContainer.innerHTML = "<p>No hay registros.</p>";
        return;
      }

      result.rows.forEach((row) => {
        const persona = row.doc;
        const div = document.createElement("div");
        div.className = "person-item";

        div.innerHTML = `
          <strong>${persona.name}</strong><br>
          Edad: ${persona.age}<br>
          Email: ${persona.email}<br>
          <button class="delete-btn" data-id="${persona._id}" data-rev="${persona._rev}">Eliminar</button>
        `;

        listContainer.appendChild(div);
      });

      // Asignar evento de eliminación a cada botón
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.target.dataset.id;
          const rev = e.target.dataset.rev;
          eliminarPersona(id, rev);
        });
      });
    })
    .catch((err) => console.error("Error al listar personas:", err));
}

// --- ELIMINAR PERSONA ---
function eliminarPersona(id, rev) {
  if (confirm("¿Seguro que deseas eliminar este registro?")) {
    db.remove(id, rev)
      .then(() => {
        alert("Persona eliminada con éxito.");
        listarPersonas();
      })
      .catch((err) => console.error("Error al eliminar la persona:", err));
  }
}

// Cargar lista al iniciar
listarPersonas();
