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

    const chunksDir = path.join(serverDir, 'chunks');
    if (fs.existsSync(chunksDir)) {
      for (const file of fs.readdirSync(chunksDir)) {
        if (file.endsWith('.js')) {
          const src = path.join(chunksDir, file);
          const dest = path.join(serverDir, file);
          if (!fs.existsSync(dest)) {
            fs.copyFileSync(src, dest);
          }
        }
      }
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

let devManifestWatchdogStarted = false;

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
      ensureDevManifests();
      if (!devManifestWatchdogStarted) {
        devManifestWatchdogStarted = true;
        const timer = setInterval(ensureDevManifests, 100);
        if (typeof timer.unref === 'function') {
          timer.unref();
        }
      }
      config.plugins = config.plugins || [];
      config.plugins.push({
        apply(compiler: {
          hooks: {
            beforeCompile: {tap: (name: string, fn: () => void) => void};
            afterCompile: {tap: (name: string, fn: () => void) => void};
            done: {tap: (name: string, fn: () => void) => void};
          };
        }) {
          compiler.hooks.beforeCompile.tap(
            'EnsureDevManifestsPlugin',
            ensureDevManifests
          );
          compiler.hooks.afterCompile.tap(
            'EnsureDevManifestsPlugin',
            ensureDevManifests
          );
          compiler.hooks.done.tap(
            'EnsureDevManifestsPlugin',
            ensureDevManifests
          );
        },
      });
    }
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


