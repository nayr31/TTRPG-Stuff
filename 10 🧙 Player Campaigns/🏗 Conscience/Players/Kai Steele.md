---
Pronouns: He/Him
Origin: Survivor
Job: Thief
Cool: 1
Clever: 2
Tough: 0
Quick: 3
Burden: 2
Art: "![[Kai_cc.png]]"
augmentBurden: 1
damageTrack: 0-Healthy
defClever: 0
defCool: 0
defQuick: 1
defTough: 1
cash: 0
harm_1: false
harm_2: false
harm_3: false
harm_4: false
harm_5: false
harm_6: false
NoteIcon: Player
---
# `=this.file.name` (`VIEW[{Pronouns}]`)
## Specialties
| Defence | Value |
| ---- | :--: |
| Clever | `VIEW[{defClever}+7]` |
| Cool | `VIEW[{defCool}+7]` |
| Quick | `VIEW[{defQuick}+7]` |
| Tough | `VIEW[{defTough}+7]` |

| Specialty | Value |
| ---- | :--: |
| Parkour | +2 |
| Graffiti | +2 |
| Stealth | +1 |
| (One cartel corporation) | +1 |
## Damage Track

`INPUT[inlineSelect(option(0-Healthy), option(1-Minor Injury), option(2-Minor Injury), option(3-Harm), option(4-Harm), option(5-Serious Harm), option(6-Incapacitated)):damageTrack]`

|  | Injured? | Harm Level | Effect |
| ---- | ---- | ---- | ---- |
| 1 | `INPUT[toggle:harm_1]` | Minor Injury | N/A |
| 2 | `INPUT[toggle:harm_2]` | Minor Injury | N/A |
| 3 | `INPUT[toggle:harm_3]` | Harm | -1 to all rolls |
| 4 | `INPUT[toggle:harm_4]` | Harm | -1 to all rolls |
| 5 | `INPUT[toggle:harm_5]` | Serious Harm | -1 die to all rolls |
| 6 | `INPUT[toggle:harm_6]` | Incapacitated | Out of action |

## Origin - `VIEW[{Origin}]`

Whether you were directly affected by the Impact, thrown out onto the streets at a young age, or suffered a terrible accident, you spent years struggling to survive and came out stronger for it. **Once per mission, you may Boost one Tough roll.**
## Assets

> [!NOTE]+ Assets
>  - [S] Spring Legs (Shoes - 3)
	> 	- Spring Legs were originally a hacked variant of commercial athletic legs, designed for low-gravity sports. These days they're mostly created by smaller designer companies. Spring Legs **Boost all rolls relating to running, or jumping high or long distances**. On a critical succeed or fail—the user must make a Quick save vs 7 or mark damage box 1 as they crash hard. Never apply this to attack rolls, even if you make one as part of a move. Special: These can also come as an Asset, in shoe form. The Quick save for these is vs 10.
>  - [l] Gym (6)
	 >	- You own a gym. This can be a personal room in your apartment filled with equipment, or a small business. Twice per mission, you or an ally can take Advantage on a personal Prep roll made by training or mentally preparing yourself at the gym.


## Gigs

> [!hint]+ Gigs
>  - [S] Roofdash
	> 	- When you roll for group Prep before a Mission, you may instead choose to work for RoofDash. You have to use a Generic Specialty for making speedy deliveries, even if you’ve already used it during Prep. Gain Cash instead of group Prep for this roll, to a maximum of +3 Cash.

## Augments
Added Burden: `INPUT[number:augmentBurden]` `VIEW[{augmentBurden}+1][math(hidden):Burden]`
- Athletic Legs (3)
	- Legs were one of the first types of prosthetic to become a proper Augment, and the modern versions can surpass biological limitations. Couriers face significant pressure to get these on the job, but their average career lasts roughly two years. This Augment replaces both legs. **You have Advantage on all rolls to run, jump, do parkour, and similar feats. Never apply this to attack rolls, even if you make one as part of a move.**

> [!note]+ Traits
> - Well Traveled
> 	- You've been all around Grand Cross and know it like the back of your hand. You have Advantage on all rolls that rely on your knowledge of the station's layout. Frequent traveling means shopping and transport costs; if you roll to lose unspent Cash at the end of a session, roll with Advantage.
> - Speedy
> 	- You get +1 Quick Defense Specialty. When you’re not Quick enough to defend against something, you have Disadvantage on your next roll (whatever it is).

> [!check]+ Talents
>  - Cat Burglar
	> 	- **You have Advantage on all rolls to climb, scale, squeeze through, abseil, leap over, or otherwise pass an obstacle.** Once per fight, when an attack targets your Quick Defense, you may immediately use Take Cover (p. 45) before the attack is resolved.
>  - Parkour
	 >	- If you roll a critical success on any action involving movement, gain Advantage on your next action if it also involves movement.
	 >	> [!fail]- **7+ Thief Talents:** You may reroll all 1s on these rolls.

## `VIEW[{Job}]`
For each level, you gain:
- +1 Specialty, +1 Generic Specialty, 1 Talent.
1. (Stealth), (Parkour), (Cat Burglar)
## First Occupation
| ~~**Choose one:** A Fake ID (p. 81) or a weapon (your choice).~~ |
| ---- |
| ~~**Choose one: **A Safehouse (p. 83) or Thieving Gear (p. 83).~~ |
| ~~**Choose one Specialty:** +1 Clever Defense, +1 Quick Defense, or +1 to 1 Stealth action.~~ |
| ==**Choose one Talent:** Thief or Generic. (Parkour)== |

# Backstory

Kai was born to wealthy parents, and is the youngest of 3 children. Rick, his father, runs a few businesses (restaurants, gyms) across the Grand Cross, while his mother, Rebecca, is a lipstick model. His parents were strict in what he could do and when, but that didn't stop him from breaking curfew to run the rooftops and hang with taggers. This lifestyle lead him to household punishment from his mother, but the escape just made it feel just as nice. 

