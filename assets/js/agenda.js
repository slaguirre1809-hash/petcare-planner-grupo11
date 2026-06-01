import { getTasks, saveTasks } from "./storage.js";

const taskForm = document.querySelector("#task-form");

const taskPet = document.querySelector("#task-pet");
const taskTitle = document.querySelector("#task-title");
const taskDescription = document.querySelector("#task-description");
const taskDate = document.querySelector("#task-date");
const taskTime = document.querySelector("#task-time");

const taskMessage = document.querySelector("#task-message");

const tasksList = document.querySelector("#tasks-list");

const filterButtons = document.querySelectorAll("[data-filter]");

let tasks = getTasks();

//CREAR MENSAJE DOM//

function showTaskMessage(message, type) {

    taskMessage.textContent = message;

    taskMessage.className = type;

}

//CREAR ESTADOS VISUALES//

function getTaskVisualStatus(task) {

    const today = new Date().toISOString().split("T")[0];

    if (task.status === "done") {
        return {
            text: "Realizada",
            className: "badge-purple"
        };
    }

    if (task.date < today) {
        return {
            text: "Vencida",
            className: "badge-danger"
        };
    }

    if (task.date === today) {
        return {
            text: "Hoy",
            className: "badge-warning"
        };
    }

    return {
        text: "Próxima",
        className: "badge-success"
    };

}

//RENDERIZAR TAREAS//

function renderTasks(filter = "all") {

    tasksList.innerHTML = "";

    if (tasks.length === 0) {

        tasksList.innerHTML = `
            <p>No hay tareas registradas.</p>
        `;

        return;
    }

    let filteredTasks = tasks;

    if (filter === "done") {

        filteredTasks = tasks.filter(task => task.status === "done");

    } else if (filter === "overdue") {

        const today = new Date().toISOString().split("T")[0];

        filteredTasks = tasks.filter(task =>
            task.status !== "done" &&
            task.date < today
        );

    } else if (filter === "today") {

        const today = new Date().toISOString().split("T")[0];

        filteredTasks = tasks.filter(task =>
            task.date === today
        );

    } else if (filter === "upcoming") {

        const today = new Date().toISOString().split("T")[0];

        filteredTasks = tasks.filter(task =>
            task.date > today &&
            task.status !== "done"
        );
    }

    filteredTasks.forEach(task => {

        const visualStatus = getTaskVisualStatus(task);

        tasksList.innerHTML += `
        
            <article class="card task-card">

                <header class="task-card-header">

                    <section>

                        <h3>${task.title}</h3>

                        <p>
                            ${task.petId} ·
                            ${task.date} ·
                            ${task.time}
                        </p>

                    </section>

                    <p class="badge ${visualStatus.className}">
                        ${visualStatus.text}
                    </p>

                </header>

                <p>${task.description}</p>

                <footer class="task-card-actions">

                    ${
                        task.status !== "done"
                        ?
                        `
                        <button
                            class="btn btn-primary"
                            data-done="${task.id}"
                        >
                            Marcar realizada
                        </button>
                        `
                        :
                        ""
                    }

                </footer>

            </article>
        
        `;
    });

}

//CREAR TAREAS//

function handleTaskSubmit(event) {

    event.preventDefault();

    if (
        !taskPet.value ||
        !taskTitle.value ||
        !taskDate.value
    ) {

        showTaskMessage(
            "Completa los campos obligatorios.",
            "overdue"
        );

        return;
    }

    const newTask = {

        id: crypto.randomUUID(),

        petId: taskPet.value,

        title: taskTitle.value,

        description: taskDescription.value,

        date: taskDate.value,

        time: taskTime.value,

        status: "pending"
    };

    tasks.push(newTask);

    saveTasks(tasks);

    renderTasks();

    showTaskMessage(
        "Tarea creada correctamente.",
        "upcoming"
    );

    taskForm.reset();

}

//FILTROS//

function handleTaskFilter(event) {

    const filter = event.target.dataset.filter;

    renderTasks(filter);

}

//MARCAR TAREA COMO REALIZADA//

function handleMarkTaskAsDone(taskId) {

    tasks = tasks.map(task => {

        if (task.id === taskId) {

            return {
                ...task,
                status: "done"
            };
        }

        return task;

    });

    saveTasks(tasks);

    renderTasks();

}

//EVENT LISTENERS//

taskForm.addEventListener(
    "submit",
    handleTaskSubmit
);

//FILTROS//

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        handleTaskFilter
    );

});

//BOTÓN REALIZADA//

tasksList.addEventListener("click", function(event) {

    const taskId = event.target.dataset.done;

    if (taskId) {

        handleMarkTaskAsDone(taskId);

    }

});

//RENDER INICIAL//

renderTasks();