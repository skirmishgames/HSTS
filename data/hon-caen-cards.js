window.HTS_CARDS = window.HTS_CARDS || {};
HTS_CARDS["hon-caen"] = {
 "box": "caen",
 "source": "designer print files: the Commonwealth Battle Event deck (Battle Pack 2, 50 cards), the Eileen Nearne special card, and the 6 German SS cards of Battle Pack 3 (a German recruitment option adds 3 or 6 of them to the deck)",
 "phases": [
  "Order",
  "Activation",
  "Movement",
  "Combat",
  "Supply",
  "Any time"
 ],
 "tags": [
  "Order tokens",
  "Activation",
  "Movement",
  "Firing and assault",
  "Suppressed markers",
  "Vehicles",
  "Infantry",
  "Dice",
  "Action cards",
  "Destroyed units",
  "Gear markers",
  "Healing"
 ],
 "sides": [
  {
   "id": "cw",
   "name": "Commonwealth"
  },
  {
   "id": "ss",
   "name": "German SS"
  }
 ],
 "entries": [
  {
   "id": "cw-burst-into-action",
   "nation": "cw",
   "name": "Burst into Action",
   "copies": 4,
   "phase": "Activation",
   "on": [
    "Firing and assault"
   ],
   "when": "Play before activating one of your units.",
   "text": "During this activation, your unit gains the Fire on the Move special ability. Ignore the Combat Value penalty if your unit already has the Fire on the Move special ability.",
   "ref": "PB02-HoN-CW-EN-1 to 4",
   "img": "img/hon/caen/cards/cw/burst-into-action.webp",
   "thumb": "img/hon/caen/cards/cw/burst-into-action.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-don-t-stop",
   "nation": "cw",
   "name": "Don't Stop",
   "copies": 1,
   "phase": "Movement",
   "on": [
    "Vehicles",
    "Movement",
    "Suppressed markers",
    "Dice"
   ],
   "when": "Play before moving one of your vehicles.",
   "text": "You can move through any Difficult Passage square as long as your Movement Value is sufficient to completely exit that Terrain Element. Roll a die, on a 1-2 your unit receives 1 Suppressed Marker at the end of its Movement Action.",
   "ref": "PB02-HoN-CW-EN-5",
   "img": "img/hon/caen/cards/cw/don-t-stop.webp",
   "thumb": "img/hon/caen/cards/cw/don-t-stop.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-communications-scrambled",
   "nation": "cw",
   "name": "Communications Scrambled",
   "copies": 2,
   "phase": "Order",
   "on": [
    "Order tokens"
   ],
   "when": "Play at the end of the Order Phase.",
   "text": "Remove an Order Token from an enemy unit without revealing it.",
   "ref": "PB02-HoN-CW-EN-6 to 7",
   "img": "img/hon/caen/cards/cw/communications-scrambled.webp",
   "thumb": "img/hon/caen/cards/cw/communications-scrambled.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-confusion",
   "nation": "cw",
   "name": "Confusion",
   "copies": 1,
   "phase": "Combat",
   "on": [
    "Order tokens",
    "Suppressed markers",
    "Infantry"
   ],
   "when": "Play when an enemy infantry unit receives a Suppressed Marker.",
   "text": "Remove any Order Token from the target unit.",
   "ref": "PB02-HoN-CW-EN-8",
   "img": "img/hon/caen/cards/cw/confusion.webp",
   "thumb": "img/hon/caen/cards/cw/confusion.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-courage",
   "nation": "cw",
   "name": "Courage",
   "copies": 2,
   "phase": "Any time",
   "on": [
    "Suppressed markers"
   ],
   "when": "Play at any time.",
   "text": "Remove a Suppressed Marker from one of your units.",
   "ref": "PB02-HoN-CW-EN-9 to 10",
   "img": "img/hon/caen/cards/cw/courage.webp",
   "thumb": "img/hon/caen/cards/cw/courage.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-bogged-down",
   "nation": "cw",
   "name": "Bogged Down",
   "copies": 1,
   "phase": "Movement",
   "on": [
    "Vehicles",
    "Movement",
    "Suppressed markers"
   ],
   "when": "Play during the Movement Action of any enemy unit except an infantry unit.",
   "text": "Stop the unit at any point in its Movement Action, as long as it's not on a Terrain Element which is normally prohibited. Place a Suppressed Marker on it. The unit can move again on the following turn.",
   "ref": "PB02-HoN-CW-EN-11",
   "img": "img/hon/caen/cards/cw/bogged-down.webp",
   "thumb": "img/hon/caen/cards/cw/bogged-down.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-speed-setup",
   "nation": "cw",
   "name": "Speed Setup",
   "copies": 2,
   "phase": "Activation",
   "on": [
    "Movement"
   ],
   "when": "Play during the Activation Phase.",
   "text": "You can immediately flip a unit with the Tripod special ability. This Change of State doesn't count as a Movement Action.",
   "ref": "PB02-HoN-CW-EN-12 to 13",
   "img": "img/hon/caen/cards/cw/speed-setup.webp",
   "thumb": "img/hon/caen/cards/cw/speed-setup.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-go-go-go",
   "nation": "cw",
   "name": "Go! Go! Go!",
   "copies": 1,
   "phase": "Activation",
   "on": [
    "Activation",
    "Movement"
   ],
   "when": "Play before activating one of your units.",
   "text": "Two units situated 1 or 2 squares from one of your officers (yellow outline) can immediately move 2 squares. Either of those units are free to act in this Phase if they still have an Order Token.",
   "ref": "PB02-HoN-CW-EN-14",
   "img": "img/hon/caen/cards/cw/go-go-go.webp",
   "thumb": "img/hon/caen/cards/cw/go-go-go.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-high-command",
   "nation": "cw",
   "name": "High Command",
   "copies": 1,
   "phase": "Order",
   "on": [
    "Order tokens"
   ],
   "when": "Play at the start of the Order Phase.",
   "text": "For this turn, you have an additional Special Order Token.",
   "ref": "PB02-HoN-CW-EN-15",
   "img": "img/hon/caen/cards/cw/high-command.webp",
   "thumb": "img/hon/caen/cards/cw/high-command.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-initiative",
   "nation": "cw",
   "name": "Initiative",
   "copies": 2,
   "phase": "Activation",
   "on": [
    "Order tokens",
    "Activation"
   ],
   "when": "Play before the activation of an enemy unit.",
   "text": "If you don't have Initiative, you can activate your unit before your opponent's, providing the number of their Order Token is the same as yours. This Battle Event does not enable you to take the Initiative on a Special Order.",
   "ref": "PB02-HoN-CW-EN-16 to 17",
   "img": "img/hon/caen/cards/cw/initiative.webp",
   "thumb": "img/hon/caen/cards/cw/initiative.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-thank-the-helmet",
   "nation": "cw",
   "name": "Thank the Helmet!",
   "copies": 2,
   "phase": "Combat",
   "on": [
    "Infantry",
    "Suppressed markers",
    "Firing and assault"
   ],
   "when": "Play when one of your infantry units suffers a Hit (or would be Destroyed) by a Firing Action.",
   "text": "Ignore that Hit and place a Suppressed Marker on your unit instead. This card cannot be used during an assault.",
   "ref": "PB02-HoN-CW-EN-18 to 19",
   "img": "img/hon/caen/cards/cw/thank-the-helmet.webp",
   "thumb": "img/hon/caen/cards/cw/thank-the-helmet.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-no",
   "nation": "cw",
   "name": "No!",
   "copies": 2,
   "phase": "Any time",
   "on": [
    "Action cards"
   ],
   "when": "Play at any time.",
   "text": "Cancel an Action Card your opponent just played. That Action Card is returned to your opponent's hand and can be played again next turn.",
   "ref": "PB02-HoN-CW-EN-20 to 21",
   "img": "img/hon/caen/cards/cw/no.webp",
   "thumb": "img/hon/caen/cards/cw/no.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-hit-and-run",
   "nation": "cw",
   "name": "Hit and Run",
   "copies": 1,
   "phase": "Activation",
   "on": [
    "Vehicles",
    "Movement",
    "Infantry"
   ],
   "when": "Play before activating one of your vehicles.",
   "text": "Your vehicle can attempt to run over a single infantry unit during its Movement Action. Each player rolls 1 die and adds the result to their unit's Movement Value. If your result is higher, you inflict 1 Hit to the infantry unit. Otherwise, nothing happens.",
   "ref": "PB02-HoN-CW-EN-22",
   "img": "img/hon/caen/cards/cw/hit-and-run.webp",
   "thumb": "img/hon/caen/cards/cw/hit-and-run.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-weak-point",
   "nation": "cw",
   "name": "Weak Point",
   "copies": 2,
   "phase": "Activation",
   "on": [
    "Firing and assault",
    "Vehicles"
   ],
   "when": "Play before activating one of your units.",
   "text": "If your unit shoots at a heavy vehicle, choose the lowest Defense Value of that vehicle when resolving the Firing Action.",
   "ref": "PB02-HoN-CW-EN-23 to 24",
   "img": "img/hon/caen/cards/cw/weak-point.webp",
   "thumb": "img/hon/caen/cards/cw/weak-point.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-precision",
   "nation": "cw",
   "name": "Precision",
   "copies": 1,
   "phase": "Combat",
   "on": [
    "Firing and assault"
   ],
   "when": "Play after a scattering roll for Indirect Fire.",
   "text": "The scattering distance is reduced by 1 interspace.",
   "ref": "PB02-HoN-CW-EN-25",
   "img": "img/hon/caen/cards/cw/precision.webp",
   "thumb": "img/hon/caen/cards/cw/precision.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-ready",
   "nation": "cw",
   "name": "Ready!",
   "copies": 2,
   "phase": "Activation",
   "on": [
    "Order tokens",
    "Activation"
   ],
   "when": "Play during the Activation Phase.",
   "text": "Remove an Order Token or Activated Marker from one of your units. That unit can act again this turn, either with the aid of a card, through a special ability, or during the Supply Phase.",
   "ref": "PB02-HoN-CW-EN-26 to 27",
   "img": "img/hon/caen/cards/cw/ready.webp",
   "thumb": "img/hon/caen/cards/cw/ready.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-dynamic",
   "nation": "cw",
   "name": "Dynamic",
   "copies": 2,
   "phase": "Activation",
   "on": [
    "Order tokens",
    "Destroyed units"
   ],
   "when": "Play during the Activation Phase.",
   "text": "Reassign an unrevealed Order Token from one of your units to another unit without an Order Token or Activated Marker. That Order Token can even be salvaged from a unit right after it was Destroyed.",
   "ref": "PB02-HoN-CW-EN-28 to 29",
   "img": "img/hon/caen/cards/cw/dynamic.webp",
   "thumb": "img/hon/caen/cards/cw/dynamic.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-it-bounced-right-off",
   "nation": "cw",
   "name": "It Bounced Right Off",
   "copies": 1,
   "phase": "Combat",
   "on": [
    "Vehicles",
    "Suppressed markers"
   ],
   "when": "Play when one of your vehicles (light or heavy) takes a Hit or would be Destroyed.",
   "text": "Ignore that Hit result and place 2 Suppressed Markers on your unit. This Action Card must be played before any Damage location roll.",
   "ref": "PB02-HoN-CW-EN-30",
   "img": "img/hon/caen/cards/cw/it-bounced-right-off.webp",
   "thumb": "img/hon/caen/cards/cw/it-bounced-right-off.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-return-to-sender",
   "nation": "cw",
   "name": "Return to Sender",
   "copies": 1,
   "phase": "Combat",
   "on": [
    "Order tokens",
    "Activation",
    "Infantry",
    "Firing and assault"
   ],
   "when": "Play when your opponent launches any grenade (with a maximum range of 3 interspaces).",
   "text": "If one of your Unactivated infantry units is under the explosion template, move the template 1 interspace away from that unit. Put an Activated Marker on the unit, and remove its Order Token if it has one.",
   "ref": "PB02-HoN-CW-EN-31",
   "img": "img/hon/caen/cards/cw/return-to-sender.webp",
   "thumb": "img/hon/caen/cards/cw/return-to-sender.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-repairs",
   "nation": "cw",
   "name": "Repairs",
   "copies": 1,
   "phase": "Order",
   "on": [
    "Vehicles",
    "Suppressed markers"
   ],
   "when": "Play during the Order Phase.",
   "text": "Replace 1 Damage Marker on one of your heavy vehicles with 1 Suppressed Marker.",
   "ref": "PB02-HoN-CW-EN-32",
   "img": "img/hon/caen/cards/cw/repairs.webp",
   "thumb": "img/hon/caen/cards/cw/repairs.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-fall-back",
   "nation": "cw",
   "name": "Fall Back",
   "copies": 2,
   "phase": "Combat",
   "on": [
    "Infantry",
    "Suppressed markers",
    "Firing and assault",
    "Movement"
   ],
   "when": "Play when one of your infantry units suffers a Hit (or would be Destroyed) by an Assault.",
   "text": "Ignore that Hit and, if your unit has the Change of State special ability, flip it to the side with the highest Movement Value. Your unit must retreat 2 squares, regardless of its Movement Value, and then receives a Suppressed Marker. If you were the defender, the attacking unit must move into the square your unit vacated.",
   "ref": "PB02-HoN-CW-EN-33 to 34",
   "img": "img/hon/caen/cards/cw/fall-back.webp",
   "thumb": "img/hon/caen/cards/cw/fall-back.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-second-chance",
   "nation": "cw",
   "name": "Second Chance",
   "copies": 3,
   "phase": "Any time",
   "on": [
    "Dice"
   ],
   "when": "Play this card to alter the result of a die roll.",
   "text": "Reroll, or make someone reroll, all dice for a given result and apply the new result instead.",
   "ref": "PB02-HoN-CW-EN-35 to 37",
   "img": "img/hon/caen/cards/cw/second-chance.webp",
   "thumb": "img/hon/caen/cards/cw/second-chance.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-surprise",
   "nation": "cw",
   "name": "Surprise!",
   "copies": 2,
   "phase": "Movement",
   "on": [
    "Infantry",
    "Movement"
   ],
   "when": "Play before the Movement Action of one of your infantry units.",
   "text": "Your unit can enter or leave a building through a window (white arrows) unless that would move them in or out of an Elevated Position.",
   "ref": "PB02-HoN-CW-EN-38 to 39",
   "img": "img/hon/caen/cards/cw/surprise.webp",
   "thumb": "img/hon/caen/cards/cw/surprise.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-tactician",
   "nation": "cw",
   "name": "Tactician",
   "copies": 2,
   "phase": "Order",
   "on": [
    "Order tokens"
   ],
   "when": "Play at the start of the Order Phase.",
   "text": "For this turn, you have an additional Numbered Order Token.",
   "ref": "PB02-HoN-CW-EN-40 to 41",
   "img": "img/hon/caen/cards/cw/tactician.webp",
   "thumb": "img/hon/caen/cards/cw/tactician.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-opportunity-fire",
   "nation": "cw",
   "name": "Opportunity Fire",
   "copies": 2,
   "phase": "Activation",
   "on": [
    "Firing and assault",
    "Activation"
   ],
   "when": "Play during the activation of an enemy unit.",
   "text": "During this activation, one of your units can take a Firing Action as if it has the Opportunity Fire special ability.",
   "ref": "PB02-HoN-CW-EN-42 to 43",
   "img": "img/hon/caen/cards/cw/opportunity-fire.webp",
   "thumb": "img/hon/caen/cards/cw/opportunity-fire.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-all-terrain",
   "nation": "cw",
   "name": "All-Terrain",
   "copies": 2,
   "phase": "Movement",
   "on": [
    "Infantry",
    "Movement"
   ],
   "when": "Play before the Movement Action of one of your infantry units.",
   "text": "Your unit ignores the restrictions tied to Difficult Passage.",
   "ref": "PB02-HoN-CW-EN-44 to 45",
   "img": "img/hon/caen/cards/cw/all-terrain.webp",
   "thumb": "img/hon/caen/cards/cw/all-terrain.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-god-save-the-king",
   "nation": "cw",
   "name": "God Save the King",
   "copies": 1,
   "phase": "Order",
   "on": [
    "Suppressed markers"
   ],
   "when": "Play at the end of the Order Phase.",
   "text": "Remove all Suppressed Markers from your units.",
   "ref": "PB02-HoN-CW-EN-46",
   "img": "img/hon/caen/cards/cw/god-save-the-king.webp",
   "thumb": "img/hon/caen/cards/cw/god-save-the-king.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-reaction",
   "nation": "cw",
   "name": "Reaction",
   "copies": 1,
   "phase": "Movement",
   "on": [
    "Activation",
    "Movement",
    "Order tokens"
   ],
   "when": "Play when an enemy unit takes a Movement Action.",
   "text": "The enemy unit must wait at its starting position. One of your own Unactivated Units immediately moves first. Your unit receives an Activated Marker and its Order Token is removed if it had one. After this, the enemy unit may complete its Movement Action.",
   "ref": "PB02-HoN-CW-EN-47",
   "img": "img/hon/caen/cards/cw/reaction.webp",
   "thumb": "img/hon/caen/cards/cw/reaction.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-so-british",
   "nation": "cw",
   "name": "So British",
   "copies": 1,
   "phase": "Activation",
   "on": [
    "Activation",
    "Order tokens"
   ],
   "when": "Play between the activation of two orders.",
   "text": "Immediately activate any one of your Unactivated Units. This unit receives an Activated Marker and has its Order Token removed if it had one.",
   "ref": "PB02-HoN-CW-EN-48",
   "img": "img/hon/caen/cards/cw/so-british.webp",
   "thumb": "img/hon/caen/cards/cw/so-british.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-tea-time",
   "nation": "cw",
   "name": "Tea Time",
   "copies": 1,
   "phase": "Order",
   "on": [
    "Healing"
   ],
   "when": "Play at the end of the Order Phase.",
   "text": "One unit, which suffered a Hit, is flipped back to its Unharmed Side. Destroyed units cannot be revived.",
   "ref": "PB02-HoN-CW-EN-49",
   "img": "img/hon/caen/cards/cw/tea-time.webp",
   "thumb": "img/hon/caen/cards/cw/tea-time.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-concentrated-fire",
   "nation": "cw",
   "name": "Concentrated Fire",
   "copies": 1,
   "phase": "Combat",
   "on": [
    "Firing and assault",
    "Activation",
    "Order tokens"
   ],
   "when": "Play before the Firing Action of one of your units.",
   "text": "Another Unactivated Unit, no further than 2 squares away from the firing unit, can provide supporting fire by adding its Combat Value to the dice result of the Firing Action. The supporting unit receives an Activated Marker and has its Order Token removed if it had one.",
   "ref": "PB02-HoN-CW-EN-50",
   "img": "img/hon/caen/cards/cw/concentrated-fire.webp",
   "thumb": "img/hon/caen/cards/cw/concentrated-fire.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "cw-eileen-nearne",
   "nation": "cw",
   "name": "Eileen Nearne",
   "copies": 1,
   "phase": "Order",
   "on": [
    "Action cards"
   ],
   "when": "Play at the end of the Order Phase.",
   "text": "Look at your opponent's hand of cards, and discard one card of your choice.",
   "ref": "HoN-CWA-EN-SP",
   "img": "img/hon/caen/cards/cw/eileen-nearne.webp",
   "thumb": "img/hon/caen/cards/cw/eileen-nearne.t.webp",
   "w": 685,
   "h": 1039,
   "note": "Special card, sold separately from the box."
  },
  {
   "id": "ss-deutschland-uber-alles",
   "nation": "ss",
   "name": "Deutschland über alles",
   "copies": 1,
   "phase": "Combat",
   "on": [
    "Infantry",
    "Firing and assault"
   ],
   "when": "Play when one of your infantry units suffers a Hit (or would be Destroyed) by a Firing Action.",
   "text": "Ignore that Hit. This card cannot be used during an assault.",
   "ref": "HoN-SS-ENG-1",
   "img": "img/hon/caen/cards/ss/deutschland-uber-alles.webp",
   "thumb": "img/hon/caen/cards/ss/deutschland-uber-alles.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "ss-pervitin",
   "nation": "ss",
   "name": "Pervitin",
   "copies": 1,
   "phase": "Activation",
   "on": [
    "Activation",
    "Infantry",
    "Suppressed markers"
   ],
   "when": "Play after activating one of your infantry units.",
   "text": "Activate this unit a second time. Place a Suppressed Marker on the unit after the second activation.",
   "ref": "HoN-SS-ENG-2",
   "img": "img/hon/caen/cards/ss/pervitin.webp",
   "thumb": "img/hon/caen/cards/ss/pervitin.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "ss-fur-den-fuhrer",
   "nation": "ss",
   "name": "Für den Führer",
   "copies": 2,
   "phase": "Combat",
   "on": [
    "Infantry",
    "Firing and assault"
   ],
   "when": "Play when one of your infantry units suffers a Hit (or would be Destroyed).",
   "text": "This unit immediately takes a Fire Action with a +2 bonus, then it is discarded (even if it was not destroyed).",
   "ref": "HoN-SS-ENG-3 to 4",
   "img": "img/hon/caen/cards/ss/fur-den-fuhrer.webp",
   "thumb": "img/hon/caen/cards/ss/fur-den-fuhrer.t.webp",
   "w": 685,
   "h": 1039
  },
  {
   "id": "ss-blut-und-boden",
   "nation": "ss",
   "name": "Blut und Boden",
   "copies": 2,
   "phase": "Any time",
   "on": [
    "Dice"
   ],
   "when": "Play when rolling one or more dice.",
   "text": "Add or subtract 1 to the result.",
   "ref": "HoN-SS-ENG-5 to 6",
   "img": "img/hon/caen/cards/ss/blut-und-boden.webp",
   "thumb": "img/hon/caen/cards/ss/blut-und-boden.t.webp",
   "w": 685,
   "h": 1039
  }
 ]
};
