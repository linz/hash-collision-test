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
djb2a:32
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

- `farmhash__sha1` would generate a `32 + 128` bit hash
- `farmhash__sdbm__fnv1a` would generate a `32 + 32 + 32` bit hash

### Sub hashes

Sometimes hashes are too long, so hashes can be sliced into smaller hashes

- `sha1:64` use the first 64 bits of a sha1 hash
- `sha256:128` use the first 128 bits of a sha256 hash

### Combined

- `farmhash:16__sha1:16` use the first 16 bits of sha1 and farmhash to generate a 32 bit key

## Results

Using the `covt-tile-list.txt` word list hash here are the collision results for some small bit count hashes

### 32 bit hashes
`farmhash`, `fnv1a`, `sdbm` and `djb2a` are the only 32 bit hashes in the system but 32bit prefixes can be used from other algorithms 

|Algorithm|Bits|Bits Used|Collisions|Duration|
|-|-|-|-|-|
|farmhash|32|32|41|666|
|sha1|128|32|41|1057|
|md5|128|32|40|1219|
|sha256|256|32|49|1236|
|fnv1a|32|32|109|903|
|djb2a|32|32|11|622|
|sdbm|32|32|0|761|

### 64 bit hash

|Algorithm|Bits|Bits Used|Collisions|Duration|
|-|-|-|-|-|
|farmhash|64|64|0|599|
|sha1|128|64|0|1093|
|md5|128|64|0|1224|
|sha256|256|64|0|1434|


32 bit algorithms could be combined to create a 64bit hash

|Algorithm|Bits|Bits Used|Collisions|Duration|
|-|-|-|-|-|
|fnv1a:32__djb2a:32|64|64|0|1328|
|fnv1a:32__sdbm:32|64|64|0|1208|
|djb2a:32__sdbm:32|64|64|0|1119|

### Building

```bash
yarn

yarn build

./hct /path/to/test.txt --algorithms sha256,farmhash,farmhash:64
```