const taskForm = document.querySelector("#task-form");
const taskPet = document.querySelector("#task-pet");
const taskTitle = document.querySelector("#task-title");
const taskDescription = document.querySelector("#task-description");
const taskDate = document.querySelector("#task-date");
const taskTime = document.querySelector("#task-time");
const taskMessage = document.querySelector("#task-message");
const tasksList = document.querySelector("#tasks-list");
const filterButtons = document.querySelectorAll("[data-filter]");

let currentFilter = "all";

seedInitialData();

function showTaskMessage(message, type = "") {
  if (!taskMessage) {
    return;
  }

  taskMessage.textContent = message;
  taskMessage.className = type;
}

function getPetNameById(petId) {
  const pets = getPets();
  const pet = pets.find((item) => item.id === petId || item.name === petId);

  return pet ? pet.name : "Mascota";
}

function renderPetOptions() {
  if (!taskPet) {
    return;
  }

  const pets = getPets();
  const options = pets.map((pet) => {
    return `<option value="${escapeHTML(pet.id)}">${escapeHTML(pet.name)}</option>`;
  });

  taskPet.innerHTML = `
    <option value="">Seleccionar mascota</option>
    ${options.join("")}
  `;
}

function getFilteredTasks(tasks, filter) {
  if (filter === "all") {
    return tasks;
  }

  return filterTasksByVisualStatus(tasks, filter);
}

function renderTaskCard(task) {
  const visualStatus = getTaskVisualStatus(task);
  const petName = getPetNameById(task.petId);
  const date = formatDateToDisplay(task.date);
  const time = formatTimeToDisplay(task.time);
  const description = task.description || "Sin descripcion cargada.";
  const doneAction = task.status !== "done"
    ? `
      <footer class="task-card-actions">
        <button
          class="btn btn-primary"
          type="button"
          data-done="${escapeHTML(task.id)}"
        >
          Marcar realizada
        </button>
      </footer>
    `
    : "";

  return `
    <article class="card task-card">
      <header class="task-card-header">
        <section>
          <h3>${escapeHTML(task.title)}</h3>
          <p>
            ${escapeHTML(petName)} &middot;
            ${escapeHTML(date)} &middot;
            ${escapeHTML(time)}
          </p>
        </section>

        <p class="badge ${escapeHTML(visualStatus.badgeClass)}">
          ${escapeHTML(visualStatus.label)}
        </p>
      </header>

      <p>${escapeHTML(description)}</p>

      ${doneAction}
    </article>
  `;
}

function renderTasks(filter = currentFilter) {
  if (!tasksList) {
    return;
  }

  currentFilter = filter;

  const tasks = sortTasksByDate(getTasks());
  const filteredTasks = getFilteredTasks(tasks, filter);
  const content = filteredTasks.length > 0
    ? filteredTasks.map(renderTaskCard).join("")
    : '<p class="empty-state">No hay tareas para mostrar.</p>';

  tasksList.innerHTML = `
    <h2>Listado de tareas</h2>
    ${content}
  `;
}

function handleTaskSubmit(event) {
  event.preventDefault();

  const taskData = {
    petId: taskPet.value,
    title: taskTitle.value,
    description: taskDescription.value,
    date: taskDate.value,
    time: taskTime.value,
    status: "pending"
  };

  const createdTask = addTask(taskData);

  if (!createdTask) {
    showTaskMessage("Completa los campos obligatorios.", "overdue");
    return;
  }

  taskForm.reset();
  showTaskMessage("Tarea creada correctamente.", "upcoming");
  renderTasks(currentFilter);
}

function handleTaskFilter(event) {
  const button = event.target.closest("[data-filter]");

  if (!button) {
    return;
  }

  renderTasks(button.dataset.filter);
}

function handleMarkTaskAsDone(taskId) {
  const updatedTask = markTaskAsDone(taskId);

  if (!updatedTask) {
    showTaskMessage("No se pudo actualizar la tarea.", "overdue");
    return;
  }

  showTaskMessage("Tarea marcada como realizada.", "upcoming");
  renderTasks(currentFilter);
}

if (taskForm) {
  taskForm.addEventListener("submit", handleTaskSubmit);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", handleTaskFilter);
});

if (tasksList) {
  tasksList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-done]");

    if (button) {
      handleMarkTaskAsDone(button.dataset.done);
    }
  });
}

renderPetOptions();
renderTasks();
