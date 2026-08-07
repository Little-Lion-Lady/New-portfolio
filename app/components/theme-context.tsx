"use client";

import { createContext, useContext, type ReactNode } from "react";

// Set by RootLayout (server) from the "theme" cookie, so client components
// like ThemeToggle can render the correct icon on their very first pass
// instead of guessing — the guess is what caused the hydration mismatch.
// undefined = no cookie yet (new visitor or pre-cookie localStorage user);
// consumers fall back to localStorage/matchMedia in that case.
const InitialThemeContext = createContext<boolean | undefined>(undefined);

// Wraps the raw Context.Provider: a Server Component can't embed
// Context.Provider directly as JSX (it doesn't serialize across the RSC
// boundary — renders as an invalid element type on the client), but it can
// import and render an ordinary "use client" component like this one.
export function InitialThemeProvider({
  initialIsDark,
  children,
}: {
  initialIsDark: boolean | undefined;
  children: ReactNode;
}) {
  return <InitialThemeContext.Provider value={initialIsDark}>{children}</InitialThemeContext.Provider>;
}

export function useInitialIsDark() {
  return useContext(InitialThemeContext);
}
