export default function ErrorList({ errors }) {
  if (!errors || !errors.length) {
    return null;
  }

  return (
    <div className="error-list">
      {errors.map((error) => (
        <p key={error.message}>{error.message}</p>
      ))}
    </div>
  );
}
