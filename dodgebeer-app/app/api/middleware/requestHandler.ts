import { NextRequest, NextResponse } from "next/server";
import { validate } from "@/app/api/middleware/validator";
import { z, ZodObject, ZodRawShape, ZodSchema, ZodTypeAny } from "zod";

/**
 * A generic controller function that receives validated input data and returns a Next.js response.
 */
type Handler<T> = (
  data: T,
) => Promise<NextResponse> | NextResponse | Promise<Response> | Response;

/**
 * Interface for defining a POST request handler with validation.
 *
 * @template T - The shape of the expected request body.
 * @property schema - The Zod schema used to validate the incoming data.
 * @property handler - The controller logic to execute with validated data.
 */
export interface PostRequestHandlerType<T> {
  schema: ZodSchema<T> | ZodTypeAny;
  handler: Handler<T>;
}

/**
 * Creates a reusable POST request handler for Next.js API routes.
 *
 * Features:
 * - Parses request body based on `Content-Type`
 * - Validates input data using the provided Zod schema
 * - Handles validation errors gracefully
 * - Calls the provided handler if validation succeeds
 *
 * @template T - The type inferred from the schema
 * @param schema - Zod schema to validate the request body
 * @param handler - Controller function to call with validated data
 * @returns An async function that handles the API request and returns a `NextResponse`
 */
export function standardPostRequestHandler<T>({
  schema,
  handler,
}: PostRequestHandlerType<T>) {
  return async function (req: NextRequest) {
    let data: any;
    const contentType = req.headers.get("content-type") || "";

    try {
      if (contentType.includes("application/json")) {
        data = await req.json();
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const raw = await req.text();
        const params = new URLSearchParams(raw);
        data = {};
        for (const [key, value] of params.entries()) data[key] = value;
      } else if (contentType.includes("multipart/form-data")) {
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

    const result = schema.safeParse(data);
    const validationError = validate(result);

    if (validationError || !result.data) {
      return NextResponse.json(validationError);
    }

    return handler(result.data);
  };
}

/**
 * Validates query parameters from a `NextRequest` against a Zod schema.
 *
 * @template T - A Zod object schema representing required query parameters.
 * @param req - The incoming Next.js request object.
 * @param schema - Zod object schema to validate query parameters.
 * @returns The parsed and validated query parameters as `z.infer<T>` or a `NextResponse` with an error.
 */
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
