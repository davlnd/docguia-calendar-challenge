---

# 🗓️ DocGuía Calendar — Voice-First Scheduling

Mini-módulo de calendario semanal que emula el UI provisto en las capturas y agrega creación de citas mediante voz (voice-first).

---

## 🔗 Demo

* 🌐 URL: `<TU_URL_DEPLOY>`
* 💻 Repo: `<TU_REPO>`

> ⚠️ Para probar la funcionalidad de voz se recomienda **Google Chrome**.

---

## 🧱 Stack

* **Next.js (App Router)** + TypeScript
* **TailwindCSS**
* **Zustand** (estado de citas y semana activa)
* **Radix UI** (Drawer / componentes base)
* **Web Speech API (SpeechRecognition)** para captura de voz

---

## 🎯 Objetivo del Challenge

1. Emular fielmente el diseño del calendario provisto.
2. Implementar una experiencia **voice-first** para crear citas.
3. Manejar ambigüedades con criterio de producto.
4. Reflejar inmediatamente la cita creada en el calendario.

---

# 📅 Calendario

## Vista semanal

* Grid con slots de 30 minutos.
* Posicionamiento absoluto de citas según hora y duración.
* Indicador de **hora actual** (línea roja dinámica).
* Rango dinámico de semana (ej. `8 – 15 Feb`).
* Scroll vertical controlado.

---

# 🎤 Creación de citas por voz

## Flujo

1. Usuario presiona botón 🎤.
2. Se inicia grabación con **Web Speech API**.
3. Se obtiene transcripción.
4. Se interpreta el texto y se construye un **draft estructurado**.
5. Si hay ambigüedades → se muestran preguntas de aclaración.
6. Confirmación final.
7. Se crea la cita y se renderiza en el calendario.

---

# 🧠 Estrategia de interpretación

Se implementó una capa de parsing que:

* Detecta:

    * Fecha (hoy, mañana, día de la semana)
    * Hora (24h, 12h, am/pm)
    * Duración (ej: 30 minutos, media hora)
    * Paciente (ej: “con María”)
    * Motivo (ej: “por control”)

* Aplica defaults:

    * Duración por defecto: 30 minutos

---

# ⚠️ Manejo de Ambigüedades

Se priorizó reducir fricción sin crear errores:

| Caso                       | Resolución UX                              |
| -------------------------- | ------------------------------------------ |
| “A las 7”                  | Se solicita confirmar AM o PM              |
| “El miércoles en la tarde” | Se proponen horarios sugeridos             |
| Falta fecha                | Se ofrecen opciones rápidas (Hoy / Mañana) |
| Falta hora                 | Se sugieren horas comunes                  |

---

# 🛡️ Consideraciones técnicas

### Web Speech API

Se decidió utilizar Web Speech API por:

* Rapidez de implementación dentro del alcance del challenge
* Experiencia fluida en Chrome
* No requerir infraestructura externa

⚠️ Nota: Web Speech API puede presentar comportamiento inconsistente entre navegadores.
El demo está optimizado para **Google Chrome**.

---

# 📦 Instalación

```bash
pnpm install
pnpm dev
```

Abrir:

```
http://localhost:3000
```

---

# 🧪 Cómo probar

Ejemplos recomendados:

* “Crea una cita mañana a las 3pm con María Pérez por control”
* “Agéndame a Juan el viernes a las 9 por consulta”
* “Pon una cita el miércoles en la tarde con Carlos”
* “Agéndame a Ana a las 7”

---

# ✨ Bonus implementados

* Indicador visual de hora actual
* Manejo de ambigüedades con UI contextual
* Separación clara entre:

    * Captura de voz
    * Parsing
    * Confirmación
    * Creación en calendario

---

# 🧠 Decisiones de producto

* Prioricé claridad y control sobre automatización agresiva.
* Prefiero confirmar ambigüedades antes de crear una cita incorrecta.
* El usuario siempre ve el resumen estructurado antes de guardar.

---

# 📌 Conclusión

El objetivo fue construir una experiencia coherente con el producto existente, cuidando:

* Jerarquía visual
* Claridad de interacción
* Manejo realista de ambigüedades
* Responsabilidad sobre lo que se crea

---
