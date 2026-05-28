/* =====================================================
   PetCare Planner - mascotas.js
   Logica de la pagina Mascotas
===================================================== */

const petsListElement = document.getElementById("pets-list");
const selectedPetDetailElement = document.getElementById("selected-pet-detail");
const selectedPetSummaryElement = document.getElementById("selected-pet-summary");
const petFeatureTabsElement = document.getElementById("pet-feature-tabs");
const petFeatureMessageElement = document.getElementById("pet-feature-message");
const desktopPetSummaryElement = document.getElementById("desktop-pet-summary");
const desktopSummaryTitleElement = document.getElementById("desktop-summary-title");
const quickInfoListElement = document.getElementById("quick-info-list");
const petFormSectionElement = document.getElementById("pet-form-section");
const petTipTextElement = document.getElementById("pet-tip-text");

const petFormElement = document.getElementById("pet-form");
const petFormTitleElement = document.getElementById("pet-form-title");
const petFormSubmitElement = document.getElementById("pet-form-submit");
const petNameInput = document.getElementById("pet-name");
const petSpeciesSelect = document.getElementById("pet-species");
const petKnowsBirthDateSelect = document.getElementById("pet-knows-birth-date");
const petBirthDateGroup = document.getElementById("pet-birth-date-group");
const petAgeGroup = document.getElementById("pet-age-group");
const petAgeUnitGroup = document.getElementById("pet-age-unit-group");
const petAgeInput = document.getElementById("pet-age");
const petAgeUnitSelect = document.getElementById("pet-age-unit");
const petBreedInput = document.getElementById("pet-breed");
const petBirthDateInput = document.getElementById("pet-birth-date");
const petSexSelect = document.getElementById("pet-sex");
const petWeightInput = document.getElementById("pet-weight");
const petWeightUnitSelect = document.getElementById("pet-weight-unit");
const petSizeSelect = document.getElementById("pet-size");
const petVetNameInput = document.getElementById("pet-vet-name");
const petClinicInput = document.getElementById("pet-clinic");
const petAllergiesInput = document.getElementById("pet-allergies");
const petNotesInput = document.getElementById("pet-notes");
const petImageInput = document.getElementById("pet-image");
const petMessageElement = document.getElementById("pet-message");

let selectedPetId = null;
let editingPetId = null;

const MAX_PET_IMAGE_SIZE = 1024 * 1024;

const AGE_UNIT_LABELS = {
  days: ["día", "días"],
  months: ["mes", "meses"],
  years: ["año", "años"]
};

const VALID_AGE_UNITS = ["days", "months", "years"];
const VALID_WEIGHT_UNITS = ["kg", "g"];

const PET_TIPS = [
  "Asegurate de que tu mascota tenga agua fresca disponible todos los días.",
  "Revisá su comedero y bebedero al menos una vez al día.",
  "Anotá vacunas y controles para no olvidarte de las fechas importantes.",
  "Una rutina clara ayuda a reducir estrés en perros y gatos.",
  "Cepillar el pelaje ayuda a detectar nudos, pulgas o irritaciones.",
  "Si notás cambios de apetito o conducta, consultá con tu veterinario.",
  "Mantené actualizada la información de peso, alergias y veterinario.",
  "Los controles preventivos ayudan a detectar problemas a tiempo."
];

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
    vet: "Vet. María López",
    clinic: "Patitas Felices",
    allergies: "Sin alergias registradas",
    notes: "Le gusta pasear por la tarde."
  },
  "pet-mishi": {
    sex: "Macho",
    birthDate: "03/08/2022",
    weight: "5 kg",
    size: "Mediano",
    vet: "Vet. María López",
    clinic: "Patitas Felices",
    allergies: "Evitar pollo",
    notes: "Prefiere alimento húmedo."
  },
  "pet-luna": {
    sex: "Hembra",
    birthDate: "20/01/2023",
    weight: "2 kg",
    size: "Pequeña",
    vet: "Vet. María López",
    clinic: "Patitas Felices",
    allergies: "Sin alergias registradas",
    notes: "Revisar dientes con frecuencia."
  }
};

function validateRequiredElements() {
  const requiredElements = [
    petsListElement,
    selectedPetDetailElement,
    selectedPetSummaryElement,
    petFeatureTabsElement,
    petFeatureMessageElement,
    petFormSectionElement,
    petFormElement,
    petFormTitleElement,
    petFormSubmitElement,
    petNameInput,
    petSpeciesSelect,
    petKnowsBirthDateSelect,
    petBirthDateGroup,
    petAgeGroup,
    petAgeUnitGroup,
    petAgeInput,
    petAgeUnitSelect,
    petBreedInput,
    petBirthDateInput,
    petSexSelect,
    petWeightInput,
    petWeightUnitSelect,
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

function normalizeSizeForInput(value) {
  const size = displayText(value).trim();
  const normalizedSize = size.toLowerCase();

  if (normalizedSize === "pequena" || normalizedSize === "pequeña") {
    return "Pequeno";
  }

  return size;
}

function parsePetAgeInput(value) {
  const normalizedAge = normalizePetAge(value, "");
  const ageParts = normalizedAge.match(/^(\d+)\s+(días|día|meses|mes|años|año)$/);

  if (!ageParts) {
    return {
      value: "",
      unit: "years"
    };
  }

  const unitText = ageParts[2];
  let unit = "years";

  if (unitText === "día" || unitText === "días") {
    unit = "days";
  } else if (unitText === "mes" || unitText === "meses") {
    unit = "months";
  }

  return {
    value: ageParts[1],
    unit
  };
}

function formatManualPetAge(value, unit) {
  const cleanValue = cleanText(value).replace(",", ".");
  const ageNumber = Number(cleanValue);
  const labels = AGE_UNIT_LABELS[unit];

  if (!labels || !Number.isFinite(ageNumber) || ageNumber <= 0) {
    return "";
  }

  const normalizedNumber = Math.floor(ageNumber);

  if (normalizedNumber !== ageNumber || normalizedNumber <= 0) {
    return "";
  }

  return `${normalizedNumber} ${normalizedNumber === 1 ? labels[0] : labels[1]}`;
}

function parsePetWeightInput(value) {
  const text = displayText(value).trim().toLowerCase();
  const weightParts = text.match(/^(\d+(?:[,.]\d+)?)\s*(kg|g)?$/);

  if (!weightParts) {
    return {
      value: "",
      unit: "kg"
    };
  }

  return {
    value: weightParts[1].replace(".", ","),
    unit: weightParts[2] || "kg"
  };
}

function normalizePetWeight(value, unit) {
  const text = cleanText(value);

  if (!text) {
    return {
      isValid: true,
      weight: ""
    };
  }

  if (/^-\s*\d/.test(text)) {
    return {
      isValid: false,
      message: "El peso no puede ser negativo ni cero.",
      focusElement: petWeightInput
    };
  }

  const weightParts = text.toLowerCase().match(/^(\d+(?:[,.]\d+)?)\s*(kg|g)?$/);

  if (!weightParts) {
    return {
      isValid: false,
      message: "Ingresá un peso válido.",
      focusElement: petWeightInput
    };
  }

  const normalizedUnit = weightParts[2] || (VALID_WEIGHT_UNITS.includes(unit) ? unit : "kg");
  const normalizedNumberText = weightParts[1].replace(",", ".");
  const weightNumber = Number(normalizedNumberText);

  if (!Number.isFinite(weightNumber)) {
    return {
      isValid: false,
      message: "Ingresá un peso válido.",
      focusElement: petWeightInput
    };
  }

  if (weightNumber <= 0) {
    return {
      isValid: false,
      message: "El peso no puede ser negativo ni cero.",
      focusElement: petWeightInput
    };
  }

  const displayNumber = normalizedNumberText.replace(".", ",");

  return {
    isValid: true,
    weight: `${displayNumber} ${normalizedUnit}`
  };
}

function setPetBirthDateMax() {
  petBirthDateInput.max = getTodayISO();
}

function setFormGroupVisibility(groupElement, shouldShow) {
  groupElement.hidden = !shouldShow;
  groupElement.style.display = shouldShow ? "" : "none";
}

function setPetAgeMode(mode, shouldClear = false) {
  const usesBirthDate = mode === "birthdate";
  const usesManualAge = mode === "manual";

  if (usesBirthDate) {
    setPetBirthDateMax();
  }

  petBirthDateInput.disabled = !usesBirthDate;
  petAgeInput.disabled = !usesManualAge;
  petAgeUnitSelect.disabled = !usesManualAge;
  setFormGroupVisibility(petBirthDateGroup, usesBirthDate);
  setFormGroupVisibility(petAgeGroup, usesManualAge);
  setFormGroupVisibility(petAgeUnitGroup, usesManualAge);

  if (shouldClear && usesBirthDate) {
    petAgeInput.value = "";
    petAgeUnitSelect.value = "years";
  }

  if (shouldClear && usesManualAge) {
    petBirthDateInput.value = "";
  }

  if (shouldClear && !usesBirthDate && !usesManualAge) {
    petBirthDateInput.value = "";
    petAgeInput.value = "";
    petAgeUnitSelect.value = "years";
  }
}

function renderLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

function renderLucideIcon(iconName) {
  return `<i data-lucide="${iconName}" aria-hidden="true"></i>`;
}

function pickRandomPetTip(currentTip = "") {
  const availableTips = PET_TIPS.filter((tip) => tip && tip !== currentTip);

  if (availableTips.length === 0) {
    return PET_TIPS[0] || "Cuidá sus rutinas y registrá sus cuidados importantes.";
  }

  return availableTips[Math.floor(Math.random() * availableTips.length)];
}

function updatePetTip() {
  if (!petTipTextElement) {
    return;
  }

  const nextTip = pickRandomPetTip(petTipTextElement.textContent.trim());
  petTipTextElement.textContent = nextTip;
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

function getPetDisplayAge(pet, fallback = "Sin edad") {
  const savedDetails = PET_DEFAULTS[pet.id] || {};
  const birthDate = formatDateForInput(pet.birthDate || savedDetails.birthDate);
  const calculatedAge = calculateAgeFromBirthDate(birthDate);

  return calculatedAge || normalizePetAge(pet.age, fallback);
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
        "Todavía no agregaste mascotas",
        "Agregá tu primera mascota para empezar a organizar sus cuidados.",
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
        <span class="pet-species-chip">${escapeHTML(getPetDisplayAge(pet))}</span>
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
        Seleccioná una mascota para ver su información y próximos cuidados.
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
          <span class="badge badge-primary">${escapeHTML(getPetDisplayAge(pet))}</span>
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
      data-edit-selected-pet
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
      text: "Requieren atención"
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
      label: "Próximas",
      text: "En los próximos días"
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

function getTaskSummaryVisualStatus(task) {
  if (task.status !== "done" && getTaskTimestamp(task) < Date.now()) {
    return {
      key: "overdue",
      label: "Vencida",
      badgeClass: "badge-danger"
    };
  }

  return getTaskVisualStatus(task);
}

function getPendingTasksForSelectedPet() {
  if (!selectedPetId) {
    return [];
  }

  return getTasksByPetId(selectedPetId).filter((task) => task.status !== "done");
}

function getPriorityTaskForSelectedPet() {
  const pendingTasks = getPendingTasksForSelectedPet();
  const now = Date.now();
  const overdueTasks = pendingTasks.filter((task) => getTaskTimestamp(task) < now);

  if (overdueTasks.length > 0) {
    return sortTasksByDateTime(overdueTasks)[0];
  }

  return sortTasksByDateTime(pendingTasks)[0] || null;
}

function renderSummaryTaskRow(task) {
  const visualStatus = getTaskSummaryVisualStatus(task);

  return `
    <article class="summary-task-row summary-task-row--${visualStatus.key}">
      ${renderTaskIcon(task.title)}
      <div class="summary-task-row__body">
        <h4>${escapeHTML(displayText(task.title, "Cuidado pendiente"))}</h4>
        <p>${escapeHTML(displayText(task.description, "Sin descripción adicional."))}</p>
      </div>
      <time class="summary-task-row__date" datetime="${escapeHTML(task.date || "")}">
        ${escapeHTML(formatDateToDisplay(task.date))}<br />
        ${escapeHTML(formatTimeToDisplay(task.time))}
      </time>
      <span class="badge ${visualStatus.badgeClass}">${escapeHTML(displayText(visualStatus.label))}</span>
      <span class="summary-task-row__chevron" aria-hidden="true">${renderLucideIcon("chevron-right")}</span>
    </article>
  `;
}

function renderSelectedPetSummary() {
  if (!selectedPetId) {
    selectedPetSummaryElement.innerHTML = `
      ${renderEmptyState(
        "Sin mascota seleccionada",
        "Seleccioná una mascota para ver el resumen de cuidados.",
        "pets"
      )}
    `;
    return;
  }

  const pet = getSelectedPet();
  const priorityTask = getPriorityTaskForSelectedPet();

  if (!pet || !priorityTask) {
    selectedPetSummaryElement.innerHTML = `
      <div class="pet-summary-dashboard pet-summary-dashboard--empty">
        ${renderEmptyState(
          "Sin cuidados pendientes",
          "Esta mascota no tiene tareas pendientes por ahora.",
          "tasks"
        )}
      </div>
    `;
    return;
  }

  const priorityStatus = getTaskSummaryVisualStatus(priorityTask);
  const priorityLabel = priorityStatus.key === "overdue" ? "Tarea vencida" : "Próxima tarea";
  const pendingTasks = sortTasksByDateTime(getPendingTasksForSelectedPet())
    .filter((task) => task.id !== priorityTask.id)
    .slice(0, 3);
  const taskListContent =
    pendingTasks.length > 0
      ? pendingTasks.map((task) => renderSummaryTaskRow(task)).join("")
      : `<p class="summary-task-list__empty">No hay otras tareas pendientes para esta mascota.</p>`;

  selectedPetSummaryElement.innerHTML = `
    <div class="pet-summary-dashboard">
      <article class="priority-task-card priority-task-card--${priorityStatus.key}">
        ${renderTaskIcon(priorityTask.title)}
        <span class="priority-task-card__eyebrow">${escapeHTML(priorityLabel)}</span>
        <h3>${escapeHTML(displayText(priorityTask.title, "Cuidado pendiente"))}</h3>
        <p>${escapeHTML(displayText(priorityTask.description, "Sin descripción adicional."))}</p>
        <time datetime="${escapeHTML(priorityTask.date || "")}">
          ${escapeHTML(formatDateToDisplay(priorityTask.date))} - ${escapeHTML(formatTimeToDisplay(priorityTask.time))}
        </time>
        <span class="badge ${priorityStatus.badgeClass}">${escapeHTML(displayText(priorityStatus.label))}</span>
      </article>

      <section class="summary-task-list" aria-labelledby="summary-task-list-title">
        <div class="summary-task-list__header">
          <h3 id="summary-task-list-title">Próximas tareas</h3>
        </div>
        <div class="summary-task-list__items">
          ${taskListContent}
        </div>
      </section>

      <a class="btn btn-primary pet-summary-dashboard__cta" href="./agenda.html">
        ${renderLucideIcon("clipboard-check")}
        Ver agenda completa de ${escapeHTML(displayText(pet.name, "la mascota"))}
      </a>
    </div>
  `;
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
    quickInfoListElement.innerHTML = "<li>Seleccioná una mascota.</li>";
    return;
  }

  const details = getPetDetails(pet);
  const infoItems = [
    { icon: "venus-and-mars", label: "Sexo", value: details.sex },
    { icon: "calendar", label: "Fecha", value: details.birthDate },
    { icon: "weight", label: "Peso", value: details.weight },
    { icon: "ruler", label: "Tamaño", value: details.size },
    { icon: "stethoscope", label: "Veterinario", value: details.vet },
    { icon: "hospital", label: "Clínica", value: details.clinic },
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
      { icon: "ruler", label: "Tamaño", value: details.size },
      { icon: "stethoscope", label: "Veterinario", value: details.vet },
      { icon: "hospital", label: "Clínica", value: details.clinic },
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
      <h3 class="coming-soon-card__title">${escapeHTML(sectionName)} próximamente</h3>
      <p class="coming-soon-card__text">
        Esta sección queda preparada para una próxima versión del MVP.
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
  if (editingPetId && editingPetId !== petId) {
    closePetForm();
  }

  selectedPetId = petId;

  renderPets();
  renderSelectedPet();
  renderSelectedPetSummary();
  renderDesktopPetSummary();
  renderQuickInfo();
  setActivePetFeatureTab("Resumen");

  petMessageElement.textContent = "";
  renderLucideIcons();
}

function resetPetFormMode() {
  editingPetId = null;
  petFormSectionElement.dataset.mode = "create";
  petFormTitleElement.textContent = "Agregar mascota";
  petFormSubmitElement.textContent = "Guardar mascota";
}

function clearPetForm() {
  petFormElement.reset();
  petImageInput.value = "";
  petWeightUnitSelect.value = "kg";
  petAgeUnitSelect.value = "years";
  setPetAgeMode("", true);
}

function openPetFormForCreate() {
  resetPetFormMode();
  clearPetForm();
  setPetBirthDateMax();
  petMessageElement.textContent = "";
  petMessageElement.className = "form-help";
  petFormSectionElement.hidden = false;
  petNameInput.focus();
}

function fillPetForm(pet) {
  const details = getPetDetails(pet);
  const birthDate = formatDateForInput(pet.birthDate || details.birthDate);
  const parsedAge = parsePetAgeInput(pet.age);
  const parsedWeight = parsePetWeightInput(details.weight === "Sin dato" ? "" : details.weight);
  const ageMode = birthDate ? "birthdate" : parsedAge.value ? "manual" : "";

  petNameInput.value = displayText(pet.name);
  petSpeciesSelect.value = displayText(pet.species);
  petKnowsBirthDateSelect.value = ageMode;
  petBirthDateInput.value = birthDate;
  petAgeInput.value = birthDate ? "" : parsedAge.value;
  petAgeUnitSelect.value = parsedAge.unit;
  petBreedInput.value = displayText(pet.breed);
  petSexSelect.value = displayText(pet.sex || details.sex) === "Sin dato" ? "" : displayText(pet.sex || details.sex);
  petWeightInput.value = parsedWeight.value;
  petWeightUnitSelect.value = parsedWeight.unit;
  petSizeSelect.value = details.size === "Sin dato" ? "" : normalizeSizeForInput(details.size);
  petVetNameInput.value = details.vet === "A completar" ? "" : details.vet;
  petClinicInput.value = details.clinic === "A completar" ? "" : details.clinic;
  petAllergiesInput.value = details.allergies === "Sin alergias registradas" ? "" : details.allergies;
  petNotesInput.value = details.notes === "Sin notas cargadas" ? "" : details.notes;
  petImageInput.value = "";
  setPetBirthDateMax();
  setPetAgeMode(ageMode, false);
}

function openPetFormForEdit(petId) {
  const pet = getPetById(petId);

  if (!pet) {
    showPetMessage("No se encontró la mascota seleccionada.", "error");
    return;
  }

  editingPetId = pet.id;
  petFormSectionElement.dataset.mode = "edit";
  petFormTitleElement.textContent = `Editar mascota`;
  petFormSubmitElement.textContent = "Guardar cambios";
  fillPetForm(pet);
  petMessageElement.textContent = "";
  petMessageElement.className = "form-help";
  petFormSectionElement.hidden = false;
  petNameInput.focus();
}

function closePetForm() {
  petFormSectionElement.hidden = true;
  clearPetForm();
  resetPetFormMode();
  petMessageElement.textContent = "";
  petMessageElement.className = "form-help";
}

function showPetMessage(message, type = "success") {
  petMessageElement.textContent = message;
  petMessageElement.className = type === "error" ? "form-error" : "form-success";
}

function getValidatedPetAge() {
  const ageMode = cleanText(petKnowsBirthDateSelect.value);
  const birthDate = cleanText(petBirthDateInput.value);
  const manualAge = cleanText(petAgeInput.value);
  const ageUnit = cleanText(petAgeUnitSelect.value);

  if (!ageMode) {
    return {
      isValid: false,
      message: "Seleccioná si conocés la fecha de nacimiento.",
      focusElement: petKnowsBirthDateSelect
    };
  }

  if (ageMode === "birthdate") {
    if (!birthDate) {
      return {
        isValid: false,
        message: "Ingresá una fecha de nacimiento válida.",
        focusElement: petBirthDateInput
      };
    }

    if (isFutureDate(birthDate)) {
      return {
        isValid: false,
        message: "La fecha de nacimiento no puede ser futura.",
        focusElement: petBirthDateInput
      };
    }

    const calculatedAge = calculateAgeFromBirthDate(birthDate);

    if (!calculatedAge) {
      return {
        isValid: false,
        message: "La fecha de nacimiento no es válida.",
        focusElement: petBirthDateInput
      };
    }

    return {
      isValid: true,
      age: calculatedAge,
      birthDate
    };
  }

  if (ageMode !== "manual") {
    return {
      isValid: false,
      message: "Seleccioná si conocés la fecha de nacimiento.",
      focusElement: petKnowsBirthDateSelect
    };
  }

  if (!manualAge) {
    return {
      isValid: false,
      message: "Ingresá una edad válida, por ejemplo: 3 meses, 12 días o 2 años.",
      focusElement: petAgeInput
    };
  }

  if (/^-\s*\d/.test(manualAge)) {
    return {
      isValid: false,
      message: "La edad no puede ser negativa.",
      focusElement: petAgeInput
    };
  }

  if (!VALID_AGE_UNITS.includes(ageUnit)) {
    return {
      isValid: false,
      message: "Ingresá una edad válida, por ejemplo: 3 meses, 12 días o 2 años.",
      focusElement: petAgeUnitSelect
    };
  }

  const normalizedAge = formatManualPetAge(manualAge, ageUnit);

  if (!normalizedAge) {
    return {
      isValid: false,
      message: "Ingresá una edad válida, por ejemplo: 3 meses, 12 días o 2 años.",
      focusElement: petAgeInput
    };
  }

  return {
    isValid: true,
    age: normalizedAge,
    birthDate: ""
  };
}

function readPetImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("Seleccioná un archivo de imagen válido."));
      return;
    }

    if (file.size > MAX_PET_IMAGE_SIZE) {
      reject(new Error("La foto es demasiado pesada. Usa una imagen de hasta 1 MB."));
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => {
      reject(new Error("No se pudo leer la foto. Intentá con otra imagen."));
    });
    reader.readAsDataURL(file);
  });
}

function getPetFormPayload(imageValue, ageValidation, weightValue) {
  return {
    name: petNameInput.value,
    species: petSpeciesSelect.value,
    age: ageValidation.age,
    breed: petBreedInput.value,
    image: imageValue,
    birthDate: ageValidation.birthDate || "",
    sex: cleanText(petSexSelect.value),
    weight: weightValue,
    size: cleanText(petSizeSelect.value),
    vetName: cleanText(petVetNameInput.value),
    clinic: cleanText(petClinicInput.value),
    allergies: cleanText(petAllergiesInput.value),
    notes: cleanText(petNotesInput.value)
  };
}

async function handlePetSubmit(event) {
  event.preventDefault();

  const existingPet = editingPetId ? getPetById(editingPetId) : null;

  if (editingPetId && !existingPet) {
    showPetMessage("No se encontró la mascota que querías editar.", "error");
    resetPetFormMode();
    return;
  }

  const isEditing = Boolean(editingPetId && existingPet);
  let imageValue = isEditing ? existingPet.image || "" : "";
  const ageValidation = getValidatedPetAge();
  const basicPetData = {
    name: petNameInput.value,
    species: petSpeciesSelect.value
  };

  if (!cleanText(basicPetData.name)) {
    showPetMessage("Completá el nombre de la mascota.", "error");
    petNameInput.focus();
    return;
  }

  if (!cleanText(basicPetData.species)) {
    showPetMessage("Seleccioná la especie de la mascota.", "error");
    petSpeciesSelect.focus();
    return;
  }

  if (!ageValidation.isValid) {
    showPetMessage(ageValidation.message, "error");
    ageValidation.focusElement.focus();
    return;
  }

  const weightValidation = normalizePetWeight(petWeightInput.value, petWeightUnitSelect.value);

  if (!weightValidation.isValid) {
    showPetMessage(weightValidation.message, "error");
    weightValidation.focusElement.focus();
    return;
  }

  try {
    const newImage = await readPetImageFile(petImageInput.files[0]);

    if (newImage) {
      imageValue = newImage;
    }
  } catch (error) {
    showPetMessage(error.message, "error");
    petImageInput.focus();
    return;
  }

  const petData = getPetFormPayload(imageValue, ageValidation, weightValidation.weight);

  if (isEditing) {
    const updatedPet = updatePet(existingPet.id, petData);

    if (!updatedPet) {
      showPetMessage("No se pudieron guardar los cambios. Revisá los datos.", "error");
      return;
    }

    clearPetForm();
    resetPetFormMode();
    selectPet(updatedPet.id);
    showPetMessage(`Mascota "${displayText(updatedPet.name)}" actualizada correctamente.`);
    return;
  }

  const newPet = addPet(petData);

  if (!newPet) {
    showPetMessage("No se pudo guardar la mascota. Revisá los datos.", "error");
    return;
  }

  clearPetForm();
  resetPetFormMode();
  selectPet(newPet.id);
  showPetMessage(`Mascota "${displayText(newPet.name)}" agregada correctamente.`);
}

function handlePetsListClick(event) {
  const petButton = event.target.closest("[data-pet-id]");
  const openFormButton = event.target.closest("[data-open-pet-form]");

  if (openFormButton) {
    openPetFormForCreate();
    return;
  }

  if (petButton) {
    selectPet(petButton.dataset.petId);
  }
}

function handlePageClick(event) {
  if (event.target.closest("[data-open-pet-form]")) {
    openPetFormForCreate();
  }

  if (event.target.closest("[data-close-pet-form]")) {
    closePetForm();
  }

  if (event.target.closest("[data-edit-selected-pet]") && selectedPetId) {
    openPetFormForEdit(selectedPetId);
  }

  if (event.target.closest("[data-next-pet-tip]")) {
    updatePetTip();
  }
}

function handlePetFeatureTabsClick(event) {
  const tabButton = event.target.closest("[data-pet-section]");

  if (!tabButton) {
    return;
  }

  setActivePetFeatureTab(tabButton.dataset.petSection);
}

function handlePetAgeModeChange() {
  setPetAgeMode(petKnowsBirthDateSelect.value, true);
}

function setupEventListeners() {
  petsListElement.addEventListener("click", handlePetsListClick);
  petFeatureTabsElement.addEventListener("click", handlePetFeatureTabsClick);
  petKnowsBirthDateSelect.addEventListener("change", handlePetAgeModeChange);
  petFormElement.addEventListener("submit", handlePetSubmit);
  document.addEventListener("click", handlePageClick);
}

function initMascotasPage() {
  if (!validateRequiredElements()) {
    return;
  }

  setPetBirthDateMax();
  setPetAgeMode("", false);
  loadInitialData();
  renderPets();
  renderSelectedPet();
  renderSelectedPetSummary();
  renderDesktopPetSummary();
  renderQuickInfo();
  setActivePetFeatureTab("Resumen");
  setupEventListeners();
  updatePetTip();
  renderLucideIcons();
}

initMascotasPage();
