# @je/contracts

Owns the shared vocabulary: the message `Envelope`, core event payloads and versions, the port
interfaces, the module manifest/host shapes, the replay-log shape, and pack types with their JSON
Schemas. It has no logic and imports nothing. Everything else codes against it.

Breaking a contract means a new `v` on the event type (see the development plan, section 3).
