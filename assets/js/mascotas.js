/* =====================================================
   PetCare Planner - mascotas.js
   Logica de la pagina Mascotas
===================================================== */

const petsListElement = document.getElementById("pets-list");
const selectedPetDetailElement = document.getElementById("selected-pet-detail");
const selectedPetTasksElement = document.getElementById("selected-pet-tasks");
const selectedPetSummaryElement = document.getElementById("selected-pet-summary");
const petFeatureTabsElement = document.getElementById("pet-feature-tabs");
const petFeatureMessageElement = document.getElementById("pet-feature-message");
const desktopPetSummaryElement = document.getElementById("desktop-pet-summary");
const desktopSummaryTitleElement = document.getElementById("desktop-summary-title");
const quickInfoListElement = document.getElementById("quick-info-list");
const petFormSectionElement = document.getElementById("pet-form-section");

const petFormElement = document.getElementById("pet-form");
const petNameInput = document.getElementById("pet-name");
const petSpeciesSelect = document.getElementById("pet-species");
const petAgeInput = document.getElementById("pet-age");
const petBreedInput = document.getElementById("pet-breed");
const petBirthDateInput = document.getElementById("pet-birth-date");
const petSexSelect = document.getElementById("pet-sex");
const petWeightInput = document.getElementById("pet-weight");
const petSizeSelect = document.getElementById("pet-size");
const petVetNameInput = document.getElementById("pet-vet-name");
const petClinicInput = document.getElementById("pet-clinic");
const petAllergiesInput = document.getElementById("pet-allergies");
const petNotesInput = document.getElementById("pet-notes");
const petImageInput = document.getElementById("pet-image");
const petMessageElement = document.getElementById("pet-message");

let selectedPetId = null;

const MAX_PET_IMAGE_SIZE = 1024 * 1024;

const PET_COLORS = {
  Perro: "dog",
  Gato: "cat",
  Conejo: "rabbit",
  Otro: "other"
};

const PET_IMAGE_BY_ID = {
  "pet-kira": "assets/img/pets/dog-avatar.png",
  "pet-mishi": "assets/img/pets/cat-avatar.png",
  "pet-luna": "assets/img/pets/rabbit-avatar.png"
};

const TASK_ICON_ASSETS = {
  vaccine: "assets/img/icons/icon-vaccine.png",
  food: "assets/img/icons/icon-food.png",
  bath: "assets/img/icons/icon-bath.png",
  vet: "assets/img/icons/icon-vet.png",
  medicine: "assets/img/icons/icon-medicine.png",
  calendar: "assets/img/icons/icon-calendar.png"
};

const EMPTY_STATE_ASSETS = {
  pets: "assets/img/states/empty-pets.png",
  tasks: "assets/img/states/empty-tasks.png"
};

const PET_DEFAULTS = {
  "pet-kira": {
    sex: "Hembra",
    birthDate: "12/04/2021",
    weight: "28 kg",
    size: "Grande",
    vet: "Vet. Maria Lopez",
    clinic: "Patitas Felices",
    allergies: "Sin alergias registradas",
    notes: "Le gusta pasear por la tarde."
  },
  "pet-mishi": {
    sex: "Macho",
    birthDate: "03/08/2022",
    weight: "5 kg",
    size: "Mediano",
    vet: "Vet. Maria Lopez",
    clinic: "Patitas Felices",
    allergies: "Evitar pollo",
    notes: "Prefiere alimento humedo."
  },
  "pet-luna": {
    sex: "Hembra",
    birthDate: "20/01/2023",
    weight: "2 kg",
    size: "Pequena",
    vet: "Vet. Maria Lopez",
    clinic: "Patitas Felices",
    allergies: "Sin alergias registradas",
    notes: "Revisar dientes con frecuencia."
  }
};

function validateRequiredElements() {
  const requiredElements = [
    petsListElement,
    selectedPetDetailElement,
    selectedPetTasksElement,
    selectedPetSummaryElement,
    petFeatureTabsElement,
    petFeatureMessageElement,
    petFormSectionElement,
    petFormElement,
    petNameInput,
    petSpeciesSelect,
    petAgeInput,
    petBreedInput,
    petBirthDateInput,
    petSexSelect,
    petWeightInput,
    petSizeSelect,
    petVetNameInput,
    petClinicInput,
    petAllergiesInput,
    petNotesInput,
    petImageInput,
    petMessageElement
  ];

  const hasMissingElement = requiredElements.some((element) => !element);

  if (hasMissingElement) {
    console.error("Faltan elementos necesarios en mascotas.html.");
    return false;
  }

  return true;
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeDisplayText(value) {
  const text = String(value || "");

  if (!/[ÃÂ]/.test(text)) {
    return text;
  }

  try {
    return decodeURIComponent(escape(text));
  } catch (error) {
    return text;
  }
}

function displayText(value, fallback = "") {
  return normalizeDisplayText(cleanText(value) || fallback);
}

function displayOptionalText(value, fallback) {
  const text = displayText(value).trim();
  const normalizedText = text.toLowerCase();

  if (!text || normalizedText === "undefined" || normalizedText === "null") {
    return fallback;
  }

  return text;
}

function normalizePetAge(value, fallback = "Sin edad") {
  const text = displayText(value).trim().toLowerCase();

  if (!text) {
    return fallback;
  }

  const numberMatch = text.match(/\d+/);

  if (numberMatch) {
    const ageNumber = Number(numberMatch[0]);

    if (Number.isFinite(ageNumber) && ageNumber > 0) {
      return `${ageNumber} ${ageNumber === 1 ? "año" : "años"}`;
    }
  }

  return text
    .replace(/\s+/g, " ")
    .replace(/anos/g, "años")
    .replace(/años\s+años/g, "años")
    .trim();
}

function formatPetDate(value) {
  const text = displayOptionalText(value, "Sin fecha");

  if (text === "Sin fecha") {
    return text;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return formatDateToDisplay(text);
  }

  return text;
}

function renderLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

function renderLucideIcon(iconName) {
  return `<i data-lucide="${iconName}" aria-hidden="true"></i>`;
}

function resolveAssetPath(assetPath) {
  if (!assetPath) {
    return "";
  }

  if (/^(data:|blob:|https?:\/\/)/.test(assetPath)) {
    return assetPath;
  }

  const isInsidePagesFolder = window.location.pathname.includes("/pages/");
  return isInsidePagesFolder ? `../${assetPath}` : `./${assetPath}`;
}

function renderOptionalImage(assetPath, className, altText = "", isLazy = true) {
  const resolvedPath = resolveAssetPath(assetPath);

  if (!resolvedPath) {
    return "";
  }

  const lazyAttribute = isLazy ? ' loading="lazy"' : "";

  return `
    <img
      class="${className}"
      src="${escapeHTML(resolvedPath)}"
      alt="${escapeHTML(altText)}"
      ${lazyAttribute}
      onload="this.closest('.pet-avatar')?.classList.add('has-image')"
      onerror="this.hidden = true; this.closest('.pet-avatar')?.classList.remove('has-image')"
    />
  `;
}

function getPetKind(pet) {
  return PET_COLORS[pet.species] || PET_COLORS.Otro;
}

function getPetImage(pet) {
  return cleanText(pet.image) || PET_IMAGE_BY_ID[pet.id] || "";
}

function getPetDetails(pet) {
  const savedDetails = PET_DEFAULTS[pet.id] || {};

  return {
    sex: displayOptionalText(pet.sex || savedDetails.sex, "Sin dato"),
    birthDate: formatPetDate(pet.birthDate || savedDetails.birthDate),
    weight: displayOptionalText(pet.weight || savedDetails.weight, "Sin dato"),
    size: displayOptionalText(pet.size || savedDetails.size, "Sin dato"),
    vet: displayOptionalText(pet.vetName || savedDetails.vet, "A completar"),
    clinic: displayOptionalText(pet.clinic || savedDetails.clinic, "A completar"),
    allergies: displayOptionalText(
      pet.allergies || savedDetails.allergies,
      "Sin alergias registradas"
    ),
    notes: displayOptionalText(pet.notes || savedDetails.notes, "Sin notas cargadas")
  };
}

function getTaskIcon(title) {
  const normalizedTitle = displayText(title).toLowerCase();

  if (normalizedTitle.includes("vacuna")) return "💉";
  if (normalizedTitle.includes("aliment")) return "🥣";
  if (normalizedTitle.includes("bano") || normalizedTitle.includes("baño")) return "🚿";
  if (normalizedTitle.includes("cepill")) return "🦷";
  if (normalizedTitle.includes("control") || normalizedTitle.includes("veterin")) return "✚";
  if (normalizedTitle.includes("medic") || normalizedTitle.includes("pastilla")) return "💊";

  return "▣";
}

function getTaskIconKey(title) {
  const normalizedTitle = displayText(title).toLowerCase();

  if (normalizedTitle.includes("vacuna")) return "vaccine";
  if (normalizedTitle.includes("aliment")) return "food";
  if (normalizedTitle.includes("bano") || normalizedTitle.includes("baÃ±o")) return "bath";
  if (normalizedTitle.includes("control") || normalizedTitle.includes("veterin")) return "vet";
  if (normalizedTitle.includes("medic") || normalizedTitle.includes("pastilla")) return "medicine";

  return "";
}

function renderTaskIcon(title) {
  const iconKey = getTaskIconKey(title);
  const iconAsset = iconKey ? TASK_ICON_ASSETS[iconKey] : "";

  return `
    <span class="pet-task-card__icon" aria-hidden="true">
      ${renderOptionalImage(iconAsset, "pet-task-card__image", "", true)}
      <span class="pet-task-card__fallback">${getTaskIcon(title)}</span>
    </span>
  `;
}

function renderEmptyState(title, text, imageType = "") {
  const imageAsset = EMPTY_STATE_ASSETS[imageType] || "";

  return `
    <div class="empty-state">
      ${renderOptionalImage(imageAsset, "empty-state__image", "", true)}
      <p class="empty-state__title">${escapeHTML(title)}</p>
      <p class="empty-state__text">${escapeHTML(text)}</p>
    </div>
  `;
}

function getSelectedPet() {
  return selectedPetId ? getPetById(selectedPetId) : null;
}

function loadInitialData() {
  seedInitialData();

  const pets = getPets();

  if (pets.length > 0 && !selectedPetId) {
    selectedPetId = pets[0].id;
  }
}

function renderPetAvatar(pet, sizeClass = "") {
  const petKind = getPetKind(pet);
  const petImage = getPetImage(pet);
  const hiddenAttribute = petImage ? "" : ' aria-hidden="true"';

  return `
    <span class="pet-avatar pet-avatar--${petKind} ${sizeClass}"${hiddenAttribute}>
      ${renderOptionalImage(petImage, "pet-avatar__image", `Foto de ${displayText(pet.name, "mascota")}`, true)}
      <span class="pet-face pet-face--${petKind}" aria-hidden="true"></span>
    </span>
  `;
}

function renderPets() {
  const pets = getPets();
  petsListElement.innerHTML = "";

  if (pets.length === 0) {
    petsListElement.innerHTML = `
      ${renderEmptyState(
        "Todavia no agregaste mascotas",
        "Agrega tu primera mascota para empezar a organizar sus cuidados.",
        "pets"
      )}
      <button class="pet-add-card" type="button" data-open-pet-form>
        <span class="pet-add-card__icon" aria-hidden="true">${renderLucideIcon("plus")}</span>
        <span class="pet-add-card__text">Agregar mascota</span>
      </button>
    `;
    return;
  }

  pets.forEach((pet) => {
    const isSelected = pet.id === selectedPetId;
    const petButton = document.createElement("button");

    petButton.type = "button";
    petButton.className = `pet-selector-card pet-selector-card--${getPetKind(pet)}`;
    petButton.dataset.petId = pet.id;
    petButton.setAttribute("aria-pressed", isSelected ? "true" : "false");
    petButton.setAttribute("aria-label", `Seleccionar mascota ${pet.name}`);

    if (isSelected) {
      petButton.classList.add("is-selected");
    }

    petButton.innerHTML = `
      ${renderPetAvatar(pet)}
      <span class="pet-info">
        <span class="pet-name">${escapeHTML(displayText(pet.name))}</span>
        <span class="pet-breed">${escapeHTML(displayText(pet.breed || pet.species, "Mascota"))}</span>
        <span class="pet-species-chip">${escapeHTML(normalizePetAge(pet.age))}</span>
      </span>
      <span class="pet-selector-dot" aria-hidden="true"></span>
    `;

    petsListElement.appendChild(petButton);
  });

  const addPetButton = document.createElement("button");
  addPetButton.className = "pet-add-card";
  addPetButton.type = "button";
  addPetButton.dataset.openPetForm = "";
  addPetButton.innerHTML = `
    <span class="pet-add-card__icon" aria-hidden="true">${renderLucideIcon("plus")}</span>
    <span class="pet-add-card__text">Agregar mascota</span>
  `;
  petsListElement.appendChild(addPetButton);
}

function renderSelectedPet() {
  const pet = getSelectedPet();

  if (!pet) {
    selectedPetDetailElement.className = "card";
    selectedPetDetailElement.innerHTML = `
      <p class="card-text">
        Selecciona una mascota para ver su informacion y proximos cuidados.
      </p>
    `;
    return;
  }

  const details = getPetDetails(pet);
  selectedPetDetailElement.className = "card pet-profile-card";
  selectedPetDetailElement.innerHTML = `
    <div class="pet-profile-card__main">
      <div class="pet-profile-card__avatar-wrap">
        ${renderPetAvatar(pet, "pet-avatar--xl")}
        <span class="pet-camera" aria-hidden="true">${renderLucideIcon("camera")}</span>
      </div>

      <div class="pet-profile-card__body">
        <div class="pet-profile-card__title">
          <h2>${escapeHTML(displayText(pet.name))}</h2>
          <span class="badge badge-primary">${escapeHTML(normalizePetAge(pet.age))}</span>
        </div>
        <p class="pet-profile-card__breed">${escapeHTML(displayText(pet.breed || pet.species, "Mascota"))}</p>
        <p class="pet-profile-card__meta">
          <span>${renderLucideIcon("venus-and-mars")} ${escapeHTML(details.sex)}</span>
          <span>${renderLucideIcon("calendar")} ${escapeHTML(details.birthDate)}</span>
        </p>
      </div>
    </div>

    <button
      class="btn btn-secondary pet-profile-card__action"
      type="button"
      aria-disabled="true"
      title="Funcion disponible proximamente"
    >
      ${renderLucideIcon("pencil")} Editar
    </button>
  `;
}

function getPetTaskSummary() {
  const petTasks = selectedPetId ? getTasksByPetId(selectedPetId) : [];

  return [
    {
      className: "danger",
      icon: "circle-alert",
      value: petTasks.filter((task) => getTaskVisualStatus(task).key === "overdue").length,
      label: "Pendientes",
      text: "Requieren atencion"
    },
    {
      className: "warning",
      icon: "sun",
      value: getTodayTasksFromList(petTasks).length,
      label: "Hoy",
      text: "Para hoy"
    },
    {
      className: "success",
      icon: "calendar-days",
      value: getTasksByVisualStatus(petTasks, "upcoming").length,
      label: "Proximas",
      text: "En los proximos dias"
    },
    {
      className: "primary",
      icon: "circle-check",
      value: getDoneTasksFromList(petTasks).length,
      label: "Realizadas",
      text: "Buen trabajo"
    }
  ];
}

function renderSelectedPetSummary() {
  if (!selectedPetId) {
    selectedPetSummaryElement.innerHTML = `
      ${renderEmptyState(
        "Sin mascota seleccionada",
        "Selecciona una mascota para ver el resumen de cuidados.",
        "pets"
      )}
    `;
    return;
  }

  selectedPetSummaryElement.innerHTML = "";

  getPetTaskSummary().forEach((item) => {
    const summaryCard = document.createElement("article");
    summaryCard.className = `pet-summary-card pet-summary-card--${item.className}`;
    summaryCard.innerHTML = `
      <span class="pet-summary-card__icon" aria-hidden="true">${renderLucideIcon(item.icon)}</span>
      <strong class="pet-summary-card__value">${item.value}</strong>
      <span class="pet-summary-card__label">${item.label}</span>
      <span class="pet-summary-card__text">${item.text}</span>
    `;
    selectedPetSummaryElement.appendChild(summaryCard);
  });
}

function renderDesktopPetSummary() {
  if (!desktopPetSummaryElement || !desktopSummaryTitleElement || !selectedPetId) {
    return;
  }

  const pet = getSelectedPet();
  desktopSummaryTitleElement.textContent = `Resumen de ${pet ? displayText(pet.name) : "mascota"}`;
  desktopPetSummaryElement.innerHTML = "";

  getPetTaskSummary().forEach((item) => {
    const row = document.createElement("div");
    row.className = `desktop-summary-row desktop-summary-row--${item.className}`;
    row.innerHTML = `
      <span class="desktop-summary-row__icon" aria-hidden="true">${renderLucideIcon(item.icon)}</span>
      <span class="desktop-summary-row__label">${escapeHTML(displayText(item.label))}</span>
      <strong class="desktop-summary-row__value">${item.value}</strong>
    `;
    desktopPetSummaryElement.appendChild(row);
  });
}

function renderQuickInfo() {
  if (!quickInfoListElement) {
    return;
  }

  const pet = getSelectedPet();

  if (!pet) {
    quickInfoListElement.innerHTML = "<li>Selecciona una mascota.</li>";
    return;
  }

  const details = getPetDetails(pet);
  const infoItems = [
    { icon: "venus-and-mars", label: "Sexo", value: details.sex },
    { icon: "calendar", label: "Fecha", value: details.birthDate },
    { icon: "weight", label: "Peso", value: details.weight },
    { icon: "ruler", label: "Tamano", value: details.size },
    { icon: "stethoscope", label: "Veterinario", value: details.vet },
    { icon: "hospital", label: "Clinica", value: details.clinic },
    { icon: "triangle-alert", label: "Alergias", value: details.allergies },
    { icon: "clipboard-list", label: "Notas", value: details.notes }
  ];

  quickInfoListElement.innerHTML = "";

  infoItems.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span aria-hidden="true">${renderLucideIcon(item.icon)}</span>
      <div>
        <strong>${escapeHTML(item.label)}</strong>
        <p>${escapeHTML(displayText(item.value))}</p>
      </div>
    `;
    quickInfoListElement.appendChild(listItem);
  });
}

function renderSelectedPetTasks() {
  if (!selectedPetId) {
    selectedPetTasksElement.innerHTML = `
      ${renderEmptyState(
        "Sin mascota seleccionada",
        "Selecciona una mascota para ver sus proximos cuidados.",
        "tasks"
      )}
    `;
    return;
  }

  const pendingTasks = getTasksByPetId(selectedPetId).filter((task) => task.status !== "done");
  const visibleTasks = sortTasksByDate(pendingTasks).slice(0, 4);

  selectedPetTasksElement.innerHTML = "";

  if (visibleTasks.length === 0) {
    selectedPetTasksElement.innerHTML = `
      ${renderEmptyState(
        "Sin cuidados pendientes",
        "Esta mascota no tiene cuidados pendientes por ahora.",
        "tasks"
      )}
    `;
    return;
  }

  visibleTasks.forEach((task) => {
    const visualStatus = getTaskVisualStatus(task);
    const taskCard = document.createElement("article");
    taskCard.className = `pet-task-card pet-task-card--${visualStatus.key}`;
    taskCard.innerHTML = `
      ${renderTaskIcon(task.title)}
      <div class="pet-task-card__body">
        <h3>${escapeHTML(displayText(task.title))}</h3>
        <p>${escapeHTML(displayText(task.description, "Sin descripcion adicional."))}</p>
      </div>
      <time class="pet-task-card__date" datetime="${escapeHTML(task.date || "")}">
        ${escapeHTML(formatDateToDisplay(task.date))}<br />
        ${escapeHTML(formatTimeToDisplay(task.time))}
      </time>
      <span class="badge ${visualStatus.badgeClass}">${escapeHTML(displayText(visualStatus.label))}</span>
      <span class="pet-task-card__chevron" aria-hidden="true">${renderLucideIcon("chevron-right")}</span>
    `;
    selectedPetTasksElement.appendChild(taskCard);
  });
}

function renderPetFeatureMessage(sectionName = "Resumen") {
  const pet = getSelectedPet();
  const details = pet ? getPetDetails(pet) : null;

  if (sectionName === "Resumen") {
    selectedPetSummaryElement.hidden = false;
    petFeatureMessageElement.hidden = true;
    renderSelectedPetSummary();
    return;
  }

  selectedPetSummaryElement.hidden = true;
  petFeatureMessageElement.hidden = false;

  if (sectionName === "Informacion" && pet && details) {
    const infoItems = [
      { icon: "paw-print", label: "Especie", value: displayOptionalText(pet.species, "Sin especie") },
      { icon: "badge-info", label: "Raza", value: displayOptionalText(pet.breed, "Sin raza") },
      { icon: "venus-and-mars", label: "Sexo", value: details.sex },
      { icon: "calendar", label: "Fecha", value: details.birthDate },
      { icon: "weight", label: "Peso", value: details.weight },
      { icon: "ruler", label: "Tamano", value: details.size },
      { icon: "stethoscope", label: "Veterinario", value: details.vet },
      { icon: "hospital", label: "Clinica", value: details.clinic },
      { icon: "triangle-alert", label: "Alergias", value: details.allergies },
      { icon: "clipboard-list", label: "Notas", value: details.notes }
    ];

    petFeatureMessageElement.innerHTML = `
      <div class="info-tab-grid">
        ${infoItems
          .map(
            (item) => `
              <article>
                <span class="info-tab-grid__icon" aria-hidden="true">${renderLucideIcon(item.icon)}</span>
                <strong>${escapeHTML(item.label)}</strong>
                <span>${escapeHTML(item.value)}</span>
              </article>
            `
          )
          .join("")}
      </div>
    `;
    return;
  }

  petFeatureMessageElement.innerHTML = `
    <span class="coming-soon-card__icon" aria-hidden="true">${renderLucideIcon("calendar-clock")}</span>
    <div>
      <h3 class="coming-soon-card__title">${escapeHTML(sectionName)} proximamente</h3>
      <p class="coming-soon-card__text">
        Esta seccion queda preparada para una proxima version del MVP.
      </p>
    </div>
  `;
}

function setActivePetFeatureTab(sectionName = "Resumen") {
  const tabButtons = petFeatureTabsElement.querySelectorAll("[data-pet-section]");

  tabButtons.forEach((button) => {
    const isActive = button.dataset.petSection === sectionName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  renderPetFeatureMessage(sectionName);
  renderLucideIcons();
}

function selectPet(petId) {
  selectedPetId = petId;

  renderPets();
  renderSelectedPet();
  renderSelectedPetSummary();
  renderDesktopPetSummary();
  renderQuickInfo();
  renderSelectedPetTasks();
  setActivePetFeatureTab("Resumen");

  petMessageElement.textContent = "";
  renderLucideIcons();
}

function openPetForm() {
  petFormSectionElement.hidden = false;
  petNameInput.focus();
}

function closePetForm() {
  petFormSectionElement.hidden = true;
}

function showPetMessage(message, type = "success") {
  petMessageElement.textContent = message;
  petMessageElement.className = type === "error" ? "form-error" : "form-success";
}

function readPetImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("Selecciona un archivo de imagen valido."));
      return;
    }

    if (file.size > MAX_PET_IMAGE_SIZE) {
      reject(new Error("La foto es demasiado pesada. Usa una imagen de hasta 1 MB."));
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => {
      reject(new Error("No se pudo leer la foto. Intenta con otra imagen."));
    });
    reader.readAsDataURL(file);
  });
}

async function handlePetSubmit(event) {
  event.preventDefault();

  const petData = {
    name: petNameInput.value,
    species: petSpeciesSelect.value,
    age: normalizePetAge(petAgeInput.value, ""),
    breed: petBreedInput.value,
    image: ""
  };

  const extraPetData = {
    birthDate: cleanText(petBirthDateInput.value),
    sex: cleanText(petSexSelect.value),
    weight: cleanText(petWeightInput.value),
    size: cleanText(petSizeSelect.value),
    vetName: cleanText(petVetNameInput.value),
    clinic: cleanText(petClinicInput.value),
    allergies: cleanText(petAllergiesInput.value),
    notes: cleanText(petNotesInput.value)
  };

  if (!cleanText(petData.name)) {
    showPetMessage("Completa el nombre de la mascota.", "error");
    petNameInput.focus();
    return;
  }

  if (!cleanText(petData.species)) {
    showPetMessage("Selecciona la especie de la mascota.", "error");
    petSpeciesSelect.focus();
    return;
  }

  try {
    petData.image = await readPetImageFile(petImageInput.files[0]);
  } catch (error) {
    showPetMessage(error.message, "error");
    petImageInput.focus();
    return;
  }

  const newPet = addPet(petData);

  if (!newPet) {
    showPetMessage("No se pudo guardar la mascota. Revisa los datos.", "error");
    return;
  }

  const updatedPet = updatePet(newPet.id, extraPetData) || newPet;

  petFormElement.reset();
  selectPet(updatedPet.id);
  showPetMessage(`Mascota "${displayText(updatedPet.name)}" agregada correctamente.`);
}

function handlePetsListClick(event) {
  const petButton = event.target.closest("[data-pet-id]");
  const openFormButton = event.target.closest("[data-open-pet-form]");

  if (openFormButton) {
    openPetForm();
    return;
  }

  if (petButton) {
    selectPet(petButton.dataset.petId);
  }
}

function handlePageClick(event) {
  if (event.target.closest("[data-open-pet-form]")) {
    openPetForm();
  }

  if (event.target.closest("[data-close-pet-form]")) {
    closePetForm();
  }
}

function handlePetFeatureTabsClick(event) {
  const tabButton = event.target.closest("[data-pet-section]");

  if (!tabButton) {
    return;
  }

  setActivePetFeatureTab(tabButton.dataset.petSection);
}

function setupEventListeners() {
  petsListElement.addEventListener("click", handlePetsListClick);
  petFeatureTabsElement.addEventListener("click", handlePetFeatureTabsClick);
  petFormElement.addEventListener("submit", handlePetSubmit);
  document.addEventListener("click", handlePageClick);
}

function initMascotasPage() {
  if (!validateRequiredElements()) {
    return;
  }

  loadInitialData();
  renderPets();
  renderSelectedPet();
  renderSelectedPetSummary();
  renderDesktopPetSummary();
  renderQuickInfo();
  renderSelectedPetTasks();
  setActivePetFeatureTab("Resumen");
  setupEventListeners();
  renderLucideIcons();
}

initMascotasPage();
