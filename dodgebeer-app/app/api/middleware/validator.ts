import { SafeParseReturnType } from "zod";

export interface ValidationError {
  status: number;
  error: string;
  details: {
    _errors: string[];
  };
}
export function validate(result: SafeParseReturnType<any, any>) {
  if (!result.success) {
    return {
      status: 400,
      error: "Validation failed",
      details: result.error.format(),
    } as ValidationError;
  }

  return undefined;
}
