# Konfydence Lockscreens — MDM setup

For IT admins deploying the rotating lock-screen / wallpaper URL to managed
devices. One-time setup; Konfydence rotates the image behind the URL on
your chosen cadence — nothing to update on your side afterward.

Your delivery URL is on your admin page: `/lockscreens/{workplace|school}/admin/{your-token}`,
under **Delivery**. The base URL is the same for every platform — only the
last path segment changes to match the device's native aspect ratio:

```
https://konfydence.com/api/l/{token}/current/{format}
```

| Platform | `{format}` |
| --- | --- |
| Windows (Intune) | `desktop` (16:9) |
| macOS (Jamf) | `notebook-16x10` |
| ChromeOS (Google Admin) | `notebook-3x2` |
| iPad, landscape | `tablet-landscape` (4:3) |
| iPad / Android tablet, portrait | `tablet-portrait` (3:4) |

Using the wrong format still works (the image just won't quite fill the
screen at its native aspect) — match the table above for the cleanest fit.

**Platform coverage** (per `docs/LOCKSCREENS_ARCHITECTURE.md` §6) — Konfydence
only claims what actually works:

| Platform | Managed lock screen? |
| --- | --- |
| Windows (Intune) | Yes — real lock screen |
| ChromeOS (Google Admin) | Yes — real, refreshes well, best fit for weekly cadence |
| iOS/iPadOS, supervised (Jamf School / Apple School Manager) | Yes — real lock screen |
| macOS (Jamf) | Partial — desktop picture + login-window message, not a true lock-screen image |
| Android, fully managed / kiosk | Yes |
| Android, work-profile only | No — can't touch the personal wallpaper. Use the Personal engine (Home tier) instead |
| iOS/iPadOS, unsupervised | Limited — not reliable, recommend the Personal engine |

**Cadence note:** MDM re-applies policy on its own refresh cycle, not
instantly. If your fleet only checks in every two weeks, a **weekly**
cadence will silently miss half its flips — **fortnightly is the honest
default** everywhere except ChromeOS and an actively-managed Intune/Jamf
fleet you've confirmed checks in weekly.

---

## Microsoft Intune (Windows)

1. **Devices → Configuration profiles → Create profile**
   Platform: **Windows 10 and later** · Profile type: **Templates → Personalization** (or *Settings catalog* → search "Personalization").
2. Set **Lock screen image** (and optionally **Desktop image**) to:
   ```
   https://konfydence.com/api/l/{token}/current/desktop
   ```
   (Windows always uses `desktop` — it's the only Windows-native format.)
   Intune's Personalization template wants a `.jpg`/`.png` URL your devices can reach — it re-fetches on its own policy refresh, so no local caching config is needed on your end.
3. Assign to the device group(s) you want covered → **Create**.
4. Devices pick up the change on their next check-in (typically within a few hours; force it with `Settings → Accounts → Access work or school → Info → Sync` on a test device to confirm).

**Reference:** `PersonalizationCSP` — Intune surfaces this as the *Personalization* settings catalog category.

## Jamf Pro / Jamf School (iOS/iPadOS, supervised)

1. **Jamf School:** Classes/Devices → **Lock Screen Wallpaper** (or **Configuration → Wallpaper** in Jamf Pro).
2. Choose **URL-based wallpaper** if your Jamf tier supports it; otherwise use a **Web Clip / declarative config profile** referencing (use `tablet-landscape` or `tablet-portrait` to match how the iPad is mounted/used):
   ```
   https://konfydence.com/api/l/{token}/current/tablet-landscape
   ```
3. Scope to the supervised device group.
4. **macOS via Jamf:** wallpaper policies use `com.apple.desktop` (desktop picture) and `LoginwindowText` (login-screen message) payloads — this sets the desktop picture and a login message, not a true lock-screen image. Use `notebook-16x10` for the image URL. Set expectations with your team accordingly.

## Google Admin console (ChromeOS)

1. **Devices → Chrome → Settings → Device settings** (scope to the right OU).
2. Under **Device wallpaper** (or **Sign-in wallpaper** for the login screen), set the image source to:
   ```
   https://konfydence.com/api/l/{token}/current/notebook-3x2
   ```
3. Save. ChromeOS devices refresh device policy frequently — this is the platform where **weekly cadence is genuinely reliable**.

---

## Troubleshooting

- **Nothing changed after 24h:** confirm the device group/OU scope includes the test device, and that outbound HTTPS to `konfydence.com` isn't blocked by a firewall/proxy allowlist.
- **Old image keeps showing:** that's the MDM's own policy-refresh cadence, not Konfydence — the URL always resolves to the current screen; your fleet just hasn't re-fetched yet.
- **A device class isn't covered here** (BYOD, unsupervised iOS, Android work-profile): route those users to the Personal engine (Home tier) instead of trying to force MDM coverage — see `docs/LOCKSCREENS_ARCHITECTURE.md` §7.

Questions? concierge@konfydence.com.
