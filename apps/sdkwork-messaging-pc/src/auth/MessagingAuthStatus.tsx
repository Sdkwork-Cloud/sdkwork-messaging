import { LoaderCircle, MessageSquareText, RefreshCw, TriangleAlert } from "lucide-react";

export function MessagingAuthStatus({
  message,
  onRetry,
  retryLabel,
}: {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  const unavailable = Boolean(onRetry);
  return (
    <main className="messaging-auth-status">
      <div className="messaging-auth-status__brand">
        <span aria-hidden="true"><MessageSquareText size={20} /></span>
        <strong>SDKWork Notification Center</strong>
      </div>
      <div aria-live="polite" className="messaging-auth-status__message" role={unavailable ? "alert" : "status"}>
        {unavailable
          ? <TriangleAlert aria-hidden="true" size={20} />
          : <LoaderCircle aria-hidden="true" className="spin" size={20} />}
        <span>{message}</span>
      </div>
      {onRetry ? (
        <button className="button button--secondary" onClick={onRetry} type="button">
          <RefreshCw aria-hidden="true" size={16} />
          <span>{retryLabel}</span>
        </button>
      ) : null}
    </main>
  );
}

