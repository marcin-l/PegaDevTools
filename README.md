# **PegaDevTools**

PDT is browser-only (i.e. no ruleset deployment is required) Pega 8 developer productivity tool.

First, check out the feature list in the [PDT Wiki](https://github.com/marcin-l/PegaDevTools/wiki).

Extension development is mostly targeting chromium-based browsers, but it should for the most part work in Firefox.

## Issues and feature requests
Check the [Issues](https://github.com/marcin-l/PegaDevTools/issues) page to see things to be fixed and features to be implemented.

If you found a bug or have a new idea/feature for the extension, [you can report them](https://github.com/marcin-l/PegaDevTools/issues/new).

## How to use
- Download (or clone) the extension using green button on the top of this page
**Code -> Download ZIP**
- Unpack downloaded zip file

[[https://raw.githubusercontent.com/wiki/marcin-l/PegaDevTools/images/installation.png]]

### Chrome or Edge
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

Please note that this method is not persistent. Extension needs to be loaded on each Firefox session.

### Post-installation steps
- Go to [Extension Options](https://github.com/marcin-l/PegaDevTools/wiki/Configuration). In the **Site config** section add your environment by domain name (e.g. *client-dt1.pegacloud.net*, without *https://*) and click **Save site configuration**. Turn on features in the **Settings** section and click **Save settings**.
- Reload your Pega tabs if needed

## Credits
Tracer feature to navigate to first Error and Message is based on Piotr Olejniczak's idea.

### Contributors
* [Mariusz Woźnica](https://github.com/woznica1970)
