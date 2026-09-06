"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Modal } from "./Modal";
import { ComingSoon } from "./ComingSoon";
import { LeadForm } from "./LeadForm";

export type DialogKind = "lead" | "salon" | "gym";

type Ctx = { open: (kind: DialogKind) => void; close: () => void };

const DialogContext = createContext<Ctx | null>(null);

/** Opens the strategy form or either coming-soon modal from anywhere on the page. */
export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used inside <DialogProvider>");
  return ctx;
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [kind, setKind] = useState<DialogKind | null>(null);

  const open = useCallback((next: DialogKind) => setKind(next), []);
  const close = useCallback(() => setKind(null), []);
  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <DialogContext.Provider value={value}>
      {children}

      <Modal
        open={kind !== null}
        onClose={close}
        size={kind === "lead" ? "lg" : "sm"}
        labelledBy="kx-dialog-title"
      >
        {kind === "lead" ? (
          <LeadForm titleId="kx-dialog-title" onDone={close} />
        ) : kind ? (
          // Keyed so switching salon -> gym remounts with the right copy.
          <ComingSoon
            key={kind}
            product={kind}
            titleId="kx-dialog-title"
            onTalk={() => open("lead")}
            onClose={close}
          />
        ) : null}
      </Modal>
    </DialogContext.Provider>
  );
}
