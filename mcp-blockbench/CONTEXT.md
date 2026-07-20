# Asset Production Context

This glossary defines the language used while producing one Blockbench asset from an approved Reference Package. It contains no implementation procedure.

## Terms

**Asset** — One independently produced Blockbench deliverable with one canonical identity.

**Canonical Model** — The single authoritative `.bbmodel` file for an Asset.

**Stage** — A user-visible production phase: Geometry, Texture, optional Animation, or Final Validation.

**Internal Pass** — A bounded implementation step inside a Stage. It is not a user review gate.

**Mutation** — Any operation that changes the active Asset, its canonical state, or production evidence.

**Writer** — The one execution session currently authorized to perform Mutations.

**Review Gate** — A user-visible pause where current Stage evidence is presented for approval or targeted revision.

**Revision** — A targeted return from a Review Gate to active work while preserving accepted areas and approved history.

**Evidence** — A current, reproducible artifact proving a production claim, such as rendered views, metrics, reports, texture atlases, or validation results.

**Checkpoint** — A recoverable snapshot bound to a specific Asset identity, Stage, runtime revision, and approval state.

**Runtime State** — The current machine-readable production status for an active Asset.

**Reference Binding** — The integrity relationship that ties the active Asset and its Evidence to the approved Reference Package.

**Final Candidate** — The validated model, textures, previews, and reports prepared for final user review.

**Finalization** — The atomic transition that promotes an approved Final Candidate into the completed user-facing package.

**Completed Baseline** — An immutable approved Asset package retained for use and future targeted reopening.
