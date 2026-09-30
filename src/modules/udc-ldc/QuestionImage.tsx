export function QuestionImage({ path, alt = 'Question diagram' }: { path?: string; alt?: string }) {
  if (!path) return null;

  const src = path.startsWith('/') ? path : `/question-images/${path}`;
  return (
    <div style={{ margin: '10px 0 12px', textAlign: 'center' }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ maxWidth: '100%', maxHeight: 420, objectFit: 'contain', border: '1px solid var(--border, #dcdce3)', borderRadius: 8 }}
      />
    </div>
  );
}
