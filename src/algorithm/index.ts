import { HashTestAlgorithm } from '../algo';
import { CompositeHash } from '../composite';
import { Djb2a } from './djb2a';
import { FarmHash } from './farmhash';
import { Fnv1a } from './fnv1a';
import { NodeCrypto } from './node';
import { Sdbm } from './sdbm';
import { XxHash } from './xxhash';

export const Algorithms = {
  map: new Map<string, HashTestAlgorithm>(),
  register(ht: HashTestAlgorithm, name = ht.name): void {
    if (this.map.has(name)) throw new Error('Duplicate algorithm name: ' + name);
    this.map.set(name, ht);
  },

  /**
   * look up a hash algorthm by name
   * @example
   * Algorithms.lookup('sha256')
   * Algorithms.lookup('sha256:128')
   * Algorithms.lookup('farmhash__fnv1a')
   * @param name
   * @returns
   */
  lookup(name: string): HashTestAlgorithm | null {
    let ha = Algorithms.map.get(name);
    if (ha) return ha;

    if (name.includes('__')) {
      const composites = name.split('__').map((c) => {
        const res = Algorithms.lookup(c);
        if (res == null) throw new Error('Failed to find algorithm: ' + c + ' from composite: ' + name);
        return res;
      });
      return new CompositeHash(composites);
    }
    if (!name.includes(':')) return null;
    const [hashType, bits] = name.split(':');

    ha = Algorithms.map.get(hashType);
    if (ha == null) return null;
    return ha.sub(Number(bits));
  },
};

const fnv1a = new Fnv1a();
Algorithms.register(fnv1a);
Algorithms.register(fnv1a, 'fnv1a');
Algorithms.register(new Fnv1a(64));

Algorithms.register(new Sdbm());

Algorithms.register(new Djb2a());

Algorithms.register(new FarmHash(32));
Algorithms.register(new FarmHash(64));

Algorithms.register(new NodeCrypto('sha512', 512));
Algorithms.register(new NodeCrypto('sha256', 256));
Algorithms.register(new NodeCrypto('sha1', 128));
Algorithms.register(new NodeCrypto('md5', 128));

const xxHash = new XxHash(32);
Algorithms.register(xxHash, 'xxhash');
Algorithms.register(xxHash);
Algorithms.register(new XxHash(64));
Algorithms.register(new XxHash(128));
