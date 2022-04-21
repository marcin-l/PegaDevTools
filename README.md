# **PegaDevTools**

PDT is browser-only (i.e. no ruleset deployment is required) Pega 8 developer productivity tool.

**Check out available features in the [PDT Wiki](https://github.com/marcin-l/PegaDevTools/wiki)**

Extension development is mostly targeting chromium-based browsers, but it should for the most part work in Firefox.

## Issues and feature requests
Check the [Issues](https://github.com/marcin-l/PegaDevTools/issues) page to see things to be fixed and features to be implemented.

If you found a bug or have a new idea/feature for the extension, [you can report them](https://github.com/marcin-l/PegaDevTools/issues/new).

## How to use
- Download (or clone) the extension using green button on the top of this page
**Code -> Download ZIP**
- Unpack downloaded zip file

[[https://raw.githubusercontent.com/wiki/marcin-l/PegaDevTools/images/installation.png]]

### Chrome and Edge
- Go to Chrome/Edge settings
- Click **Extensions**
- Enable **Developer mode**
- Click on **Load Unpacked** and select your unpacked zip file directory

### Firefox
- go to **about:debugging** URL
- click on **This Firefox** button on the left
- click on **Load Temporary Add-on...** button
- navigate your unpacked zip file directory
- select any file in the directory and click **Open**
- Please note that this method is not persistent. Extension needs to be loaded for each Firefox session.

### Post-installation steps
- Go to [Extension Options](https://github.com/marcin-l/PegaDevTools/wiki/Configuration). In the **Site config** section add your environment by domain name (e.g. *client-dt1.pegacloud.net*, without *https://*) and click **Save site configuration**. Turn on features in the **Settings** section and click **Save settings**.
- Reload your Pega tabs if needed

### Updating
- Overwrite extension with new download, your settings will be left intact
- Go to Chrome/Edge settings
- Click **Extensions**
- Reload PegaDevTools
- Check the PDT Options to see if there are any new features to be enabled

## Known issues and limitations
- System rules customizations in Dev studio will stop working when a rule is refreshed (to be addressed in the future). Reopening the rule will restore customizations.
- Some features will not work when Dev Studio is language other than English. I recommend to use the "ignore locale" option in user preferences.
- Not all customizations will load if you open your application in App or Admin Studio. As a workaround set _Developer_ portal as default one for your Access Group.

## Credits
Tracer feature to navigate to first Error and Message is based on Piotr Olejniczak's idea.

### Contributors
* [Mariusz Woźnica](https://github.com/woznica1970)

### Third-party libraries (MIT license)
- [CodeMirror](https://codemirror.net/)
- [Huebee](https://huebee.buzz)
- [jQuery](https://jquery.com/)
- [jQuery.FilterTable](https://github.com/sunnywalker/jQuery.FilterTable)
