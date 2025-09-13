# Deploy to GitHub Pages - PWA Installation Guide

## Quick Deploy Steps

### 1. Create Icons First
Open `icon-generator.html` in your browser and download all icons to the `icons/` folder.

### 2. Push to GitHub
```bash
git add .
git commit -m "Add PWA support"
git push origin main
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Choose **main** branch and **/ (root)** folder
5. Click **Save**

### 4. Wait for Deployment
- GitHub Pages will take 2-10 minutes to deploy
- Your site will be available at: `https://[username].github.io/[repository-name]/`

## Testing PWA Installation

### Desktop (Chrome/Edge)
1. Visit your GitHub Pages URL
2. Look for the install icon (⊕) in the address bar
3. Or click the three dots menu → "Install CTU Danao Smart Bins"
4. Click **Install** in the dialog

### Mobile (Android)
1. Open Chrome and visit your site
2. You should see an "Add to Home Screen" banner
3. Or tap menu → "Add to Home screen"

### iOS (Safari)
1. Open Safari and visit your site
2. Tap Share button
3. Select "Add to Home Screen"

## Troubleshooting

### Still showing "Create shortcut" instead of "Install"?

1. **Clear browser data:**
   - Chrome: Settings → Privacy → Clear browsing data
   - Select "Cached images and files" and "Cookies"
   - Clear data for your GitHub Pages domain

2. **Check PWA requirements in DevTools:**
   - Open Chrome DevTools (F12)
   - Go to **Application** tab
   - Click **Manifest** - should show no errors
   - Click **Service Workers** - should be registered
   - Run **Lighthouse** audit → PWA section

3. **Common fixes:**
   - Ensure all icon files exist in `icons/` folder
   - Make sure you're using HTTPS (GitHub Pages provides this)
   - Service worker must be registered successfully
   - Wait a few minutes after deployment for changes to propagate

### Required for PWA Installation
✅ HTTPS connection (GitHub Pages provides)
✅ Valid manifest.json with required fields
✅ Service Worker registered
✅ Icons (192x192 and 512x512 minimum)
✅ Responsive viewport meta tag
✅ Works offline (via Service Worker)

## File Checklist
Make sure these files exist:
- [x] index.html
- [x] manifest-simple.json
- [x] sw.js
- [x] script.js
- [x] style.css
- [x] offline.html
- [ ] icons/icon-192.png
- [ ] icons/icon-512.png

## Test Your PWA
After deployment, test at:
- https://www.pwabuilder.com/
- Chrome DevTools Lighthouse audit

Your PWA should now be installable! 🎉
