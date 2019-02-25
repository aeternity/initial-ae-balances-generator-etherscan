# initial-ae-balances-generator-etherscan
Generate an `accounts.json` for the æeternity Mainnet genesis block.

```
$ head accounts.json
{
  "ak_2CC81QrxVxYD5T8eJcAUwJsfSRBS2fA1MpsccLRjJumZdFuD8g": 1162000000000000000,
    "ak_2ruXgsLy9jMwEqsgyQgEsxw8chYDfv2QyBfCsR6qtpQYkektWB": 5307138661548760000000,
    "ak_2r6Mmd53BTd2rRuYnV2KfLeGMmxAZJo8g79bfDMW2uBdWe4ax": 1444554454444446550,
    "ak_CGBUVnsR9EyAGz8iwdBgy6gNpKnCsZatDkmSnFogR1LTJSnMr": 3000000000000000000,
    "ak_2Zp5KWiMLT63G3kXM9jXw3yzfLqTeL9m8TyqqY2aQmKD7o3ap6": 204000000000000000000,
    "ak_2WXFcbPPFCgxgXmduQGDywfhGFRfe2GkkTjWKEEbf8jQQ44ZaC": 100000000000000000,
    "ak_f37nhJ2NyLR2LGb5PG9mGnYfLYLC2z2eFDkZFDrERYSo6zoLR": 123556789000000000,
    "ak_DJim8QGrk72aG7bDMkszdLPYfDL3AVhjvHcjPbrriDFWSTSgV": 500000000000000000,
    "ak_REvrRjqYYJWTGr2JikZiem2g1qfqBdb2fQ8pwmKVWHM2uLaV5": 500000000000000000000,
$
```

# a) Usage with Node.js

requires node.js, git and etherscan.io api key

- https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
- https://nodejs.org/en/download/
- https://etherscan.io/register

`node initial-balances-generator-etherscan.js -k XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

where: `-k [Etherscan.io api key]`


# b) Usage with Docker

requires docker-ce, git and etherscan.io api key

- https://docs.docker.com/install/
- https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

```
git clone https://github.com/aeternity/initial-ae-balances-generator-etherscan.git
cd initial-ae-balances-generator-etherscan
docker build -t aeternity/token-burn-listener-etherscan .
touch accounts.json
docker run --rm -it -v $(pwd)/accounts.json:/usr/src/code/accounts.json aeternity/token-burn-listener-etherscan -k XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
shasum -a 256 accounts.json
```

where: `-k [Etherscan.io api key]`

# Verify

Verify sha256 of `accounts.json`

```
$ shasum -a 256 accounts.json

761e27a90d931551a5f5d3a8f9014a276292ba6a780db1c0013e7996770cab69  accounts.json
```
