/**
 * Injects a JSON-LD script tag into the document <head>.
 * Removes any existing script with the same ID before injecting.
 */
export function injectJsonLd(id: string, schema: Record<string, unknown>) {
  // Remove existing if present
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Removes all JSON-LD scripts injected by our app (by id prefix).
 */
export function removeJsonLd() {
  document.querySelectorAll('script[id^="seo-"]').forEach((el) => el.remove());
}
