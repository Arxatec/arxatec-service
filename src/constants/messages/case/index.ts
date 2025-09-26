// src/constants/messages/case/index.ts
export const CASE_MESSAGES = {
  EXTERNAL_CLIENT_NOT_FOUND: "Cliente externo no encontrado",
  EXTERNAL_CLIENT_NOT_ALLOWED_FOR_CLIENT:
    "No tienes permiso de usar este cliente externo",
  EXTERNAL_CLIENT_REQUIRED_FOR_LAWYER: "Se requiere un cliente externo",
  ONLY_PUBLIC_TAKE:
    "Solo los casos públicos pueden ser tomados por un cliente.",
  SELECT_LAWYER_CLIENT_ONLY:
    "Solo el cliente puede asignar un abogado al caso.",
  ONLY_LAWYER_CAN_ASSIGN_EXTERNAL:
    "Solo un abogado puede asignar un cliente externo propio.",
  LAWYER_CANNOT_CHANGE_ASSIGNED_LAWYER:
    "EL ABOGADO NO PUEDE CAMBIAR EL ABOGADO ASIGNADO",
  /* ──────────────── General ──────────────── */
  INVALID_ID: "ID de caso inválido.",
  NOT_FOUND: "Caso no encontrado.",
  ACCESS_DENIED: "Acceso denegado o permisos insuficientes.",
  CATEGORIES_SUCCESS: "Categorías obtenidas con éxito.",
  STATUSES_SUCCESS: "Estados obtenidos con éxito.",
  HISTORY_NOT_FOUND: "No se encontraron cambios en el historial de este caso.",

  /* ──────────────── Creación ──────────────── */
  LIMIT_OPEN_CLIENT:
    "Has alcanzado el número máximo de casos abiertos o en progreso (5).",
  LIMIT_OPEN_LAWYER:
    "El abogado ha alcanzado el número máximo de casos en progreso.",

  CREATED_TITLE: "Nuevo caso creado",
  CREATED_SUCCESS: "El caso ha sido creado con éxito.",

  /* ──────────────── Actualización/Edición ──────────────── */
  UPDATED_SUCCESS: "El caso ha sido actualizado con éxito.",
  CANNOT_EDIT_ARCHIVED: "Los casos archivados no pueden ser editados.",
  CANNOT_EDIT_CLOSED: "Los casos cerrados no pueden ser editados.",
  NEXT_STATUS_ONLY: "Solo se permite avanzar al siguiente estado.",
  INVALID_TRANSITION_LAWYER:
    "Un abogado solo puede avanzar o retroceder un paso en el flujo del caso.",

  /* ──────────────── Estado ──────────────── */
  ALREADY_CLOSED: "El caso ya está cerrado.",
  STATUS_CHANGED: "Estado del caso actualizado con éxito.",

  INVALID_STATUS: "Transición de estado inválida.",
  STATUS_UPDATED_SUCCESS: "El estado del caso ha sido actualizado.",
  ALREADY_TAKEN: "El caso ya ha sido tomado por otro abogado.",
  CLOSE_ONLY_LAWYER: "Solo el abogado asignado puede cerrar el caso.",
  /* Caso tomado */
  TAKEN_TITLE: "Tu caso ha sido tomado",
  TAKEN_SUCCESS: "El caso ha sido tomado con éxito.",
  LIMIT_INPROGRESS_LAWYER:
    "Has alcanzado el límite de casos activos en progreso.",

  /* ──────────────── Archivo ──────────────── */
  ARCHIVED_SUCCESS: "El caso ha sido archivado.",
  ALREADY_ARCHIVED: "El caso ya está archivado.",

  /* ──────────────── Adjuntos ──────────────── */
  ONLY_IMAGE_FILES_ALLOWED:
    "Solo se permiten archivos de imagen (jpg, png, webp...).",
  ATTACHMENT_ADDED: "Adjunto subido con éxito.",
  ATTACHMENT_ARCHIVED: "Adjunto archivado con éxito.",
  ATTACHMENT_NOT_FOUND: "Adjunto no encontrado.",
  ATTACHMENT_ACCESS_DENIED: "No tienes permiso para modificar este adjunto.",
  ATTACHMENT_DUPLICATE:
    "Un archivo con el mismo nombre o URL ya está adjunto a este caso. Por seguridad y trazabilidad, no se permiten archivos duplicados.",

  /* ──────────────── Mensajes Internos ──────────────── */
  HISTORY_FETCH_SUCCESS: "Historial del caso recuperado.",
  MESSAGE_SENT: "Mensaje enviado.",
  MESSAGE_NOT_FOUND: "Mensaje no encontrado.",

  /* ──────────────── Filtros/Exploración ──────────────── */
  INVALID_FILTERS: "Filtros inválidos para la exploración de casos.",

  /* ──────────────── Acceso / Visibilidad ──────────────── */
  NOT_ASSIGNED_TO_LAWYER: "Este caso no está asignado a ti.",
  NEED_MIN_2_STATUSES: "Se requieren al menos 2 estados configurados.",
};
