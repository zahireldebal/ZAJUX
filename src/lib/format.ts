/** Reemplaza {clave} por su valor. Las claves sin valor quedan como están. */
export function fmt(template: string, vars: Record<string, string | number | undefined>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => {
    const v = vars[k];
    return v === undefined ? m : String(v);
  });
}
