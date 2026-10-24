# Releasing

Releases go out from CI. When `main` has a version in `package.json` that npm doesn't have
yet, the `publish` job in [`ci.yml`](.github/workflows/ci.yml) publishes it, once the checks
and tests pass. It then tags the commit `vX.Y.Z` and makes a GitHub release from the version's
section in [`CHANGELOG.md`](CHANGELOG.md). A merge that doesn't change the version publishes
nothing.

npm trusts the workflow through [trusted publishing](https://docs.npmjs.com/trusted-publishers),
so no npm token is stored in GitHub, and every version gets a provenance statement linking it
to the commit and run that built it.

The demo is deployed to GitHub Pages by [`pages.yml`](.github/workflows/pages.yml) on every
push to `main`, whether or not the version changed.

## Releasing a version

1. On a branch, bump the version without tagging. CI makes the tag.

   ```bash
   npm version minor --no-git-tag-version   # or patch, major, or e.g. 1.1.0-beta.1
   ```

2. In `CHANGELOG.md`, rename `## [Unreleased]` to the new version and start an empty
   `## [Unreleased]` above it. Update the compare links at the bottom. The job refuses to
   publish a version with no section.
3. Open a pull request, and merge it once CI is green.

The run on `main` publishes the version, then tags and releases it. A version with a
prerelease part (`1.1.0-beta.1`) goes to npm under the `next` tag, so
`npm install vue-trend-chart` still gets the latest stable one. On GitHub it's marked as a
prerelease.

If a run fails partway, fix the cause and re-run the job (or run the CI workflow on `main` from
the Actions tab). Each step checks what's missing, so nothing happens twice.

## One-time setup

Do this before merging the first change that bumps the version (1.0.0), so its run on `main`
can publish.

1. **Trust the workflow.** On npmjs.com, open the `vue-trend-chart` package's **Settings**,
   then **Trusted publishing**. Choose **GitHub Actions** and enter:

   | Field             | Value             |
   | ----------------- | ----------------- |
   | Organization/user | `dmtrbrl`         |
   | Repository        | `vue-trend-chart` |
   | Workflow filename | `ci.yml`          |
   | Environment       | `npm`             |

   Under **Allowed actions**, tick **Allow npm publish**. Without it npm only lets the
   workflow stage versions for approval, and its `npm publish` is refused. Leave **Allow
   npm dist-tag** unticked: the workflow sets the tag as part of publishing.

2. **Turn off tokens.** In the same settings, under **Publishing access**, choose **Require
   two-factor authentication and disallow bypass 2fa tokens**. Trusted publishing keeps
   working, and a leaked token can't publish.
3. **Deploy the demo from Actions.** In the repository's **Settings → Pages**, set **Source**
   to **GitHub Actions**. The demo used to be pushed to the `gh-pages` branch by hand; once
   the workflow has deployed it, that branch can be deleted.

The workflow's first run creates the `npm` environment in GitHub
(**Settings → Environments**). To make sure only `main` can publish, set its **Deployment
branches and tags** to `main`. To approve each release by hand, add yourself as a
**Required reviewer** there.
