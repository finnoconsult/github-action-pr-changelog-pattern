# Build Changelog JS Action

To Build Changelog from recent PR title and/or body

- This action grabs any text from PR details, which matches "message-pattern".
- Then builds up a string changelog according to template specified in "body-template"

## Environment variable


### `PR`

**Required** The object contaning the PR details in JSON string!!! format


## Inputs

### `version`

**Required** The version number to be put into changelog

### `message-pattern`

**Optional** The regex pattern to match any string, ie to grab all referenced issue URL. Default `https://[\wéáőúíóüö/\-\.]+`
### `body-template`

**Optional** String Format to build the changelog template. Default `"## {{version}} - {{date}}\n\n{ - {message}\n}"`.

Supported literals are *{version} {date} {datetime}* and *{message}*

## Outputs

### `content`

The string content build from input

## Example usage
```yaml
    ## prerequisites
    - uses: 8BitJonny/gh-get-current-pr@1.0.1
      id: PR
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}

    ## this is the bit for this package
    - name: 'Build changelog'
      id: changelog
      uses: 'finnoconsult/github-action-pr-changelog-pattern@master'
      env:
        PR: ${{ steps.PR.outputs.pr }}
      with
        version: ${{ steps.version.outputs.newTag }}

    ## any next step
    - name: 'Append changelog file'
      env:
        BODY: ${{ steps.changelog.outputs.content }}
      run: echo -e "${BODY}" >> finnoconsult.at/changelog.md
    - name: Commit file
      id: git_commit
      uses: swinton/commit@v2.x
      env:
        # GITHUB_TOKEN is injected automatically by GITHUB Actions, no further setup is needed
        GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        files: |
          finnoconsult.at/changelog.md
        commit-message: CI: amend changelog for version
        ref: refs/heads/development
    - run: echo "${{ steps.git_commit.outputs.commit-sha }}"
```