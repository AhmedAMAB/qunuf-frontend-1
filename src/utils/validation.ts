import z from "zod";


// Reusable phone schema
export const phoneSchema = z.string()
    .min(1, 'required')
    .regex(/^[+]?[\d\s\-()]{3,20}$/, 'invalidPhone');
