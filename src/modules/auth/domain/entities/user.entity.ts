  // src/modules/auth/domain/entities/user.entity.ts
  export class User {
    constructor(
      public id: number,
      public first_name: string,
      public last_name: string, 
      public email: string,
      public password: string,
      public status: string,
      public createdAt?: Date,
      public user_type?: string | null 

    ) {}

    // Método para verificar si el usuario está activo
    isVerified(): boolean {
      return this.status === "active";
    }

    // Método para activar el usuario
    activate() {
      this.status = "active";
    }
  }
