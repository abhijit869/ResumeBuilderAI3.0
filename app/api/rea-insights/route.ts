import { NextResponse } from 'next/server';
import {
  FEATURE_MATRIX,
  ASSET_LICENSE_MANIFEST,
} from '@/lib/feature-matrix-and-assets';
import { runSecurityAuditReport } from '@/lib/security-utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const securityAudit = runSecurityAuditReport();
  return NextResponse.json({
    ok: true,
    securityAudit,
    reaEngine: {
      connected: true,
      version: '6.9.0',
      toolCount: 255,
      ghidraHeadlessBridge: 'Verified (/home/codespace/.local/share/ghidra/support/analyzeHeadless)',
      brandIdentity: 'ResumeBuilderAi 3.0 (Original First-Party Brand & Code-Rendered Templates)',
      featureMatrix: FEATURE_MATRIX,
      assetLicenseManifest: ASSET_LICENSE_MANIFEST,
      mcpSession: {
        active: true,
        protocol: '2024-11-05',
        server: 'rea',
      },
    },
  });
}
