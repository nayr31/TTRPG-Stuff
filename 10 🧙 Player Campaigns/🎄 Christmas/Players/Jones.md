---
tamerpool: 100
tamerpoolmax: 100
PROF: 6
LVL: 20
---





# Tamer Class
Tamer Pool: `INPUT[number:tamerpool]`/`VIEW[{LVL} * 5][math:tamerpoolmax]`
Alpha Strike: `INPUT[number:alphapool]`/
## Monster Tamer

The Tamer grants its companions improvements and hit dice when they level up.
![[Tamer companion table.png]]

# Companions

## Pocket Familiar

```statblock
image: [[Taz_c.png]]
name: Taz (Tatzling)
size: Large
type: Dragon
ac: 18 (natural armor)
hp: 81 (9d10)
speed: 45ft.
stats: [11, 14, 16, 11, 10, 12]
skillsaves:
  - Perception: +6
damage_resistances: cold
senses: darkvision 60ft., passive Perception 12
languages: N/A
cr: 1/8
traits:
  - name: Disaster Prone
    desc: When the tatzling makes an ability check or attack roll and rolls a 1 on the d20, the results are often disastrous. The GM has great latitude when deciding the consequences of this trait triggering.
  - name: Aura of Protection
    desc: Whenever a creature friendly to the tatzling makes a saving throw while within 10 feet of the tatzling, the creature gains a bonus to the saving throw equal to the tatzling’s Constitution modifier (minimum +1). The tatzling must be conscious to grant this bonus.
actions:
  - name: Bite
    desc: Melee, +9 to hit, 1d12+3 piercing damage
  - name: Claw
    desc: Melee, +9 to hit, 1d10+3 slashing damage
  - name: Cold Demeanour
    desc: As a bonus action, the tatzling creates a magical protective shield that surrounds it, covering its scales in a delicate patina of hoarfrost. It gains temporary hit points equal to three times its tamer’s proficiency bonus for 1 minute. If a creature hits it with a melee attack while it has these temporary hit points, the creature takes cold damage equal to three times its tamer’s proficiency bonus. After the tatzling uses this action, it can’t do so again until its tamer finishes a short or long rest.
reactions:
  - name: Protect (3/Day)
    desc: When a creature the tatzling can see attacks a target that is within 5 feet of the tatzling, it can impose disadvantage on the attack roll provided the attack is against a creature other than the tatzling.
  - ...
```

```yaml
  - name: Slowing Gaze (1/rest)
    desc: As an action, the tatzling targets one creature it can see within 30 feet of it that can see it. The target must succeed on a Constitution saving throw or be affected by the slow spell until the start of the tatzling’s next turn, until the tatzling can no longer see it, until it is more than 60 feet from the tatzling,
or until the tatzling chooses to end the effect (no action required). At the start of its subsequent turns, the tatzling can use its bonus action to extend the effect’s duration to the start of its next turn. For the effect’s duration, the tatzling has disadvantage on attack rolls against creatures other than the target of this effect.
  - name: Slowing Glare (1/long)
    desc: As an action, each creature of the tatzling’s choice in a 40-foot cone originating from its eyes must succeed on a Constitution saving throw or become affected by the slow spell for 1 minute. An affected creature can repeat this saving throw at the end of each of its turns, ending the effect on itself on a success.
  - name: Freezing Blast (1/long)
    desc: The tatzling gains immunity to cold damage. As an action, the tatzling causes temperatures to plummet. Each creature within 20 feet of it must make a Constitution saving throw, taking 35 (10d6) cold damage on a failure, or half as much damage on a success. In addition, surfaces in the area become covered in a thin sheet of ice that lasts for 1 minute. When the ice appears, each creature standing on it must succeed on a Dexterity saving throw or fall prone. A creature that enters the area for the first time on its turn or ends its turn there must also succeed on a Dexterity saving throw or fall prone. The tatzling automatically succeeds on these Dexterity saving throws.
```

> [!notes]- Improvements
> CR 1/2 -, gets 19 Improvements and 5 Hit dice increases
> 
> 1. Growth 1 (Tiny->Small, d4->d6, Bite=d8, Claw=d6)
> 2. Growth 3 (Medium->Large, d8->d10, Bite=d12, Claw=d10)
> 3. Growth 2 (Small->Medium, d6->d8, Bite=d10, Claw=d8)
> 4. Ability Boost (CON)
> 5. Ability Boost (CON)
> 6. Ability Boost (CON)
> 7. Ability Boost (CON)
> 8. Toughen Up (+1 Hit Die)
> 9. Toughen Up (+1 Hit Die)
> 10. Harden 1 (+2 AC)
> 11. Harden 2 (+2 AC)
> 12. Aura of Protection (10ft., Saving From CON)
> 13. Speed Training (+15ft.)
> 14. Cold Dameanour (1/rest, Bonus Action, TempHP=Prof, melee reflection=3xProf)
> 15. Freezing Blast (cold immune, 1/long, 20ft con save, 10d6 cold;halved, ice left, dex save or prone)
> 16. Slowing gaze (1/rest, target 30ft., con save or slow, stay within 60ft., bonus action concentrate)
> 17. Slowing glare (1/long, 60ft. cone slowing gaze, no requirement to keep it)
> 18. Multiattack
> 19. Go For the Throat (+1 to attack and dmg rolls)

```statblock
creature: Invisible Stalker
name: Waz
```
