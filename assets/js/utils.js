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