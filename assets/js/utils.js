/* =====================================================
   PetCare Planner - utils.js
   Funciones auxiliares reutilizables
===================================================== */

/*
  Este archivo es compartido por:
  - storage.js
  - index.js
  - mascotas.js
  - agenda.js

  Regla importante:
  utils.js NO renderiza HTML.
  utils.js NO usa document.querySelector().
  utils.js NO usa localStorage.

  Solo contiene funciones auxiliares puras o de ayuda general.
*/

/* =====================================================
   Textos
===================================================== */

function cleanText(value) {
  return String(value || "").trim();
}

function normalizeSpaces(value) {
  return cleanText(value).replace(/\s+/g, " ");
}

function validateTextLength(value, maxLength) {
  return normalizeSpaces(value).length <= maxLength;
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

  if (/^-\s*\d/.test(text)) {
    return fallback;
  }

  const cleanAgeText = text
    .replace(/\s+/g, " ")
    .replace(/dias/g, "días")
    .replace(/dia/g, "día")
    .replace(/anos/g, "años")
    .replace(/ano/g, "año")
    .replace(/\b(días|día)\s+(días|día)\b/g, "$1")
    .replace(/\b(meses|mes)\s+(meses|mes)\b/g, "$1")
    .replace(/\b(años|año)\s+(años|año)\b/g, "$1")
    .trim();

  const ageParts = cleanAgeText.match(/^(\d+)\s*(días|día|meses|mes|años|año)?$/);

  if (!ageParts) {
    return fallback;
  }

  const ageNumber = Number(ageParts[1]);
  const ageUnit = ageParts[2] || "años";

  if (!Number.isFinite(ageNumber) || ageNumber <= 0) {
    return fallback;
  }

  if (ageUnit === "día" || ageUnit === "días") {
    return `${ageNumber} ${ageNumber === 1 ? "día" : "días"}`;
  }

  if (ageUnit === "mes" || ageUnit === "meses") {
    return `${ageNumber} ${ageNumber === 1 ? "mes" : "meses"}`;
  }

  return `${ageNumber} ${ageNumber === 1 ? "año" : "años"}`;
}

/* =====================================================
   IDs
===================================================== */

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/* =====================================================
   Fechas
===================================================== */

function getTodayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateToDisplay(date) {
  if (!date) {
    return "Sin fecha";
  }

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

function formatTimeToDisplay(time) {
  if (!time) {
    return "Sin horario";
  }

  return time;
}

function formatDateForInput(value) {
  const text = displayText(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  const dateParts = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (dateParts) {
    return `${dateParts[3]}-${dateParts[2]}-${dateParts[1]}`;
  }

  return "";
}

function parseDateOnly(value) {
  const text = displayText(value).trim();
  const dateParts = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!dateParts) {
    return null;
  }

  const year = Number(dateParts[1]);
  const month = Number(dateParts[2]);
  const day = Number(dateParts[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function isFutureDate(value) {
  const date = parseDateOnly(value);

  if (!date) {
    return false;
  }

  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return date.getTime() > todayOnly.getTime();
}

function formatCalculatedPetAge(totalMonths, totalDays) {
  if (totalDays < 30) {
    return `${totalDays} ${totalDays === 1 ? "día" : "días"}`;
  }

  if (totalMonths < 24) {
    const safeMonths = Math.max(totalMonths, 1);
    return `${safeMonths} ${safeMonths === 1 ? "mes" : "meses"}`;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const yearsText = `${years} ${years === 1 ? "año" : "años"}`;

  if (months > 0) {
    return `${yearsText} y ${months} ${months === 1 ? "mes" : "meses"}`;
  }

  return yearsText;
}

function calculateAgeFromBirthDate(value) {
  const birthDate = parseDateOnly(value);

  if (!birthDate || isFutureDate(value)) {
    return "";
  }

  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.floor((todayOnly.getTime() - birthDate.getTime()) / millisecondsPerDay);
  let totalMonths =
    (todayOnly.getFullYear() - birthDate.getFullYear()) * 12 +
    (todayOnly.getMonth() - birthDate.getMonth());

  if (todayOnly.getDate() < birthDate.getDate()) {
    totalMonths -= 1;
  }

  return formatCalculatedPetAge(Math.max(totalMonths, 0), Math.max(totalDays, 0));
}

/* =====================================================
   Peso de mascotas
===================================================== */

function parsePetWeight(value, fallbackUnit = "") {
  const text = displayText(value).trim().toLowerCase();
  const weightParts = text.match(/^(\d+(?:[,.]\d+)?)\s*(kg|g)?$/);

  if (!weightParts) {
    return null;
  }

  const unit = weightParts[2] || fallbackUnit;

  if (unit !== "kg" && unit !== "g") {
    return null;
  }

  return {
    value: weightParts[1].replace(".", ","),
    unit
  };
}

function formatPetWeight(value, unit) {
  const text = cleanText(value);

  if (!text) {
    return {
      isValid: true,
      weight: ""
    };
  }

  if (!unit) {
    return {
      isValid: false,
      error: "unit"
    };
  }

  if (/^-\s*\d/.test(text)) {
    return {
      isValid: false,
      error: "nonPositive"
    };
  }

  const parsedWeight = parsePetWeight(text, unit);

  if (!parsedWeight) {
    return {
      isValid: false,
      error: "invalid"
    };
  }

  const normalizedNumberText = parsedWeight.value.replace(",", ".");
  const weightNumber = Number(normalizedNumberText);

  if (!Number.isFinite(weightNumber)) {
    return {
      isValid: false,
      error: "invalid"
    };
  }

  if (weightNumber <= 0) {
    return {
      isValid: false,
      error: "nonPositive"
    };
  }

  if (parsedWeight.unit === "g" && !Number.isInteger(weightNumber)) {
    return {
      isValid: false,
      error: "invalid"
    };
  }

  return {
    isValid: true,
    weight: `${parsedWeight.value} ${parsedWeight.unit}`
  };
}

/* =====================================================
   Estados de tareas
===================================================== */

function normalizeTaskStatus(status) {
  return status === "done" ? "done" : "pending";
}

function getTaskVisualStatus(task) {
  if (task.status === "done") {
    return {
      key: "done",
      label: "Realizada",
      badgeClass: "badge-primary"
    };
  }

  if (!task.date) {
    return {
      key: "pending",
      label: "Pendiente",
      badgeClass: "badge-info"
    };
  }

  const today = getTodayISO();

  if (task.date < today) {
    return {
      key: "overdue",
      label: "Vencida",
      badgeClass: "badge-danger"
    };
  }

  if (task.date === today) {
    return {
      key: "today",
      label: "Hoy",
      badgeClass: "badge-warning"
    };
  }

  return {
    key: "upcoming",
    label: "Próxima",
    badgeClass: "badge-success"
  };
}

/* =====================================================
   Filtros y ordenamiento de tareas
===================================================== */

function filterTasksByVisualStatus(tasks, statusKey) {
  if (statusKey === "all") {
    return tasks;
  }

  return tasks.filter((task) => getTaskVisualStatus(task).key === statusKey);
}

function sortTasksByDate(tasks) {
  return [...tasks].sort((a, b) => {
    const dateA = `${a.date || "9999-12-31"} ${a.time || "23:59"}`;
    const dateB = `${b.date || "9999-12-31"} ${b.time || "23:59"}`;

    return dateA.localeCompare(dateB);
  });
}

function getTaskTimestamp(task) {
  if (!task.date) {
    return Number.POSITIVE_INFINITY;
  }

  const time = task.time || "23:59";
  const timestamp = new Date(`${task.date}T${time}`).getTime();

  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
}

function sortTasksByDateTime(tasks) {
  return [...tasks].sort((a, b) => getTaskTimestamp(a) - getTaskTimestamp(b));
}

function getTasksByVisualStatus(tasks, statusKey) {
  return filterTasksByVisualStatus(tasks, statusKey);
}

function getUpcomingTasksFromList(tasks, limit = 3) {
  const upcomingTasks = tasks.filter((task) => {
    const visualStatus = getTaskVisualStatus(task);
    return visualStatus.key === "today" || visualStatus.key === "upcoming";
  });

  return sortTasksByDate(upcomingTasks).slice(0, limit);
}

function getOverdueTasksFromList(tasks) {
  return tasks.filter((task) => getTaskVisualStatus(task).key === "overdue");
}

function getTodayTasksFromList(tasks) {
  return tasks.filter((task) => getTaskVisualStatus(task).key === "today");
}

function getDoneTasksFromList(tasks) {
  return tasks.filter((task) => getTaskVisualStatus(task).key === "done");
}

/* =====================================================
   Mascotas
===================================================== */

function getPetNameById(pets, petId) {
  const pet = pets.find((item) => item.id === petId);
  return pet ? pet.name : "Mascota no encontrada";
}

function getPetByIdFromList(pets, petId) {
  return pets.find((pet) => pet.id === petId) || null;
}
