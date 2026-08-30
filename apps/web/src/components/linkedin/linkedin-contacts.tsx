"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CONNECTION_STATUSES, type LinkedInContactPublic } from "@job-tracker/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Field } from "@/components/auth/field";
import { CONNECTION_LABELS } from "@/lib/connection-labels";
import {
  createLinkedInContact,
  listLinkedInContacts,
  updateLinkedInContact,
} from "@/lib/linkedin";
import {
  createLinkedInContactSchema,
  type CreateLinkedInContactValues,
} from "@/lib/validation/linkedin";

export function LinkedInContacts({
  applicationId,
  connectionCount,
}: {
  applicationId: string;
  connectionCount: number;
}) {
  const queryClient = useQueryClient();
  const contacts = useQuery({
    queryKey: ["linkedin", applicationId],
    queryFn: () => listLinkedInContacts(applicationId),
  });

  const form = useForm<CreateLinkedInContactValues>({
    resolver: zodResolver(createLinkedInContactSchema),
    defaultValues: {
      name: "",
      position: "",
      status: "PENDING",
      conversationNotes: "",
    },
  });

  const create = useMutation({
    mutationFn: (values: CreateLinkedInContactValues) =>
      createLinkedInContact(applicationId, values),
    onSuccess: async () => {
      form.reset({
        name: "",
        position: "",
        status: "PENDING",
        conversationNotes: "",
      });
      await queryClient.invalidateQueries({ queryKey: ["linkedin", applicationId] });
      await queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  return (
    <section aria-labelledby="linkedin-heading" className="mt-16">
      <h2 id="linkedin-heading" className="font-display text-3xl tracking-tight">
        LinkedIn outreach
      </h2>
      <p className="mt-3 max-w-xl text-muted">
        Track people at this company. Connection count updates automatically —
        currently {connectionCount}.
      </p>

      <form
        className="mt-8 grid gap-5 border-t border-line pt-8 md:grid-cols-2"
        onSubmit={form.handleSubmit((values) => create.mutate(values))}
        noValidate
      >
        <Field
          id="contact-name"
          label="Employee"
          placeholder="Jordan Lee"
          error={form.formState.errors.name?.message}
          {...form.register("name")}
        />
        <Field
          id="contact-position"
          label="Position"
          placeholder="Engineering manager"
          error={form.formState.errors.position?.message}
          {...form.register("position")}
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-status" className="text-sm text-muted">
            Connection status
          </label>
          <select
            id="contact-status"
            className="h-12 rounded-sm border border-line bg-surface px-3"
            {...form.register("status")}
          >
            {CONNECTION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {CONNECTION_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="contact-notes" className="text-sm text-muted">
            Conversation notes
          </label>
          <textarea
            id="contact-notes"
            rows={3}
            className="rounded-sm border border-line bg-surface px-3 py-2"
            {...form.register("conversationNotes")}
          />
        </div>
        {create.error ? (
          <p role="alert" className="text-sm text-error md:col-span-2">
            {create.error.message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={create.isPending}
          className="h-12 w-fit px-6 bg-ink text-paper hover:opacity-90 disabled:opacity-60"
        >
          {create.isPending ? "Adding…" : "Add contact"}
        </button>
      </form>

      {contacts.isLoading ? (
        <p className="mt-8 text-muted">Loading contacts…</p>
      ) : contacts.error ? (
        <p role="alert" className="mt-8 text-error">
          {contacts.error.message}
        </p>
      ) : !contacts.data?.length ? (
        <p className="mt-8 border-t border-line pt-8 text-muted">
          No contacts yet. Add the first employee you messaged.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-line border-t border-line">
          {contacts.data.map((contact) => (
            <ContactRow key={contact.id} contact={contact} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ContactRow({ contact }: { contact: LinkedInContactPublic }) {
  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: (body: { status?: typeof contact.status; conversationNotes?: string }) =>
      updateLinkedInContact(contact.id, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["linkedin", contact.applicationId],
      });
      await queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  return (
    <li className="grid gap-4 py-6 md:grid-cols-[1fr_12rem_1fr]">
      <div>
        <p className="text-ink">{contact.name}</p>
        <p className="text-sm text-muted">{contact.position}</p>
      </div>
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">Status</span>
        <select
          className="h-11 rounded-sm border border-line bg-surface px-3"
          defaultValue={contact.status}
          onChange={(event) =>
            update.mutate({
              status: event.target.value as typeof contact.status,
            })
          }
        >
          {CONNECTION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {CONNECTION_LABELS[status]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">Notes</span>
        <textarea
          rows={2}
          className="rounded-sm border border-line bg-surface px-3 py-2"
          defaultValue={contact.conversationNotes}
          onBlur={(event) => {
            if (event.target.value !== contact.conversationNotes) {
              update.mutate({ conversationNotes: event.target.value });
            }
          }}
        />
      </label>
      {update.error ? (
        <p role="alert" className="text-sm text-error md:col-span-3">
          {update.error.message}
        </p>
      ) : null}
    </li>
  );
}
