# Notion Integration Scripts

Scripts for syncing project documentation to Notion.

## ✅ Setup Complete!

Your Notion integration is already configured and working:
- **Token**: Stored securely in `.env`
- **Page**: Release Notes/Changelog (2e8516cd94be80a28976c4b8a69de51e)
- **Database**: Auto-detected on the page

## Available Commands

### Test Connection
```bash
npm run notion:test
```
Tests the Notion API connection and lists all pages shared with the integration.

### Inspect Page Structure
```bash
npm run notion:inspect
```
Shows the structure of the configured Notion page and finds embedded databases.

### Sync Changelog
```bash
npm run notion:sync
npm run notion:sync-changelog
```
Syncs all entries from `docs/CHANGELOG.md` to your Notion page. Each changelog version will be added as:
- A heading with version number and date
- Categorized changes (Added, Changed, Fixed, Removed)
- Formatted with emojis and bullet points

## How It Works

The sync script:
1. Reads `docs/CHANGELOG.md`
2. Parses version entries (format: `## [X.X.X] - YYYY-MM-DD`)
3. Extracts changes by category (Added, Changed, Fixed, Removed)
4. Converts to Notion blocks (headings, lists, dividers)
5. Appends blocks to your Notion page

## Changelog Format

Your changelog should follow this format:

```markdown
## [0.2.0] - 2026-02-15

### Added
- New feature 1
- New feature 2

### Changed
- Updated component X
- Improved performance

### Fixed
- Bug fix 1

### Removed
- Deprecated feature
```

The script automatically recognizes:
- Version headers: `## [X.X.X]` or `## X.X.X`
- Date format: `YYYY-MM-DD` or `MM/DD/YYYY`
- Categories: `### Added`, `### Changed`, `### Fixed`, `### Removed`
- Category emojis: `✨ Added`, `🔄 Changed`, `🐛 Fixed`, `❌ Removed`

## Usage Workflow

1. **Update your changelog**: Edit `docs/CHANGELOG.md` with new changes
2. **Sync to Notion**: Run `npm run notion:sync-changelog`
3. **View in Notion**: Check your Release Notes page

The script appends new content to the page, so you can sync multiple times. If you want a fresh start, manually clear the page in Notion before syncing.

## Troubleshooting

### "Page not found" error
Make sure the page is shared with your integration:
1. Open the Notion page
2. Click "..." (more options) in the top right
3. Click "Add connections"
4. Select your integration

### "Unauthorized" error
Your integration token might be invalid:
- Check https://www.notion.so/my-integrations
- Verify the token in `.env` matches your integration
- Make sure the integration hasn't been revoked

### Duplicate entries
The script appends content each time it runs. To avoid duplicates:
- Only run the sync when you have new changelog entries
- Or manually remove old entries from Notion before syncing

## Links

- [Your Release Notes Page](https://www.notion.so/liberticus-caelum/Release-Notes-Changelog-2e8516cd94be80a28976c4b8a69de51e)
- [Notion Integration Settings](https://www.notion.so/my-integrations)
- [Notion API Documentation](https://developers.notion.com/)
