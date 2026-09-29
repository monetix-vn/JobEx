export type Severity = 'error' | 'warning' | 'info';

export interface Diagnostic {
  severity: Severity;
  /** Stable machine-readable id, e.g. "ref.missing", "locale.missing". */
  code: string;
  message: string;
  /** File relative to the content root. */
  file?: string;
  /** JSON pointer or dotted path inside the file. */
  path?: string;
}

export function hasErrors(diagnostics: readonly Diagnostic[]): boolean {
  return diagnostics.some((d) => d.severity === 'error');
}

export function formatDiagnostic(d: Diagnostic): string {
  const where = [d.file, d.path].filter(Boolean).join(' ');
  return `${d.severity.toUpperCase().padEnd(7)} ${d.code}${where ? ` [${where}]` : ''}: ${d.message}`;
}

export function formatDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics.map(formatDiagnostic).join('\n');
}
