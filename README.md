<br />
<div align="center"><img src="https://tailprops.dev/logo.png" width="500" /></div>
<div align="center">Empower your framework's components with custom props for Tailwind styles.</div>

---

> **Warning**
>
> Tailprops is just starting to form. It is not yet ready for production use. We appreciate you tinkering with it, feel free to provide feedback to make it better for everyone.

## Overview

Tailprops is a set of tools that allow you to write Tailwind classes in this way:

```jsx
<div
  tw="flex flex-col bg-red-500"
  tw-desktop="flex-row" // Responsive breakpoints
  tw-dark-focus-hover="bg-blue-500" // Or any combination of Tailwind modifiers
/>
```

It works as a compile step, hooking into your bundler and transforming the props into the actual Tailwind classes.

## Docs

The full documentation is available at [tailprops.dev](https://tailprops.dev).
