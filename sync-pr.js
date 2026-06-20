const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Validar argumentos de entrada
const docFileName = process.argv[2];
const prTitle = process.argv[3];

if (!docFileName || !prTitle) {
  console.error('Error: Faltan argumentos.');
  console.error('Uso: node sync-pr.js "<nombre-del-archivo.md>" "<Título del PR>"');
  process.exit(1);
}

// Asegurar que el nombre tenga la extensión .md
const normalizedDocName = docFileName.endsWith('.md') ? docFileName : `${docFileName}.md`;
const docPath = path.join(__dirname, 'Obsidian', '2-Docs-PullRequests', normalizedDocName);
const kanbanPath = path.join(__dirname, 'Obsidian', '1-Tickets-y-Kanban', 'Tablero.md');

// 2. Lectura de Documentación usando el módulo fs
if (!fs.existsSync(docPath)) {
  console.error(`Error: El archivo de documentación no existe en la ruta: ${docPath}`);
  process.exit(1);
}

let docContent;
try {
  docContent = fs.readFileSync(docPath, 'utf8');
} catch (error) {
  console.error(`Error al leer el archivo de documentación: ${error.message}`);
  process.exit(1);
}

// 3. Verificar si GitHub CLI (gh) está instalado y autenticado
try {
  execSync('gh auth status', { stdio: 'ignore' });
} catch (error) {
  console.error('Error: GitHub CLI (gh) no está instalado o no está autenticado.');
  console.error('Por favor, ejecuta "gh auth login" antes de usar este script.');
  process.exit(1);
}

// 4. Creación del Pull Request (CLI)
console.log(`Creando Pull Request: "${prTitle}"...`);
let prUrl;
try {
  // Ejecutamos gh pr create pasando el contenido del archivo .md como body vía stdin
  // El flag --body-file - le indica a gh que lea el cuerpo desde la entrada estándar (stdin)
  const command = `gh pr create --title "${prTitle.replace(/"/g, '\\"')}" --body-file -`;
  
  const stdout = execSync(command, {
    input: docContent,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'inherit'] // pipe stdin para el input, pipe stdout para capturar la URL, heredamos stderr
  });
  
  prUrl = stdout.trim();
  if (!prUrl) {
    throw new Error('La salida del comando gh pr create está vacía.');
  }
  console.log(`PR creado exitosamente: ${prUrl}`);
} catch (error) {
  console.error(`Error al crear el Pull Request en GitHub: ${error.message}`);
  process.exit(1);
}

// 5. Actualización del Tablero Kanban
if (!fs.existsSync(kanbanPath)) {
  console.error(`Error: El tablero Kanban no existe en la ruta: ${kanbanPath}`);
  process.exit(1);
}

try {
  let kanbanContent = fs.readFileSync(kanbanPath, 'utf8');
  
  // Buscar específicamente la línea de ## In review
  const lines = kanbanContent.split(/\r?\n/);
  const targetHeader = '## In review';
  const headerIndex = lines.findIndex(line => line.trim() === targetHeader);
  
  if (headerIndex === -1) {
    console.error(`Error: No se encontró la sección "${targetHeader}" en el tablero Kanban.`);
    process.exit(1);
  }
  
  // Insertar la nueva tarea justo en la línea siguiente
  const newTaskLine = `- [ ] [PR: ${prTitle}](${prUrl})`;
  lines.splice(headerIndex + 1, 0, newTaskLine);
  
  fs.writeFileSync(kanbanPath, lines.join('\n'), 'utf8');
  console.log(`Tablero Kanban actualizado con éxito. Se agregó la tarea: ${newTaskLine}`);
} catch (error) {
  console.error(`Error al actualizar el tablero Kanban: ${error.message}`);
  process.exit(1);
}
