// src/constants/messages/plans/index.ts

export const PLANS_MESSAGES = {
    // * Creation errors
    CREATE_PLAN_ERROR_REQUIRED_NAME: "The plan name is required.",
    CREATE_PLAN_ERROR_INVALID_NAME_MIN_LENGTH: "The plan name must be at least 2 characters long.",
    CREATE_PLAN_ERROR_REQUIRED_PRICE: "The plan price is required.",
    CREATE_PLAN_ERROR_INVALID_PRICE_MIN_VALUE: "The plan price must be zero or a positive number.",
  
    // * Creation success
    CREATE_PLAN_SUCCESS: "Plan created successfully.",
  
    // * Update errors
    UPDATE_PLAN_ERROR_NOT_FOUND: "Plan not found for update.",
    UPDATE_PLAN_ERROR_INVALID_DATA: "The plan data provided is invalid.",
  
    // * Update success
    UPDATE_PLAN_SUCCESS: "Plan updated successfully.",
  
    // * Deletion errors
    DELETE_PLAN_ERROR_NOT_FOUND: "Plan not found for deletion.",
  
    // * Deletion success
    DELETE_PLAN_SUCCESS: "Plan deleted successfully.",
  
    // * Retrieval errors
    PLAN_NOT_FOUND: "Plan not found.",
  
    // * Retrieval success
    PLAN_RETRIEVED_SUCCESS: "Plan retrieved successfully.",
  
    // * General errors
    INTERNAL_SERVER_ERROR: "An internal server error occurred while processing the plan.",

     // *Not plan fount error
    NO_PLAN_FOUND: "No plan found.",
  };
  