# 📖 Ejemplo Práctico: Flujo Completo (CRUD de Usuarios)

Este documento sirve como registro y guía de cómo se ejecutó el flujo completo de desarrollo, documentación y publicación para la creación de un feature real (CRUD de Usuarios en NestJS), integrando convenciones modernas y nuestras herramientas en Obsidian.

---

## 1. Inicio del Desarrollo (Git & CLI)
El proceso comenzó aislando el trabajo en una rama dedicada. Esto previene conflictos y nos permite enviar un Pull Request limpio.

```bash
# 1. Crear y cambiar a la rama
git checkout -b feature/users-crud

# 2. Navegar al backend
cd backend

# 3. Generar el esqueleto del código con NestJS CLI
npx @nestjs/cli g module users
npx @nestjs/cli g controller users --no-spec
npx @nestjs/cli g service users --no-spec
cd ..
```
*Se omitieron los archivos de test (`--no-spec`) por simplicidad en este ejemplo.*

---

## 2. Documentación Arquitectónica (Obsidian Canvas)
En lugar de depender solo de texto, se creó un **Canvas Arquitectónico** (`Canvas-Feature-Usuarios.canvas`) dentro de Obsidian.
Este lienzo sirve para visualizar cómo se conectan las capas del código que acabamos de generar:
- **Entidad**: El modelo de datos.
- **DTOs**: Los objetos de transferencia y validación.
- **Servicio**: La lógica de negocio.
- **Controlador**: Las rutas HTTP expuestas.

Este diagrama visual ayuda enormemente a que otros desarrolladores (o tú mismo en el futuro) entiendan de un vistazo la arquitectura de la feature.

---

## 3. Documentación del PR (Markdown en Obsidian)
Se creó el archivo `feature-users-crud.md` en la carpeta `2-Docs-PullRequests/`. Este documento contiene el cuerpo exacto que se enviará a GitHub para explicar el PR.

Se utilizó un formato limpio y el uso de Emojis para una lectura amena:
```markdown
# ✨ Feature: CRUD de Usuarios Básicos

## 📝 Descripción
Este Pull Request implementa la funcionalidad base...
(Ver archivo para el detalle completo)
```

---

## 4. Empaquetado y Versionado (Conventional Commits)
Al momento de confirmar los cambios en Git, se siguió el estándar de [Conventional Commits](https://www.conventionalcommits.org/) combinado con **emojis**. Esto permite identificar rápidamente el propósito del código en el historial.

```bash
# Agregar todos los archivos (código, canvas, documentación)
git add .

# Crear el commit semántico
git commit -m "✨ feat: implementar CRUD de usuarios basico"

# Subir la rama a GitHub
git push -u origin feature/users-crud
```

---

## 5. Sincronización y Orquestación Final (El Script)
Por último, en lugar de ir a la web de GitHub a copiar, pegar y crear el PR manualmente, y luego ir al Kanban de Obsidian a pegar la URL, ejecutamos nuestro script directamente usando Node.

Le indicamos al script:
1. Qué documento leer.
2. Qué título ponerle al PR.
3. A qué Tablero enviarlo (`Tablero-Features`).

```bash
node sync-pr.js "feature-users-crud.md" "✨ Feat: CRUD de Usuarios" "Tablero-Features"
```

**✅ Resultados Automáticos**:
1. Se hizo la llamada al GitHub CLI (`gh`).
2. Se inyectó el Markdown de Obsidian en GitHub.
3. El PR se publicó con éxito.
4. El archivo `1-Tickets-y-Kanban/Tablero-Features.md` fue modificado inyectando la tarea justo debajo de `## In review` enlazando a la URL retornada por GitHub.
