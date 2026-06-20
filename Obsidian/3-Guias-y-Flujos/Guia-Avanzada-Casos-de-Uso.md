# Guía Avanzada: Casos de Uso y Múltiples Tableros Kanban

Esta guía expande la automatización para adaptarse a equipos y proyectos reales, donde no todo va a un único tablero, sino que se separa por contexto (ej. Features vs Bugs).

---

## 1. Múltiples Tableros (Features vs Bugs)

Hemos configurado **dos nuevos tableros Kanban** especializados en la carpeta `1-Tickets-y-Kanban`:
1. `Tablero-Features.md` 🚀: Para nuevas características y mejoras.
2. `Tablero-Bugs.md` 🐛: Para corrección de errores.

El script orquestador (`sync-pr.js`) ha sido actualizado para aceptar un **tercer parámetro opcional** que indica a qué tablero debe ir la tarea.

### Ejecución mediante NPM Scripts
En el archivo `package.json` hemos creado accesos directos (scripts) para facilitarte la vida:

* **Para enviar a Features**:
  ```bash
  npm run sync-pr:feature -- "doc-del-feature.md" "Feat: Nuevo Login"
  ```
* **Para enviar a Bugs**:
  ```bash
  npm run sync-pr:bug -- "doc-del-bug.md" "Fix: Botón roto en móvil"
  ```
* **Para enviar al Tablero General (Por defecto)**:
  ```bash
  npm run sync-pr -- "doc-general.md" "Docs: Actualización de README"
  ```

---

## 2. Ejemplos de Documentación y PRs (Cómo redactar en Obsidian)

Para que tus Pull Requests queden profesionales en GitHub directamente desde Obsidian, te sugerimos utilizar las siguientes plantillas al crear tus archivos en `Obsidian/2-Docs-PullRequests/`.

### Ejemplo A: Creando un nuevo Feature (ej. `feature-login.md`)

```markdown
# 🚀 Nuevo Feature: Autenticación OAuth con Google

## 📝 Descripción
Este Pull Request implementa la estrategia de autenticación de Google utilizando Passport.js en nuestro backend NestJS.

## 🛠️ Cambios Realizados
- [x] Configuración de variables de entorno (OAUTH_CLIENT_ID).
- [x] Creación del `AuthModule` y `GoogleStrategy`.
- [x] Endpoint `/auth/google/callback` expuesto.

## ⚠️ Puntos a revisar
Por favor revisen el manejo de errores cuando el usuario deniega los permisos en la pantalla de Google. ¿Deberíamos redirigir a una vista específica de error?
```

**Comando para sincronizar**:
```bash
npm run sync-pr:feature -- "feature-login.md" "Feat: Autenticación OAuth con Google"
```

---

### Ejemplo B: Solucionando un Bug (ej. `fix-crash-perfil.md`)

```markdown
# 🐛 Fix: Crash al cargar perfil sin imagen

## 🚨 Problema Original
Cuando un usuario que se registró en la versión antigua de la app intenta abrir su perfil, la app crashea con un error 500 porque `user.avatarUrl` es nulo y la vista intenta hacer un `.split()` de ese valor.

## 💡 Solución
- Se añadió un fallback (valor por defecto) de imagen en la serialización del usuario.
- Se agregó una validación de seguridad en el controlador `UsersController`.

## ✅ Pasos para probar
1. Iniciar sesión con un usuario legado (ID < 1000).
2. Navegar a `/perfil`.
3. Verificar que se carga el avatar por defecto y no hay error 500.
```

**Comando para sincronizar**:
```bash
npm run sync-pr:bug -- "fix-crash-perfil.md" "Fix: Crash al cargar perfil sin imagen"
```

---

## 3. Beneficios de esta Arquitectura Múltiple

1. **Orden Mental**: Tu canvas (`Sin título.canvas`) puede enlazar a diferentes tableros Kanban dependiendo del flujo visual.
2. **Especialización**: Los Bugs suelen requerir atención prioritaria. Al tener su propio tablero, puedes gestionar "Hotfixes" separados de tus "Features" a largo plazo.
3. **Escalabilidad**: Si mañana necesitas un `Tablero-DevOps.md`, solo tienes que crear el archivo y ejecutar `node sync-pr.js "doc.md" "Título" "Tablero-DevOps"`.
