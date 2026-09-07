# Design

The site is built from `@applecn/ui`, so it is its own first consumer; the tokens in `packages/ui/src/tokens` are the only source of colour, type, shape and motion.

**Landing page (brand register).** Apple's own product-page grammar under the `web` platform: SF via the system stack, apple.com's 48/40/32 headline ladder with tracking, 17/25 body, `#1d1d1f` on white with `#f5f5f7` bands, 980 px pill CTAs and "Learn more ›" links. The hero is drenched in a vivid gradient with Liquid Glass controls floating over it, as iOS 26 is marketed. The "imagery" is the components themselves at scale, in an iPhone frame, a macOS window and a browser card, driven by one platform switch. One page-load choreography (hero rise, frames float in), reduced motion honoured.

**Documentation (product register).** The system's own sidebar, navigation bar, lists and cards. Tables render from token data. Every example is live and switchable between platforms.

**Bans.** No literal colours, sizes or durations outside the tokens. No glass for decoration in the content layer. No cards inside cards. No eyebrow labels on every section.
