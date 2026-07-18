const { test, expect } = require('@playwright/test');
const path = require('path');

const fileUrl = 'file://' + path.resolve(__dirname, '../index.html');

test.describe('Collapsible Cards', () => {
    test('on mobile - start closed, toggle on click', async ({ page }) => {
        // Set viewport to mobile width
        await page.setViewportSize({ width: 375, height: 667 });
        
        await page.goto(fileUrl);
        
        // Find the collapsible value cards
        const cards = page.locator('.value-card-collapsible');
        await expect(cards).toHaveCount(3);
        
        // Assert they all start closed (have display: none on the content)
        for (let i = 0; i < 3; i++) {
            const content = cards.nth(i).locator('.value-card-content');
            await expect(content).toBeHidden();
        }
        
        // Click the first card's header to open it
        const firstHeader = cards.nth(0).locator('.value-card-header');
        await firstHeader.click();
        
        // Assert it is now open
        const firstContent = cards.nth(0).locator('.value-card-content');
        await expect(firstContent).toBeVisible();
        
        // Click again to close
        await firstHeader.click();
        await expect(firstContent).toBeHidden();
    });

    test('on desktop - start open and not toggleable', async ({ page }) => {
        // Set viewport to desktop width
        await page.setViewportSize({ width: 1024, height: 768 });
        
        await page.goto(fileUrl);
        
        const cards = page.locator('.value-card-collapsible');
        
        // Assert they are all visible by default
        for (let i = 0; i < 3; i++) {
            const content = cards.nth(i).locator('.value-card-content');
            await expect(content).toBeVisible();
            
            // Try clicking the header
            const header = cards.nth(i).locator('.value-card-header');
            await header.click();
            
            // Should still be visible because pointer-events/toggles are disabled on desktop
            await expect(content).toBeVisible();
        }
    });
});

test.describe('Infinite Swipe Carousels', () => {
    test('on mobile - swipe containers have clones and scroll loop works', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(fileUrl);

        // Find mobile swiper containers
        const featureGrids = page.locator('.feature-grid');
        
        // We will test the first grid (e.g. Boyfriend mode in Action)
        const grid = featureGrids.first();
        
        // Check if clones are created
        const preClones = grid.locator('[data-clone-pre="true"]');
        const postClones = grid.locator('[data-clone-post="true"]');
        
        await expect(preClones).not.toHaveCount(0);
        await expect(postClones).not.toHaveCount(0);

        // Wait for infinite scroll initialization layout and position centering
        await page.waitForTimeout(500);

        // Get initial scrollLeft
        const initialScrollLeft = await grid.evaluate(el => el.scrollLeft);
        expect(initialScrollLeft).toBeGreaterThan(0);
    });
});
