# Cordova (Cross Platform) Web Launcher

This sample shows how to make a standalone app which will launch a website in the native browser.

The documentation is quite detailed, but please note it is actually quite easy to customize the app for your own needs.

**Author(s)**

* [Chad Tetreault](http://www.twitter.com/chadtatro)
* [Dennis Reumer](http://www.twitter.com/reumerd)

**Applies To**

* BlackBerry 10 WebWorks
* Apache Cordova

**Tested On**

* BlackBerry 10
* Android
* iOS

**Known Issues**

* None

###

**Platform Quirks**

* iOS

 Developers are **not** able to programatically close an application on iOS. The app will stay open. This is a platform limitation that cannot be helped at this time.

* Android

 Default behaviour is that the app stays in 'Recent Apps' menu when closed.

**Contributing**

 To contribute code to this repository you must be [signed up as an official contributor](http://blackberry.github.com/howToContribute.html).

## Required Plugins ##

	com.blackberry.app
	com.blackberry.invoke

## Installation ##

It's best to follow each individual [Platform Guide](https://cordova.apache.org/docs/en/4.0.0/guide_platforms_index.md.html#Platform%20Guides) to do this as easy as possible.

* [BlackBerry 10](https://developer.blackberry.com/html5/documentation/v2_2/getting_started.html)
* [Android](https://cordova.apache.org/docs/en/4.0.0/guide_platforms_android_index.md.html#Android%20Platform%20Guide)
* [iOS](https://cordova.apache.org/docs/en/4.0.0/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide)

You will require the SDK, and environmental setup for each platform before you continue with building this app.

You will also require [Apache Cordova](http://cordova.io)

## Configure the App
To customize the apps for your needs, follow the instructions listed at the top of both of the following files:

* /config.xml
* /www/js/index.js


## How to Build

To build and deploy on BlackBerry 10 follow these steps. For other platforms, please refer to their respective [Platform Guide(s)](https://cordova.apache.org/docs/en/4.0.0/guide_platforms_index.md.html#Platform%20Guides)

**BlackBerry 10**

1. Clone this repo to your local machine.

2. Ensure the [BlackBerry 10 WebWorks SDK 2.0](https://developer.blackberry.com/html5/download/sdk) is correctly installed, and your setup your signing keys as described in the [Getting Started Guide](https://developer.blackberry.com/html5/documentation/v2_2/getting_started.htm).

3. Open a command prompt (windows) or terminal (mac) and run the following command:

	```
	cordova create <your-project-name-here>
	```

4. In the new project folder, **replace** the www folder with the www folder from **this** project

5. In the new project folder, **replace** the config.xml file with the config.xml from **this** project


6. Run the following commands to add plugins used by **this app**

 ```cordova plugin add com.blackberry.appp```
 ```cordova plugin add com.blackberry.invoke```

7. Add the Platforms you want to target

 ```cordova platform add <platform-here>```

8. Build the project

 ```cordova build```

9. To deploy the app, again refer to the [Platform Guide(s)](https://cordova.apache.org/docs/en/4.0.0/guide_platforms_index.md.html#Platform%20Guides).

 For **BlackBerry 10** Run the following command to build and deploy the app to a device connected via USB

	```
	webworks run
	```

## More Info

* [BlackBerry HTML5 WebWorks](https://bdsc.webapps.blackberry.com/html5/) - Downloads, Getting Started guides, samples, code signing keys.
* [BlackBerry WebWorks Development Guides](https://bdsc.webapps.blackberry.com/html5/documentation)
* [BlackBerry WebWorks Community Forums](http://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/bd-p/browser_dev)
* [BlackBerry Open Source WebWorks Contributions Forums](http://supportforums.blackberry.com/t5/BlackBerry-WebWorks/bd-p/ww_con)

## Contributing Changes

Please see the [README](https://github.com/blackberry/BB10-WebWorks-Samples) of the BB10-WebWorks-Samples repository for instructions on how to add new Samples or make modifications to existing Samples.

## Bug Reporting and Feature Requests

If you find a bug in a Sample, or have an enhancement request, simply file an [Issue](https://github.com/blackberry/BB10-WebWorks-Samples/issues) for the Sample.

## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
