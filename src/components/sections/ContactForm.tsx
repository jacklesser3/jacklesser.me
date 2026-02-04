"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/your-form-id", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="p-8 bg-[var(--color-bg-secondary)] rounded-lg text-center">
        <p className="font-[family-name:var(--font-cormorant)] text-xl text-[var(--color-text-primary)]">
          Thank you for reaching out.
        </p>
        <p className="text-[var(--color-text-secondary)] mt-2">
          I&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-3 bg-[var(--color-bg-primary)] border border-[var(--color-bg-secondary)] rounded-md text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-forge)] focus:border-transparent transition-all"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-3 bg-[var(--color-bg-primary)] border border-[var(--color-bg-secondary)] rounded-md text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-forge)] focus:border-transparent transition-all"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 bg-[var(--color-bg-primary)] border border-[var(--color-bg-secondary)] rounded-md text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-forge)] focus:border-transparent transition-all resize-none"
          placeholder="What's on your mind?"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong. Please try again.
        </p>
      )}

      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
