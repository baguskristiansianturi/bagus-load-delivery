# Platform Adapters

**Status:** reserved architectural layer; no native/Capacitor adapter is implemented.

Owns browser APIs and future native bridges behind small interfaces (for example file selection, camera, location, notifications and offline persistence). Feature and service code should depend on these interfaces rather than scattering platform-specific branches.

Do not add Capacitor or another runtime until browser flows and the product decision are ready.
