const { test, expect } = require("@playwright/test");

async function waitForLaunch(page) {
  const opening = page.locator("#openingSequence");
  await expect(opening).toBeAttached();
  await expect(opening).toHaveClass(/hidden/, { timeout: 10_000 });
}

async function sectionTop(page, sectionId) {
  return page.evaluate((id) => {
    const node = document.getElementById(id);
    if (!node) {
      return Number.POSITIVE_INFINITY;
    }
    return Math.round(node.getBoundingClientRect().top);
  }, sectionId);
}

async function openSite(page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
}

test("loader is visible then cleanly completes", async ({ page }) => {
  await openSite(page);
  await expect(page.locator("#loadingStage")).toContainText("BATCAVE", { timeout: 2_000 });
  await waitForLaunch(page);
  await expect(page.locator("#openingSequence")).toHaveClass(/hidden/);
});

test("CTA classes toggle for press/release/focus", async ({ page }) => {
  await openSite(page);
  await waitForLaunch(page);

  const ignite = page.locator('[data-cta="ignite"]');
  await ignite.dispatchEvent("pointerdown", { pointerType: "touch", button: 0 });
  await expect(ignite).toHaveClass(/is-pressed/);

  await ignite.dispatchEvent("pointerup", { pointerType: "touch", button: 0 });
  await expect(ignite).not.toHaveClass(/is-pressed/);

  const showreel = page.locator('[data-cta="showreel"]');
  await showreel.focus();
  await expect(showreel).toHaveClass(/is-focused/);
  await page.locator("body").click({ position: { x: 2, y: 2 } });
  await expect(showreel).not.toHaveClass(/is-focused/);

  const gridToggle = page.locator('.toggle-btn[data-view="grid"]');
  await gridToggle.dispatchEvent("pointerdown", { pointerType: "touch", button: 0 });
  await expect(gridToggle).toHaveClass(/is-pressed/);
  await gridToggle.dispatchEvent("pointerup", { pointerType: "touch", button: 0 });
  await expect(gridToggle).not.toHaveClass(/is-pressed/);

  const dockShowreel = page.locator('.dock-btn[data-jump="#showreel"]');
  await dockShowreel.dispatchEvent("pointerdown", { pointerType: "touch", button: 0 });
  await expect(dockShowreel).toHaveClass(/is-pressed/);
  await dockShowreel.dispatchEvent("pointerup", { pointerType: "touch", button: 0 });
  await expect(dockShowreel).not.toHaveClass(/is-pressed/);
});

test("Ignite Sequence opens surprise panel", async ({ page }) => {
  await openSite(page);
  await waitForLaunch(page);

  await page.locator('[data-cta="ignite"]').dispatchEvent("click");
  await expect(page.locator("#surprisePanel")).toHaveClass(/open/);
});

test("hero anchor CTAs navigate after feedback", async ({ page }) => {
  await openSite(page);
  await waitForLaunch(page);

  await page.locator('[data-cta="showreel"]').dispatchEvent("click");
  await expect
    .poll(async () => sectionTop(page, "showreel"), { timeout: 8_000 })
    .toBeLessThan(260);

  await page.locator('[data-cta="manifesto"]').dispatchEvent("click");
  await expect
    .poll(async () => sectionTop(page, "wishes"), { timeout: 8_000 })
    .toBeLessThan(320);
});

test("mobile showreel swipe and sticky rail stay stable", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile validation only");

  await openSite(page);
  await waitForLaunch(page);
  await page.locator('[data-cta="showreel"]').dispatchEvent("click");

  const board = page.locator("#filmBoard");
  await expect(board).toHaveClass(/mobile-swipe/);
  await expect(page.locator(".film-card.active")).toHaveCount(1);

  const before = await page.evaluate(() => {
    const active = document.querySelector(".film-card.active");
    return active ? Array.from(document.querySelectorAll(".film-card")).indexOf(active) : -1;
  });

  await page.evaluate(() => {
    const node = document.getElementById("filmBoard");
    if (!node) {
      return;
    }
    node.scrollBy({ left: Math.round(node.clientWidth * 0.95), behavior: "instant" });
    node.dispatchEvent(new Event("scroll", { bubbles: true }));
  });

  await page.waitForTimeout(200);
  const after = await page.evaluate(() => {
    const active = document.querySelector(".film-card.active");
    return active ? Array.from(document.querySelectorAll(".film-card")).indexOf(active) : -1;
  });

  expect(after).not.toBe(before);

  const railPosition = await page.evaluate(() => getComputedStyle(document.querySelector(".top-rail")).position);
  expect(railPosition).toBe("sticky");
});
