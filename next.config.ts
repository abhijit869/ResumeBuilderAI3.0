import type {NextConfig} from 'next';
import fs from 'fs';
import path from 'path';

function writeJsonIfMissing(filePath: string, data: unknown) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), {recursive: true});
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
  } catch {
    // ignore concurrent write errors
  }
}

function ensureDevManifests() {
  try {
    const distDir = path.join(process.cwd(), '.next');
    if (!fs.existsSync(path.join(distDir, 'package.json'))) {
      return;
    }
    const serverDir = path.join(distDir, 'server');
    if (!fs.existsSync(serverDir)) {
      fs.mkdirSync(serverDir, {recursive: true});
    }

    writeJsonIfMissing(path.join(distDir, 'routes-manifest.json'), {
      version: 3,
      pages404: true,
      caseSensitive: false,
      basePath: '',
      redirects: [
        {
          source: '/:path+/',
          destination: '/:path+',
          internal: true,
          statusCode: 308,
          regex: '^(?:\\/((?:[^\\/]+?)(?:\\/(?:[^\\/]+?))*))\\/$',
        },
      ],
      headers: [],
      dynamicRoutes: [],
      staticRoutes: [],
      dataRoutes: [],
      rsc: {
        header: 'RSC',
        varyHeader:
          'RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch',
        prefetchHeader: 'Next-Router-Prefetch',
        didPostponeHeader: 'x-nextjs-postponed',
        contentTypeHeader: 'text/x-component',
        suffix: '.rsc',
        prefetchSuffix: '.prefetch.rsc',
        prefetchSegmentHeader: 'Next-Router-Segment-Prefetch',
        prefetchSegmentSuffix: '.segment.rsc',
        prefetchSegmentDirSuffix: '.segments',
      },
      rewrites: {beforeFiles: [], afterFiles: [], fallback: []},
    });

    writeJsonIfMissing(path.join(distDir, 'prerender-manifest.json'), {
      version: 4,
      routes: {},
      dynamicRoutes: {},
      notFoundRoutes: [],
      preview: {
        previewModeId: 'b576a24ebd575248bf988754cc60aef8',
        previewModeSigningKey:
          '299dd3b3b6375ed3996fd28c56ff17f46ad9d56a201c63896d901b56053011d2',
        previewModeEncryptionKey:
          '670c851bebaa79017d8127fe38690fb9c8bceac188a888ddf2a34a299dea1260',
      },
    });

    writeJsonIfMissing(path.join(serverDir, 'app-paths-manifest.json'), {});
    writeJsonIfMissing(path.join(serverDir, 'pages-manifest.json'), {});
  } catch {
    // ignore
  }
}

function syncServerChunks() {
  try {
    const distDir = path.join(process.cwd(), '.next');
    const serverDir = path.join(distDir, 'server');
    if (!fs.existsSync(serverDir)) {
      return;
    }
    const chunksDir = path.join(serverDir, 'chunks');
    if (fs.existsSync(chunksDir)) {
      for (const file of fs.readdirSync(chunksDir)) {
        if (file.endsWith('.js')) {
          const src = path.join(chunksDir, file);
          const dest = path.join(serverDir, file);
          const srcStat = fs.statSync(src);
          if (srcStat.size > 0) {
            const shouldCopy =
              !fs.existsSync(dest) ||
              fs.statSync(dest).size !== srcStat.size ||
              srcStat.mtimeMs > fs.statSync(dest).mtimeMs;
            if (shouldCopy) {
              const tmp = `${dest}.tmp.${process.pid}`;
              fs.copyFileSync(src, tmp);
              fs.renameSync(tmp, dest);
            }
          }
        }
      }
    }

    const runtimePath = path.join(serverDir, 'webpack-runtime.js');
    if (fs.existsSync(runtimePath)) {
      const content = fs.readFileSync(runtimePath, 'utf8');
      const devTarget =
        'installChunk(require("./" + __webpack_require__.u(chunkId)));';
      const devReplacement =
        'installChunk((function(p){try{return require("./"+p)}catch(e){return require("./chunks/"+p)}})(__webpack_require__.u(chunkId)));';
      const prodTarget =
        'installChunk(require("./chunks/" + __webpack_require__.u(chunkId)));';
      const prodReplacement =
        'installChunk((function(p){try{return require("./chunks/"+p)}catch(e){return require("./"+p)}})(__webpack_require__.u(chunkId)));';

      let patched = content;
      if (patched.includes(devTarget)) {
        patched = patched.replace(devTarget, devReplacement);
      }
      if (patched.includes(prodTarget)) {
        patched = patched.replace(prodTarget, prodReplacement);
      }
      if (patched !== content) {
        const tmp = `${runtimePath}.tmp.${process.pid}`;
        fs.writeFileSync(tmp, patched, 'utf8');
        fs.renameSync(tmp, runtimePath);
      }
    }
  } catch {
    // ignore
  }
}

let devManifestWatchdogStarted = false;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  experimental: {
    devtoolSegmentExplorer: false,
  },
  env: {
    NEXT_PUBLIC_FIREBASE_EMAIL_AUTH_ENABLED:
      process.env.NEXT_PUBLIC_FIREBASE_EMAIL_AUTH_ENABLED || 'false',
    DISABLE_HMR: process.env.DISABLE_HMR || 'true',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    if (dev) {
      config.cache = false;
      ensureDevManifests();
      syncServerChunks();
      if (!devManifestWatchdogStarted) {
        devManifestWatchdogStarted = true;
        const timer = setInterval(() => {
          ensureDevManifests();
          syncServerChunks();
        }, 200);
        if (typeof timer.unref === 'function') {
          timer.unref();
        }
      }
    }

    config.plugins = config.plugins || [];
    config.plugins.push({
      apply(compiler: {
        hooks: {
          beforeCompile: {tap: (name: string, fn: () => void) => void};
          afterEmit: {tap: (name: string, fn: () => void) => void};
          done: {tap: (name: string, fn: () => void) => void};
        };
      }) {
        if (dev) {
          compiler.hooks.beforeCompile.tap(
            'EnsureDevManifestsPlugin',
            ensureDevManifests
          );
        }
        compiler.hooks.afterEmit.tap('EnsureDevManifestsPlugin', () => {
          if (dev) ensureDevManifests();
          syncServerChunks();
        });
        compiler.hooks.done.tap('EnsureDevManifestsPlugin', () => {
          if (dev) ensureDevManifests();
          syncServerChunks();
        });
      },
    });

    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;


