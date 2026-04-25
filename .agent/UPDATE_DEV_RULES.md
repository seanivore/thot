# Dev Rules Document Update 

## Summary 

Formalization of the naming and structure of project documentation. 

### Objective 

  1. Clean up, improve, polish the details below
  2. Integrate into master version `/Users/seanivore/Development/_git_init/.agent/DEV_RULES.md`
  3. Run script to replace `.agent/DEV_RULES.md` file anywhere in `~/Development/~`

---

## Structure 

### **MAIN DIRECTORY**

- Primary documentation directory lives in `./assets/docs/`
- Master architecture, context, helper document is 'living'
- Master architecture updated with every new SESSION or IMPLEMENTATION doc added
- Master `./assets/docs/PROJECT_NAME.md`
- Any other high importance documents live here (e.g. branding details)
- High bar for keeping documents here
- Versioning docs kept in 'archive' directory 

#### **ARCHIVE DIRECTORY**

- Development guide documentation lives in `./assets/docs/archive/`
- Directory of version number subdirectories
- Nothing is deleted; updates move forward
- Nothing other than subdirectories in `vX_X` format
- Maintains planning documents to see evolution over time
- New directory for every 0.0+1.0 increase (v0.1 to v0.2)

#### **VERSIONING SUBDIRECTORIES**

- Current version highest number lives in `./assets/docs/archive/vX_X/`
- All implementation details and how/why the documents changed (feedback, bugs, etc.)
- Contents are kept in chronological order via filenames and name formats 
- Third number `v1_2_3` can change and say in these subdirectories 
- Third number used for bugs, but also simple documentation updates 
- Soft implementation plan updates and multiple feedback rounds update third number 

---

## Naming Protocol 

### **INFORMAL FILES** 

- Primarily documents from Sean 
- Update ideas for new version 
- Bug logging details 
- Feedback from reviewing previous plan
- Feedback for updates from reviewing build 

  - `UPDATE_vX(+1)_X_X.md` — planning
  - `FEEDBACK_vX_X(+1)_X.md` — fixes and planning 
  - `vX_X_X(+1)_BUGS.md` — fixes 

### **FORMAL FILES**

- Agent created documentation 
- Claude Code Plan Mode session planning 
- Master implementation plan 

  - `vX_X_X_DEV_PLANNING.md` — planning
  - `vX_X_X_IMPLEMENT.md` — to execute
  - `vX_X_X_SESSION_DEV.md` — building 

--- 

## Visual Directory Structure Example 

```
assets/docs/
├── archive/
│   ├── v3_1/
│   │   ├── IMG/                    # Referenced in planning
│   │   │   ├── visual-aid-1.jpg
│   │   │   └── visual-aid-1.wepb
│   │   ├── UPDATE_v3_1_0.md        # New plan introduced for v3.1.0
│   │   ├── v3_1_0_DEV_PLANNING.md  # Researching, perfecting implementation guide
│   │   └── v3_1_0_IMPLEMENT.md     # Implementation guide 
│   ├── v3_2/
│   │   ├── FEEDBACK_v3_2_0.md      # Reporting gaps in implementation guide 
│   │   ├── FEEDBACK_v3_2_1.md      # More gaps 
│   │   ├── v3_2_0_DEV_PLANNING.md  # Filling in implementation gaps
│   │   ├── v3_2_0_IMPLEMENT.md     # Updated 
│   │   ├── v3_2_1_DEV_PLANNING.md  # Perfecting plan
│   │   ├── v3_2_2_DEV_PLANNING.md  # Perfecting plan for something else 
│   │   └── v3_2_2_IMPLEMENT.md     # Updated
│   ├── v3_3/
│   │   ├── FEEDBACK_v3_3_0.md      # Reviewed and made build changes 
│   │   ├── v3_3_0_DEV_PLANNING.md  # Adjusting plan for changes 
│   │   ├── v3_3_0_IMPLEMENT.md     # Updated
│   │   ├── v3_3_0_SESSION_DEV.md   # Executing implementation plan
│   │   ├── v3_3_1_BUGS.md          # Reviewed and found issues 
│   │   ├── v3_3_1_DEV_PLANNING.md  # Finding bug fixes 
│   │   └── v3_3_1_SESSION_DEV.md   # Executing bug fixes 
│   └── v4_0/
│       ├── FEEDBACK_v4_0_0.md      # Notable feature improvement and updates
│       ├── v4_0_0_DEV_PLANNING.md  # Researching to create new plan 
│       ├── v4_0_1_DEV_PLANNING.md  # Auditing plan for issues 
│       ├── v4_0_3_DEV_PLANNING.md  # Fixing audit issues 
│       └── v4_0_3_IMPLEMENT.md     # Updated and ready for next session 
├── BRAND.md                        # For voice, palette, etc.
└── PROJECT_NAME.md                 # Master updated with every plan update 
```
```
README.md                           # Updated with every plan update as well
```

---