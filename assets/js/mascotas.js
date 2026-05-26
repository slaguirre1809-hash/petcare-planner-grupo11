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
const selectedPetSummaryElement = document.getElementById("selected-pet-summary");
const petFeatureTabsElement = document.getElementById("pet-feature-tabs");
const petFeatureMessageElement = document.getElementById("pet-feature-message");

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
    petMessageElement,
    selectedPetSummaryElement,
    petFeatureTabsElement,
    petFeatureMessageElement
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

function getTaskEmoji(title) {
  const normalizedTitle = cleanText(title).toLowerCase();

  if (normalizedTitle.includes("vacuna")) {
    return "💉";
  }

  if (normalizedTitle.includes("aliment")) {
    return "🥣";
  }

  if (normalizedTitle.includes("baño") || normalizedTitle.includes("bano")) {
    return "🚿";
  }

  if (normalizedTitle.includes("control") || normalizedTitle.includes("veterin")) {
    return "🩺";
  }

  return "📌";
}

function getSelectedPet() {
  if (!selectedPetId) {
    return null;
  }

  return getPetById(selectedPetId);
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
    petButton.className = "pet-mini-card pet-selector-card";
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
    <span class="pet-species-chip">
      ${pet.species || "Sin especie"}
    </span>
    <span class="pet-meta">
      ${pet.age || "Sin edad"}
    </span>
  </span>
`;

    petsListElement.appendChild(petButton);
  });

  const addPetLink = document.createElement("a");
  addPetLink.className = "pet-add-card";
  addPetLink.href = "#pet-form";
  addPetLink.setAttribute("aria-label", "Ir al formulario para agregar mascota");

  addPetLink.innerHTML = `
      <span class="pet-add-card__icon" aria-hidden="true">+</span>
      <span class="pet-add-card__text">Agregar mascota</span>
    `;

  petsListElement.appendChild(addPetLink);
}

function renderSelectedPet() {
  if (!selectedPetId) {
    selectedPetDetailElement.className = "card";
    selectedPetDetailElement.innerHTML = `
      <p class="card-text">
        Seleccioná una mascota para ver su información y próximos cuidados.
      </p>
    `;
    return;
  }

  const pet = getSelectedPet();

  if (!pet) {
    selectedPetDetailElement.className = "card";
    selectedPetDetailElement.innerHTML = `
      <p class="card-text">
        No se encontró la mascota seleccionada.
      </p>
    `;
    return;
  }

  selectedPetDetailElement.className = "card pet-profile-card";

  selectedPetDetailElement.innerHTML = `
    <div class="pet-profile-card__main">
      <span class="pet-avatar pet-avatar--xl" aria-hidden="true">
        ${getPetEmoji(pet.species)}
      </span>

      <div>
        <div class="pet-profile-card__title">
          <h3 class="card-title">${pet.name}</h3>
          <span class="badge badge-primary">
            ${pet.breed || "Sin raza"}
          </span>
        </div>

        <div class="pet-profile-card__meta">
          <p class="card-text">
            <strong>Especie:</strong> ${pet.species || "Sin especie"}
          </p>

          <p class="card-text">
            <strong>Edad:</strong> ${pet.age || "Sin edad registrada"}
          </p>

          <p class="card-text">
            <strong>Registrada:</strong> ${pet.createdAt ? formatDateToDisplay(pet.createdAt.slice(0, 10)) : "Sin fecha"
    }
          </p>
        </div>
      </div>
    </div>

    <button
      class="btn btn-secondary pet-profile-card__action"
      type="button"
      aria-disabled="true"
      title="Función disponible próximamente"
    >
      ✏️ Editar próximamente
    </button>
  `;
}

function renderSelectedPetSummary() {
  if (!selectedPetId) {
    selectedPetSummaryElement.innerHTML = `
      <div class="empty-state">
        <p class="empty-state__title">Sin mascota seleccionada</p>
        <p class="empty-state__text">
          Seleccioná una mascota para ver el resumen de cuidados.
        </p>
      </div>
    `;
    return;
  }

  const petTasks = getTasksByPetId(selectedPetId);
  const pendingCount = petTasks.filter((task) => task.status !== "done").length;
  const todayCount = getTodayTasksFromList(petTasks).length;
  const upcomingCount = getTasksByVisualStatus(petTasks, "upcoming").length;
  const doneCount = getDoneTasksFromList(petTasks).length;

  const summaryItems = [
    {
      icon: "📌",
      value: pendingCount,
      label: "Pendientes",
      text: "Sin completar"
    },
    {
      icon: "⏰",
      value: todayCount,
      label: "Hoy",
      text: "Para hoy"
    },
    {
      icon: "📅",
      value: upcomingCount,
      label: "Próximas",
      text: "En próximos días"
    },
    {
      icon: "✅",
      value: doneCount,
      label: "Realizadas",
      text: "Buen trabajo"
    }
  ];

  selectedPetSummaryElement.innerHTML = "";

  summaryItems.forEach((item) => {
    const summaryCard = document.createElement("article");
    summaryCard.className = "pet-summary-card";

    summaryCard.innerHTML = `
      <span class="pet-summary-card__icon" aria-hidden="true">
        ${item.icon}
      </span>
      <span class="pet-summary-card__value">${item.value}</span>
      <span class="pet-summary-card__label">${item.label}</span>
      <span class="pet-summary-card__text">${item.text}</span>
    `;

    selectedPetSummaryElement.appendChild(summaryCard);
  });
}

function selectPet(petId) {
  selectedPetId = petId;

  renderPets();
  renderSelectedPet();
  renderSelectedPetSummary();
  renderSelectedPetTasks();
  setActivePetFeatureTab("Resumen");

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
    taskCard.className = "task-card pet-task-card";

    taskCard.innerHTML = `
  <span class="pet-task-card__icon" aria-hidden="true">
    ${getTaskEmoji(task.title)}
  </span>

  <div class="pet-task-card__body">
    <h3 class="task-card__title">${task.title}</h3>

    <p class="task-card__description">
      ${task.description || "Sin descripción adicional."}
    </p>

    <p class="task-card__meta pet-task-card__date">
      ${formatDateToDisplay(task.date)} · ${formatTimeToDisplay(task.time)}
    </p>
  </div>

  <span class="badge ${visualStatus.badgeClass}">
    ${visualStatus.label}
  </span>
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

function renderPetFeatureMessage(sectionName = "Resumen") {
  const pet = getSelectedPet();
  const petName = pet ? pet.name : "esta mascota";

  if (sectionName === "Resumen") {
    selectedPetSummaryElement.hidden = false;
    petFeatureMessageElement.hidden = true;
    renderSelectedPetSummary();
    return;
  }

  selectedPetSummaryElement.hidden = true;
  petFeatureMessageElement.hidden = false;

  petFeatureMessageElement.innerHTML = `
    <span class="coming-soon-card__icon" aria-hidden="true">🚧</span>
    <div>
      <h3 class="coming-soon-card__title">${sectionName} próximamente</h3>
      <p class="coming-soon-card__text">
        Esta sección está pensada para una próxima versión. Por ahora, el MVP
        permite ver el resumen, próximos cuidados y agregar nuevas mascotas.
      </p>
    </div>
  `;
}

function setActivePetFeatureTab(sectionName = "Resumen") {
  const tabButtons = petFeatureTabsElement.querySelectorAll("[data-pet-section]");

  tabButtons.forEach((button) => {
    const isActive = button.dataset.petSection === sectionName;
    button.classList.toggle("is-active", isActive);
  });

  renderPetFeatureMessage(sectionName);
}

function handlePetFeatureTabsClick(event) {
  const tabButton = event.target.closest("[data-pet-section]");

  if (!tabButton) {
    return;
  }

  const sectionName = tabButton.dataset.petSection;

  setActivePetFeatureTab(sectionName);
}

function setupEventListeners() {
  petsListElement.addEventListener("click", handlePetsListClick);
  petFeatureTabsElement.addEventListener("click", handlePetFeatureTabsClick);
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
  renderSelectedPetSummary();
  renderSelectedPetTasks();
  setActivePetFeatureTab("Resumen");

  setupEventListeners();

  console.info("Mascotas page inicializada correctamente.");
}

initMascotasPage();