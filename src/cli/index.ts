import { Command, flags } from '@oclif/command';
import * as fs from 'fs';
import pino from 'pino';
import { PrettyTransform } from 'pretty-json-log';
import * as readline from 'readline';
import { Readable } from 'stream';
import * as zlib from 'zlib';
import { HashTestAlgorithmSub, HashTestCase } from '../algo';
import { Algorithms } from '../algorithm';

const logger = pino(process.stdout.isTTY ? PrettyTransform.stream() : undefined);
logger.level = 'info';

const DefaultAlgorithms = ['farmhash', 'sha256', 'sha256:128'];
export class Hct extends Command {
  static flags = {
    all: flags.boolean({ description: 'Use all algorithms' }),
    algorithms: flags.string({ description: 'Algorithms to use' }),
    markdown: flags.boolean({ description: 'Dump output to markdown table' }),
    verbose: flags.boolean({ description: 'Verbose logging' }),
  };

  static args = [{ name: 'inputFile', required: true }];

  async run(): Promise<void> {
    const { args, flags } = this.parse(Hct);

    if (flags.verbose) logger.level = 'debug';

    if (!fs.existsSync(args.inputFile)) {
      logger.error({ input: args.inputFile }, 'Missing input file');
      return;
    }

    if (flags.all)
      flags.algorithms = [...new Set(Algorithms.map.values())]
        .map((c) => c.id)
        .sort()
        .join(',');
    if (flags.algorithms == null) flags.algorithms = DefaultAlgorithms.join(',');

    const algorithms = flags.algorithms.split(',').map((c) => {
      const res = Algorithms.lookup(c);
      if (res != null) return new HashTestCase(res);
      logger.info({ algo: [...new Set(Algorithms.map.values())].map((c) => c.id).sort() }, 'Algorithm options');
      throw new Error('Failed to find algorithm: ' + c);
    });

    logger.info({ path: args.inputFIle, algorithms: algorithms.map((c) => c.ht.id) }, 'Starting');

    let sourceData: Readable = fs.createReadStream(args.inputFile);
    if (args.inputFile.endsWith('.gz')) sourceData = sourceData.pipe(zlib.createGunzip());

    const rl = readline.createInterface({ input: sourceData });

    let count = 0;

    const lineDupe = new Set(); // de dupe lines

    const batch: string[] = [];
    rl.on('line', (l) => {
      if (lineDupe.has(l)) return;
      count++;
      batch.push(l);
      if (count % 50_000 === 0) {
        logger.debug({ count }, 'Progress');
        for (const a of algorithms) a.hash(batch);
        batch.length = 0;
      }
      lineDupe.add(l);
    });
    if (batch.length > 0) for (const a of algorithms) a.hash(batch);

    await new Promise((resolve, reject) => {
      rl.on('error', reject);
      rl.on('close', resolve);
    });

    logger.info({ path: args.inputFile, count }, 'Done');
    for (const a of algorithms) {
      logger.info({ hash: a.ht.name, bits: a.ht.bits, collisions: a.collisions.size, duration: a.duration }, a.ht.id);
    }

    if (flags.markdown) {
      console.log(`|` + ['Algorithm', 'Bits', 'Bits Used', 'Collisions', 'Duration'].join('|') + '|');
      console.log('|' + (['-', '-', '-', '-', '-'].join('|') + '|'));
      for (const a of algorithms) {
        let bitsTotal = a.ht.bits;
        if (a.ht instanceof HashTestAlgorithmSub) bitsTotal = a.ht.ht.bits;
        console.log('|' + ([a.ht.name, bitsTotal, a.ht.bits, a.collisions.size, a.duration].join('|') + '|'));
      }
    }
  }
}
