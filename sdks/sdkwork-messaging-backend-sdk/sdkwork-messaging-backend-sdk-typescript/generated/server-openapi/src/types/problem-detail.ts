export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail?: string;
  /** Server-owned request correlation id. */
  requestId?: string;
}
