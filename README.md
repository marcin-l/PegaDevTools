# **PegaDevTools (PDT)**

PDT is a browser-based developer productivity tool for Pega 8, designed to enhance your development experience without the need for ruleset deployment. The extension primarily targets Chromium-based browsers (Chrome, Edge, Opera, etc.).


**[Explore the PDT Wiki](https://github.com/marcin-l/PegaDevTools/wiki)** to learn about the available features.

## Recent changes
- 2024.06.20 SQL queries in Tracer - added simple syntax highlighting for improved readability and ability to see the query in a formatted view

## Installation
1. Download or clone the extension using the green *Code* button at the top of this page and selecting `Download ZIP`
<br><img src="https://raw.githubusercontent.com/wiki/marcin-l/PegaDevTools/images/installation.png" />
1. Extract downloaded ZIP file
  
  
1. Load unpacked extension:
- For Chrome and Edge:
  - Open browser settings and click `Extensions`
  - Enable `Developer mode`
  - Click `Load Unpacked` and navigate to the extracted ZIP file directory (containing manifest.json) and click *Select Folder*

- For Firefox
  - Open `about:debugging` URL
  - Click the `This Firefox` button on the left
  - Click the `Load Temporary Add-on...` button
  - Navigate to the extracted ZIP file directory, select any file, and click *Open*.
  <br>Please note that this method is not persistent. Extension needs to be loaded for each Firefox session.

## Post-Installation
- Go to PDT [Extension Options](https://github.com/marcin-l/PegaDevTools/wiki/Configuration). In the *Site config* section add your environment domain name (e.g. `client-dt1.pegacloud.net`, without `https://`) and click *Save site configuration*. 
- Turn on features in the *Settings* section and click `Save settings`.
- Reload your Pega tabs if needed
<br>Some features will not work if this step is skipped

## Updating to a New Version
- Overwrite extension with new download, your settings will be left intact
- Go to Chrome/Edge settings
- Click `Extensions`
- Reload PegaDevTools
- Check the PDT Extension Options to see if there are any new features to be enabled

## Known Issues and Limitations
- System rules customizations in Dev Studio will stop working when a rule is refreshed (to be addressed in the future). Reopen the rule to restore customizations.
- Some features may not work when Dev Studio language is set to something other than English. Use the `ignore locale` option in user preferences as a workaround.
- Not all customizations will load if you open your application in App or Admin Studio. Set _Developer_ portal as the default for your Access Group to circumvent this issue.
- Firefox support is currently unavailable but coming soon.

## Issue Reporting and Feature Requests
Visit the [Issues](https://github.com/marcin-l/PegaDevTools/issues) page to view pending fixes and upcoming features.

If you find a bug or have a new idea/feature for the extension, feel free to [report them](https://github.com/marcin-l/PegaDevTools/issues/new).

## Credits
Tracer feature to navigate to first Error and Message is based on Piotr Olejniczak's idea.

### Contributors
* [Mariusz Woźnica](https://github.com/woznica1970)

### Third-party libraries (MIT license)
- [arrive.js](https://github.com/uzairfarooq/arrive)
- [CodeMirror](https://codemirror.net/)
- [ctxmenu.js](https://github.com/nkappler/ctxmenu)
- [Huebee](https://huebee.buzz)
- [jQuery](https://jquery.com/)
- [jQuery.FilterTable](https://github.com/sunnywalker/jQuery.FilterTable)
- [Tinycon](https://github.com/tommoor/tinycon)
