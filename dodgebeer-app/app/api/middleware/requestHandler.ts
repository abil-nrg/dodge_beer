import { NextRequest, NextResponse } from "next/server";
import { validate } from "@/app/api/middleware/validator";
import { z, ZodObject, ZodRawShape, ZodSchema, ZodTypeAny } from "zod";

// Type definition for controller/handler function
// Takes validated data and returns a NextResponse
type Handler<T> = (data: T) => Promise<NextResponse> | NextResponse;

/**
 * @param schema - Zod schema to validate the incoming data
 * @param handler - Controller func to handle the validated data
 */
export interface RequestHandlerType<T> {
  schema: ZodSchema<T> | ZodTypeAny;
  handler: Handler<T>;
}

/**
 * A reusable request handler generator for API routes.
 * - Parses JSON from the request body
 * - Validates it against the provided Zod schema
 * - Calls the provided handler with validated data if valid
 * - Returns appropriate error responses if invalid
 *
 * @returns An async function
 */
export function standardPostRequestHandler<T>({
  schema,
  handler,
}: RequestHandlerType<T>) {
  return async function (req: NextRequest) {
    let data: any;
    const contentType = req.headers.get("content-type") || "";

    try {
      if (contentType.includes("application/json")) {
        data = await req.json();
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        // form-urlencoded
        const raw = await req.text();
        const params = new URLSearchParams(raw);
        data = {};
        for (const [key, value] of params.entries()) data[key] = value;
      } else if (contentType.includes("multipart/form-data")) {
        // form-data
        const formData = await req.formData();
        data = {};
        for (const [key, value] of formData.entries()) data[key] = value;
      } else {
        return NextResponse.json(
          { error: "Unsupported Content-Type" },
          { status: 415 },
        );
      }
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // validate the parsed JSON against the provided schema
    const result = schema.safeParse(data);

    // Validator
    const validationError = validate(result);

    // if validation failed, return error response
    if (validationError || !result.data) {
      return NextResponse.json(validationError);
    }

    // call the handler/controller with validated data and return its response
    return handler(result.data);
  };
}

export function verifyQueryParams<T extends ZodObject<ZodRawShape>>(
  req: NextRequest,
  schema: T,
): z.infer<T> | NextResponse {
  const { searchParams } = new URL(req.url);
  const obj: Record<string, string> = {};

  for (const key of Object.keys(schema.shape)) {
    const value = searchParams.get(key);
    if (!value) {
      return new NextResponse(
        JSON.stringify({ error: `Missing query param: ${key}` }),
        { status: 400 },
      );
    }

    obj[key] = value;
  }

  const parseResult = schema.safeParse(obj);
  if (!parseResult.success) {
    return new NextResponse(
      JSON.stringify({
        error: "Invalid query parameters",
        details: parseResult.error,
      }),
      { status: 400 },
    );
  }

  return parseResult.data;
}
