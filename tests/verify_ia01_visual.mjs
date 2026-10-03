import { webkit, chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('Launching browser to verify IA-01 visual layout...');
  let browser;
  try {
    browser = await webkit.launch({ headless: true });
    console.log('Using WebKit (iOS Safari engine)');
  } catch (err) {
    console.log('Falling back to chromium with msedge channel:', err.message);
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  }
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  try {
    console.log('Navigating to http://localhost:8081...');
    await page.goto('http://localhost:8081', { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Set valid persisted user profile ID
    await page.evaluate(() => {
      localStorage.setItem('vmh_user_id', 'vmh_1783852135547_epn3718r');
    });

    console.log('Reloading with persisted user session...');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);

    // If on onboarding screen, complete it
    const submitBtn = page.locator('text=KÍCH HOẠT HỒ SƠ');
    if (await submitBtn.count() > 0) {
      console.log('Onboarding screen detected. Filling required fields...');
      const nameInput = page.locator('input[placeholder*="Minh Anh"]');
      if (await nameInput.count() > 0) {
        await nameInput.fill('Tester GenZ');
      }

      // Check age confirmation checkbox
      const ageCheck = page.locator('[data-testid="checkbox-age-16"]');
      if (await ageCheck.count() > 0) {
        await ageCheck.click();
        await page.waitForTimeout(500);
      }

      console.log('Submitting onboarding...');
      const submitBtn = page.locator('[data-testid="btn-submit-onboarding"]');
      if (await submitBtn.count() > 0) {
        await submitBtn.click();
        await page.waitForTimeout(5000);
      }
    }

    // If daily checkin modal is showing, close it
    const closeCheckinBtn = page.locator('text=Đóng');
    if (await closeCheckinBtn.count() > 0) {
      console.log('Closing daily checkin modal...');
      await closeCheckinBtn.click();
      await page.waitForTimeout(1000);
    }

    // Screenshot home screen with all cards visible and dock
    const homeScreenshotPath = path.join(__dirname, 'ia01_home_screen_proof.png');
    await page.screenshot({ path: homeScreenshotPath });
    console.log(`Saved screenshot to ${homeScreenshotPath}`);

    // Verify FAB [+] is present
    const fabButton = page.locator('[data-testid="nav-fab-plus"]');
    const fabCount = await fabButton.count();
    console.log(`Found FAB [+] button count: ${fabCount}`);

    // Tap FAB [+]
    if (fabCount > 0) {
      console.log('Tapping FAB [+]...');
      await fabButton.click();
      await page.waitForTimeout(1500);
      const fabModalScreenshotPath = path.join(__dirname, 'ia01_fab_modal_proof.png');
      await page.screenshot({ path: fabModalScreenshotPath });
      console.log(`Saved FAB modal screenshot to ${fabModalScreenshotPath}`);

      // Close modal by clicking backdrop or tapping an action
      console.log('Closing FAB modal...');
      await page.locator('text=Ghi Khoản Chi Tiêu').click();
      await page.waitForTimeout(1000);
    }

    // Tap Wallet Tab
    const walletTab = page.locator('[data-testid="nav-tab-wallet"]');
    const walletCount = await walletTab.count();
    console.log(`Found Wallet tab count: ${walletCount}`);
    if (walletCount > 0) {
      console.log('Tapping Wallet tab...');
      await walletTab.click();
      await page.waitForTimeout(1500);
      const walletScreenshotPath = path.join(__dirname, 'ia01_wallet_screen_proof.png');
      await page.screenshot({ path: walletScreenshotPath });
      console.log(`Saved Wallet screenshot to ${walletScreenshotPath}`);
    }

    console.log('Visual verification complete!');
  } catch (err) {
    console.error('Visual verification error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();
