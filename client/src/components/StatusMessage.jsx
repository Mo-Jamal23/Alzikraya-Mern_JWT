export function Loading({ text = 'Loading…' }) {
  return <p className="status" role="status">{text}</p>;
}
export function ErrorMessage({ message }) {
  return message ? <p className="alert alert-error" role="alert">{message}</p> : null;
}
