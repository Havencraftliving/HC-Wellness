export function CartLineImage({ name, imageSrc }: { name: string; imageSrc?: string }) {
  if (!imageSrc) {
    return (
      <div
        aria-hidden="true"
        className="flex h-24 w-24 shrink-0 items-center justify-center bg-parchment px-2 text-center"
      >
        <span className="font-heading text-sm leading-tight text-bark">{name}</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt=""
      className="h-24 w-24 shrink-0 bg-parchment object-contain"
    />
  );
}
