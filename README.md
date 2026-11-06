# AI Studio Pro — Work in progress

**Status: early prototype; not ready for production use.** This public repository is being shared to document the project and invite feedback while development continues. It is not a completed After Effects automation product.

AI Studio Pro is an intended desktop companion for video editors and motion designers. The current source includes an Electron interface prototype and experimental code. The interface contains mock project data and illustrative render states. Those items are not evidence of a real After Effects connection, completed render, working AI provider integration, or verified usage.

## Current state

- Electron desktop interface prototype with Uzbek, Russian, and English UI assets.
- Planned direction: turn a natural-language creative brief into a reviewable After Effects plan.
- AI provider connections, secure user-owned API key storage, After Effects project inspection and actions, reference-media analysis, and actual rendering still need implementation and verification.
- Do not put API keys, account credentials, private footage, or production project files in this repository.
- No user, download, or external-contributor metrics are currently verified.

## Technology

The project is structured as an Electron application using JavaScript, HTML, and CSS. `package.json` lists the current dependency set. The startup and build workflow has not yet been validated for a clean checkout; setup documentation will be updated as that work is completed.

## Roadmap

1. Audit the current Electron security boundaries and remove misleading demo behavior.
2. Implement user-owned provider credentials with secure local storage and explicit paid-request consent.
3. Build a constrained, reviewable plan format before adding any After Effects actions.
4. Add After Effects integration with clear confirmation and verified success/failure reporting.
5. Implement reference analysis and rendering only after rights, privacy, and real output handling are addressed.
6. Add clean-install instructions, licensing and asset attribution, and contributor guidance.

## License and assets

The source package currently declares the ISC license; the repository will include its license text. Image and preview files are omitted from this first public snapshot while their provenance and reuse rights are reviewed. Do not assume the local preview images are licensed for reuse. A separate asset-attribution record will be added before a stable public release.

## Feedback and contributions

This repository is a work in progress. Issues describing workflow needs, Uzbek/Russian wording, accessibility concerns, and reproducible bugs are welcome. Please do not submit API keys, personal footage, or private After Effects projects in issues. Contribution instructions will be expanded as the project architecture is stabilized.

## Important billing note

The intended design is for each user to connect their own AI provider account and API key, with that provider billing the account owner. A Claude Max subscription is separate from Anthropic API billing and does not pay for API calls made by an application.
