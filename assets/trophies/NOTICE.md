# Trophy artwork and ranking rules

The added trophy cards reuse cup and laurel artwork from [soulteary/github-profile-trophy v1.0.0](https://github.com/soulteary/github-profile-trophy/tree/v1.0.0), under the included [MIT license](./LICENSE). Rank thresholds and labels follow its `internal/trophies/trophy_types.go` implementation.

`scripts/expand-trophies.py` preserves the generated Commits, PullRequest, and Followers cards, then adds Stars, Repositories, and Experience. It paginates GitHub's public repository API, checks that all public repositories were collected, and fails on missing data rather than converting errors into zero scores. Stars are the sum across those public repositories, including owned forks. Experience is the integer number of 100-day periods since account creation.

The additional cards use a single cup displaying the full rank string. Their progress bars show progress toward the next threshold; the highest rank has a full bar. The graph, cards, source metadata, and motion-free alternatives are refreshed by the existing daily profile workflow.
