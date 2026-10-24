import type {NextConfig} from 'next';
import fs from 'fs';
import path from 'path';

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
    }

    config.plugins = config.plugins || [];
    config.plugins.push({
      apply(compiler: {
        hooks: {
          afterEmit: {tap: (name: string, fn: () => void) => void};
          done: {tap: (name: string, fn: () => void) => void};
        };
      }) {
        compiler.hooks.afterEmit.tap('SyncServerChunksPlugin', () => {
          syncServerChunks();
        });
        compiler.hooks.done.tap('SyncServerChunksPlugin', () => {
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
