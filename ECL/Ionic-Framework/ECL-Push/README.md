# Emergency Contact List

This sample app shows how to build an Emergency Contact List application for BlackBerry 10.

**Author(s)**

* [Chad Tetreault](http://bit.ly/chadli123)

**Contributor(s)**

* [Naveenan Murugesu](http://twitter.com/naveenan5)

**Important Note**

This app uses *BES Push*, and must be installed in the Work Space to work.

**What's new in v2?**

The ECL app has been rebuilt from the ground up. Here are some key updates.

* User Photos
* Bulk Email
* Bulk SMS
* Bulk PIN
* Multiple 'Backup' users
* New UI (Based on Material Design)

**Supported Platforms**

* BlackBerry 10

**Tested On**

* Classic
* Passport
* Z30
* Z10

**3rd Party Libraries**
* [Ionic v1.2.1](http://www.ionicframework.com) is licensed under the MIT License
* [Ionic Material](http://www.ionicmaterial.com) is licensed under the MIT License
* [Fab Button (ng-mfb)](https://github.com/nobitagit/ng-material-floating-button) is licensed under the MIT License
* [Underscore.js](http://www.underscorejs.org) is licensed under the MIT License

**Attributes**

* Photos used (landing, landing-logo, profile-background) are provided by myself, [Chad Tetreault](http://www.twitter.com/chadtatro). Use as you wish.

**Required Plugins**

* com.blackberry.app
* com.blackberry.invoke
* com.blackberry.invoke.card
* com.blackberry.invoked
* com.blackberry.notification
* com.blackberry.push
* com.blackberry.utils

## Environment Setup

This sample uses [Ionic Framework](http://www.ionicframework.com). The fastest, and simplest way to install it is via [NPM/Node.js](http://nodejs.org).

1. Install [Node.js](http://www.nodejs.org)

2. Install Cordova

```
npm install -g cordova
```

3. Install Ionic

```
npm install -g ionic
```

## How to Build

To build and deploy on BlackBerry 10 follow these steps. For other platforms, please refer to their respective [Platform Guide(s)](https://cordova.apache.org/docs/en/4.0.0/guide_platforms_index.md.html#Platform%20Guides)

**BlackBerry 10**

1. Clone this repo to your local machine.

2. Ensure the [BlackBerry 10 WebWorks SDK 2.0](https://developer.blackberry.com/html5/download/sdk) is correctly installed, and your setup your signing keys as described in the [Getting Started Guide](https://developer.blackberry.com/html5/documentation/v2_2/getting_started.htm).

3. Open a command prompt (windows) or terminal (mac) and run the following command:

```
ionic start myAppName blank
```

4. In the new project's **www** folder, **delete** everything **except** the **lib** folder

5. Copy & Paste the sample app files and folders into the root folder of the new project and overwrite any conflicts

7. Add the Platforms you want to target

 ```
 cordova platform add blackberry10
 ```

8. Add required plugins

```
cordova plugin add com.blackberry.app com.blackberry.invoke com.blackberry.invoke.card com.blackberry.invoked com.blackberry.notification com.blackberry.push com.blackberry.utils
```

9. Build the project

 ```
 cordova build
 ```

10. To deploy the app, again refer to the [Platform Guide(s)](https://cordova.apache.org/docs/en/4.0.0/guide_platforms_index.md.html#Platform%20Guides).

 For **BlackBerry 10** Run the following command to build and deploy the app to a device connected via USB

	```
	webworks run
	```

  or

  ```
  cordova run blackberry10
  ```

## How to configure the app

As noted, you must install this app in the Work Space as it uses BES Push.

**Dummy Data**

To quickly test the app with dummy-data simply follow the instructions on *line 26* of *app.js*.

**JSON**

Every organizations JSON data will vary. This app is made to be backwards compatible with [ECL v1](https://github.com/blackberry/BES10-WebWorks/tree/master/ECL/WW2.0).

You can now add some additional fields (as seen in **www/js/services.js**) in the updateJSON method. Additional work will be required on your part if you'd like to use user images. I have had pretty good success in Base64 encoding images, and including the Base64 string in the 'image' key. Since Base64 strings are very big, it's wise to encode a small thumbnail photo for the user image.

**Push**

Modify the following fields to customize the app for your own use

* /config.xml - Line 7 - Widget ID
* /config.xml - Line 42 - Invoke Push ID
* /config.xml - Line 52 - Invoke Open ID
* www/js/pushClient.js - Line 19 - window.pushTarget

Your app is now configured to receive push data!

**Pushing Data**

The app can handle both (small) JSON payloads, or (recommended) URLs which point to a valid .json file.

My favourite tool to use for pushing data, and testing, is the **server** component of our previous ECL sample [available here](https://github.com/blackberry/BES10-WebWorks/tree/master/ECL/WW2.0/www) (see the www/server folder). It only takes a few seconds to configure. Just fill out the form fields with your company's info and you're all set.

**Customizing**

To customize the JSON data you're working with, refer to the updateJSON method in **www/js/services.js**

**Tools**

Be sure to use a service like [JSON Lint](http://www.jsonlint.com) to make sure your JSON is valid. If you push invalid JSON to the app it will fail to process, and load it.


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
