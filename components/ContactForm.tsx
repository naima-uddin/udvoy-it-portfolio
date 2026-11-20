"use client";

import { useActionState, type PointerEvent } from "react";
import { sendContact, type ContactField, type ContactState } from "@/app/actions";

const initial: ContactState = { status: "idle", message: "" };

/** a soft light inside the card follows the cursor (CSS variables only: no React re-render) */
const spotlight = (e: PointerEvent<HTMLElement>) => {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
  el.style.setProperty("--spot", "1");
};
const spotlightOff = (e: PointerEvent<HTMLElement>) => e.currentTarget.style.setProperty("--spot", "0");

/**
 * Three fields: name, email, message. Labels sit inside the fields and float up when you
 * type. Everything is checked again on the server (app/actions.ts).
 */
export default function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);
  const v = state.values ?? {};
  const err = (f: ContactField) => state.errors?.[f];
  // ties a field to its error message for screen readers
  const a11y = (f: ContactField) =>
    err(f) ? { "aria-invalid": true as const, "aria-describedby": `${f}-error` } : {};
  const errorFor = (f: ContactField) =>
    err(f) ? (
      <span id={`${f}-error`} className="field-error">
        {err(f)}
      </span>
    ) : null;

  if (state.status === "success") {
    return (
      <div className="form form-done" role="status" onPointerMove={spotlight} onPointerLeave={spotlightOff}>
        <span className="done-mark" aria-hidden>
          ✓
        </span>
        <h3>Message sent</h3>
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    // after an action React resets the form to its default values, so failed submissions
    // pass their values back as defaults; the key remounts the fields with them
    <form
      key={JSON.stringify(v)}
      className="form"
      action={action}
      onPointerMove={spotlight}
      onPointerLeave={spotlightOff}
    >
      <div className="form-head">
        <span className="avail">
          <i aria-hidden /> Available for new projects
        </span>
        <span>Reply &lt; 24h</span>
      </div>

      <div className="form-row">
        <div className="fl">
          <input
            id="cf-name"
            name="name"
            placeholder=" "
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            defaultValue={v.name}
            {...a11y("name")}
          />
          <label htmlFor="cf-name">Your name</label>
          {errorFor("name")}
        </div>
        <div className="fl">
          <input
            id="cf-email"
            name="email"
            type="email"
            placeholder=" "
            autoComplete="email"
            required
            maxLength={200}
            defaultValue={v.email}
            {...a11y("email")}
          />
          <label htmlFor="cf-email">Email</label>
          {errorFor("email")}
        </div>
      </div>

      <div className="fl">
        <textarea
          id="cf-message"
          name="message"
          placeholder=" "
          rows={5}
          required
          minLength={10}
          maxLength={5000}
          defaultValue={v.message}
          {...a11y("message")}
        />
        <label htmlFor="cf-message">Tell us about your project</label>
        {errorFor("message")}
      </div>

      {/* spam trap: hidden from people and screen readers, bots tend to fill it in */}
      <div className="hp" aria-hidden>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button className="send" type="submit" disabled={pending}>
        <span>{pending ? "Sending…" : "Send message"}</span>
        <b aria-hidden>→</b>
      </button>
      <p className={`form-msg${state.status === "error" ? " is-error" : ""}`} aria-live="polite">
        {state.status === "error" ? state.message : "Your details stay with us. No newsletters, no spam."}
      </p>
    </form>
  );
}
