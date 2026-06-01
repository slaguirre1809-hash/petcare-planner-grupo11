# Informe de Uso de IA

## 1. Datos del proyecto

- **Proyecto:** PetCare Planner
- **Materia / instancia:** IntegrarTEC
- **Equipo:** Grupo 11
- **Tecnologías:** HTML, CSS, JavaScript (vanilla), LocalStorage

---

## 2. Propósito del uso de IA

La IA se utilizó como herramienta de apoyo técnico y editorial para acelerar tareas de desarrollo, mejorar la calidad del código y fortalecer la consistencia visual/funcional del MVP.

No se usó IA para reemplazar decisiones del equipo, sino para:

1. proponer mejoras de implementación;
2. detectar inconsistencias;
3. refinar redacción y documentación;
4. validar criterios de UX/UI y responsive.

---

## 3. Alcance de uso en el proyecto

La asistencia con IA se aplicó principalmente en:

- **Refactor controlado de CSS:** orden, consistencia entre páginas (Inicio, Mascotas, Agenda), normalización de componentes reutilizables.
- **Mejoras de UX en Mascotas:** formularios, validaciones, microcopys y estados condicionales (fecha de nacimiento vs edad aproximada).
- **Integración visual progresiva:** navegación compartida, footer y ajustes de layout responsive.
- **Revisión funcional:** comprobación de no regresiones en selección de mascota, tabs, formularios, agenda y persistencia en LocalStorage.
- **Documentación:** generación y mejora de README, textos de interfaz y este informe.

---

## 4. Metodología de trabajo con IA

Se trabajó en ciclos cortos de:

1. **Definición de alcance acotado** (qué archivos se podían tocar y cuáles no).
2. **Diagnóstico previo** (revisión de estructura y dependencias antes de editar).
3. **Implementación controlada** (cambios mínimos, trazables y reversibles).
4. **Validación técnica** (`node --check`, `git diff --check`, pruebas manuales de flujos).
5. **Ajuste fino** según resultados visuales/funcionales.

Este enfoque permitió mantener estabilidad del MVP y evitar cambios de alto riesgo.

---

## 5. Aportes concretos de IA

### 5.1 Frontend (HTML/CSS)

- Unificación del patrón responsive de navegación (sidebar desktop + bottom nav mobile).
- Ajustes de consistencia visual entre páginas sin rediseñar la app.
- Limpieza progresiva de CSS por PRs pequeños (tokens, formularios, botones, badges, estados, empty states).
- Corrección de problemas de layout (incluyendo casos de overflow horizontal en mobile).

### 5.2 JavaScript

- Refactor de helpers puros hacia `utils.js` para mejorar organización.
- Mejora de validaciones y normalización de datos en formularios de Mascotas.
- Ajustes en Agenda para usar correctamente scripts globales compartidos.
- Revisión de retrocompatibilidad con datos existentes en LocalStorage.

### 5.3 Contenidos y documentación

- Mejora de textos visibles con español natural de Argentina (tildes, ñ, voseo en mensajes al usuario).
- Redacción de README técnico para uso académico y deploy en Vercel.
- Estructuración de reportes y criterios de aceptación por tarea.

---

## 6. Criterios de calidad aplicados

Para aceptar cambios propuestos con IA se exigió:

- no romper funcionalidades existentes;
- no modificar lógica fuera del alcance definido;
- mantener compatibilidad con LocalStorage;
- conservar arquitectura vanilla (sin frameworks ni bundlers);
- respetar mobile-first y evitar scroll horizontal;
- mantener accesibilidad básica (labels, textos claros, `aria-*` donde corresponde).

---

## 7. Límites y decisiones humanas

Las decisiones finales de producto y código fueron del equipo.  
La IA no tomó decisiones autónomas sobre:

- alcance académico del MVP;
- arquitectura general del proyecto;
- priorización funcional de entregas;
- aceptación final de cambios.

Todo cambio sugerido fue revisado, probado y validado manualmente antes de considerarse terminado.

---

## 8. Riesgos del uso de IA y mitigación

### Riesgos identificados

- introducir cambios fuera de alcance;
- inconsistencias entre páginas por refactors amplios;
- degradación de UX responsive;
- textos correctos técnicamente pero poco naturales para el contexto local.

### Mitigaciones aplicadas

- instrucciones de alcance por archivo;
- PRs chicos y secuenciales;
- validaciones obligatorias por cada etapa;
- revisión visual en desktop y mobile;
- ajuste de copy con criterio local (español de Argentina).

---

## 9. Resultado observado

El uso de IA permitió:

- acelerar iteraciones de mejora;
- reducir deuda técnica en CSS y utilidades JS;
- mantener estabilidad del MVP durante cambios sucesivos;
- elevar calidad de documentación y consistencia general del proyecto.

En términos académicos, la IA actuó como soporte de productividad y revisión, sin reemplazar la comprensión técnica ni la toma de decisiones del equipo.

---

## 10. Declaración final

Este proyecto utilizó IA de forma responsable, acotada y verificable.  
El equipo mantuvo control sobre análisis, implementación, pruebas y validación final de cada cambio.

---

## 11. Respuestas solicitadas por la cátedra

### 1) ¿Qué herramientas de IA utilizaron?

Durante el ciclo de desarrollo del proyecto, el equipo implementó principalmente dos enfoques:

- utilizamos **Open Code** funcionando como agente de programación especializado;
- complementamos el trabajo con un **chat conversacional estándar** para consultas rápidas y resolución de dudas puntuales.

### 2) ¿Para qué las utilizaron?

Open Code fue fundamental para generar el código base o “esqueleto” de los archivos principales.  
A partir de esa estructura inicial generada por el agente, nosotros nos encargamos de modificar, adaptar y refactorizar el código para que cumpliera con los requisitos específicos del proyecto.

Por otro lado, el chat tradicional se utilizó como herramienta de consulta para:

- entender bloques de código específicos;
- debatir la lógica detrás de problemas puntuales;
- contrastar alternativas de implementación.

Esta división también nos permitió optimizar el uso de tokens.

### 3) ¿Qué partes del proyecto fueron asistidas por IA?

De manera general, la IA tuvo presencia a lo largo de todo el proyecto.  
Se utilizó como asistente en las tres tecnologías principales (**HTML, CSS y JavaScript**), desde la maquetación inicial hasta la corrección de errores lógicos en funciones de JavaScript.

### 4) ¿Qué prompts o consultas les resultaron más útiles?

Los prompts que más valor aportaron fueron los orientados a la arquitectura inicial del proyecto.  
Por ejemplo:

> “Genera la estructura semántica base para un archivo `index.html` que incluirá un `header`, un `main` para dashboard y un `footer`.”

Este tipo de pedidos funcionó muy bien como punto de partida, ahorrando trabajo repetitivo y permitiendo enfocarnos en lógica y diseño.

### 5) ¿Qué respuestas de la IA tuvieron que corregir?

Tuvimos que intervenir manualmente para:

- solucionar problemas de codificación (por ejemplo, errores al renderizar la letra **ñ** o al interpretar emojis en el código);
- corregir el uso de etiquetas HTML no del todo semánticas para nuestro contexto;
- ajustar propiedades de posicionamiento en CSS (Flexbox/Grid) para respetar mockups y responsive.

### 6) ¿Qué problemas tuvieron al trabajar con IA?

El mayor inconveniente fue la pérdida de contexto en interacciones largas.  
En algunos casos, la IA olvidaba el objetivo principal o sugería cambios que rompían funcionalidades que ya estaban operativas.

Otro problema recurrente fue que, a veces, proponía métodos de JavaScript demasiado avanzados para el alcance del módulo, por lo que debimos pedir reescrituras con lógica más simple y alineada a los contenidos vistos.

### 7) ¿Qué aprendieron durante el proceso?

El desarrollo de **PetCare Planner** fue muy enriquecedor.

- A nivel técnico, aprendimos a integrar asistentes de IA en un entorno de desarrollo real y a trabajar mejor con repositorios en GitHub.
- A nivel metodológico, fortalecimos el trabajo en equipo.
- Para uno de los integrantes, este fue su primer proyecto grupal, lo que impulsó el uso de herramientas de gestión (como Trello) y de mockups para planificar antes de codificar.

### 8) ¿Qué partes del código puede explicar cada integrante?

- **Magalí:** responsable de la sección **Mascotas**, incluyendo lógica de creación de perfiles y renderizado de información.
- **Santiago:** responsable de la sección **Agenda**, incluyendo manejo de fechas, filtrado de tareas por estado y actualización de tareas.
- **Luca:** responsable del **Index** (página principal), incluyendo diseño del dashboard inicial, resumen de estadísticas y próximas tareas.

### 9) ¿Qué decisiones tomó el grupo sin depender de la IA?

El grupo tomó de forma autónoma decisiones clave de producto, arquitectura y alcance, entre ellas:

- definir el alcance del MVP (qué entra y qué queda para futuras versiones);
- establecer la división de responsabilidades por página (Index, Mascotas y Agenda);
- elegir mantener el proyecto en **HTML/CSS/JavaScript vanilla** sin frameworks externos;
- priorizar enfoque **mobile-first** y luego ajustes desktop;
- decidir criterios de UX (mensajes, tono, legibilidad de estados, consistencia visual);
- aprobar o rechazar sugerencias de IA según requisitos académicos, simplicidad y mantenibilidad.

### 10) ¿Hubo código sugerido por IA que descartaron? ¿Por qué?

Sí. En múltiples ocasiones se descartaron bloques completos de código.

Generalmente ocurrió cuando el prompt no incluía suficiente contexto o restricciones, y la IA devolvía soluciones alejadas del objetivo: lógicas demasiado complejas, uso de librerías externas no permitidas o enfoques poco alineados al MVP.

En esos casos, se priorizó una implementación más simple, clara y coherente con el objetivo del proyecto: resolver con **código nativo (Vanilla JS)** y contenidos vistos en clase.

---

## 12. Uso aplicado con Codex (asistencia técnica en este proyecto)

Además del uso general de IA indicado arriba, en este proyecto se utilizó **Codex** como asistente técnico continuo para tareas de implementación y refactor controlado.

### ¿Cómo se utilizó?

Se trabajó con un enfoque de iteraciones cortas:

1. definición de alcance por tarea;
2. diagnóstico de archivos afectados;
3. implementación limitada a archivos permitidos;
4. validaciones técnicas y revisión visual.

### ¿En qué aportó concretamente?

- ajustes de UI/UX en **Mascotas** (formularios, textos, estados y comportamiento responsive);
- mejoras de consistencia visual entre páginas (Index, Mascotas y Agenda);
- refactors progresivos de CSS por PRs acotados (sin rediseñar ni romper layout);
- normalización de helpers y organización de lógica JS;
- soporte en redacción técnica de documentación (README e informe IA).

### ¿Qué controles se aplicaron durante ese uso?

- restricciones explícitas de archivos por tarea;
- prioridad de no romper funcionalidad existente;
- verificación con comandos de chequeo (`node --check`, `git diff --check`);
- pruebas manuales de flujos críticos (crear/editar mascotas, agenda, navegación, responsive).

### Resultado del uso con Codex

El uso de Codex funcionó como apoyo de productividad y revisión técnica, ayudando a acelerar ajustes sin perder control del código.  
Las decisiones finales de arquitectura, alcance y aceptación de cambios siempre quedaron en el equipo.
