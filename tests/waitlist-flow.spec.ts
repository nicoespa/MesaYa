import { test, expect } from '@playwright/test'

test.describe('Waitlist Flow', () => {
  test('complete waitlist flow from join to seated', async ({ page }) => {
    // Navigate to join page
    await page.goto('/join/kansas-belgrano')
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Kansas Belgrano')
    
    // Fill out the form
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="phone"]', '+5491123456789')
    await page.fill('input[name="size"]', '2')
    await page.fill('input[name="notes"]', 'Mesa cerca de la ventana')
    
    // Submit the form
    await page.click('button[type="submit"]')
    
    // Should show success message
    await expect(page.locator('h1')).toContainText('¡Te anotaste en la lista!')
    
    // Get the status link
    const statusButton = page.locator('text=Ver mi posición en la fila')
    await expect(statusButton).toBeVisible()
    
    // Click status link
    await statusButton.click()
    
    // Should open status page in new tab
    const newPage = await page.waitForEvent('popup')
    await newPage.waitForLoadState()
    
    // Verify status page shows correct info
    await expect(newPage.locator('h1')).toContainText('Kansas Belgrano')
    await expect(newPage.locator('text=Test User')).toBeVisible()
    await expect(newPage.locator('text=2')).toBeVisible() // party size
    
    // Close the status page
    await newPage.close()
  })

  test('dashboard shows party in queue', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard')
    
    // Should show dashboard
    await expect(page.locator('h1')).toContainText('Kansas Belgrano')
    
    // Should show stats cards
    await expect(page.locator('text=En Espera')).toBeVisible()
    await expect(page.locator('text=Sentados Hoy')).toBeVisible()
    
    // Should show QR code section
    await expect(page.locator('text=Código QR')).toBeVisible()
  })

  test('add party from dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Click add party button
    await page.click('text=Agregar Fila')
    
    // Should open dialog
    await expect(page.locator('text=Agregar a la Lista')).toBeVisible()
    
    // Fill form
    await page.fill('input[name="name"]', 'Dashboard Test User')
    await page.fill('input[name="phone"]', '+5491123456790')
    await page.fill('input[name="size"]', '3')
    await page.fill('input[name="notes"]', 'Test from dashboard')
    
    // Submit
    await page.click('button[type="submit"]')
    
    // Dialog should close and party should appear in list
    await expect(page.locator('text=Dashboard Test User')).toBeVisible()
  })

  test('party actions work', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Wait for parties to load
    await page.waitForSelector('[data-testid="party-list"]', { timeout: 10000 })
    
    // Find a party and test actions
    const partyRow = page.locator('[data-testid="party-item"]').first()
    await expect(partyRow).toBeVisible()
    
    // Test notify action
    const notifyButton = partyRow.locator('text=Notificar')
    if (await notifyButton.isVisible()) {
      await notifyButton.click()
      // Should show success or handle the action
    }
    
    // Test other actions if available
    const seatedButton = partyRow.locator('text=Sentar')
    if (await seatedButton.isVisible()) {
      await seatedButton.click()
    }
  })

  test('QR code generation', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Should show QR code section
    const qrSection = page.locator('text=Código QR')
    await expect(qrSection).toBeVisible()
    
    // Should show join URL
    const joinUrl = page.locator('input[readonly]')
    await expect(joinUrl).toHaveValue(/join\/kansas-belgrano/)
    
    // Should have download button
    const downloadButton = page.locator('text=Descargar QR')
    await expect(downloadButton).toBeVisible()
  })

  test('status page updates', async ({ page }) => {
    // Navigate directly to status page with demo token
    await page.goto('/status/demo-token-1')
    
    // Should show party info
    await expect(page.locator('text=María González')).toBeVisible()
    await expect(page.locator('text=Kansas Belgrano')).toBeVisible()
    
    // Should show position
    await expect(page.locator('text=#1')).toBeVisible()
    
    // Should have action buttons
    const actionButtons = page.locator('button')
    await expect(actionButtons.first()).toBeVisible()
  })

  test('mobile responsive design', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Test join page on mobile
    await page.goto('/join/kansas-belgrano')
    await expect(page.locator('h1')).toContainText('Kansas Belgrano')
    
    // Form should be usable on mobile
    await page.fill('input[name="name"]', 'Mobile Test')
    await page.fill('input[name="phone"]', '+5491123456789')
    await page.fill('input[name="size"]', '2')
    
    // Submit button should be visible and clickable
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
    await expect(submitButton).toBeEnabled()
  })

  test('PWA manifest is valid', async ({ page }) => {
    await page.goto('/')
    
    // Check manifest link
    const manifestLink = page.locator('link[rel="manifest"]')
    await expect(manifestLink).toHaveAttribute('href', '/manifest.webmanifest')
    
    // Check theme color
    const themeColor = page.locator('meta[name="theme-color"]')
    await expect(themeColor).toHaveAttribute('content', '#3b82f6')
    
    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]')
    await expect(viewport).toHaveAttribute('content', /width=device-width/)
  })
})
