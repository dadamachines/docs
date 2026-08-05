# dadamachines-docs

Jekyll + just-the-docs site published to https://docs.dadamachines.com via
GitHub Pages. The `pages.yml` workflow deploys on every push to `main`.

## THIS REPOSITORY IS PUBLIC

`github.com/dadamachines/docs` is public. **Committing a file publishes it**,
whether or not Jekyll builds it into the site. Treat "don't publish this" as
"don't commit this" — never as "exclude it from the build".

Before committing anything that is not customer-facing documentation, ask
where it belongs. Engineering handovers, implementation notes, build
procedures for unreleased artifacts, audit reports, roadmap and status
documents belong in the team's **private** engineering repository, not here.
Only the customer-facing manual and the assets the site needs at runtime
belong in this repo.

### Three separate layers, and what each one does *not* do

1. **`.gitignore`** — the only layer that keeps something out of the public
   repo. This is the one that matters for anything confidential.
2. **`_config.yml` `exclude:`** — keeps a committed file out of the built
   site. Defence in depth only; the file is still public on GitHub.
   Note `exclude:` **replaces** Jekyll's built-in list, so the defaults are
   repeated at the top of ours. Dropping them would publish the `Gemfile`.
3. **`nav_exclude: true`** — hides a page from the sidebar and **nothing
   else**. The page stays live at its URL, crawlable, and indexed in the
   theme's client-side search. It is *not* a privacy control. Never rely on
   it to hide anything.

A file with no YAML front matter placed anywhere outside `_`-prefixed
directories — a stray `README.md` in `assets/`, for instance — is copied
verbatim to a public URL rather than rendered as a page. Watch for those.

### Before any release or merge to main

```sh
bundle exec jekyll build
grep -rlIi "/Users/\|private/tmp" _site/        # local paths — expect no hits
git grep --cached -lIi "/Users/\|private/tmp"   # same, in the commit
```

Also grep for the names of internal repositories, design tools, project files
and unreleased hardware revisions. **Code comments are the usual culprit** —
a provenance note explaining where some geometry or constant came from will
happily name an internal tool and its project file. Describe the *source*
generically instead. Check against what is already live: if a name does not
appear anywhere in `origin/main`, committing it is a new disclosure.

Then read `git diff --cached --stat` in full and confirm every single file is
something you are content to see on the public internet.

## Gotchas

- `.gitignore`'s Bundler rule is `/vendor/`, **anchored on purpose**.
  Unanchored, `vendor/` also swallows `assets/js/vendor/`, which holds the
  site's own vendored `webaudio-controls.js`. That failure is silent: the file
  is simply never committed, then 404s in production and breaks every knob on
  every Learn page. Do not "tidy" the leading slash away.
- Learn-page widget scripts are wired in `_includes/head_custom.html` and are
  opt-in per page via `tbd_widgets: true`. `webaudio-controls.js` is
  deliberately **not** deferred — it must define its custom elements before
  `tbd-seq.js` instantiates any knob.
- Every asset URL goes through `relative_url`; CI builds with a `--baseurl`.
- `assets/runtime/` holds a generated Wasm artifact and a mirrored browser
  SDK. Both are copied in from elsewhere — do not hand-edit them here. The
  guard is `node assets/runtime/groovebox-dev/smoke-test.mjs`.
