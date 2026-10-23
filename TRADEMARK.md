# Trademark & Brand Guidelines

## Overview

The source code of **byphongphan.com** is free and open-source software distributed under the [MIT License](./LICENSE.md).

However, the MIT License applies strictly to the source code, architecture, and reusable component implementations. It **does not grant** rights to use the personal identity, trademarks, trade dress, or proprietary branding of **Phong Phan**.

This document outlines the permitted and restricted uses of our brand assets.

---

## Protected Assets

The following personal brand assets are explicitly reserved and are **not** licensed under the MIT License:

- The name **"Phong Phan"** and aliases associated with the author's identity.
- The **PP** monogram, isometric branding marks, and custom SVG logos (`src/shared/ui/icons/pp-pixel-mark.tsx`, isometric artwork, etc.).
- Personal photographs, avatars, and likenesses.
- The primary domain **byphongphan.com** and associated deployment mirrors.
- Custom editorial content, personal biography, and case study narrative write-ups.

---

## Permitted Usage :white_check_mark:

You are welcome and encouraged to:

1. **Fork the repository** and use the code architecture, algorithms, UI patterns, and styling system for your personal, commercial, or educational projects.
2. **Install and reuse registry components** via the shadcn CLI in your own applications.
3. **Reference this project** as a technical inspiration or learning resource with appropriate attribution.
4. **Submit Pull Requests**, bug reports, or feature contributions back to the upstream repository.

---

## Restricted Usage :x:

You may not:

1. Deploy or publish a website that retains the author's personal identity, contact information, resume details, or photographs.
2. Use the **PP** monogram or brand marks as the brand identity for your own company, website, or product in a manner that could cause confusion.
3. Imply any official partnership, endorsement, sponsorship, or affiliation with Phong Phan without prior written consent.
4. Distribute deceptive clones or phishing sites impersonating **byphongphan.com**.

---

## Forking & Rebranding Checklist

If you fork this repository to build your own portfolio or application, please complete the following steps before publishing to production:

- [ ] Update `src/shared/config/site.config.ts` with your own name, bio, social links, email, and domain.
- [ ] Replace avatar images (`public/avatar-about.jpg`, favicons) and Open Graph images (`public/og-image.png`).
- [ ] Replace or customize the PP logo/monogram in header, footer, and navigation.
- [ ] Update `public/site.webmanifest` and SEO metadata with your own branding.
- [ ] Configure your own deployment domain and environment variables.

---

## Questions & Permissions

If you have questions regarding the appropriate use of these assets, please contact:

:e-mail: **phongphanq089@gmail.com**
