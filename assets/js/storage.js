/* =====================================================
   PetCare Planner - storage.js
   Funciones compartidas para localStorage
===================================================== */

/*
  Este archivo es compartido por:
  - index.js
  - mascotas.js
  - agenda.js

  Regla importante:
  storage.js NO renderiza HTML y NO usa document.querySelector().
  Solo se encarga de leer, guardar y actualizar datos.
*/

/* =====================================================
   Claves de localStorage
===================================================== */

const STORAGE_KEYS = {
  PETS: "petcare_pets",
  TASKS: "petcare_tasks"
};

/* =====================================================
   Funciones generales
===================================================== */

function getFromStorage(key) {
  const data = localStorage.getItem(key);

  if (!data) {
    return [];
  }

  try {
    const parsedData = JSON.parse(data);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error(`Error al leer ${key} desde localStorage`, error);
    return [];
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error al guardar ${key} en localStorage`, error);
  }
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function cleanText(value) {
  return String(value || "").trim();
}

function getTodayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =====================================================
   Mascotas
===================================================== */

function getPets() {
  return getFromStorage(STORAGE_KEYS.PETS);
}

function savePets(pets) {
  saveToStorage(STORAGE_KEYS.PETS, pets);
}

function addPet(petData) {
  const pets = getPets();

  const newPet = {
    id: generateId("pet"),
    name: cleanText(petData.name),
    species: cleanText(petData.species),
    age: cleanText(petData.age),
    breed: cleanText(petData.breed),
    image: cleanText(petData.image),
    createdAt: new Date().toISOString()
  };

  pets.push(newPet);
  savePets(pets);

  return newPet;
}

function getPetById(petId) {
  const pets = getPets();
  return pets.find((pet) => pet.id === petId) || null;
}

function updatePet(petId, updatedData) {
  const pets = getPets();

  const updatedPets = pets.map((pet) => {
    if (pet.id !== petId) {
      return pet;
    }

    return {
      ...pet,
      ...updatedData,
      name: cleanText(updatedData.name ?? pet.name),
      species: cleanText(updatedData.species ?? pet.species),
      age: cleanText(updatedData.age ?? pet.age),
      breed: cleanText(updatedData.breed ?? pet.breed),
      image: cleanText(updatedData.image ?? pet.image),
      updatedAt: new Date().toISOString()
    };
  });

  savePets(updatedPets);
  return getPetById(petId);
}

function deletePet(petId) {
  const pets = getPets();
  const tasks = getTasks();

  const updatedPets = pets.filter((pet) => pet.id !== petId);
  const updatedTasks = tasks.filter((task) => task.petId !== petId);

  savePets(updatedPets);
  saveTasks(updatedTasks);
}

/* =====================================================
   Tareas / Cuidados
===================================================== */

function getTasks() {
  return getFromStorage(STORAGE_KEYS.TASKS);
}

function saveTasks(tasks) {
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
}

function addTask(taskData) {
  const tasks = getTasks();

  const newTask = {
    id: generateId("task"),
    petId: cleanText(taskData.petId),
    title: cleanText(taskData.title),
    description: cleanText(taskData.description),
    date: cleanText(taskData.date),
    time: cleanText(taskData.time),
    status: "pending",
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  saveTasks(tasks);

  return newTask;
}

function getTaskById(taskId) {
  const tasks = getTasks();
  return tasks.find((task) => task.id === taskId) || null;
}

function getTasksByPetId(petId) {
  const tasks = getTasks();
  return tasks.filter((task) => task.petId === petId);
}

function updateTask(taskId, updatedData) {
  const tasks = getTasks();

  const updatedTasks = tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    return {
      ...task,
      ...updatedData,
      petId: cleanText(updatedData.petId ?? task.petId),
      title: cleanText(updatedData.title ?? task.title),
      description: cleanText(updatedData.description ?? task.description),
      date: cleanText(updatedData.date ?? task.date),
      time: cleanText(updatedData.time ?? task.time),
      status: cleanText(updatedData.status ?? task.status),
      updatedAt: new Date().toISOString()
    };
  });

  saveTasks(updatedTasks);
  return getTaskById(taskId);
}

function markTaskAsDone(taskId) {
  return updateTask(taskId, {
    status: "done",
    completedAt: new Date().toISOString()
  });
}

function markTaskAsPending(taskId) {
  return updateTask(taskId, {
    status: "pending",
    completedAt: ""
  });
}

function deleteTask(taskId) {
  const tasks = getTasks();
  const updatedTasks = tasks.filter((task) => task.id !== taskId);

  saveTasks(updatedTasks);
}

/* =====================================================
   Estados visuales de tareas
===================================================== */

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

function getUpcomingTasks(limit = 3) {
  const tasks = getTasks();

  const upcomingTasks = tasks.filter((task) => {
    const visualStatus = getTaskVisualStatus(task);
    return visualStatus.key === "today" || visualStatus.key === "upcoming";
  });

  return sortTasksByDate(upcomingTasks).slice(0, limit);
}

function getOverdueTasks() {
  const tasks = getTasks();
  return tasks.filter((task) => getTaskVisualStatus(task).key === "overdue");
}

function getTodayTasks() {
  const tasks = getTasks();
  return tasks.filter((task) => getTaskVisualStatus(task).key === "today");
}

function getDoneTasks() {
  const tasks = getTasks();
  return tasks.filter((task) => getTaskVisualStatus(task).key === "done");
}

/* =====================================================
   Datos iniciales opcionales
===================================================== */

function seedInitialData() {
  const pets = getPets();
  const tasks = getTasks();

  if (pets.length > 0 || tasks.length > 0) {
    return;
  }

  const examplePet = addPet({
    name: "Kira",
    species: "Perro",
    age: "3 años",
    breed: "Golden Retriever",
    image: ""
  });

  addTask({
    petId: examplePet.id,
    title: "Vacuna antirrábica",
    description: "Aplicación anual.",
    date: getTodayISO(),
    time: "09:00"
  });
}

/* =====================================================
   Utilidades para testing
===================================================== */

function clearPetCareData() {
  localStorage.removeItem(STORAGE_KEYS.PETS);
  localStorage.removeItem(STORAGE_KEYS.TASKS);
}