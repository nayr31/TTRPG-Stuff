---
isMe: true
Portrait: "[[heretic.jpg]]"
Class: Heretic
Stats:
  - 2
  - 5
  - "1"
  - "1"
  - "1"
  - "1"
Show: true
---

> [!NOTE] Heretic Notes
> Heretics seem to be spellcasters that can either be stationed in the frontlines, or among allies. Able to augment their spells and debuff enemies, *page 267* will be of great use.

### Class

To start:
- 1x Martial Tradition
- 1x Spell Aspect
- Mana/Grit pool of 6 and 6 (2 and 2 per level)
- A Subclass
- 1 Exploit and 2 spells (+1 spell and an exploit/spell per level)
- 2 Career points (1/level) (1 career and a node, or two careers - both entry perks)

**Level 1:**

Attributes:

| Body | Gods | Mind | Shadow | Soul | World |
| ---- | ---- | ---- | ------ | ---- | ----- |
| 1    | 1    | 1    | 1      | 1    | 1     |
4 points to place, nothing can be above 3 at level 1 (5 max)

*Blasphemer:* When you cast a spell, you may spend 2 Grit to corrupt it. Choose one: inflict [[Status Effects (Enemy)#Frightened|Frightened]], [[Status Effects (Enemy)#Silenced|Silenced]], or [[Status Effects (Enemy)#Weakened|Weakened]] on a target of the spell.
*Subclass Perk:* Pick 1 Perk from your chosen Heretic Subclass.
*Martial Tradition:* Suppression
*Exploit:* Potent Venom (When using a poisoned weapon to attack an enemy, you gain a Boon on your attack roll.)
*Race:* Adaphaen
*Core Perk - Wings:* You possess radiant wings. You gain flight equal to your Speed. You may fly for a number of rounds equal to your Body (minimum 1) before landing


> [!multi-column-clean]
> > [!about] Attributes
> > Body: `BUTTON[statdown0]` `VIEW[{Stats[0]}]` `BUTTON[statup0]` 
>> Shadow: `INPUT[number:shadow]` 
> 
> > [!tip] A secondary part
> > Gods: `INPUT[number:gods]`
> > Soul `INPUT[number:soul]`
> 
> > [!fail] The third one!
> > Mind: `INPUT[number:mind]`
> > World: `INPUT[number:world]`

```meta-bind
INPUT[list:Stats]
```


### 0th Stat

```meta-bind-button
style: primary
label: "-"
id: statdown0
hidden: true
action:
  type: updateMetadata
  bindTarget: Stats
  evaluate: true
  value: "x.map((val, i) => i === 0 ? Number(val) - 1 : val)"
```
```meta-bind-button
style: primary
label: +
id: statup0
hidden: true
action:
  type: updateMetadata
  bindTarget: Stats
  evaluate: true
  value: "x.map((val, i) => i === 0 ? Number(val) + 1 : val)"
```

### 1st Stat

```meta-bind-button
style: primary
label: "-"
id: statdown1
hidden: true
action:
  type: updateMetadata
  bindTarget: Stats
  evaluate: true
  value: "x.map((val, i) => i === 1 ? Number(val) - 1 : val)"
```
```meta-bind-button
style: primary
label: +
id: statup1
hidden: true
action:
  type: updateMetadata
  bindTarget: Stats
  evaluate: true
  value: "x.map((val, i) => i === 1 ? Number(val) + 1 : val)"
```

### 2nd Stat

```meta-bind-button
style: primary
label: "-"
id: statdown2
hidden: true
action:
  type: updateMetadata
  bindTarget: Stats
  evaluate: true
  value: "x.map((val, i) => i === 2 ? Number(val) - 1 : val)"
```
```meta-bind-button
style: primary
label: +
id: statup2
hidden: true
action:
  type: updateMetadata
  bindTarget: Stats
  evaluate: true
  value: "x.map((val, i) => i === 2 ? Number(val) + 1 : val)"
```

### 3rd Stat

```meta-bind-button
style: primary
label: "-"
id: statdown3
hidden: true
action:
  type: updateMetadata
  bindTarget: Stats
  evaluate: true
  value: "x.map((val, i) => i === 3 ? Number(val) - 1 : val)"
```
```meta-bind-button
style: primary
label: +
id: statup3
hidden: true
action:
  type: updateMetadata
  bindTarget: Stats
  evaluate: true
  value: "x.map((val, i) => i === 3 ? Number(val) + 1 : val)"
```

### 4th Stat

```meta-bind-button
style: primary
label: "-"
id: statdown4
hidden: true
action:
  type: updateMetadata
  bindTarget: Stats
  evaluate: true
  value: "x.map((val, i) => i === 4 ? Number(val) - 1 : val)"
```
```meta-bind-button
style: primary
label: +
id: statup4
hidden: true
action:
  type: updateMetadata
  bindTarget: Stats
  evaluate: true
  value: "x.map((val, i) => i === 4 ? Number(val) + 1 : val)"
```

### 5th Stat

```meta-bind-button
style: primary
label: "-"
id: statdown5
hidden: true
action:
  type: updateMetadata
  bindTarget: Stats
  evaluate: true
  value: "x.map((val, i) => i === 5 ? Number(val) - 1 : val)"
```
```meta-bind-button
style: primary
label: +
id: statup5
hidden: true
action:
  type: updateMetadata
  bindTarget: Stats
  evaluate: true
  value: "x.map((val, i) => i === 5 ? Number(val) + 1 : val)"
```



---

All though the path to holy worship is laden with broken glass, I walk it barefoot all the same
Corruption of the flesh is the least of your worries