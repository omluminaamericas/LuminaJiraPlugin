# Lumina Jira Plugin

This is a Tampermonkey userscript designed to enhance the Jira Cloud UI by adding custom buttons for updating estimations and triggering webhooks, tailored for Lumina's workflow.

## Description
The **Lumina Jira Plugin** adds two icons to the Jira issue view:
- A button to quickly refresh the estimation of the current Jira issue (visible when the "Estimation" tab is present).
- A button to update the total story points in an Epic via a webhook (visible only for Epic issue types).

## Installation
To use this plugin, follow these steps:

1. **Install Tampermonkey**:
   - If you don't have Tampermonkey installed, get it from:
     - [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
     - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

2. **Install the Script**:
   - Click on the following link to install the script directly:
     [Install Lumina Jira Plugin](https://raw.githubusercontent.com/omluminaamericas/LuminaJiraPlugin/main/LuminaJiraPlugin.user.js)
   - Tampermonkey will prompt you to install the script. Click "Install".

3. **Verify Installation**:
   - Open a Jira issue page (e.g., `https://luminaamericas.atlassian.net/browse/LUMINA-1234`).
   - If the "Estimation" tab is present, you should see a `⟳` button to refresh the estimation.
   - If the issue is an Epic, you should see a `✯` button to update story points.

## Features
- **Refresh Estimation**: Quickly updates the estimation for the current Jira issue.
- **Update Story Points**: Calculates and updates the total story points in an Epic via a webhook.
- **Automatic Updates**: The script checks for updates automatically when a new version is released.

## Requirements
- A modern web browser (Chrome, Firefox, Edge) with Tampermonkey installed.
- Access to your Jira Cloud instance (e.g., `https://luminaamericas.atlassian.net`).

## Usage
- The `⟳` button appears when the "Estimation" tab is available and refreshes the estimation with a single click.
- The `✯` button appears only on Epic issues and triggers a webhook to update the total story points.
- A toast notification will confirm success or display an error if something goes wrong.

## Updating
- When a new version is available, Tampermonkey will notify you. Click "Install" to update the script.
- Check the `@version` in the script header to see the current version (e.g., 1.8).

## Contributing
This script is maintained by the Lumina team. For suggestions or issues, please contact your IT administrator.

## License
TBD

## Notes
- Ensure the webhook URL and API endpoints (`ESTIMACION_API_URL` and `WEBHOOK_URL_BASE`) are correctly configured for your environment.
- The script source code is visible in Tampermonkey for transparency and customization, but it is intended for internal use only.
