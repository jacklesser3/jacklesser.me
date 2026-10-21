"use client";
import { useEffect, useId, useRef, useState } from "react";
import { socialLinks } from "../layout/socialLinks";

export function ConnectMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);
  return <div className="jp-connect" ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button ref={trigger} className="jp-connect-trigger" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}>Connect</button>
    {open && <div className="jp-connect-menu" id={id} aria-label="Connect links">{socialLinks.map(link => <a key={link.name} href={link.href} target={link.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" onClick={() => setOpen(false)}><span className="jp-connect-icon">{link.icon}</span><span>{link.name}</span></a>)}</div>}
  </div>;
}
