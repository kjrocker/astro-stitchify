# Astro-Stitchify

I like Astro. I like CodeStitch. I wish getting an Astro component out of CodeStitch was marginally faster.

This is a Firefox extension that adds an "Extract Astro Component" button to CodeStitch's Stitch pages.

This button extracts the HTML, Javascript, and Dark-Mode-Supporting SCSS code and puts a neatly formatted Astro component onto the clipboard.

By "neatly formatted" I literally just mean empty frontmatter and some top-level tags:
```html
---
---
{HTML Content Here}

<style lang="scss">
    {CSS Content Here}
</style>

<script>
    {JS Content Here}
</script>
```

# Links
- [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/astrostitchify/)
