"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Modal } from "./Modal";
import { ComingSoon } from "./ComingSoon";
import { LeadForm } from "./LeadForm";
import { ApplicationForm } from "./ApplicationForm";

export type DialogKind = "lead" | "salon" | "gym" | "apply";

type Ctx = {
  /** `payload` is the pre-selected role id when opening "apply" from a role row. */
  open: (kind: DialogKind, payload?: string) => void;
  close: () => void;
};

const DialogContext = createContext<Ctx | null>(null);

/** Opens the strategy form, the application form, or either coming-soon modal. */
export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used inside <DialogProvider>");
  return ctx;
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ kind: DialogKind; payload?: string } | null>(null);

  const open = useCallback(
    (kind: DialogKind, payload?: string) => setState({ kind, payload }),
    [],
  );
  const close = useCallback(() => setState(null), []);
  const value = useMemo(() => ({ open, close }), [open, close]);

  const kind = state?.kind ?? null;

  return (
    <DialogContext.Provider value={value}>
      {children}

      <Modal
        open={kind !== null}
        onClose={close}
        size={kind === "lead" || kind === "apply" ? "lg" : "sm"}
        labelledBy="kx-dialog-title"
      >
        {kind === "lead" ? (
          <LeadForm titleId="kx-dialog-title" onDone={close} />
        ) : kind === "apply" ? (
          <ApplicationForm
            titleId="kx-dialog-title"
            roleId={state?.payload}
            onDone={close}
          />
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
