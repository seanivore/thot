# V3.1.1 Multi-Window Persistence Safety

**Branch**: `feat/v3-multi-window` (branching from `main`)

## Architecture Change: Unique Window IDs
Local Storage is shared across the entire origin (`thots.august.style`). If three windows are open, they all fight over the `thot:content` key, and the last window to autosave obliterates the others.

To fix this, we need **Local Storage Partitioning via URL Parameters**.

### How It Will Work
1. **Window Boot**: `main.ts` boots up. It checks the URL parameters for `?id=XYZ`.
2. **First Load**: If there is no `id` parameter (e.g., you just launch the PWA from the dock), Thot generates a random 6-character ID (like `a9f3k2`) and immediately updates the URL to `/?id=a9f3k2` using `history.replaceState()`.
3. **Partitioned Storage Keys**: Instead of saving everything to `thot:content`, the app dynamically appends the ID to the storage keys: `thot:content:a9f3k2` and `thot:state:a9f3k2`.
4. **New Windows**: When you trigger `newWindow()` (typically CMD+N or the Share menu), Thot generates a fresh ID and opens `/?id=newabc` in the new window, isolating its storage instance from the parent.
5. **Session Safety**: Now, every single window has its own dedicated silo in localStorage. They save independently, and upon computer restart, the OS restores the windows exactly to their unique URL IDs, cleanly loading their respective content.
6. **"Main" Deskpad Reference**: The user wants a concept of a "main" fallback. We can establish `thot:content:main` as the default. If a user hits the base `/` URL, we can force that to resolve to the `main` ID partition, protecting the primary deskpad. (If they launch a *second* window from `/`, the base code will realize the window is standalone and redirect to a random ID to prevent a collision).

## Proposed Changes

### [MODIFY] `src/persistence.ts` and `src/state.ts`
We must refactor the persistence engines to accept a dynamic `windowId` rather than hardcoding the `thot:content` key.

- Export a getter/setter for `windowId` (defaulting to `'main'`).
- Update `saveContent`, `loadContent`, `forceSave`, `hasSavedContent`, and `clearContent` to use `` `thot:content:${windowId}` ``.
- Apply the exact same structural change to `src/state.ts`.

### [MODIFY] `src/main.ts`
We must implement the Bootloader URL orchestration.

1. On `init()`, parse `window.location.search`.
2. If `?id=...` exists, grab it and set it as the persistence `windowId`.
3. If `?id=` is missing:
   - Generate an ID (e.g., `Math.random().toString(36).substring(2, 8)`).
   - `history.replaceState` the URL to `?id={newId}`.
   - Set the persistence `windowId`.
4. Initialize the editor using the dynamically defined keys.

### [MODIFY] `src/file-system.ts`
Update the `newWindow()` function so that instead of duplicating the exact URL, it explicitly drops the `?id=` parameter from the opened URL (or assigns a new one), ensuring the newly spawned window doesn't try to inherit the same localStorage partition.

- `window.open(window.location.pathname + '?id=' + generateId(), '_blank')`

## Fallback Considerations
There's one edge case: old `thot:content` data from v3.1.0 still exists. During the bootloader orchestration in `main.ts`, if `?id=` is missing, we should temporarily check if the legacy `thot:content` key has data. If it does, we bootstrap that data into the newly spawned partition (e.g., the `main` partition) and delete the legacy key, silently migrating the user to the partition safe architecture.

# V3.1.2 Single Draftpad Fallback
**Branch**: `fix/v3-pwa-state-restore` (branching from `dev`)

Instead of trying to orchestrate an inherently incompatible multi-window environment within Safari's PWA constraints, we are pivoting to a single-draftpad approach per user request. 

### How It Will Work
1. **The Core Draftpad**: When Thot boots up without an `?id=` parameter in the URL (which always happens on a fresh PWA OS restart), the bootloader will simply default the `windowId` to `"main"`.
2. **URL Correction**: It will instantly `replaceState` the URL to `?id=main`. Because the PWA always restarts at `/`, it will always predictably route back to the user's permanent `main` draftpad storage partition.
3. **Disposable Temp Windows**: When the user presses `CMD+N` or Share -> New Window, the `newWindow()` function will explicitly overwrite the URL parameter with a new randomly generated string prefixed with `temp-` (e.g. `?id=temp-xyz123`). This safely isolates the secondary windows while ensuring they don't clobber the primary `main` working document.

## Proposed Changes

### [MODIFY] `src/main.ts`
- Alter the fallback block: instead of generating a 6-character random string, hardcode the `windowId` generation to `'main'`.

### [MODIFY] `src/file-system.ts`
- Alter `newWindow()`: instead of stripping parameters completely, explicitly set `.searchParams.set('id', 'temp-' + random)` so spawned windows are isolated from the permanent `main` Draftpad.
