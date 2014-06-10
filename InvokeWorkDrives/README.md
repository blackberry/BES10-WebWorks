# WorkDrives Invocation Sample

The WorkDrives Invocation Sample demonstrates how to invoke the WorkDrives application in the work perimeter, launching into either the Network Drives or the SharePoint Drives screen of the WorkDrives app.

**Applies To**

* [Apache Cordova for BlackBerry 10](https://github.com/blackberry/cordova-blackberry/tree/master/blackberry10) 

**Author(s)** 

* [Maurice White](http://github.com/MoReeseMo)

**Dependencies**

1. [bbUI.js](https://github.com/blackberry/bbUI.js) is [licensed](https://github.com/blackberry/bbUI.js/blob/master/LICENSE) under the Apache 2.0 license.
2. You will need a BlackBerry 10 smartphone to test.
3. If you intend to test in Corporate Perimeter, you will need a BlackBerry Device Service Server or access to one. (optional). If you'd like to sideload into the work space, see [this] (http://bizblog.blackberry.com/2013/10/debugging-apps-in-the-work-space/) article
4. WorkDrives app installed in the Work Perimeter 


**Icons**

* The [Liz Myers](http://www.myersdesign.com) Icon set and are [licensed](http://creativecommons.org/licenses/by/3.0/) under the CC-BY-3.0 license.

**Contributing**

* To contribute code to this repository you must be [signed up as an official contributor](http://blackberry.github.com/howToContribute.html).

## Required Plugins ##

####The following Cordova Plugins are required for this sample:####

	com.blackberry.invoke
	com.blackberry.invoke.card


## How to Build

1. Clone this repo to your local machine.

2. Ensure the [BlackBerry 10 WebWorks SDK 2.0](https://developer.blackberry.com/html5/download/sdk) is correctly installed.

3. Open a command prompt (windows) or terminal (mac) and run the following command:

	```
	webworks create <your source folder>\InvokeWorkDrives
	```

4. **Replace** the default InvokeWorkDrives\www folder with the \www folder from **this** project
5. **Replace** the default InvokeWorkDrives\config.xml with the config.xml from **this** project

6. From the command prompt (Windows) or terminal (mac), navigate to the Invocation/<invoker/invocable> folder

	```
	cd <your source folder>\InvokeWorkDrives
	```

7. Run the following commands to configure plugins used by **this app**

	```
	webworks plugin add com.blackberry.invoke
	webworks plugin add com.blackberry.invoke.card
	```


8. Run the following command to build and deploy the app to a device connected via USB

	```
	webworks run
	```

## Running the example in the work perimeter
**Steps apply to BlackBerry Balance Enabled devices**

1. [Build and Sign] (http://developer.blackberry.com/html5/documentation/v2_0/build_and_sign_your_app.html) the app. A .bar file will be created 
2. Add the .bar file to the BlackBerry Device Server.
3. Add it to a software configuration.
2. Apply the software configuration to the user account you are testing with. [BlackBerry Device Service Documentation](http://docs.blackberry.com/en/admin/subcategories/?userType=2&category=BlackBerry+Device+Service)


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
