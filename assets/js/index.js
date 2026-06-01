/* =====================================================
   Mapa de emojis por especie
   ===================================================== */

const SPECIES_EMOJI = {
  perro: '🐕',
  gato: '🐱',
  conejo: '🐰',
  pez: '🐠',
  ave: '🐦',
  hamster: '🐹',
  tortuga: '🐢',
  default: '🐾'
};

/* =====================================================
   Mensajes para estados vacíos
   ===================================================== */

var EMPTY_MESSAGES = {
  noTasks: 'No hay tareas a mostrar',
  noPets: 'No hay mascotas registradas'
};

/* =====================================================
   Utilidades
   ===================================================== */

function getEmojiForSpecies(species) {
  var key = (species || '').trim().toLowerCase();
  return SPECIES_EMOJI[key] || SPECIES_EMOJI.default;
}

function getUserName() {
  // Por ahora, saludo genérico. En el futuro se podría leer de localStorage:
  // const userName = localStorage.getItem('petcare_user_name');
  // return userName || 'Cuidador';
  return 'Cuidador';
}

/* =====================================================
   Tips del día
   ===================================================== */

var TIPS = [
  'Cepillar a tu mascota regularmente ayuda a reducir el estrés y fortalece el vínculo.',
  'Mantener al día las vacunas es clave para la salud de tu compañero.',
  'El agua fresca debe estar siempre disponible; cambiala al menos dos veces al día.',
  'Pasear a tu perro al menos 30 minutos diarios mejora su salud física y mental.',
  'Revisar orejas y dientes de tu mascota una vez por semana previene infecciones.',
  'Una alimentación equilibrada según su edad y tamaño prolonga su calidad de vida.'
];

function pickRandomTip() {
  return TIPS[Math.floor(Math.random() * TIPS.length)];
}

function updateTipOfTheDay() {
  var tipContainer = document.getElementById('tip-of-the-day');
  if (!tipContainer) return;

  var paragraph = tipContainer.querySelector('p');
  if (paragraph) paragraph.textContent = pickRandomTip();
}

/* =====================================================
   Renderizar contadores del resumen de hoy
   ===================================================== */

function renderStats(tasks) {
  var overdueCount = getOverdueTasksFromList(tasks).length;
  var todayCount = getTodayTasksFromList(tasks).length;
  var upcomingCount = getTasksByVisualStatus(tasks, 'upcoming').length;
  var doneCount = getDoneTasksFromList(tasks).length;

  var overdueEl = document.getElementById('overdue-count');
  var todayEl = document.getElementById('today-count');
  var upcomingEl = document.getElementById('upcoming-count');
  var doneEl = document.getElementById('done-count');

  if (overdueEl) overdueEl.textContent = overdueCount;
  if (todayEl) todayEl.textContent = todayCount;
  if (upcomingEl) upcomingEl.textContent = upcomingCount;
  if (doneEl) doneEl.textContent = doneCount;
}

/* =====================================================
   Badge por estado
   ===================================================== */

function getBadgeEmoji(statusKey) {
  switch (statusKey) {
    case 'overdue': return '⚠️';
    case 'today': return '⏰';
    case 'upcoming': return '📅';
    case 'done': return '✅';
    default: return '';
  }
}

/* =====================================================
   Crear elemento de tarea próxima
   ===================================================== */

function createUpcomingTaskElement(task, pets) {
  var status = getTaskVisualStatus(task);
  var pet = getPetByIdFromList(pets, task.petId);
  var petName = pet ? pet.name : 'Mascota';
  var species = pet ? pet.species : '';
  var emoji = getEmojiForSpecies(species);
  var dateDisplay = formatDateToDisplay(task.date);
  var timeDisplay = formatTimeToDisplay(task.time);

  var li = document.createElement('li');
  li.innerHTML =
    '<article class="task-card">' +
      '<span class="task-avatar" aria-hidden="true">' + emoji + '</span>' +
      '<div class="task-card__body">' +
        '<h3 class="task-card__title">' + task.title + '</h3>' +
        '<p class="task-card__meta">' +
          petName + ' • ' + species + ' • ' +
          dateDisplay + ' • ' + timeDisplay +
        '</p>' +
        '<span class="badge ' + status.badgeClass + '">' + getBadgeEmoji(status.key) + ' ' + status.label + '</span>' +
      '</div>' +
      '<a class="task-link" href="#" aria-label="Ver detalle de la tarea">›</a>' +
    '</article>';

  return li;
}

/* =====================================================
   Obtener tareas para el dashboard (prioridad: vencidas → hoy → próximas, máximo 3)
   ===================================================== */

function getDashboardTasks(tasks, limit) {
  var overdue = getOverdueTasksFromList(tasks);
  var today = getTodayTasksFromList(tasks);
  var upcoming = getUpcomingTasksFromList(tasks, 10); 

  overdue = sortTasksByDate(overdue);
  today = sortTasksByDate(today);
  upcoming = sortTasksByDate(upcoming);

  var combined = overdue.concat(today, upcoming);
  return combined.slice(0, limit);
}

/* =====================================================
   Renderizar lista de próximas tareas
   ===================================================== */

function renderUpcomingTasks(tasks, pets) {
  var container = document.getElementById('upcoming-tasks-list');
  if (!container) return;

  container.innerHTML = '';

  var dashboardTasks = getDashboardTasks(tasks, 3);

if (dashboardTasks.length === 0) {
  container.innerHTML = '<li class="empty-state">' + EMPTY_MESSAGES.noTasks + '</li>';
  return;
}

var fragment = document.createDocumentFragment();

for (var i = 0; i < dashboardTasks.length; i++) {
  fragment.appendChild(createUpcomingTaskElement(dashboardTasks[i], pets));
}

  container.appendChild(fragment);
}

/* =====================================================
   Renderizar lista de mascotas
   ===================================================== */

function renderPets(pets) {
  var container = document.getElementById('pets-list-container');
  if (!container) return;

  container.innerHTML = '';

  if (pets.length === 0) {
    container.innerHTML = '<li class="empty-state">' + EMPTY_MESSAGES.noPets + '</li>';
    return;
  }

  var displayPets = pets.slice(0, 3);
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < displayPets.length; i++) {
    var pet = displayPets[i];
    var emoji = getEmojiForSpecies(pet.species);
    var age = pet.age || 'Edad no especificada';

    var li = document.createElement('li');
    li.className = 'pet-mini-card';

    li.innerHTML =
      '<span class="pet-avatar" aria-hidden="true">' + emoji + '</span>' +
      '<div class="pet-info">' +
        '<p class="pet-name">' + pet.name + '</p>' +
        '<p class="pet-specie">' + pet.species + '</p>' +
        '<p class="pet-meta">' + age + '</p>' +
      '</div>';

    fragment.appendChild(li);
  }

  container.appendChild(fragment);
}

/* =====================================================
   Renderizar saludo
   ===================================================== */

function renderGreeting() {
  var greetingElement = document.getElementById('user-greeting');
  if (!greetingElement) return;

  var userName = getUserName();
  greetingElement.textContent = '¡Hola, ' + userName + '! 🐾';
}

/* =====================================================
   Inicialización del dashboard
   ===================================================== */

function initDashboard() {
  try {
    seedInitialData();

    var pets = getPets();
    var tasks = getTasks();

    renderGreeting();
    renderStats(tasks);
    renderUpcomingTasks(tasks, pets);
    renderPets(pets);
    updateTipOfTheDay();

    var tipLink = document.querySelector('.tip-of-the-day__button');
    if (tipLink) {
      tipLink.addEventListener('click', function (event) {
        updateTipOfTheDay();
      });
    }

  } catch (error) {
    console.error('Error al inicializar el dashboard:', error);
  }
}

document.addEventListener('DOMContentLoaded', initDashboard);
