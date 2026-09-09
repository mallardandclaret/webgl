# WebGL

![Status](https://img.shields.io/badge/status-archive-2ea44f) ![three.js](https://img.shields.io/badge/three.js-r143-000000?logo=threedotjs&logoColor=white) ![Physics](https://img.shields.io/badge/physics-cannon--es%20%7C%20Ammo.js-555555) ![Build](https://img.shields.io/badge/build-webpack%205-8DD6F9?logo=webpack&logoColor=black)

Real-time 3D scenes, physics simulations and a versioned library of 3D assets, built on three.js and WebGL.

This repository is an **archive**. It preserves the scene sources, numbered builds and asset generations from the studio's WebGL R&D programme. Active development takes place in project-specific repositories.

## Contents

- [Overview](#overview)
- [Stack](#stack)
- [Repository structure](#repository-structure)
- [Versioning](#versioning)
- [Local development](#local-development)
- [Conventions](#conventions)
- [Third-party code](#third-party-code)
- [Licence](#licence)

## Overview

The repository is organised around three concerns:

| Concern | Location | Purpose |
| --- | --- | --- |
| Scene builds and assets | `scroll2/` | Compiled scene bundles, models, textures and environment maps, kept as numbered generations. |
| Scene source | `scroll2/M&C3.0/`, `scroll2/unbuilt/`, `scroll3/unbuilt/` | Webpack projects that produce the scene bundles. |
| Experiments and reference | everything else | Standalone prototypes and vendored upstream projects. |

## Stack

| Layer | Technology |
| --- | --- |
| Rendering | [three.js](https://threejs.org/) r138 – r143, WebGL 2 |
| Physics | [cannon-es](https://github.com/pmndrs/cannon-es), [Ammo.js](https://github.com/kripken/ammo.js) (Bullet via WebAssembly) |
| Motion | [GSAP](https://gsap.com/) with ScrollTrigger |
| Assets | glTF 2.0 / GLB, [Draco](https://google.github.io/draco/) geometry compression, PBR texture sets, cube-map environments |
| Build | webpack 5, Babel |

## Repository structure

```
.
├── scroll2/                  Scene builds and asset library
│   ├── models/               glTF / GLB models and texture sets
│   │   └── 3.0/              Current model generation
│   ├── textures/             Environment maps and background plates
│   ├── fonts/                Typeface geometry for three.js text
│   ├── draco/                Draco decoder
│   ├── 3.0script/  K/  bp/   Scene folders, each holding numbered
│   ├── sf/  MCrooms/ storey/ builds plus scene-specific assets
│   ├── collective/  mcode/
│   ├── M&C3.0/               Scene source (three.js, cannon-es, webpack)
│   └── unbuilt/              Scroll scene source (three.js, GSAP, webpack)
│
├── scroll3/  ScrollS/  scroll/     Scroll-linked camera experiments
├── softbody/  compound/  compound2/ Ammo.js soft-body and cloth simulation
├── webflow/  Muller/
├── strip/                          PBR rendering and tone mapping
├── kinetic/  index.html            Kinetic typography (Lottie)
├── modeltest/  halov1/             Layout prototypes
├── halo-media-holding/  bdemo/
├── daffy/  documents/              Logo model, environment map, animation data
│
├── three.js-dev/  three.js-master/ Vendored upstream (see Third-party code)
├── Physijs/  AmmoEx/
├── enable_3d/  ammo/
├── 3d/  stem2/
│
└── *Poster.jpg  *PosterVid.mp4     Campaign stills and motion
```

## Versioning

Builds are versioned by folder rather than by tag. Each scene directory contains numbered build folders (`K/0` … `K/18`, `3.0script/224` … `3.0script/241`), and each number is a complete, self-contained build of that scene at a point in time.

Builds are **immutable**. A new build is always added as a new number. Existing builds, models and textures are never renamed, moved or overwritten, so any historical state of a scene can be reproduced exactly.

## Local development

Scene sources are standard webpack projects.

```bash
cd "scroll2/M&C3.0"
npm install
npm run dev
```

| Script | Effect |
| --- | --- |
| `npm run dev` | Development server with hot reload on `localhost:8080`. |
| `npm run build` | Optimised bundle, content-hashed, written to `dist/`. |

To record a build, create the next numbered folder in the scene's directory, copy the bundle in as `app.js`, and commit.

Experiments are static pages. Serve the repository root with any HTTP server and open the relevant folder.

## Conventions

- **Branch.** `staging` is the default branch and holds the canonical history.
- **Versioning.** Numeric, per scene, monotonically increasing. No tags.
- **Assets.** Models as glTF 2.0 or GLB, Draco-compressed where size warrants it. Textures as JPEG for colour, PNG where alpha or precision is needed. Environments as six-face cube maps under `textures/environmentMaps/<n>/`.
- **Immutability.** Never overwrite a recorded build. Add a new one.
- **Dependencies.** `node_modules` is committed in the webpack projects so that historical builds remain reproducible.

## Third-party code

Upstream projects are vendored for offline reference and retain their original licences and documentation.

| Path | Project | Licence |
| --- | --- | --- |
| `three.js-dev/`, `three.js-master/` | [three.js](https://github.com/mrdoob/three.js) r138dev, r143 | MIT |
| `Physijs/` | [Physijs](https://github.com/chandlerprall/Physijs) | MIT |
| `AmmoEx/` | [AmmoPhysics-extended](https://github.com/Oxynt/AmmoPhysics-extended) | MIT |
| `enable_3d/`, `ammo/` | [enable3d](https://enable3d.io/) and physics examples | MIT |
| `3d/` | [Fake 3D Image Effect](https://tympanus.net/codrops/?p=38413), Codrops | Codrops |
| `stem2/` | [three.js examples](https://stemkoski.github.io/Three.js/) by Lee Stemkoski | See upstream |

## Licence

Scenes, models and assets authored by Mallard & Claret are proprietary. Third-party code is licensed as listed above.

---

<p align="center"><a href="https://mallardandclaret.com/">Mallard &amp; Claret</a></p>
