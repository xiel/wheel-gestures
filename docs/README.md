# wheel-gestures website

The Next.js website includes the documentation, Embla gallery, looping time picker,
wheel visualizer, and recorder.

## Develop

From the repository root, using Node 18 or newer and Yarn Classic:

```sh
yarn --cwd docs install --frozen-lockfile
yarn --cwd docs dev
```

Open [localhost:3000](http://localhost:3000).

All website imports of `wheel-gestures`, including those inside
`embla-carousel-wheel-gestures`, resolve to this checkout's `src/index.ts`.
Edits under `src/` are compiled and watched directly by Next.js. No `yarn link`,
root library build, or separate `yarn start` watcher is required.

`next.config.mjs` applies an exact package alias in both development and production
builds. The Embla plugin is bundled rather than externalized on the server, so
its dependency uses that alias too. `tsconfig.json` maps the same package name to
local source for type checking. Embla and its plugin still use the published
versions pinned in `package.json`; only `wheel-gestures` is sourced locally.

An installed registry copy of `wheel-gestures` may still exist in `node_modules`
as a dependency. Plain Node resolution can report that copy (or an old Yarn
link); it does not reflect the website's configured bundler resolution.

Use the documented `dev` script (Next's webpack mode). The webpack alias is not
configured for `next dev --turbo`.

## Check and build

```sh
yarn --cwd docs lint
yarn --cwd docs build
yarn --cwd docs start
```

The production build checks TypeScript and compiles the same local source used
in development. Deployments must include both `docs/` and the repository's
`src/` directory. If the deployment project root is `docs/`, allow access to files
outside that root.

For the library's own tests and package builds, install dependencies at the
repository root and use the root scripts as usual.

## Demo maintenance

The time picker uses Embla 8.6.0 and wheel plugin 8.0.5. The plugin is deliberately
pinned below 8.1.0: that release treats scroll progress at zero as a boundary even
when Embla loops, blocking reverse wheel input from `00`. Upgrade once a compatible
release handles looping boundaries correctly. Check both `00 → 23/59` and
`23/59 → 00`, using wheel input as well as keyboard controls, before changing it.
The non-looping photo gallery shares this plugin version.

The picker replaces Embla's flat translations with the 3D presentation; Embla still
owns dragging, wheel input through the plugin, snapping, and looping. The example
source and styles displayed on the examples page are read from the component files
at build time. Keep its CSS item height and TypeScript `ITEM_HEIGHT` in sync.

The momentum visualizer uses `@react-spring/web` and `@use-gesture/react` and runs
with React Strict Mode enabled. No dependency patches or postinstall scripts are
needed. When changing the demo, check wheel input, pointer dragging, recorder
start/stop, and navigation away and back for duplicate listeners.
