# ✨ Feature: CRUD de Usuarios Básicos

## 📝 Descripción
Este Pull Request implementa la funcionalidad base para la gestión de usuarios (Crear, Leer, Actualizar, Borrar) utilizando el generador de recursos de NestJS.

## 🛠️ Cambios Realizados
- [x] Generación del módulo `UsersModule`.
- [x] Creación del controlador `UsersController` con las rutas RESTful (`GET`, `POST`, `PATCH`, `DELETE`).
- [x] Creación del servicio `UsersService` con la lógica de negocio (mockeada por el momento).
- [x] Definición de los DTOs básicos (`CreateUserDto` y `UpdateUserDto`).
- [x] Definición de la entidad `User`.

## 🎨 Flujo de Trabajo Demostrado
- **Branch**: `feature/users-crud`
- **Commit**: `✨ feat: implementar CRUD de usuarios básico`
- **Integración Kanban**: Automatizado al `Tablero-Features.md`.

## ⚠️ Próximos Pasos
Conectar los servicios generados a una base de datos real (ej. PostgreSQL con TypeORM o Prisma) en futuros PRs.
