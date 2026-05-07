# v4.0.0 Thot Update Planning

**Created**: 2026-05-06
**Version**: driving -> v4.0.0 (clean slate for clarity)
**Status**: Drafting 
**Update**: System clarity, basics for expansion before public release.

---

## Overview

Previous build documentation and history has been all over the place. This update will modernize our system and make clear our protocol for development and pathway forward. 

### Intention 

This document will serve as the beginning to a series of planning documents. First we need on overview that is comprehensive, breaks things down into milestones, creates parallel tracks, delineates research needs, and organizes all remaining fixes. From that, based on the milestone versions, we'll be able to create truly EXCLUSIVELY EXECUTABLE implementation guides, looping until we have everything right. This way we can focus on features right in front of us, while maintaining clear view of what's coming further down the line. These will be living documents, updated as the project develops, and will be paired with market research and other necessary business planning documents to illustrate our brand's legitimacy, development pragmatism, and paints a clear picture of exactly what problem Thot solves and who we are building it for. 

### Strategy High-Level Requirements

  1. A handful of simple, UX that users would expect of any application, like clickable URL likes, URL preview, anchor links, and a standard flow for saving and opening files; consider these us rounding out the basics. 
  2. Groundwork for our our feature moat aimed at making sure Thot feels like an intuitive shift in user workflow, while offering innovative but logical Markdown IDE Editor features that other tools have overlooked. 

### Focus 

This is open to your opinion and feedback, but I imagine we need something along these lines: 

  1. A comprehensive high-level plan overview of entire product lifespan as pitched so far so that we can group milestones into version releases that make strategic sense, maybe v4, v5, and a v6? 
  2. A detailed list of feedback and bugs that were not yet attended to. 
  3. Then one document for each version that details the implementation plan as it stands so that we can fill in gaps; identify research as needed now. 

### Growth 

Beyond developers, Thot's aim is to bring the magic of modern IDE markdown editors, like syntax highlighting and tab auto-completion, to users who default to Apple Notes or Google Docs; the kind of users who aren't likely to be persuaded to jump into learning markdown. No matter how you write, Thot's interface instantly and intuitively adapts. Many of these users have no idea that you can format an entire 20 page document in minutes thanks to tab completion, which is frankly still magical. Combine that with customizing exactly what amount of syntax highlighting helps them most, and it won't take long before they see how these tools lessen the cognitive load they're used to, freeing up mental space to maximize creativity. 

AI tools continue to rapidly grow the development industry, pushing use toward more markdown-heavy, planning-centric workflows. This will increase the demand for collaborative markdown editors, of which there is a current shortage. But in Thot, it won't just be your colleagues editing markdown documents live, but direct access to Claude built right into your documents; no need to go anywhere for a quick web search or to confirm you have the latest API documentation. 

---

## Understand Current App State 

  1. HIGHLIGHTING SYSTEM HISTORY 
      - I think that here `docs/archive/v4_0/UPDATE_MAP.md:99` is when I recognized how convoluted with logic issues the highlighting was 
        - It is the all caps and bold text lol; I think that was before we decided we should be making our own anyway 
        - If we really planned it out proper, it shouldn't be terrible difficult 
        - Then we'd have complete control and there wouldn't be any figuring things out
      - As of right now, there are still many highlights I gave up trying to get fixed because of the system issues
      - Then in `docs/archive/v3_0_USABILITY_UPDATE/v3_THREE_TRACK_IMPL.md:36` at "Track 2: Proprietary Highlighting System" 
        - We started to plan our own which I believe the planning, research, and anything else was on a local branch 
        - In `docs/archive/v3_0_USABILITY_UPDATE/v3_THREE_TRACK_UPDATE.md:49` I reference a document called "v3_HIGHLIGHTING" 
        - FOUND IT HERE: `docs/archive/research/1_DEEP/feature-research/HIGHLIGHTING.md`
      - **Now idk that it is going to be of any help, but it still do think that there should be research regarding creating our own system because I still lean in that direction, though I don't really want to start with any other people's work. I want it to be our IP.**
  2. INTELLIGENT FORMATTING UI 
    - Potentially first planned `docs/archive/v3_0_USABILITY_UPDATE/v3_THREE_TRACK_IMPL.md:53` at "Track 3: Intelligent Formatting UI" 
    - FOUND THE DOCUMENT HERE: `docs/archive/research/1_DEEP/feature-research/FORMATTING.md`
    - It would be great if we could find the actual user experience written description of how the interface worked 
      - That was very well pitched 
      - Perhaps you can find it 
    - `docs/archive/v3_0_USABILITY_UPDATE/UPDATE_MAP.md:175` "8. Intelligent Formatting Mode ⚠️ RESEARCH NEEDED"
    - **This is key to our moat and the idea that the tool should adjust intuitively based on how you are writing. It would also be great for our IP. Particularly if down the line we ended up training models on managing these systems.**
  3. URL CLICKABILITY AND ANCHORS 
     - This was never fully fleshed out and implemented 
     - Find some details here `docs/archive/v4_0/FEAT_URLS_ANCHORS.md`
     - **Obviously a must have for a functioning app.**
  4. This last session was intended "planning/research session, not a build/execution session"
     - `docs/archive/v4_0/RE_ORIENT_v3_4_0.md`
     - Frankly that document is a huge mess  
  5. Heading stacking feature: `docs/archive/v4_0/FEAT_HEADING_STACK.md`
  6. PWA title-bar: remove the duplicated `- Thot` suffix -- from `docs/archive/v4_0/RE_ORIENT_v3_4_0.md:68`
     - Currently shows `Thot - daily-planner.md - Thot` 
     - Want `Thot - daily-planner.md` 
     - Inspect document title source — likely a manifest + dynamic `document.title` doubling up. 
     - Critical files: `index.html`, wherever title is set in `src/main.ts` or a persistence module.
  7. Line numbers CSS** (exact CSS edits Sean dictated) — from `docs/archive/v4_0/RE_ORIENT_v3_4_0.md:69`
     - `.ͼ5 .cm-lineNumbers .cm-gutterElement`: `width: 18px` → `25px`; remove `align-content: flex-end`; add `padding-right: 5px`.
     - `.ͼ1 .cm-lineNumbers .cm-gutterElement`: remove `padding: 0 3px 0 5px`.
     - These are CodeMirror-generated class names; verify they're stable or use a more durable selector. Tokenize the width into `--thot-line-number-width`.
  8. Frontmatter color update to pale yellow — from `docs/archive/v4_0/RE_ORIENT_v3_4_0.md:73`
     - Not orange — currently same as headings 
     - Only highlight as frontmatter when at the top of the document AND with the canonical `---` fence — single hyphen line should not trigger.
  9. Checked todo `[x]` color change to a darker blue distinct from bullet-blue. — from `docs/archive/v4_0/RE_ORIENT_v3_4_0.md:74`
  10. Editor behavior fixes — from `docs/archive/v4_0/RE_ORIENT_v3_4_0.md:80-86`
      - **Line wrap stops below 1040px viewport** — fix wrap to be unconditional. Inspect editor container CSS / CodeMirror `EditorView.lineWrapping`.
      - **Always paste as plain text** — install a paste transformer that strips formatting on every paste.
      - **Curly→straight quotes on paste** — extend the same paste transformer to normalize `“ ” ‘ ’` to `" '`.
      - **List formatting bleeds onto next line** — when a line follows a list, it shouldn't inherit list styling. Likely a parser/styling continuation issue.
      - **Line-break-inside-list propagates blank lines** — adjust the list-continuation helper so a manual blank line in a list does not insert blank lines before each new bullet.
      - **Single hyphen triggering frontmatter color** — tighten frontmatter detection to require the canonical opening fence at line 1.
      - **`->` → `→`** — autocorrect rule (matches the existing autocorrect engine pattern).

## Purge Documents

As I continue down the document I mentioned above in a few numbers, I'm seeing more and more items that still need to be done. This seems to be the case in general. I would like to purge these documents and make a new, singular, truly comprehensive, and fully organized document that is properly structured and legible. I'm okay with leaving old documents in `docs/archive/v1_0_OLD_BUILD/...`, `docs/archive/v2_0_PWA_BUILD/...`, `docs/archive/v2_1_HIGHLIGHTING/...`, `docs/archive/v3_0_USABILITY_UPDATE/...`. For anything in `docs/archive/v4_0/...` let's move to a subdirectory called "processed". 

These are some of the most notable but might not be everything. I'm particularly interested in any of the earlier documents where I had written user-interface/user-experience for features like the intelligent formatting and for the columns layout with sticky notes that have AI populated details in some cases. 

  - `docs/archive/v4_0/v4_0_0_REGROUP.md`
  - `docs/archive/v3_0_USABILITY_UPDATE/UPDATE_MAP.md`
  - `docs/archive/v4_0/RE_ORIENT_v3_4_0.md`
  - `docs/archive/v4_0/SNAPSHOT_v3_1_2_.md`

---

## Shape Up Current App State

### Proper Vercel Deployment

  - Agent can use Vercel CLI tools for setup 
  - Current Vercel builds are failing each time this project is pushed to GIT 
  - Vercel was set up with `thot.august.style` which is currently active for the last proper release build
  - Might need a clean sweep of current Vercel project and or repo, then set up fresh 
  - Set up `main` branch to Vercel production deployment with the custom url 
  - Set up `dev` branch to Vercel preview deployment 
  - Ensure we can preview dev builds using Vercel's provided URL; we want to avoid localhost testing 

---

## Build Out Current App State 

It is time to start the user interface. To do that, we'll need to have a better grasp of the app's technical architecture, which there is more details on below, but also the UI / UX design architecture's strategy, plan, and tools we want to start implementing. We need to know what we need to do to ensure that our build is accommodating everything. 

### Prepare for User Preferences & System Settings

Choosing the color of the syntax highlighting is really important to us visual writers. We should give them normal language labeled access to every single scope we have; this will help us close current gaps I've been trying to close for a while now. 

  - Like the `non-ordered list item's icon (bullet point, asterisk, dash, etc.)` versus the `non-ordered list item (what is actually written next to the bullet)`
  - Last time we dug into that, we discovered that our highlighter system was a HUGE mess of overlapping and contradictory logic 
  - I think we might have fixed it, but we should really make sure to keep it in mind moving forward 
  - Also because we need to build and highlight the syntax for normal text writers, too, which shouldn't be that different, it just doesn't have symbols like # for heading for instance 

The current build and 
As we update and build out features, we need to make sure we are actively setting ourselves up to be able to easily wire up a UI where they'll be able to change the colors of the syntax highlighting, bullet points, list markers, etc. 

---

## Architecture Strategy

Working with PWAs I almost immediately was curious if they could be wrapped in the native app shell, and pleasantly surprised when I searched the web and found it to be a "hybrid approach that allows you to maintain a single web codebase while gaining access to device features that standard browsers often restrict, such as background geolocation, advanced push notifications, and system-level file access", as this is exactly what I was imagining. 

### PWA In Disguise

For scaling purposes, I was thinking that we should make the PWA the primary focus of Thot; where all the expected features life and what we'd update the most frequently. I don't want us to think of it as "the App Store version is the full featured version, and the PWA is trimmed down" — it seems much smarter to do the opposite: less effort for technically two more impressive products. 

  - The PWA will be the most robust version of Thot, with all the features that people would expect from a modern markdown editor. 
  - The wrapper would be bit more than a novelty because we can add additional features that are *only* available in that version. 
  - We can charge more for the app store version 

We would focus on building the web app first. 

Also, I don't even want to present web users with the option to download the web app. After exploring online, there is just a lot of irrational dislike for PWAs so no need to draw attention to it when everyone works in their browser tabs anyway. 

Plus, when releasing a macOS/iOS/iPadOS app, there wouldn't be any confusion with people using a lower quality UX from the PWA download.  

### Web App Future

  * **This strategy of focusing on the web app bodes well for future planned features.**

    - Collaborative integration for teams 
      - This seems like a **huge market opportunity** 
      - The technicals about this are beyond me as of now but I imagine we'd want to start at the web app level 
      - OAuth or something, and as much as I hate "login with Google, etc." services 
      - BUT THE MOST IMPORTANT IS PASSKEY

    - Connecting more directly to LLMs 
      - Answer questions posed just by typing "@claude please check to make sure that these are the most up-to-date API doc information for Stripe"
      - Even possibly "@claude will you sketch out the function for this..." 
      - Possibly live chatbot flow, as well as commenting and feedback annotations 
    
    - Subtle AI integrations 
      - I'm also really into the idea of even more subtle things like automatic formatting 
      - And of course, our **MUST HAVE** tab auto-completion
      - Triggering subagent crawlers to look for gaps and work on the implementation plan loop iteration in general 
      - Oh and I really love in Dia when the Tab Groups automatically name themselves based on content -- anything smart like that 

  * **AI Integration Notes**

    - Apps that are not affiliated with Anthropic allow users to login using Claude subscription; example: `https://www.pencil.dev`
    - Stripe billing has LLM token that adjusts for model

### Native App Wrapper Opportunities

Though, yes, with this setup the ideas is that we'd be able to build the PWA architecture in a sort of way that we would be able to just "DROP" in the PWA when we have an update, ensuring that all the necessary connections still exist, and keeping specific track of updates that have changes requiring adjustments from this kind of "plug-and-play".

  * **However, this is also about being *MORE* than just a modular native app wrapper.**

    - I cataloged some ideas based on the feature list from SwiftUI here: `docs/archive/resources/SWIFTUI.md`
      - I like the idea of notes being Geo-tagged along with other metadata just like photographs. 
      - Depending on the degree of AppleAI by then it could pull in data from events, photos, friend's proximity 

  * **The biggest opportunity seemed to be the "Live Activities & Widgets"**

    - Our UI layout allowing users to set "post-it" visible text
      - It could extend that feature to even more helpful locations
      - Lock-screen notes, etc. 
    - I **LOVE** the idea of there just always being a little "notepad" available by tapping the dynamic Island
    - Tap when you have an idea but are in the flow 
    - Quick jot whatever it was down and keep working 
    - *Opportunity* to even have AI organize or otherwise manage these one-off notes 
    - Lock-screen live activities and app intents for shortcuts 
    - Data-at-a-glance on Lock Screen, Home Screen, note to self in dynamic island (or many reminders kept there)

  * **I personally find it crazy when apps don't have a WatchOS app because huge missed opportunities**

    - I'd love if you WatchOS Thot App let you record voice messages that WhisperAI changed to text
        - This could be extended to sort of more advanced "automatic AI note takers"
        - You could hit a button on the watch and get all the meeting notes from the Watch listening

  * **And I am also very much an iPadOS Apple Pencil lover**

    - Apple Notes does it too but they're so clunky and it goes no where 
    - Ours would be more like actual feedback being given on a document with a red pen 
    - We'd offer Standard blue/black/red pen or black Sharpie
    - Offer to convert handwritten messages to actual text

---

## Actual Architecture 

  * **Must answer these questions through research that then gives use the specifics we need to be able to build the PWA accordingly to keep things modular**

    1. What native app wrapper method?
    2. Which core macOS app framework to use? 
       - How to handle the iOS/iPadOS vs macOS vs WatchOS differences?
       - Not that we want to chose one just because it is most easily integrated between devices, but worth considering 

  * **Random competition**

    - I came across this on Twitter the other day and was hoping you could look into it and tell us about the architecture. 
      - Free, open-source competition: `https://github.com/joelbqz/writer-computer`
        - Horrible logo: `/Users/seanivore/Downloads/writer-app-logo.jpg`
        - Not monospace text editor, not highlighting: `/Users/seanivore/Downloads/writer-app-text-editor.jpg`

### Research 

There seems like there are a bunch of possible routes to go about this that we'll need to research so that we can find the combination of the: 

  1. Best documented and most positive feedback from developers 
  2. Most modern, while avoiding traps like React, where its crap but everyone uses it because of employment trends 
  3. Straightforward and flexible approach is great 
  4. And we need to make sure that they give the most complete access to the macOS/iOS/iPadOS/WatchOS features 

### Options for Building 

#### PWA Research Starter-Pack 

- [How to build a PWA with a Native Wrapper](https://shakuro.com/blog/how-to-make-a-pwa-with-a-native-wrapper)

```
Wrapping a Progressive Web App (PWA) in a native shell is a hybrid approach that allows you to maintain a single web codebase while gaining access to device features that standard browsers often restrict, such as background geolocation, advanced push notifications, and system-level file access. [1, 2, 3, 4, 5]  
Popular Tools for Wrapping PWAs 

• Capacitor: Currently the industry standard for this approach. It provides a cross-platform layer that lets you use a single API to call native functions (camera, haptics, etc.) from your web code. 
• PWABuilder: A Microsoft-backed tool that simplifies the process of generating packages for the  Google Play Store 
 and Apple App Store using native wrappers like Trusted Web Activities (TWA) or custom iOS shells. 
• WebView Wrappers: For highly customized needs, developers may build a thin native app in Swift (iOS) or Kotlin (Android) that contains a  or  to load the PWA URL. [2, 6, 7, 8, 9, 10, 11]  

Why Add a Native Wrapper? 

| Feature [1, 3, 7, 12, 13, 14] | Standard PWA                          | Wrapped PWA (Native Shell)                   |
| ----------------------------- | ------------------------------------- | -------------------------------------------- |
| App Store Presence            | No (Browser-only install)             | Yes (Listed in official stores)              |
| Push Notifications            | Limited (iOS support is inconsistent) | Robust (Uses native OS handlers)             |
| Hardware Access               | Basic (GPS, Camera via browser)       | Deep (Bluetooth, Accelerometer, File System) |
| Background Tasks              | Very restricted                       | Supported (e.g., constant location tracking) |

Key Implementation Steps 

1. Prepare the PWA: Ensure your web app has a valid  and Service Worker for offline support. 
2. Initialize the Wrapper: Use Capacitor to add native project folders (e.g.,  and ) to your web project. 
3. Bridge Functionality: Use native plugins (like ) to replace or enhance web-only features. 
4. Build and Sync: Generate your web build, then "sync" it to the native folders to update the content inside the wrapper. 
5. Test and Deploy: Open the projects in Android Studio or Xcode to run them on physical devices before submitting to stores. [1, 7, 9, 10, 15]  

[1] https://dev.to/okoye_ndidiamaka_5e3b7d30/from-pwa-to-native-app-how-to-turn-your-progressive-web-app-into-a-full-fledged-mobile-experience-200i
[2] https://www.reddit.com/r/Blazor/comments/1r7ffwl/tools_for_packaging_pwa_as_native_mobile_app/
[3] https://stackoverflow.com/questions/76620827/react-pwa-progressive-web-app-with-native-android-webview-wrapper
[4] https://riseuplabs.com/pwa-development-ultimate-guide/
[5] https://www.monocubed.com/blog/progressive-web-apps/
[6] https://shakuro.com/blog/how-to-make-a-pwa-with-a-native-wrapper
[7] https://without.systems/progressive-web-to-native-mobile-with-capacitor
[8] https://hashithkarunarathne.medium.com/reactjs-pwa-react-native-app-integration-with-both-way-communication-368f0632df0d
[9] https://capacitorjs.com/docs/web/progressive-web-apps
[10] https://www.pwabuilder.com/
[11] https://dev.to/kioumars_rahimi/taking-pwas-beyond-the-basics-with-capacitorjs-build-truly-native-like-apps-using-web-tech-2ooo
[12] https://www.youtube.com/watch?v=HIAqC_nOBpo
[13] https://scandiweb.com/blog/how-to-create-pwa-native-apps/
[14] https://www.davebitter.com/articles/wrapping-your-progressive-web-app-for-android-with-trusted-web-activities
[15] https://capgo.app/blog/transform-pwa-to-native-app-with-capacitor/
```

#### Core Apple App Dev Frameworks Research Starter-Pack

```
macOS APIs are high-level frameworks and low-level interfaces that allow developers to build apps and interact with the Mac operating system. They range from modern UI kits to deep system-level calls for hardware and security. [1, 2, 3, 4, 5]  
Core Frameworks for macOS Apps 

• AppKit: The traditional framework used to build native macOS user interfaces, including windows, buttons, and menus. 
• SwiftUI: Apple's modern declarative framework for building interfaces across all Apple platforms, including macOS. 
• Foundation: Provides basic system services like data management, file handling, and networking. 
• Core Data: A framework for managing the model layer of an application, handling data persistence and object graphing. [4, 5, 6, 7, 8]  

Specialized System APIs 

• Launch Services: Enables apps to open other applications or document files, similar to the Finder. 
• Accessibility API: Allows developers to support features like audio graphs, braille displays, and system setting notifications. 
• Security & Authorization: Manages access to restricted areas of the OS and handles user permissions. 
• Video Effects API: Provides machine-learning algorithms for video editing, such as motion blur and frame rate conversion. 
• Metal: A low-level API for high-performance 3D graphics and data-parallel computation. [1, 2, 3, 9, 10]  

Integration and Automation 

• App Store Connect API: Used to automate app metadata, beta testing with TestFlight, and financial reporting. 
• Shortcuts: The Shortcuts User Guide explains how to use the "Get Contents of URL" action to interact with external web APIs directly from macOS. 
• Low-Level Interfaces: For deep system integration, developers can use POSIX calls (like  or ) or Mach APIs (like ). [11, 12, 13, 14, 15]  

[1] https://developer.apple.com/documentation/security/authorization-services
[2] https://developer.apple.com/documentation/accessibility/accessibility-api
[3] https://developer.apple.com/macos/
[4] https://en.wikipedia.org/wiki/Cocoa_(API)
[5] https://developer.apple.com/documentation/appkit
[6] https://www.reddit.com/r/SideProject/comments/1ovs8b1/i_built_a_free_native_macos_api_client_that_works/
[7] https://stackoverflow.com/questions/51395287/documentation-of-api-for-macos-app-in-javascript
[8] https://kyan.com/insights/using-swift-swiftui-to-build-a-modern-macos-menu-bar-app
[9] https://developer.apple.com/documentation/coreservices/launch_services
[10] https://developer.apple.com/documentation/
[11] https://support.apple.com/guide/shortcuts-mac/request-your-first-api-apd58d46713f/mac
[12] https://developer.apple.com/documentation/appstoreconnectapi
[13] https://stackoverflow.com/questions/50311153/how-can-i-access-macos-api-calls-from-c-on-mac
[14] https://support.apple.com/en-by/guide/shortcuts-mac/apd2e30c9d45/mac
[15] https://developer.apple.com/documentation/system
```
