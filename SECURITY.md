# Security Policy

We take the security of this project, its distributed components, and the privacy of its users seriously. This document outlines our vulnerability disclosure policy and security guidelines.

---

## Supported Versions

Only the latest release deployed on the production branch and live at [byphongphan.com](https://byphongphan.com) is actively maintained and supported with security updates.

| Version / Target     | Supported          | Notes                                      |
| -------------------- | ------------------ | ------------------------------------------ |
| `main` branch        | :white_check_mark: | Actively monitored and patched             |
| Live production site | :white_check_mark: | Deployed at https://byphongphan.com        |
| Historical commits   | :x:                | Please update to `main` for security fixes |

---

## Reporting a Vulnerability

If you discover a security vulnerability or security-related flaw within this repository or the live site, **please do not report it through public GitHub issues or discussions.**

Instead, please send a responsible disclosure report directly via email:

:e-mail: **phongphanq089@gmail.com**

### Please include in your report:

1. **Type of issue:** (e.g., Cross-Site Scripting, Dependency vulnerability, SSR data exposure, Cache poisoning).
2. **Detailed steps to reproduce:** Include minimal reproduction code, curl commands, or screenshots.
3. **Potential impact:** How an attacker could exploit the issue and what user data or system state could be affected.
4. **Suggested remediation:** A patch, PR diff, or architectural recommendation if available.

---

## Response Timeline & SLA

We are committed to handling security vulnerability reports promptly:

| Phase                   | Timeframe                | Commitment                                                    |
| ----------------------- | ------------------------ | ------------------------------------------------------------- |
| **Initial Response**    | Within 24–48 hours       | Acknowledgment of receipt and confirmation of review          |
| **Triage & Assessment** | Within 3–5 business days | Validation of vulnerability severity and impact assessment    |
| **Patch Release**       | Based on severity        | High/Critical patched within 72 hours; coordinated disclosure |

---

## Scope

### In-Scope:

- The production site at [byphongphan.com](https://byphongphan.com)
- Source code in the official [byphongphan.com repository](https://github.com/phongphanq089/byphongphan.com)
- Custom Shadcn registry items distributed under `public/r/`
- Direct dependencies with known, exploitable CVEs affecting this project

### Out-of-Scope:

- Forked, modified, or self-hosted versions of this codebase
- Denial of Service (DoS / DDoS) attacks against third-party edge providers (Netlify, Cloudflare)
- Social engineering, phishing, or physical attacks
- Issues on external third-party services and APIs (MapLibre tiles, ImageKit CDN)

---

## Hall of Fame & Acknowledgments

Security researchers who responsibly disclose vulnerabilities according to this policy will be credited and publicly thanked (with their permission) in our release notes and documentation.

Thank you for helping keep this project and the developer community safe.
