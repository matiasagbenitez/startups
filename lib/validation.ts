import { z } from "zod";

export const formSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(20).max(500),
    category: z.string().min(3).max(20),
    link: z.string().url(),
    pitch: z.string().min(10),
}).superRefine(async (data, ctx) => {
    try {
        const res = await fetch(data.link, { method: "HEAD" });
        const contentType = res.headers.get("content-type");

        if (!contentType || !contentType.startsWith("image/")) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["link"],
                message: "El enlace debe ser una imagen válida.",
            });
        }
    } catch {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["link"],
            message: "No se pudo verificar el enlace.",
        });
    }
});
