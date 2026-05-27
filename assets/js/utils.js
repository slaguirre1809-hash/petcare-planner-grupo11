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
