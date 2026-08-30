"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerRequest } from "@/lib/auth";
import { toastError } from "@/lib/toast";
import { registerSchema, type RegisterValues } from "@/lib/validation/auth";
import { Field } from "./field";

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error) => toastError(error, "Could not create the account"),
  });

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      noValidate
    >
      <Field
        id="name"
        label="Name"
        type="text"
        autoComplete="name"
        error={form.formState.errors.name?.message}
        {...form.register("name")}
      />
      <Field
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={form.formState.errors.email?.message}
        {...form.register("email")}
      />
      <Field
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters."
        error={form.formState.errors.password?.message}
        {...form.register("password")}
      />
      {mutation.error ? (
        <p role="alert" className="text-sm text-error">
          {mutation.error.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-2 h-12 bg-ink text-paper transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
