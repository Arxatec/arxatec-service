  # Contributing to Arxatec Service

  ## Development Conventions

  ### Using Conventional Commits and Gitemoji

  To maintain a clear commit structure, follow the **Conventional Commits** standard along with **Gitemoji**.

  **Example of a bad commit:**

  ```sh
  git commit -m "Added something"
  ```

  **Example of a good commit:**

  ```sh
  git commit -m "feat: :sparkles: Added forgot password and dashboard page"
  ```

  More information:

  - [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
  - [Gitemoji](https://gitmoji.dev/)

  ### Branch Naming Convention

  Use the following structure for naming branches:

  ```sh
  git branch <category/reference/description-in-kebab-case>
  ```

  **Example:**

  ```sh
  git branch feature/create-new-button-component
  ```

  More information:

  - [Git Branch and Commit Naming Conventions](https://dev.to/varbsan/a-simplified-convention-for-naming-branches-and-commits-in-git-il4)

  ---

  ## Project Architecture

    ##ENDPOINT creation process

  -1st the DTOs are created (format is established), 2nd the service is created (using the defined DTOs), 3rd the repository is created (Data Access, if CRUD is necessary), 4th the presentation (Controllers and Routes) where the controllers and the route are assigned (ENDPOINT)

  Arxatec Service follows **Clean Architecture**, ensuring modularity and separation of concerns. Below is the structure:

  ```
  └── src
    ├── index.ts                                  # Punto de entrada de la aplicación.
    ├── prismaClient.ts                           # Inicialización y configuración del cliente Prisma.
    ├── routes.ts                                 # Definición principal de rutas (importa rutas de cada módulo).
    ├── config/                                   # Configuración general del proyecto
    │   ├── index.ts                              # Archivo principal de configuración
    │   ├── email/
    │   │   ├── index.ts                          # Configuración de Nodemailer
    │   │   ├── email_sender.ts                   # Función para enviar emails
    │   ├── external_services/
    │   │   └── index.ts                          # Configuración de servicios externos
    │   ├── jwt/
    │   │   ├── index.ts                          # Configuración de JWT (generación/verificación)
    │   ├── env.ts                                # Validación de variables de entorno
    ├── constants/                                # Constantes del sistema
    │   ├── index.ts                              # Archivo principal de constantes
    │   ├── http_status_codes/
    │   │   └── index.ts                          # Códigos HTTP centralizados
    │   ├── messages/
    │   │   ├── index.ts                          # Mensajes generales
    │   │   ├── auth.ts                           # Mensajes de autenticación
    │   │   ├── bot.ts                            # Mensajes del bot
    │   │   └── waitlist.ts                       # Mensajes de la lista de espera
    ├── docs/
    │   └── swagger.ts                            # Documentación API con Swagger
    ├── middlewares/                              # Middlewares de Express
    │   ├── index.ts                              # Archivo principal de middlewares
    │   ├── async_handler/
    │   │   └── index.ts                          # Middleware para manejar async/await
    │   ├── authenticate_token/
    │   │   └── index.ts                          # Middleware de autenticación JWT
    ├── modules/                                  # Módulos de la aplicación
    │   ├── auth/                                 # Módulo de autenticación
    │   │   ├── data/
    │   │   │   ├── repository/
    │   │   │   │   ├── auth.repository.ts        # Repositorio de autenticación
    │   │   ├── domain/
    │   │   │   ├── dtos/
    │   │   │   │   ├── forgot_password.dto.ts    # DTO para olvido de contraseña
    │   │   │   │   ├── login.dto.ts              # DTO para login
    │   │   │   │   ├── register.dto.ts           # DTO para registro
    │   │   │   │   ├── reset_password.dto.ts     # DTO para reset de contraseña
    │   │   │   ├── entities/
    │   │   │   │   ├── user.entity.ts            # Entidad usuario
    │   │   ├── presentation/
    │   │   │   ├── controllers/
    │   │   │   │   ├── auth.controller.ts        # Controlador de autenticación
    │   │   │   ├── routes/
    │   │   │   │   ├── auth.routes.ts            # Rutas de autenticación
    │   │   │   ├── services/
    │   │   │   │   ├── auth.service.ts           # Lógica de negocio de autenticación
    │   ├── email/                                # Módulo de emails
    │   │   ├── data/
    │   │   │   ├── repository/
    │   │   │   │   ├── email.repository.ts       # Repositorio de emails
    │   │   ├── domain/
    │   │   │   ├── dtos/
    │   │   │   │   ├── bulk_email.dto.ts         # DTO para emails masivos
    │   │   │   │   ├── email.dto.ts              # DTO para emails individuales
    │   │   ├── presentation/
    │   │   │   ├── controllers/
    │   │   │   │   ├── email.controller.ts       # Controlador de emails
    │   │   │   ├── routes/
    │   │   │   │   ├── email.routes.ts           # Rutas de emails
    │   │   │   ├── services/
    │   │   │   │   ├── email.service.ts          # Lógica de negocio para emails
    │   ├── user/                                 # Módulo de usuarios
    │   │   ├── data/
    │   │   │   ├── repository/
    │   │   │   │   ├── user.repository.ts        # Repositorio de usuarios
    │   │   ├── domain/
    │   │   │   ├── dtos/
    │   │   │   │   ├── update_user.dto.ts        # DTO para actualizar usuario
    │   │   │   ├── entities/
    │   │   │   │   ├── user.entity.ts            # Entidad usuario (extendida)
    │   │   ├── presentation/
    │   │   │   ├── controllers/
    │   │   │   │   ├── user.controller.ts        # Controlador de usuario
    │   │   │   ├── routes/
    │   │   │   │   ├── user.routes.ts            # Rutas de usuario
    │   │   │   ├── services/
    │   │   │   │   ├── user.service.ts           # Lógica de negocio de usuarios
    ├── utils/                                    # Utilidades generales
    │   ├── index.ts                              # Archivo principal de utilidades
    │   ├── build_http_response/
    │   │   ├── index.ts                          # Helper para formatear respuestas HTTP
    │   ├── errors/
    │   │   ├── index.ts                          # Manejo de errores globales
    │   ├── error_handler/
    │   │   ├── index.ts                          # Middleware de manejo de errores
    │   ├── test_email/
    │   │   ├── index.ts                          # Prueba de envío de emails



  ```

  ### Explanation:

  - **`middlewares/`**: Contains middlewares like error handlers or authentication.
  - **`modules/`**: Each module represents a domain entity.
    - **`data/repository/`**: Manages database interactions via Prisma ORM.
    - **`domain/`**: Defines the business logic.
      - **`dtos/`**: Data Transfer Objects for input validation.
      - **`entities/`**: Core business entities.
    - **`presentation/`**: Handles API interactions.
      - **`controllers/`**: Processes HTTP requests and invokes services.
      - **`routes/`**: Defines HTTP routes for the module.
    - **`services/`**: Implements business logic and interacts with repositories.
  - **`index.ts`**: Main entry point of the backend.
  - **`routes.ts`**: Aggregates and exports all defined routes.

  ### Naming Conventions:

  - Use **English** for all names.
  - Folder names follow **lowerCamelCase** or **snake_case**.
    - Example: `cases/`, `user_lawyer/`
  - Controller files follow **dot notation**: `user.controller.ts`

  By following these guidelines, we ensure a scalable and maintainable codebase. 🚀
