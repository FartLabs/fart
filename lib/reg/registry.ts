export const INDEX = "default";

export type RegistryKey = string | string[];

export class Registry<T> {
  private registries: Map<string, Registry<T>> = new Map([]);

  constructor(
    public id: string,
    public value?: T,
  ) {}

  set(id: RegistryKey, value: T) {
    const [currentId, ...segments] = Registry.parseId(id);
    if (currentId !== undefined) {
      const nextRegistry = this.registries.get(currentId) ??
        new Registry(currentId, segments.length === 0 ? value : undefined);
      nextRegistry.set(segments, value);
      this.registries.set(currentId, nextRegistry);
    }
  }

  get(id: RegistryKey = INDEX): Registry<T> | undefined {
    const [currentId, ...segments] = Registry.parseId(id);
    if (currentId === undefined) return;
    if (currentId === INDEX) return this;
    const currentRegistry = this.registries.get(currentId);
    if (currentRegistry === undefined) return;
    if (segments.length > 0) {
      return currentRegistry.get(segments);
    }
    return currentRegistry;
  }

  vendor(id?: RegistryKey): T | undefined {
    if (id === undefined) return this.value;
    return this.get(id)?.value;
  }

  has(id: RegistryKey): boolean {
    return this.vendor(id) !== undefined;
  }

  include(registry: Registry<T>) {
    return this.registries.set(registry.id, registry);
  }

  static parseId(id: RegistryKey): string[] {
    if (Array.isArray(id)) {
      return id;
    }
    const segments = id.split(".").map((segment) =>
      segment.toLowerCase().replace(/[^a-z0-9]/g, "")
    );
    while (segments[segments.length - 1] === INDEX) {
      segments.pop();
    }
    return segments;
  }
}
