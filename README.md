# Hash collision test

Test a input file containing a list of newline (`\n`) separated lines of test data against various hash algorithms to see how they perform for collisions


## Usage
```
npm install -g @linzjs/hct

hct /path/to/test.txt --algorithms sha256,farmhash,farmhash:64
```

### Algorithms 

By default the following algorithms are included

```
farmhash:32 
farmhash:64 
fnv1a:32 
fnv1a:64 
md5:128 
sdbm:32 
sha1:128 
sha256:256 
sha512:512 
xxhash:32 
xxhash:64
xxhash:128 
```
### Composite
sometimes its useful to use two different hash algorithms together to get a more complex key, any algorithim can be combined with a `__`

- `farmhash__sha1` would generate a `32` + `128` bit hash
- `farmhash__sdbm__fnv1a` would generate a `32` + `32` + `32` bit hash

### Sub hashes

Sometimes hashes are too long, so hashes can be sliced into smaller hashes

- `sha1:64` use the first `64` bits of a sha1 hash
- `sha256:128` use the first `128` bits of a sha256 hash

### Combined

- `farmhash:16__sha1:16` use the first `16` bits of sha1 and farmhash to generate a 32 bit key

## Results


### Building

```bash
yarn

yarn build

./hct /path/to/test.txt --algorithms sha256,farmhash,farmhash:64
```