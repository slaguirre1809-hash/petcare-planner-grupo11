# PetCare Planner

Aplicación web para organizar el cuidado diario de mascotas, con foco en tareas, recordatorios y seguimiento del estado de cada cuidado.

---

## Tabla de contenidos

- [1. Descripción](#1-descripción)
- [2. Objetivo del proyecto](#2-objetivo-del-proyecto)
- [3. Integrantes](#3-integrantes)
- [4. Tecnologías utilizadas](#4-tecnologías-utilizadas)
- [5. Funcionalidades principales](#5-funcionalidades-principales)
- [6. Estructura del proyecto](#6-estructura-del-proyecto)
- [7. Arquitectura y organización del código](#7-arquitectura-y-organización-del-código)
- [8. Instrucciones de uso (usuario)](#8-instrucciones-de-uso-usuario)
- [9. Instalación y ejecución local (desarrollo)](#9-instalación-y-ejecución-local-desarrollo)
- [10. Deploy en Vercel](#10-deploy-en-vercel)
- [11. Persistencia de datos](#11-persistencia-de-datos)
- [12. Estado del proyecto / alcance MVP](#12-estado-del-proyecto--alcance-mvp)
- [13. Uso de IA](#13-uso-de-ia)
- [14. Links](#14-links)
- [15. Posibles mejoras futuras](#15-posibles-mejoras-futuras)
- [16. Licencia](#16-licencia)

---

## 1. Descripción

**PetCare Planner** es una aplicación web pensada para organizar los cuidados diarios de nuestras mascotas.  
Permite llevar un registro claro de necesidades importantes como:

- aplicación de vacunas,
- visitas al veterinario,
- paseos,
- baños,
- administración de medicamentos.

La app funciona como una herramienta de organización personal enfocada en el bienestar animal, para que no se pase por alto ninguna fecha importante.

---

## 2. Objetivo del proyecto

Construir un **MVP funcional, simple y claro** (HTML + CSS + JavaScript vanilla) que permita:

- registrar mascotas,
- planificar tareas de cuidado,
- hacer seguimiento de estados (pendiente, vencida, realizada),
- visualizar información de manera rápida y amigable.

---

## 3. Integrantes

- **Almiron, Luca**
- **[Apellido, Nombre]**
- **[Apellido, Nombre]**

> Reemplazar los placeholders por nombres reales antes de la entrega final.

---

## 4. Tecnologías utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**
- **LocalStorage** (persistencia en navegador)

---

## 5. Funcionalidades principales

### 5.1 Gestión de mascotas
- Registro de una o varias mascotas.
- Perfil por mascota con datos básicos y de salud.
- Edición de información de mascota.

### 5.2 Agenda centralizada
- Alta de tareas de cuidado con fecha y hora.
- Asociación de cada tarea a una mascota.

### 5.3 Seguimiento de tareas
- Marcado de tareas como realizadas.
- Separación visual de tareas activas y completadas.

### 5.4 Filtros por estado
- Visualización por estado:
  - pendientes,
  - vencidas,
  - realizadas,
  - próximas / hoy (según pantalla).

### 5.5 UI por tarjetas
- Lectura rápida con estilos diferenciados:
  - **Vencida**
  - **Hoy**
  - **Próxima**
  - **Realizada**

---

## 6. Estructura del proyecto

```txt
petcare-planner-grupo11/
├─ index.html
├─ pages/
│  ├─ mascotas.html
│  └─ agenda.html
├─ assets/
│  ├─ css/
│  │  ├─ base.css
│  │  ├─ components.css
│  │  ├─ index.css
│  │  ├─ mascotas.css
│  │  └─ agenda.css
│  ├─ js/
│  │  ├─ data.js
│  │  ├─ utils.js
│  │  ├─ storage.js
│  │  ├─ index.js
│  │  ├─ mascotas.js
│  │  ├─ agenda.js
│  │  └─ layout.js
│  └─ img/
│     └─ ...
└─ README.md
```

---

## 7. Arquitectura y organización del código

### JavaScript
- `data.js`: datos iniciales.
- `utils.js`: helpers puros reutilizables.
- `storage.js`: lectura/escritura y operaciones de datos en LocalStorage.
- `index.js`, `mascotas.js`, `agenda.js`: lógica de cada página.
- `layout.js`: render compartido de navegación/footer.

### CSS
- `base.css`: reset, variables, estilos globales.
- `components.css`: componentes reutilizables (botones, cards, nav, etc).
- `index.css`, `mascotas.css`, `agenda.css`: estilos específicos por página.

---

## 8. Instrucciones de uso (usuario)

1. **Registrar mascota**
   - Ir a la sección **Mascotas**.
   - Completar datos del perfil y guardar.

2. **Crear tarea de cuidado**
   - Ir a **Agenda**.
   - Seleccionar mascota, escribir la tarea y definir fecha/hora.

3. **Control diario**
   - Revisar estados en Inicio/Agenda:
     - Vencida,
     - Hoy,
     - Próxima.

4. **Marcar realizada**
   - En cada tarjeta de tarea, usar la acción **Marcar realizada** al completar el cuidado.

---

## 9. Instalación y ejecución local (desarrollo)

Como es un proyecto estático, podés abrir `index.html` directamente.  
Para una experiencia más estable, se recomienda levantar servidor local.

### Opción A: VS Code + Live Server
1. Instalar extensión **Live Server**.
2. Abrir el proyecto.
3. Clic derecho en `index.html` → **Open with Live Server**.

### Opción B: servidor simple con Node
```bash
npx serve .
```

---

## 10. Deploy en Vercel

### Requisitos
- Cuenta en [Vercel](https://vercel.com/).
- Repositorio en GitHub.

### Pasos
1. Subir proyecto a GitHub.
2. En Vercel: **Add New Project**.
3. Importar repositorio.
4. Framework preset: **Other**.
5. Build command: *(vacío)*.
6. Output directory: *(vacío, root estático)*.
7. Deploy.

### Configuración recomendada
Como es una app estática, no requiere variables de entorno ni build pipeline.

---

## 11. Persistencia de datos

La aplicación guarda datos en **LocalStorage** del navegador.

- Ventaja: no requiere backend para el MVP.
- Limitación: los datos quedan ligados al navegador/dispositivo.
- Si se limpia caché/localStorage, se pierden datos locales.

---

## 12. Estado del proyecto / alcance MVP

✅ Incluido en MVP:
- Gestión básica de mascotas.
- Agenda con creación y seguimiento de tareas.
- Filtros por estado.
- UI responsive (desktop + mobile).

🚧 Fuera de alcance actual (futuro):
- Sistema real de notificaciones push.
- Sincronización en la nube / multiusuario.
- Historial clínico avanzado.
- Integración con calendario externo.

---

## 13. Uso de IA

- Informe/documentación de uso de IA:
  - **[link al informe]**

> Reemplazar por el enlace real del informe antes de publicar.

---

## 14. Links

- **Repositorio:** [link]
- **Deploy (Vercel):** [link]

> Reemplazar por enlaces reales.

---

## 15. Posibles mejoras futuras

- Login de usuarios y perfiles múltiples.
- Exportación de agenda (PDF/ICS).
- Recordatorios por email/WhatsApp.
- Adjuntar estudios/recetas por mascota.
- Dashboard de métricas de cuidado.

---

## 16. Licencia

Definir licencia del proyecto (por ejemplo MIT) según criterio del equipo/cátedra.
