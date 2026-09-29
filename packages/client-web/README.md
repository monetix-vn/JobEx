# @je/client-web

The presentation shell: a status strip, a tile map, and a dialogue box with choices. It owns no
rules and no randomness. It reduces bus messages (`clock.ticked`, `map.loaded`, `scene.started`,
`choice.resolved`) into view state and sends the player's choice back as a `choice.made` command.

It talks to the simulation through a `Transport` (subscribe and send), so the same client works
against an in-process run today, a Web Worker next, and a server later. It imports only
`@je/contracts`; the composition root (`tools/demo-host`) wires a run to it.
