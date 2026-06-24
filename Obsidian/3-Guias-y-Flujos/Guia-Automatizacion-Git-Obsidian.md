# Guía Completa de Automatización: Obsidian + GitHub CLI + Kanban

Esta guía explica el porqué, el cómo y el funcionamiento del flujo de trabajo automatizado que conecta tu bóveda local de Obsidian con tu repositorio de GitHub y tu tablero de tareas Kanban.

---

## 1. ¿Por qué usar este flujo de automatización?

Al desarrollar software, la sincronización entre la documentación técnica, el estado del tablero de gestión (Kanban) y el código en GitHub suele requerir procesos manuales redundantes. Esta automatización permite:
* **Documentar primero**: Escribes la explicación técnica en formato Markdown dentro de Obsidian.
* **Cero fricción**: El script crea el Pull Request en GitHub usando el contenido de tu nota técnica directamente como descripción/body.
* **Actualización en tiempo real**: Tu tablero Kanban local en Obsidian se actualiza automáticamente con el enlace del nuevo Pull Request en la sección "In review".
* **Centralización**: Todo tu conocimiento, tareas y enlaces a código quedan conectados dentro de tu herramienta personal de notas.

---

## 2. Requisitos Previos

Para que todo funcione correctamente, tu sistema debe contar con:
1. **Node.js**: Para ejecutar el script de automatización (`sync-pr.js`).
2. **GitHub CLI (`gh`)**: La interfaz de comandos de GitHub.
   * Debes estar autenticado en tu terminal ejecutando:
     ```bash
     gh auth login
     ```
3. **Obsidian** con los siguientes plugins de la comunidad activos:
   * **Kanban** (para renderizar de manera visual el archivo [`Tablero.md`](file:///c:/Users/Alexis/Desktop/prueba_obsi/Obsidian/1-Tickets-y-Kanban/Tablero.md)).
   * **GitHub Link** (opcional, para enriquecer visualmente los enlaces de GitHub en tus notas).

---

## 3. Estructura del Proyecto

El repositorio tiene la siguiente estructura clave:

```text
├── Obsidian/
│   ├── 1-Tickets-y-Kanban/
│   │   └── Tablero.md          # Tablero Kanban visual con sintaxis compatible
│   ├── 2-Docs-PullRequests/
│   │   ├── ejemplo-doc.md      # Ejemplos de notas de desarrollo
│   │   └── nest-setup.md
│   ├── 3-Guias-y-Flujos/
│   │   └── Guia-Automatizacion-Git-Obsidian.md  # Esta guía
│   └── Sin título.canvas       # Lienzo visual interactivo del flujo
├── backend/                    # Proyecto de código (ej. NestJS)
├── sync-pr.js                  # Script orquestador Node.js
├── package.json                # Configuración de npm y comandos abreviados
└── .gitignore                  # Evita subir tokens locales (.obsidian) a Git
```

---

## 4. Paso a Paso del Flujo Real de Trabajo

Cuando vas a desarrollar un nuevo feature o corrección, el flujo a seguir es el siguiente:

### Paso 1: Crear una rama de Git
No trabajes directamente sobre `main`. Crea una rama descriptiva para tu tarea:
```bash
git checkout -b feature/nombre-del-feature
```

### Paso 2: Desarrollar código y escribir documentación
1. Escribe tu código (por ejemplo, dentro del directorio [`backend/`](file:///c:/Users/Alexis/Desktop/prueba_obsi/backend/)).
2. Crea una nota en `Obsidian/2-Docs-PullRequests/` explicando lo que hace el código (por ejemplo: `mi-cambio.md`). Esta nota servirá como la descripción de tu PR.

### Paso 3: Confirmar y subir los cambios a GitHub
Prepara tus archivos, haz un commit y sube la rama a tu repositorio remoto:
```bash
git add .
git commit -m "feat: implementar mi-cambio y agregar documentación"
git push -u origin feature/nombre-del-feature
```

### Paso 4: Ejecutar el script orquestador
Ejecuta el script usando el comando simplificado de npm:
```bash
npm run sync-pr -- "mi-cambio.md" "Título descriptivo de mi Pull Request"
```

---

## 5. Explicación Técnica del Script (`sync-pr.js`)

El script orquestador en Node.js hace lo siguiente:
1. **Lee la nota técnica**: Usa `fs.readFileSync` para importar el texto plano de la nota de Obsidian especificada en los argumentos.
2. **Ejecuta GitHub CLI de forma segura**: Usa `child_process.execSync` para correr:
   ```bash
   gh pr create --title "Título del PR" --body-file -
   ```
   * *Detalle importante*: Usamos `--body-file -` que lee el contenido directamente desde la entrada estándar (`stdin`). Esto evita que si tu documentación es muy larga o tiene caracteres especiales, el comando de la terminal falle o se trunque.
3. **Captura la URL del PR**: Lee la respuesta exitosa del comando `gh`, que contiene la URL oficial del PR.
4. **Modifica el archivo Kanban**: Lee [`Tablero.md`](file:///c:/Users/Alexis/Desktop/prueba_obsi/Obsidian/1-Tickets-y-Kanban/Tablero.md), busca la línea exacta con el encabezado `## In review` e inserta debajo una nueva tarea Markdown (`- [ ] [PR: Título](URL)`) conservando el formato visual del plugin Kanban de Obsidian.
