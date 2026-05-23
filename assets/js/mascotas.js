/* =====================================================
   PetCare Planner - mascotas.js
   Lógica de la página Mascotas
===================================================== */

/*
  Responsabilidades de este archivo:

  - Leer mascotas desde storage.js.
  - Renderizar mascotas en mascotas.html.
  - Permitir seleccionar una mascota.
  - Mostrar detalle de mascota seleccionada.
  - Mostrar próximos cuidados asociados.
  - Capturar el formulario para agregar mascota.

  Este archivo SÍ puede usar DOM.
  Este archivo NO define datos iniciales.
  Este archivo NO accede directamente a localStorage.
*/

/* =====================================================
   Selectores del DOM
===================================================== */

const petsListElement = document.getElementById("pets-list");
const selectedPetDetailElement = document.getElementById("selected-pet-detail");
const selectedPetTasksElement = document.getElementById("selected-pet-tasks");

const petFormElement = document.getElementById("pet-form");
const petNameInput = document.getElementById("pet-name");
const petSpeciesSelect = document.getElementById("pet-species");
const petAgeInput = document.getElementById("pet-age");
const petBreedInput = document.getElementById("pet-breed");
const petMessageElement = document.getElementById("pet-message");

/* =====================================================
   Estado local de la página
===================================================== */

let selectedPetId = null;

/* =====================================================
   Validaciones iniciales
===================================================== */

function validateRequiredElements() {
    const requiredElements = [
        petsListElement,
        selectedPetDetailElement,
        selectedPetTasksElement,
        petFormElement,
        petNameInput,
        petSpeciesSelect,
        petAgeInput,
        petBreedInput,
        petMessageElement
    ];

    const hasMissingElement = requiredElements.some((element) => !element);

    if (hasMissingElement) {
        console.error("Faltan elementos necesarios en mascotas.html.");
        return false;
    }

    return true;
}

/* =====================================================
   Datos iniciales
===================================================== */

function loadInitialData() {
    seedInitialData();

    const pets = getPets();

    if (pets.length > 0 && !selectedPetId) {
        selectedPetId = pets[0].id;
    }
}

/* =====================================================
   Renderizado
===================================================== */

function getPetEmoji(species) {
    if (species === "Perro") {
        return "🐶";
    }

    if (species === "Gato") {
        return "🐱";
    }

    if (species === "Conejo") {
        return "🐰";
    }

    return "🐾";
}

function renderPets() {
    const pets = getPets();

    petsListElement.innerHTML = "";

    if (pets.length === 0) {
        petsListElement.innerHTML = `
      <div class="empty-state">
        <p class="empty-state__title">Todavía no agregaste mascotas</p>
        <p class="empty-state__text">
          Agregá tu primera mascota para empezar a organizar sus cuidados.
        </p>
      </div>
    `;
        return;
    }

    pets.forEach((pet) => {
        const isSelected = pet.id === selectedPetId;

        const petButton = document.createElement("button");
        petButton.type = "button";
        petButton.className = "pet-mini-card";
        petButton.dataset.petId = pet.id;
        petButton.setAttribute("aria-pressed", isSelected ? "true" : "false");
        petButton.setAttribute("aria-label", `Seleccionar mascota ${pet.name}`);

        if (isSelected) {
            petButton.classList.add("is-selected");
        }

        petButton.innerHTML = `
      <span class="pet-avatar" aria-hidden="true">
        ${getPetEmoji(pet.species)}
      </span>

      <span class="pet-info">
        <span class="pet-name">${pet.name}</span>
        <span class="pet-meta">
          ${pet.species} · ${pet.breed || "Sin raza"} · ${pet.age || "Sin edad"}
        </span>
      </span>
    `;

        petsListElement.appendChild(petButton);
    });
}

function renderSelectedPet() {
    if (!selectedPetId) {
        selectedPetDetailElement.innerHTML = `
      <p class="card-text">
        Seleccioná una mascota para ver su información y próximos cuidados.
      </p>
    `;
        return;
    }

    const pet = getPetById(selectedPetId);

    if (!pet) {
        selectedPetDetailElement.innerHTML = `
      <p class="card-text">
        No se encontró la mascota seleccionada.
      </p>
    `;
        return;
    }

    selectedPetDetailElement.innerHTML = `
    <div class="pet-detail">
      <div class="pet-detail__header">
        <span class="pet-avatar pet-avatar--lg" aria-hidden="true">
          ${getPetEmoji(pet.species)}
        </span>

        <div>
          <h3 class="card-title">${pet.name}</h3>
          <p class="card-text">
            ${pet.species} · ${pet.breed || "Sin raza registrada"}
          </p>
        </div>
      </div>

      <div class="stack">
        <p class="card-text">
          <strong>Edad:</strong> ${pet.age || "Sin edad registrada"}
        </p>

        <p class="card-text">
          <strong>Registrada:</strong> ${pet.createdAt ? formatDateToDisplay(pet.createdAt.slice(0, 10)) : "Sin fecha"
        }
        </p>
      </div>
    </div>
  `;
}

function selectPet(petId) {
    selectedPetId = petId;

    renderPets();
    renderSelectedPet();
    renderSelectedPetTasks();

    petMessageElement.textContent = "";
}

function renderSelectedPetTasks() {
    if (!selectedPetId) {
        selectedPetTasksElement.innerHTML = `
      <div class="empty-state">
        <p class="empty-state__title">Sin mascota seleccionada</p>
        <p class="empty-state__text">
          Seleccioná una mascota para ver sus próximos cuidados.
        </p>
      </div>
    `;
        return;
    }

    const petTasks = getTasksByPetId(selectedPetId);
    const pendingTasks = petTasks.filter((task) => task.status !== "done");
    const sortedTasks = sortTasksByDate(pendingTasks);
    const visibleTasks = sortedTasks.slice(0, 3);

    selectedPetTasksElement.innerHTML = "";

    if (visibleTasks.length === 0) {
        selectedPetTasksElement.innerHTML = `
      <div class="empty-state">
        <p class="empty-state__title">Sin cuidados pendientes</p>
        <p class="empty-state__text">
          Esta mascota no tiene cuidados pendientes por ahora.
        </p>
      </div>
    `;
        return;
    }

    visibleTasks.forEach((task) => {
        const visualStatus = getTaskVisualStatus(task);

        const taskCard = document.createElement("article");
        taskCard.className = "task-card";

        taskCard.innerHTML = `
      <div class="task-card__content">
        <div>
          <h3 class="task-card__title">${task.title}</h3>

          <p class="task-card__meta">
            ${formatDateToDisplay(task.date)} · ${formatTimeToDisplay(task.time)}
          </p>

          <p class="task-card__description">
            ${task.description || "Sin descripción adicional."}
          </p>
        </div>

        <span class="badge ${visualStatus.badgeClass}">
          ${visualStatus.label}
        </span>
      </div>
    `;

        selectedPetTasksElement.appendChild(taskCard);
    });
}

/* =====================================================
   Eventos
===================================================== */

function showPetMessage(message, type = "success") {
    petMessageElement.textContent = message;

    if (type === "error") {
        petMessageElement.className = "form-error";
        return;
    }

    petMessageElement.className = "form-help";
}

function handlePetSubmit(event) {
    event.preventDefault();

    const petData = {
        name: petNameInput.value,
        species: petSpeciesSelect.value,
        age: petAgeInput.value,
        breed: petBreedInput.value,
        image: ""
    };

    if (!cleanText(petData.name)) {
        showPetMessage("Completá el nombre de la mascota.", "error");
        petNameInput.focus();
        return;
    }

    if (!cleanText(petData.species)) {
        showPetMessage("Seleccioná la especie de la mascota.", "error");
        petSpeciesSelect.focus();
        return;
    }

    const newPet = addPet(petData);

    if (!newPet) {
        showPetMessage("No se pudo guardar la mascota. Revisá los datos.", "error");
        return;
    }

    petFormElement.reset();

    selectPet(newPet.id);

    showPetMessage(`Mascota "${newPet.name}" agregada correctamente.`);
}

function handlePetsListClick(event) {
    const petButton = event.target.closest("[data-pet-id]");

    if (!petButton) {
        return;
    }

    selectPet(petButton.dataset.petId);
}

function setupEventListeners() {
    petsListElement.addEventListener("click", handlePetsListClick);
    petFormElement.addEventListener("submit", handlePetSubmit);
}

/* =====================================================
   Inicialización
===================================================== */

function initMascotasPage() {
    const isValidPage = validateRequiredElements();

    if (!isValidPage) {
        return;
    }

    loadInitialData();
    renderPets();
    renderSelectedPet();
    renderSelectedPetTasks();

    setupEventListeners();

    console.info("Mascotas page inicializada correctamente.");
}

initMascotasPage();