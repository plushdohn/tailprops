declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    tw?: string;
    [key: `tw-${string}`]: string;
  }
}
