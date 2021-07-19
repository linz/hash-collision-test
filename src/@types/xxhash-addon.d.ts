declare module 'xxhash-addon' {
  export const XXHash32: typeof xxhash.Xxhash;
  export const XXHash64: typeof xxhash.Xxhash;
  export const XXHash128: typeof xxhash.Xxhash;
  export const XXHash3: typeof xxhash.Xxhash;
}

declare namespace xxhash {
  class Xxhash {
    constructor(buf: Buffer | number);
    hash(buf: Buffer): Buffer;
    update(buf: Buffer): void;
    digest(): Buffer;
    reset(): void;
  }
}
