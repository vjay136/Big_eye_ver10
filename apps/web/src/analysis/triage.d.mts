export interface Finding { id: string; points: number; explanation: string }
export function analyze(input: { subject?: string; message?: string; url?: string }): {
  score: number;
  findings: Finding[];
  urlsInspected: number;
  urlLimitReached: boolean;
};
export function attachmentSignals(name: string): string[];
