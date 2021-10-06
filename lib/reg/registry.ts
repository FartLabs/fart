export class Registry<T> {
  private registries: Map<string, Registry<T>> = new Map([]);

  constructor(
    public id: string,
    public value?: T,
  ) {}

  set(id: string | string[], value: T) {
    const [currentId, ...segments] = Registry.parseId(id);
    if (currentId !== undefined) {
      const nextRegistry = this.registries.get(currentId) ??
        new Registry(currentId, segments.length === 0 ? value : undefined);
      nextRegistry.set(segments, value);
      this.registries.set(currentId, nextRegistry);
    }
  }

  get(id: string | string[]): Registry<T> | undefined {
    const [currentId, ...segments] = Registry.parseId(id);
    if (currentId === undefined) return;
    if (currentId === "default") return this;
    const currentRegistry = this.registries.get(currentId);
    if (currentRegistry === undefined) return;
    if (segments.length > 0) {
      return currentRegistry.get(segments);
    }
    return currentRegistry;
  }

  vendor(id?: string | string[]): T | undefined {
    if (id === undefined) return this.value;
    return this.get(id)?.value;
  }

  include(registry: Registry<T>) {
    return this.registries.set(registry.id, registry);
  }

  static parseId(id: string | string[]): string[] {
    if (Array.isArray(id)) {
      return id;
    }
    return id.split(".").map((segment) =>
      segment.toLowerCase().replace(/[^a-z0-9]/g, "")
    );
  }
}
