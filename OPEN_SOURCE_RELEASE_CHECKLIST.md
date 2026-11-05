# Open-source release checklist

This repository is currently private and is not yet ready to make public.

- [ ] Revoke/rotate the Twelve Data API key that appeared in an earlier committed
      version of `index.html`. The key was removed from a later commit, but it
      remains recoverable from Git history until history is rewritten or the
      public release is made from a clean repository containing only the reviewed
      source snapshot.
- [ ] Do not make the repository public before the exposed key is revoked and
      old Git objects are excluded from the public repository.
- [ ] Choose and add an OSI-approved license. There is currently no `LICENSE`
      file; public visibility alone does not grant reuse rights.
- [ ] Review all frontend assets and third-party material for ownership and
      redistribution rights; document required attributions.
- [ ] Keep `/api/alert` and `/api/rules` disabled until authentication,
      authorization, per-user isolation, input validation, and rate limits exist.
- [ ] Review Vercel and any legacy Netlify deployment separately. Never add
      production secrets to Git, issue descriptions, screenshots, or build logs.
- [ ] Run security smoke checks and a manual review against a Preview deployment
      before promoting anything to Production.
- [ ] Add tests and dependency manifests/lockfiles if dependencies are introduced;
      run dependency and secret scanning in CI.
- [ ] Update the README so deployment instructions match the actual Vercel setup.
