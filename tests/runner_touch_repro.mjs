import { webkit, chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
  console.log('--- RUNNING PLAYWRIGHT RUNNER TOUCH TEST ---');

  // Read current bundle HTML
  const bundleModulePath = path.resolve(__dirname, '../src/assets/runnerGameHtml.js');
  const bundleContent = fs.readFileSync(bundleModulePath, 'utf8');

  // Extract RUNNER_GAME_HTML string from export
  const match = bundleContent.match(/export const RUNNER_GAME_HTML = ([\s\S]*?);\s*$/);
  if (!match) {
    throw new Error('Could not parse RUNNER_GAME_HTML from runnerGameHtml.js');
  }
  const html = JSON.parse(match[1]);

  console.log(`HTML Bundle loaded. Length: ${html.length} bytes.`);

  // Attempt WebKit first, fallback to Chromium if WebKit binary is unavailable
  let browserType = webkit;
  let browser;
  try {
    browser = await webkit.launch({ headless: true });
    console.log('Using browser engine: WebKit (Safari / iOS WKWebView engine)');
  } catch (err) {
    console.warn('WebKit launch warning, trying chromium:', err.message);
    browser = await chromium.launch({ headless: true });
    console.log('Using browser engine: Chromium (fallback)');
  }

  // Emulate iPhone 14 Pro
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
  });

  const page = await context.newPage();

  const consoleLogs = [];
  const errors = [];

  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      console.error('[BROWSER CONSOLE ERROR]', msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push(err);
    console.error('[BROWSER PAGE ERROR]', err.message);
  });

  // Set HTML content
  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  // Wait 500ms for initial scripts execution
  await page.waitForTimeout(500);

  // Check if THREE is defined
  const isThreeDefined = await page.evaluate(() => typeof window.THREE !== 'undefined');
  console.log('Three.js initialized in window:', isThreeDefined);

  // Check if start button exists
  const btnStart = await page.$('#btn-start');
  console.log('Button #btn-start found in DOM:', !!btnStart);

  if (!btnStart) {
    await browser.close();
    throw new Error('FAILED: #btn-start not found in DOM!');
  }

  // Tap #btn-start using touch tap
  console.log('Dispatching touch tap on #btn-start...');
  await page.tap('#btn-start', { timeout: 5000 });

  // Wait 1000ms for game transition and animation frames
  await page.waitForTimeout(1000);

  // Check game state
  const gameState = await page.evaluate(() => {
    return {
      hasStartRunnerNow: typeof window.startRunnerNow === 'function',
      hasResetGame: typeof window.resetGame === 'function',
      modalDisplay: document.getElementById('start-modal') ? document.getElementById('start-modal').style.display : null,
      threeAvailable: typeof window.THREE !== 'undefined',
      stateRunning: typeof state !== 'undefined' ? state.isRunning : (window.gameState ? window.gameState.isRunning : null),
      distance: window.gameState ? window.gameState.distance : 0,
      debugBadge: document.getElementById('runner-debug-badge') ? document.getElementById('runner-debug-badge').innerText : null
    };
  });

  console.log('Game state evaluation after tap:', gameState);

  const screenshotPath = path.resolve(__dirname, 'runner_running_proof.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.close();

  // Assertions
  if (errors.length > 0) {
    const errorMsg = errors.map(e => e.message).join(' | ');
    throw new Error(`TEST FAILED: Uncaught browser errors encountered: ${errorMsg}`);
  }

  if (!gameState.threeAvailable) {
    throw new Error('TEST FAILED: window.THREE was NOT defined (Script execution crashed before Three.js ready)!');
  }

  if (gameState.modalDisplay !== 'none') {
    throw new Error('TEST FAILED: start-modal was NOT hidden after tapping Start button!');
  }

  if (!gameState.stateRunning) {
    throw new Error('TEST FAILED: gameState.isRunning was false after tapping Start button!');
  }

  console.log('>>> TEST PASSED: Runner 3D started successfully on touch tap! <<<');
}

runTest().catch(err => {
  console.error('\n' + err.message);
  process.exit(1);
});
