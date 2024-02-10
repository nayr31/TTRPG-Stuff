Highlight color adapts to the sticky note's background. Bold and Italic will remove font-decoration. It's much for my own use, so I hacked it just to make it work with my vault. But it should be neat on yours. Just let me know. The colors are also hardcoded as they match with my Gruvbox theme. But all of that can be modified very easily. I just haven't created a lot of variables yet. I will do that next.

![Sticky](https://media.discordapp.net/attachments/1194116025638207569/1198621521749495859/Bildschirmfoto_vom_2024-01-20_18-20-19.png?ex=65d20748&is=65bf9248&hm=caa5df7bc1ba91052f3426968ac4fb7ef387ef81ba483c7407b5f714aa2e9c34&=&format=webp&quality=lossless&width=961&height=541)

```css
/* STICKY NOTES */

@charset "UTF-8";
.callout.callout.callout:is([data-callout-metadata~=left]) {
  float: left;
  margin: unset;
  margin-right: 8px;
}

.callout.callout:is([data-callout-metadata~=right]) {
  float: right;
  margin: unset;
  margin-left: 8px;
}

.callout.callout.callout:is([data-callout-metadata~=ctr],
[data-callout-metadata~=center]) {
  display: block;
  margin: auto;
  float: unset;
}

.callout[data-callout~=sticky] {
  --callout-icon: sticky-note;
  background-color: var(--sticky-color) !important;
  color: #282828;
  font-family: var(--sticky-font);
  font-size: var(--sticky-font-size);
  max-width: 350px; 
  width: 40%;
  margin: auto;
  display: block;
  float: unset;
}

.callout[data-callout~=sticky] .callout-title {
  display: none;
}

.callout[data-callout~=sticky] .callout-title-inner {
  padding-top: 0.25em;
}

.callout[data-callout~=sticky] .callout-content {
  padding: 10px;
}

.callout {
  background-color: #3C3836;
  border-color: #282828;
  border-radius: 8px !important;
  border-width: 1px !important;
  padding: 0px;
  > .callout-content > :first-child {
      margin-top: 0px;
  }
  > .callout-content > :last-child {
      margin-bottom: 0px;
  }
}

.callout[data-callout~=sticky] .callout-content strong,
.callout[data-callout~=sticky] .callout-content em {
  color: #282828;
  text-decoration: none;
}

.callout[data-callout~=sticky]:is([data-callout-metadata~=green]) { background-color: #b8bb26cc !important; }
.callout[data-callout~=sticky]:is([data-callout-metadata~=red]) { background-color: #fb4934cc !important; }
.callout[data-callout~=sticky]:is([data-callout-metadata~=yellow]) { background-color: #fabd2fcc !important; }
.callout[data-callout~=sticky]:is([data-callout-metadata~=blue]) { background-color: #83a598cc !important; }
.callout[data-callout~=sticky]:is([data-callout-metadata~=purple]) { background-color: #d3869bcc !important; }
.callout[data-callout~=sticky]:is([data-callout-metadata~=aqua]) { background-color: #8ec07ccc !important; }
.callout[data-callout~=sticky]:is([data-callout-metadata~=orange]) { background-color: #fe8019cc !important; }

.callout[data-callout~=sticky]:is([data-callout-metadata~=green]) mark { background-color: #b8bb26cc !important; }
.callout[data-callout~=sticky]:is([data-callout-metadata~=red]) mark { background-color: #fb4934cc !important; }
.callout[data-callout~=sticky]:is([data-callout-metadata~=yellow]) mark{ background-color: #fabd2fcc !important; }
.callout[data-callout~=sticky]:is([data-callout-metadata~=blue]) mark { background-color: #83a598cc !important; }
.callout[data-callout~=sticky]:is([data-callout-metadata~=purple]) mark { background-color: #d3869bcc !important; }
.callout[data-callout~=sticky]:is([data-callout-metadata~=aqua]) mark { background-color: #8ec07ccc !important; }
.callout[data-callout~=sticky]:is([data-callout-metadata~=orange]) mark { background-color: #fe8019cc !important; }
.callout[data-callout~=sticky] .callout-content mark { opacity: 1;}

/*@settings
name: Sticky Notes
id: sticky-notes
settings:
  -
    id: info-text-sticky-notes
    type: info-text
    title: Sticky Notes by *Daniel Hansen*
    description: Derived from *ITS Callout snippet*
    markdown: true
  -
    id: sticky-color
    title: Sticky Notes color
    description: Default color for Sticky Notes. Used when not color is specified in markdown.
    type: variable-color
    format: hex
    opacity: true
    default: '#fabd2fcc'
  -
    id: sticky-font
    title: Sticky Notes font
    description: Font used for sticky notes.
    type: variable-select
    default: Roboto
    options:
      -
        label: IBM Plex Sans
        value: IBM Plex Sans
      -
        label: IBM Plex Mono
        value: IBM Plex Mono
      -
        label: Roboto
        value: Roboto
      -
        label: Chilanka
        value: Chilanka
      -
        label: Kalam
        value: Kalam
      -
        label: Architects Daughter
        value: Architects Daughter
      -
        label: Edu SA Beginner
        value: Edu SA Beginner
  -
    id: sticky-font-size
    title: Sticky Notes font size
    description: Size of the Sticky Notes text
    type: variable-text
    default: 1.2em
*/

```