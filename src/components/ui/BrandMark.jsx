export default function BrandMark({ className = "w-6 h-6" }) {
  return (
    <picture className="inline-flex shrink-0">
      <source
        media="(prefers-color-scheme: light)"
        srcSet="/logo-light.svg"
      />
      <img src="/logo.svg" alt="" className={className} />
    </picture>
  );
}
