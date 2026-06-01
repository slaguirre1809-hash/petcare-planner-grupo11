/* =====================================================
   PetCare Planner - data.js
   Datos iniciales de ejemplo
===================================================== */

/*
  Este archivo contiene datos iniciales para probar la app.

  Regla importante:
  data.js NO renderiza HTML.
  data.js NO usa document.querySelector().
  data.js NO usa localStorage.

  Solo define arrays de ejemplo que storage.js puede usar
  para inicializar la aplicación si no hay datos guardados.
*/

/* =====================================================
   Mascotas iniciales
===================================================== */

const INITIAL_PETS = [
  {
    id: "pet-kira",
    name: "Kira",
    species: "Perro",
    age: "3 años",
    breed: "Golden Retriever",
    image: "assets/img/pets/dog-avatar.png",
    birthDate: "2021-04-12",
    sex: "Hembra",
    weight: "28 kg",
    size: "Grande",
    vetName: "Vet. Maria Lopez",
    clinic: "Patitas Felices",
    allergies: "",
    notes: "Le gusta pasear por la tarde.",
    createdAt: "2026-05-20T10:00:00.000Z"
  },
  {
    id: "pet-mishi",
    name: "Mishi",
    species: "Gato",
    age: "2 años",
    breed: "Común europeo",
    image: "assets/img/pets/cat-avatar.png",
    birthDate: "2022-08-03",
    sex: "Macho",
    weight: "5 kg",
    size: "Mediano",
    vetName: "Vet. Maria Lopez",
    clinic: "Patitas Felices",
    allergies: "Evitar pollo",
    notes: "Prefiere alimento humedo.",
    createdAt: "2026-05-20T10:05:00.000Z"
  },
  {
    id: "pet-luna",
    name: "Luna",
    species: "Conejo",
    age: "1 año",
    breed: "Mini lop",
    image: "assets/img/pets/rabbit-avatar.png",
    birthDate: "2023-01-20",
    sex: "Hembra",
    weight: "2 kg",
    size: "Pequeno",
    vetName: "Vet. Maria Lopez",
    clinic: "Patitas Felices",
    allergies: "",
    notes: "Revisar dientes con frecuencia.",
    createdAt: "2026-05-20T10:10:00.000Z"
  }
];

/* =====================================================
   Tareas / cuidados iniciales
===================================================== */

const INITIAL_TASKS = [
  {
    id: "task-vacuna-mishi",
    petId: "pet-mishi",
    title: "Vacuna antirrábica",
    description: "Aplicación anual recomendada por veterinaria.",
    date: "2026-05-20",
    time: "09:00",
    status: "pending",
    createdAt: "2026-05-20T10:15:00.000Z"
  },
  {
    id: "task-alimento-kira",
    petId: "pet-kira",
    title: "Alimentar",
    description: "Servir su ración del mediodía y revisar que tenga agua fresca.",
    date: "2026-05-23",
    time: "13:00",
    status: "pending",
    createdAt: "2026-05-20T10:20:00.000Z"
  },
  {
    id: "task-control-luna",
    petId: "pet-luna",
    title: "Control veterinario",
    description: "Revisión general de salud y peso.",
    date: "2026-05-28",
    time: "16:30",
    status: "pending",
    createdAt: "2026-05-20T10:25:00.000Z"
  },
  {
    id: "task-bano-kira",
    petId: "pet-kira",
    title: "Baño",
    description: "Baño completo y cepillado del pelaje.",
    date: "2026-05-18",
    time: "17:00",
    status: "done",
    createdAt: "2026-05-18T10:00:00.000Z",
    completedAt: "2026-05-18T17:40:00.000Z"
  }
];
