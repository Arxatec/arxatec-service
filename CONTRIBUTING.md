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
  src/
  │── middlewares/                   # Middlewares ej.manejo de errores, validaciones autenticación; en desuso
  │   ├── async_handler/             
  │   │   └── index.ts               
  │   └── index.ts                  
  │── modules/                       # Módulos que representan las funcionalidades principales
  │   ├── cases/                     # Módulo de casos; aun falta configurar
  │   └── user/                      # Módulo de usuario
  │       ├── data/                  
  │       │   └── repository/        
  │       │       └── user.repository.ts  # Interacciones con la base de datos,
  │       ├── domain/                
  │       │   ├── dtos/                   # DTOs para manejar la validación/formato de datos
  │       │   │   ├── email.dto.ts         
  │       │   │   ├── login.dto.ts   
  │       │   │   ├── register.dto.ts
  │       │   │   └── update_user.dto.ts
  │       │   ├── entities/          
  │       │   │   └── user.entity.ts       # Entidad principal del usuario; En desuso
  │       ├── presentation/          
  │       │   ├── controllers/             # Lógica de presentación (controladores)
  │       │   │   ├── email.controller.ts 
  │       │   │   └── user.controller.ts  
  │       │   └── routes/            
  │       │       └── user.routes.ts  # Rutas de usuario
  │       └── services/               # Implementa lógica de negocios e interactúa con repositorios.
  │               └── user.service.ts    
  │       
  │  
  │── shared/                        # Lógica compartida entre módulos
  │   ├── config/                    # Configuración central (manejador de llaves, JWT, etc.)
  │   │   ├── jwt.ts                 # Archivo para manejar las llaves JWT
  │   │   └── email.ts               # Configuracion del servicio de correo/Conexion
  │   ├── utils/                     # Funciones utilitarias (validaciones, helpers)
  │   │   ├── emailSender.ts         # Construccion del correo/plantilla del mensaje
  │   │   └── testEmail              # Testeo que se envia el correo
  |   └── prismaClient.ts            # Conexión a Prisma Client
  │── index.ts                       # Punto de entrada principal(servidor Express)
  └── routes.ts                      # Manejador de las rutas                

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
