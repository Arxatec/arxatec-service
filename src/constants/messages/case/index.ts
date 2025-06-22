// src/constants/messages/case/index.ts
export const CASE_MESSAGES = {

    EXTERNAL_CLIENT_CREATED: "External client created successfully.",
    EXTERNAL_CLIENT_UPDATED: "External client updated successfully.",
    EXTERNAL_CLIENT_ARCHIVED: "External client archived.",
    EXTERNAL_CLIENT_RESTORED: "External client restored.",
    EXTERNAL_CLIENT_NOT_FOUND: "External client not found or not owned by you.",
    EXTERNAL_CLIENT_EMAIL_IN_USE: "This external client email is already linked to another record.",
    

    /* ──────────────── General ──────────────── */
    INVALID_ID: "Invalid case ID.",  
    NOT_FOUND: "Case not found.",
    ACCESS_DENIED: "Access denied or insufficient permissions.",
    CATEGORIES_SUCCESS: "Categories fetched successfully.",
    STATUSES_SUCCESS: "Statuses fetched successfully.", 
    HISTORY_NOT_FOUND: "No changes were found in the history of this case.",

    /* ──────────────── Creation ──────────────── */
    LIMIT_OPEN_CLIENT: "You have reached the maximum number of open or in-progress cases (5).",
    LIMIT_OPEN_LAWYER: "Lawyer has reached the maximum number of in-progress cases",

    CREATED_TITLE: "New case created",  
    CREATED_SUCCESS: "The case has been successfully created.",
   
  
    /* ────────────────Update/Editing ──────────────── */
    UPDATED_SUCCESS: "The case has been successfully updated.",
    CANNOT_EDIT_ARCHIVED: "Archived cases cannot be edited.",
    CANNOT_EDIT_CLOSED: "Closed cases cannot be edited.",
    NEXT_STATUS_ONLY: "Solo se permite avanzar al siguiente estado.",
    INVALID_TRANSITION_LAWYER: "Un abogado solo puede avanzar o retroceder un paso en el flujo del caso.",

    /* ──────────────── State ──────────────── */
    ALREADY_CLOSED: "The case is now closed.",
    STATUS_CHANGED: "Case status updated successfully",


    INVALID_STATUS: "Invalid status transition.",
    STATUS_UPDATED_SUCCESS: "The case status has been updated.",
    ALREADY_TAKEN: "The case has already been taken by another lawyer.",
    CLOSE_ONLY_LAWYER: "Only the assigned lawyer can close the case.",
    /* Taken case */
    TAKEN_TITLE: "Your case has been taken",
    TAKEN_SUCCESS: "The case has been successfully taken.",
    LIMIT_INPROGRESS_LAWYER: "You have reached the limit of active in-progress cases.",

    /* ──────────────── Archive ──────────────── */
    ARCHIVED_SUCCESS: "The case has been archived.",
    ALREADY_ARCHIVED: "The case is already archived.",
  
    /* ──────────────── Attachments ──────────────── */
    ONLY_IMAGE_FILES_ALLOWED: "Only image files (jpg, png, webp...) are allowed.",
    ATTACHMENT_ADDED: "Attachment uploaded successfully.",
    ATTACHMENT_ARCHIVED: "Attachment archived successfully.",
    ATTACHMENT_NOT_FOUND: "Attachment not found.",
    ATTACHMENT_ACCESS_DENIED: "You are not allowed to modify this attachment.",
    ATTACHMENT_DUPLICATE:"A file with the same name or URL is already attached to this case. For security and traceability, duplicate files are not allowed.",
  

    /* ──────────────── Messages Internal ──────────────── */
    HISTORY_FETCH_SUCCESS: "Case history retrieved.",
    MESSAGE_SENT: "Message sent.",
    MESSAGE_NOT_FOUND: "Message not found.",
  
    /* ──────────────── Filters/Scanning──────────────── */
    INVALID_FILTERS: "Invalid filters supplied for case exploration.",
    /* ──────────────── Access / Visibility ──────────────── */
     NOT_ASSIGNED_TO_LAWYER: "This case is not assigned to you.",

  };
  