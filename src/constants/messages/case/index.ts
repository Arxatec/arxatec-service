// src/constants/messages/case/index.ts
export const CASE_MESSAGES = {
  EXTERNAL_CLIENT_NOT_FOUND: "Cliente externo no encontrado",
  EXTERNAL_CLIENT_NOT_ALLOWED_FOR_CLIENT:
    "No tienes permiso de usar este cliente externo",
  EXTERNAL_CLIENT_REQUIRED_FOR_LAWYER: "Se requiere un cliente externo",
  LAWYER_CANNOT_CHANGE_ASSIGNED_LAWYER:
    "EL ABOGADO NO PUEDE CAMBIAR EL ABOGADO ASIGNADO",

  // general
  NOT_FOUND: "Caso no encontrado.",
  ACCESS_DENIED: "Acceso denegado o permisos insuficientes.",
  HISTORY_NOT_FOUND: "No se encontraron cambios en el historial de este caso.",

  // creacion
  LIMIT_OPEN_CLIENT:
    "Has alcanzado el número máximo de casos abiertos o en progreso (5).",
  CREATED_SUCCESS: "El caso ha sido creado con éxito.",

  // actualizacion
  CANNOT_EDIT_ARCHIVED: "Los casos archiveds no pueden ser editados.",
  CANNOT_EDIT_CLOSED: "Los casos closeds no pueden ser editados.",
  NEXT_STATUS_ONLY: "Solo se permite avanzar al siguiente estado.",
  INVALID_TRANSITION_LAWYER:
    "Un abogado solo puede avanzar o retroceder un paso en el flujo del caso.",

  // estado
  ALREADY_CLOSED: "El caso ya está closed.",
  STATUS_CHANGED: "Estado del caso actualizado con éxito.",

  INVALID_STATUS: "Transición de estado inválida.",
  CLOSE_ONLY_LAWYER: "Solo el abogado asignado puede cerrar el caso.",

  // caso tomado
  LIMIT_INPROGRESS_LAWYER:
    "Has alcanzado el límite de casos activos en progreso.",

  //archivado
  ARCHIVED_SUCCESS: "El caso ha sido archived.",
  ALREADY_ARCHIVED: "El caso ya está archived.",

  // adjuntos
  ONLY_IMAGE_FILES_ALLOWED:
    "Solo se permiten archivos de imagen (jpg, png, webp...).",
  ATTACHMENT_ARCHIVED: "Adjunto archived con éxito.",
  ATTACHMENT_NOT_FOUND: "Adjunto no encontrado.",

  // mensajes internos
  MESSAGE_SENT: "Mensaje enviado.",
};
