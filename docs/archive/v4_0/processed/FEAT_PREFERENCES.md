# Preferences, Settings, and Menus

**Created**: 2026-05-07

## Overview

I'm creating this document because I thought of something I needed to keep somewhere in notes. Ideally we can start to build out sections of the app features, design, requirements, etc. as dedicated pages/docs such as this one so that we can start iterating on details pushing them towards what is needed for the exclusively executable implementation plan. Fill in unknown, identify gaps, and double chuck assumptions, and sketch out the user-experience flow and rough visual design. 

## Context Menu (Right-Click)

Maintain the OS standard initial contextual menu with the following additions:

  - Add word to dictionary

  - Create Autocorrect Rule -> opens preferences modal to Autocorrect Rules List 
    - There are two empty text fields next to each other or stacked 
    - The left field has a placeholder, "Type the word you want to autocorrect". 
    - The right field has a placeholder, "Type the word you want to autocorrect to".
    - There are two buttons below the text fields, "Cancel" and "Save".
    - If the word is already in dictionary, then the modal should load with the word already in the 'Correct word to' field 
    - If the word is not in the dictionary, then the modal should load the word in the 'Word to correct' field 
    - Regardless of this load placement, user can edit either field 

## Preferences Modal 