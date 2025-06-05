This is absolutely a classic joke that resonates deeply with web developers! The humor comes from the absurd contrast between what *should* be a trivial task - putting a box in the middle of the screen - and the historical reality of CSS, where this simple goal often required arcane knowledge and hacky workarounds.

## Why it was genuinely hard

For years, CSS lacked intuitive centering mechanisms. Here are some historical approaches that made developers pull their hair out:

**The "margin: 0 auto" trap**: This only worked for horizontal centering of block elements with a defined width. Vertical centering? Good luck.

**The table-cell hack**: Developers would use `display: table-cell` with `vertical-align: middle` - essentially recreating table layout just to center content.

**Absolute positioning gymnastics**: Position absolute, then use negative margins equal to half the element's dimensions - but only if you knew those dimensions beforehand.

**The clearfix and float nightmare**: Before flexbox, developers used floats for layout, leading to complex clearing mechanisms and positioning hacks.

These methods were fragile, broke easily with responsive design, and required deep CSS knowledge for something that should be elementary.

## Modern solutions

Centering is now genuinely easy with modern CSS:

**Flexbox** (the most common):
```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**CSS Grid**:
```css
.container {
  display: grid;
  place-items: center;
}
```

**Grid with justify/align**:
```css
.container {
  display: grid;
  justify-content: center;
  align-content: center;
}
```

The joke persists partly out of nostalgia and partly because many developers learned CSS during the "dark ages" and remember the trauma. It's also become a kind of inside joke about web development's quirky evolution - how something so conceptually simple was genuinely difficult for over a decade of web development.

Today, any developer who says they can't center a div is probably either joking or hasn't learned flexbox yet!