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
  Solo se encarga de leer, guardar, crear, actualizar y eliminar datos.

  Depende de:
  - data.js  → INITIAL_PETS / INITIAL_TASKS
  - utils.js → generateId(), cleanText(), normalizeTaskStatus()
*/

/* =====================================================
   Claves de localStorage
===================================================== */

const STORAGE_KEYS = {
  PETS: "petcare_pets",
  TASKS: "petcare_tasks"
};

/* =====================================================
   Funciones generales de localStorage
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

/* =====================================================
   Mascotas
===================================================== */

function getPets() {
  return getFromStorage(STORAGE_KEYS.PETS);
}

function savePets(pets) {
  saveToStorage(STORAGE_KEYS.PETS, pets);
}

function addPet(petData = {}) {
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

  if (!newPet.name || !newPet.species) {
    return null;
  }

  pets.push(newPet);
  savePets(pets);

  return newPet;
}

function getPetById(petId) {
  const pets = getPets();
  return pets.find((pet) => pet.id === petId) || null;
}

function updatePet(petId, updatedData = {}) {
  const pets = getPets();
  let updatedPet = null;

  const updatedPets = pets.map((pet) => {
    if (pet.id !== petId) {
      return pet;
    }

    updatedPet = {
      ...pet,
      ...updatedData,
      name: cleanText(updatedData.name ?? pet.name),
      species: cleanText(updatedData.species ?? pet.species),
      age: cleanText(updatedData.age ?? pet.age),
      breed: cleanText(updatedData.breed ?? pet.breed),
      image: cleanText(updatedData.image ?? pet.image),
      updatedAt: new Date().toISOString()
    };

    return updatedPet;
  });

  if (!updatedPet) {
    return null;
  }

  if (!updatedPet.name || !updatedPet.species) {
    return null;
  }

  savePets(updatedPets);

  return updatedPet;
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

export function getTasks() {
  return getFromStorage(STORAGE_KEYS.TASKS);
}

export function saveTasks(tasks) {
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
}

function addTask(taskData = {}) {
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

  if (!newTask.petId || !newTask.title || !newTask.date) {
    return null;
  }

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

function updateTask(taskId, updatedData = {}) {
  const tasks = getTasks();
  let updatedTask = null;

  const updatedTasks = tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    updatedTask = {
      ...task,
      ...updatedData,
      petId: cleanText(updatedData.petId ?? task.petId),
      title: cleanText(updatedData.title ?? task.title),
      description: cleanText(updatedData.description ?? task.description),
      date: cleanText(updatedData.date ?? task.date),
      time: cleanText(updatedData.time ?? task.time),
      status: normalizeTaskStatus(updatedData.status ?? task.status),
      updatedAt: new Date().toISOString()
    };

    return updatedTask;
  });

  if (!updatedTask) {
    return null;
  }

  if (!updatedTask.petId || !updatedTask.title || !updatedTask.date) {
    return null;
  }

  saveTasks(updatedTasks);

  return updatedTask;
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
   Datos iniciales
===================================================== */

function seedInitialData() {
  const pets = getPets();
  const tasks = getTasks();

  if (pets.length > 0 || tasks.length > 0) {
    return;
  }

  const initialPets = typeof INITIAL_PETS !== "undefined" ? INITIAL_PETS : [];
  const initialTasks = typeof INITIAL_TASKS !== "undefined" ? INITIAL_TASKS : [];

  savePets(initialPets);
  saveTasks(initialTasks);
}

/* =====================================================
   Utilidades para testing
===================================================== */

/*
  Solo para pruebas durante desarrollo.
  No conectar esta función a botones finales del MVP.
*/

function clearPetCareData() {
  localStorage.removeItem(STORAGE_KEYS.PETS);
  localStorage.removeItem(STORAGE_KEYS.TASKS);
}