# Skill icon attribution

The SVG files in this folder are copied without modification from [tandpfun/skill-icons](https://github.com/tandpfun/skill-icons), commit [7f7e691e71aec64e8354bf697835e009d1ad80f8](https://github.com/tandpfun/skill-icons/tree/7f7e691e71aec64e8354bf697835e009d1ad80f8/icons).

Copyright (c) 2022 tandpfun. Distributed under the MIT License; the complete license is included in [LICENSE](LICENSE). Product names and logos belong to their respective owners. Their appearance identifies technologies used and does not imply endorsement.

`scripts/generate-stack-icons.mjs` composes these local sources into the four `assets/stack-*.svg` rows. The script changes display dimensions and prefixes internal SVG identifiers in the composed rows only. No network request or package installation is needed:

```sh
node scripts/generate-stack-icons.mjs
```

The React logo represents both React and React Native and is labelled accordingly in the relevant row's accessible title and profile text.

## Original Git blob checksums

| Source file | Git blob SHA |
| --- | --- |
| AWS-Dark.svg | `2aed204d50008326236c366db001c2bb0cccba07` |
| Docker.svg | `3d508c2634a66b567feb510e521f70bd71229c26` |
| Electron.svg | `e8fc507801a17bf5f089704063993660b12146f0` |
| ExpressJS-Dark.svg | `5f0a32416cb6ee2a08c750fd1642d2f00c72b8e0` |
| Git.svg | `28e85bc8a859f9c9b3c3aaa3f1b08aa4d4a37181` |
| JavaScript.svg | `991e5062abb2d350d4f93db7d227a0cfd206f6f6` |
| MongoDB.svg | `df96445cd38d1f38ba84391027e6cb6947d83d4e` |
| NextJS-Dark.svg | `cbc4e46a3c5644df4ccb3bbb20d73d19a4ba87ba` |
| NodeJS-Dark.svg | `18902f28d7f235f0987e8b458b022ce4c941c879` |
| PostgreSQL-Dark.svg | `b06ed5a0f6c67d8c5ca0132f311c8b81bb0655c3` |
| PyTorch-Dark.svg | `0321d29ad3f8bbcaf21b0b2d0caecaadb4bc71c3` |
| Python-Dark.svg | `dd0e485beea7c2840b65a4817c561b4ee90a2ae6` |
| React-Dark.svg | `9ba319e4bdcfd5756f289f1893ed755c5a1f59ab` |
| Redis-Dark.svg | `68ec898cb29f2e1b13047f93eb44355527954065` |
| Redux.svg | `00499f728d9a01b78ba577936287113303bd9e25` |
| TailwindCSS-Dark.svg | `499503e785436a61a34703e922aa570096875172` |
| TensorFlow-Dark.svg | `fe6224a7b54179157573f86d6ecdcbf73ee1d35d` |
| TypeScript.svg | `049e7c70ee7686dc8b505e3d1fe307ed973c8ecd` |
