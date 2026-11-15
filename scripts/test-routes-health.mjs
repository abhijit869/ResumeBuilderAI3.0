/**
 * Route Health & Page Rendering Verification Script
 */

const BASE_URL = 'http://localhost:3000';

const ROUTES_TO_AUDIT = [
  '/',
  '/dashboard',
  '/ats-checker',
  '/templates',
  '/career-map',
  '/cover-letter',
  '/interview-prep',
  '/p/alex-morgan-lead-architect',
  '/dashboard/resumes',
  '/robots.txt',
  '/sitemap.xml',
];

async function auditRoutes() {
  console.log('🌐 Auditing all application routes and document renderers...\n');
  let failures = 0;

  for (const route of ROUTES_TO_AUDIT) {
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}${route}`);
      const duration = Date.now() - start;
      const text = await res.text();
      const hasContent = text.length > 50;
      const isHtmlOrXml = res.headers.get('content-type')?.includes('text') || false;

      if (res.status === 200 && hasContent) {
        console.log(`✅ [200 OK] ${route.padEnd(32)} (${duration}ms, ${text.length} bytes)`);
      } else {
        console.error(`❌ [FAIL] ${route} -> Status: ${res.status}, Length: ${text.length}`);
        failures++;
      }
    } catch (err) {
      console.error(`❌ [CRASH] ${route} -> ${err.message}`);
      failures++;
    }
  }

  if (failures === 0) {
    console.log(`\n🎉 All ${ROUTES_TO_AUDIT.length} routes rendered successfully with 0 defects!`);
    process.exit(0);
  } else {
    console.error(`\n⚠️ ${failures} routes failed verification.`);
    process.exit(1);
  }
}

auditRoutes();
