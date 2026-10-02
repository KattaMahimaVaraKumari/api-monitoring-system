import {z} from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
    email:z
        .string()
        .trim()
        .email("Please enter a valid email address"),
    
    password: z 
        .string()
        .min(1,"Password is reqired"),
});


export const createMonitorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Monitor name must be at least 2 characters long"),

  url: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .refine(
      (value) => {
        try {
          const protocol = new URL(value).protocol;

          return protocol === "http:" || protocol === "https:";
        } catch {
          return false;
        }
      },
      "URL must use HTTP or HTTPS"
    ),

  method: z
    .enum(["GET"])
    .default("GET"),

  expectedStatus: z
    .number()
    .int()
    .min(100)
    .max(599)
    .default(200),

  interval: z
    .number()
    .int()
    .min(1)
    .default(5),

  timeout: z
    .number()
    .int()
    .min(1)
    .default(10),

});


export const updateMonitorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Monitor name must be at least 2 characters long")
    .optional(),

  url: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .optional(),

  method: z
    .enum(["GET"])
    .optional(),

  expectedStatus: z
    .number()
    .int()
    .min(100)
    .max(599)
    .optional(),

  interval: z
    .number()
    .int()
    .min(1)
    .optional(),

  timeout: z
    .number()
    .int()
    .min(1)
    .optional(),

  active: z
    .boolean()
    .optional(),
});


export const createApiKeySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2,"API key name must be at least 2 characters long"),
});

