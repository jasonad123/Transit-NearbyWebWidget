// Time formatting utilities (same for both vanilla and Lit)
export function getMinutesUntil(timestamp: number): number {
  const now = Date.now() / 1000;
  return Math.round((timestamp - now) / 60);
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function formatRelativeTime(minutes: number): string {
  if (minutes < 1) return 'Now';
  if (minutes === 1) return '1 minute';
  return `${minutes} minutes`;
}
