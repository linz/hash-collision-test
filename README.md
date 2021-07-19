# Hash collision test

Test a input file containing a list of newline (`\n`) separated lines of test data against various hash algorithms to see how they perform


## Usage
```
npm install -g @linzjs/hct

hct /path/to/test.txt --algorithms sha256,farmhash,farmhash:64
```

### Building

```bash
yarn

yarn build
```