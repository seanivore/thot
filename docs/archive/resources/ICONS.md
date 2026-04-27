# Leftover Updates Pulled from `docs/archive/v2/v2_0_0_FEEDBACK.md`

### Icons 

**This is how they're listed in the `YOUR_THOTS.md` document**

  ```
  ├── public/
  │   ├── favicon.ico                    # From AppIcon (16x16)
  │   ├── apple-touch-icon.png           # From AppIcon (180x180)
  │   └── manifest.json                  # PWA manifest
  ```

  + But this not how they actually exist or how they're actually named
    - I added a new batch as well because I knew it would have the names with sizes
    - E.g. favicon.ico is actually 48x48 
  + **NOTE**: There is not a 'manifest.json` file in there at all

**Actual part 1: not sure why they are in both locations**

```
~/Development/thot/public/
└── icons
    ├── 1024.png
    ├── 128.png
    ├── 16.png
    ├── 192.png
    ├── 256.png
    ├── 32.png
    ├── 512.png
    └── 64.png
```

**Actual part 2: not sure where they are in both locations**

```
~/Development/thot/src/assets/icons
├── 1024.png
├── 128.png
├── 16.png
├── 256.png
├── 32.png
├── 512.png
└── 64.png
```

**These I created from my normal favicon site**

```
~/Development/thot/docs/favicon-and-other-icons/
├── html-package
│   ├── apple-touch-icon.png
│   ├── favicon-96x96.png
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── site.webmanifest
│   ├── web-app-manifest-192x192.png
│   └── web-app-manifest-512x512.png
├── next.js-app-files
│   ├── apple-icon.png
│   ├── favicon.ico
│   ├── icon0.svg
│   ├── icon1.png
│   └── manifest.json
└── next.js-public-files
    ├── web-app-manifest-192x192.png
    └── web-app-manifest-512x512.png
```

**I downloaded them for `next.js`** 

  + Step 1 batch was `docs/favicon-and-other-icons/next.js-app-files/...`
    - "Extract them to `<your next app>/src/app`"
    - "Because these files follow Next.js conventions, the corresponding HTML markups will be automatically generated."
  + Step 2 batch was `docs/favicon-and-other-icons/next.js-public-files/...`
    - "Extract them to `<your next app>/public`"
  + Step 3 "Insert the following code in the head section of `<your next app>/src/app/layout.tsx`:"
    `<meta name="apple-mobile-web-app-title" content="thots" />`

**Then I also downloaded the normal HTML batch**

  + It says `"After extracting step, it says "Insert the following code in the <head> section of your pages"`

  ```
  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="thots" />
  <link rel="manifest" href="/site.webmanifest" />
  ```
