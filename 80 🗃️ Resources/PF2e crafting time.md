---
level: 1
gpvalue: 1000
bonus: 4
itemlevel: 2
critical: 0
---
Character Level: `INPUT[number:level]`
Proficiency: `INPUT[inlineSelect(option(0, Untrained), option(2, Trained), option(4, Expert), option(6, Master), option(8, Legendary)):bonus]`
Cost of item: `INPUT[number:gpvalue]`

Item Level `INPUT[number:itemlevel]`
Critical?: `INPUT[toggle(offValue(0), onValue(1)):critical]`

Time:`VIEW[{itemlevel} * 24 + ({gpvalue} * 0.024)/({bonus}+{level}+{critical})]`hours
