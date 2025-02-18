"use client";

import React, { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

const StartupForm = () => {
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    category: "",
    link: "",
    pitch: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const newFormValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      setFormValues({ ...newFormValues, pitch });

      await formSchema.parseAsync(newFormValues);

      const result = await createPitch(prevState, formData, pitch);

      if (result.status == "SUCCESS") {
        toast({
          title: "Success",
          description: "¡Tu idea se ha enviado con éxito!",
        });

        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        const formattedErrors: Record<string, string> = Object.fromEntries(
          Object.entries(fieldErrors).map(([key, value]) => [
            key,
            value?.[0] || "Error desconocido",
          ])
        );
        setErrors(formattedErrors);
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "Un error ha ocurrido, por favor intenta de nuevo",
        variant: "destructive",
      });
      return {
        ...prevState,
        error: "Un error ha ocurrido, por favor intenta de nuevo",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Título de la idea
        </label>
        <Input
          id="title"
          name="title"
          required
          type="text"
          value={formValues.title}
          onChange={handleInputChange}
          className="startup-form_input"
          placeholder="Ingrese el título de su idea"
          autoComplete="off"
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="startup-form_label">
          Descripción
        </label>
        <Textarea
          id="description"
          name="description"
          required
          value={formValues.description}
          onChange={handleInputChange}
          className="startup-form_textarea"
          placeholder="Describa su idea en pocas palabras"
          autoComplete="off"
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>
      <div>
        <label htmlFor="category" className="startup-form_label">
          Categoría
        </label>
        <Input
          id="category"
          name="category"
          required
          type="text"
          value={formValues.category}
          onChange={handleInputChange}
          className="startup-form_input"
          placeholder="Categoría de la idea (Ej. Tecnología, Educación)"
          autoComplete="off"
        />
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>
      <div>
        <label htmlFor="link" className="startup-form_label">
          URL de la imagen de la idea
        </label>
        <Input
          id="link"
          name="link"
          required
          type="text"
          value={formValues.link}
          onChange={handleInputChange}
          className="startup-form_input"
          placeholder="URL de la imagen de la idea"
          autoComplete="off"
        />
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>
      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 10, overflow: "hidden", marginTop: 10 }}
          textareaProps={{
            placeholder:
              "Escribe un pitch de tu idea, este es el mensaje que se mostrará en la página principal de la plataforma. Cuéntanos por qué tu idea es especial y por qué deberíamos apoyarla.",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        <Send size={16} />
        {isPending ? "Enviando..." : "Enviar idea"}
      </Button>
    </form>
  );
};

export default StartupForm;
