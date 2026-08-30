"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginRequest } from "@/lib/auth";
import { toastError } from "@/lib/toast";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";
import { Field } from "./field";

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error) => toastError(error, "Could not sign in"),
  });

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      noValidate
    >
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
        autoComplete="current-password"
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
        {mutation.isPending ? "Signing in…" : "Continue"}
      </button>
    </form>
  );
}
