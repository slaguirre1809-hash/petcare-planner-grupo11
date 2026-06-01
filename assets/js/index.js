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

const EMPTY_MESSAGES = {
  noTasks: 'No hay tareas a mostrar',
  noPets: 'No hay mascotas registradas'
};

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

function getUserPhoto() {
  // Por ahora se utiliza una imagen por defecto. En el futuro se podría leer desde localStorage:
  // const userPhoto = localStorage.getItem('petcare_user_photo');
  // return userPhoto || './assets/img/states/cuidador-default-avatar.png';
  return './assets/img/states/cuidador-default-avatar.png';
}

function resolveAssetPath(assetPath) {
  if (!assetPath) return '';
  if (/^(data:|blob:|https?:\/\/)/.test(assetPath)) return assetPath;
  return './' + assetPath;
}

function renderOptionalImage(assetPath, className, altText, isLazy) {
  var resolvedPath = resolveAssetPath(assetPath);
  if (!resolvedPath) return '';
  var lazyAttr = isLazy !== false ? ' loading="lazy"' : '';
  return '<img class="' + className + '" src="' + resolvedPath + '" alt="' + (altText || '') + '"' + lazyAttr + ' onload="this.closest(\'.pet-avatar, .task-avatar\')?.classList.add(\'has-image\')" onerror="this.hidden = true; this.closest(\'.pet-avatar, .task-avatar\')?.classList.remove(\'has-image\')" />';
}

function renderUserProfile() {
  var nameElement = document.getElementById('user-name');
  var avatarElement = document.getElementById('user-avatar');

  if (nameElement) {
    nameElement.textContent = getUserName();
  }

  if (avatarElement) {
    avatarElement.src = getUserPhoto();
  }
}


function getPetImage(pet) {
  return (pet.image ? pet.image.trim() : '') || PET_IMAGE_BY_ID[pet.id] || '';
}

function getTaskIconFallback(title) {
  var t = (title || '').toLowerCase();
  if (t.indexOf('vacuna') !== -1) return '💉';
  if (t.indexOf('aliment') !== -1) return '🥣';
  if (t.indexOf('baño') !== -1) return '🛁';
  if (t.indexOf('cepill') !== -1) return '🧹';
  if (t.indexOf('control') !== -1 || t.indexOf('veterin') !== -1) return '⚕️';
  if (t.indexOf('medic') !== -1 || t.indexOf('pastilla') !== -1) return '💊';
  return '⚠️';
}

function getTaskIconKey(title) {
  var t = (title || '').toLowerCase();
  if (t.indexOf('vacuna') !== -1) return 'vaccine';
  if (t.indexOf('aliment') !== -1) return 'food';
  if (t.indexOf('baño') !== -1) return 'bath';
  if (t.indexOf('control') !== -1 || t.indexOf('veterin') !== -1) return 'vet';
  if (t.indexOf('medic') !== -1 || t.indexOf('pastilla') !== -1) return 'medicine';
  return '';
}

function renderTaskIcon(title) {
  var iconKey = getTaskIconKey(title);
  var iconAsset = iconKey ? TASK_ICON_ASSETS[iconKey] : '';
  var fallback = getTaskIconFallback(title);
  var imgHtml = iconAsset ? renderOptionalImage(iconAsset, 'task-avatar__image', '', true) : '';
  return imgHtml + '<span class="task-avatar__fallback" aria-hidden="true">' + fallback + '</span>';
}

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

function getBadgeEmoji(statusKey) {
  switch (statusKey) {
    case 'overdue': return '⚠️';
    case 'today': return '⏰';
    case 'upcoming': return '📅';
    case 'done': return '✅';
    default: return '';
  }
}

function createUpcomingTaskElement(task, pets) {
  var status = getTaskVisualStatus(task);
  var pet = getPetByIdFromList(pets, task.petId);
  var petName = pet ? pet.name : 'Mascota';
  var species = pet ? pet.species : '';
  var dateDisplay = formatDateToDisplay(task.date);
  var timeDisplay = formatTimeToDisplay(task.time);
  var taskIconHtml = renderTaskIcon(task.title);

  var li = document.createElement('li');
  li.innerHTML =
    '<article class="task-card">' +
      '<span class="task-avatar" aria-hidden="true">' + taskIconHtml + '</span>' +
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
    var petImage = getPetImage(pet);
    var imgHtml = renderOptionalImage(petImage, 'pet-avatar__image', 'Foto de ' + pet.name, true);
    var hiddenAttr = petImage ? '' : ' aria-hidden="true"';

    var li = document.createElement('li');
    li.className = 'pet-mini-card';
    li.innerHTML =
      '<span class="pet-avatar"' + hiddenAttr + '>' +
        imgHtml +
        '<span class="pet-avatar__fallback" aria-hidden="true">' + emoji + '</span>' +
      '</span>' +
      '<div class="pet-info">' +
        '<p class="pet-name">' + pet.name + '</p>' +
        '<p class="pet-specie">' + pet.species + '</p>' +
        '<p class="pet-meta">' + age + '</p>' +
      '</div>';
    fragment.appendChild(li);
  }
  container.appendChild(fragment);
}

function renderGreeting() {
  var greetingElement = document.getElementById('user-greeting');
  if (!greetingElement) return;
  greetingElement.textContent = '¡Hola, ' + getUserName() + '! 👋';
}


function createLucideIcons() {
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

function addPetBtnHandler() {
  const addPetBtn = document.querySelector('.pet-add-card');
if (addPetBtn) {
  addPetBtn.addEventListener('click', () => {
    window.location.href = './pages/mascotas.html';
  });
}
}

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
    createLucideIcons();
    addPetBtnHandler();
    renderUserProfile();

    var tipLink = document.querySelector('.tip-of-the-day__button');
    if (tipLink) {
      tipLink.addEventListener('click', function() {
        updateTipOfTheDay();
      });
    }
  } catch (error) {
    console.error('Error al inicializar el dashboard:', error);
  }
}

document.addEventListener('DOMContentLoaded', initDashboard);