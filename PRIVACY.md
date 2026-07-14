# Privacy Policy

**Last updated:** July 15, 2026

This Privacy Policy describes how the Moss Laboratories web property ("we", "us", or "our") — the landing site and announcement system at **mosslabs.vercel.app** — handles data. It does not cover the Flick or Latch mobile apps, which have their own policies in their respective repositories.

Privacy is a core principle. The web property is built to collect as little as possible.

---

## What We Do Not Collect

The site does not use tracking cookies, analytics scripts, fingerprinting, advertising trackers, or any client-side telemetry. We do not collect visitor browsing data, device identifiers, or location.

## Server-Side Data

The backend stores the following:

- **Published announcements** — title, date, body, tag, app, and attachments. These are public by design; anyone can read them.
- **Admin audit log** — a record of administrative actions (announcement create/update/delete, attachment uploads) and the fields changed. Accessible only to the site administrator.
- **Transient client IP** — used solely for rate-limiting failed admin login attempts. Stored temporarily in short-lived cache and not persisted or used for any other purpose.

No other server-side data is collected from visitors.

## Admin Authentication

The admin console is protected by a single shared password. Failed login attempts are rate-limited by client IP. Successful authentication is recorded in the audit log. No admin credentials are stored in the browser, and no session or tracking cookie is set.

## Data Sharing

We do not sell, rent, or share collected data with third parties. Announcement content is public; everything else stays on our infrastructure.

## Infrastructure

The site is hosted on Vercel and uses Supabase (Postgres + Storage) and Upstash Redis. Each provider processes only what is needed to run the site and is bound by their own privacy commitments.

## Children's Privacy

No data is collected from any visitor, regardless of age.

## Changes to This Policy

We may update this Privacy Policy from time to time. Changes will be reflected in the "Last updated" date at the top of this document.

## Contact

For privacy-related questions or concerns:

- **GitHub**: [github.com/moss-apps](https://github.com/moss-apps)
- **Email**: moss_apps@proton.me

---

*Moss Laboratories software is open-source under the AGPL-3.0-or-later license. You can review the source code to verify the claims made in this Privacy Policy.*