# Push Capture Basics

This sample demonstrates how to implement Enterrpise BlackBerry Push into your application:
https://developer.blackberry.com/html5/apis/


The primary client functionality is implemented in **pushClient.js** and **pushInitiator.js**.

**Applies To**

* [BlackBerry 10 WebWorks SDK 2.0+](https://developer.blackberry.com/html5/download/sdk)

**Author(s)**

* [Erik Oros](http://www.twitter.com/WaterlooErik)
* [Brent Thornton](http://www.twitter.com/brentthornton32)

**Contributing**

* To contribute code to this repository you must be [signed up as an official contributor](http://blackberry.github.com/howToContribute.html).

## Screenshots ##

![image](_screenshots/1.png)

## Requirements ##

####Cordova Plugins####

**com.blackberry.utils** will be added automatically. You will need to manually add these plugins:

**Push Client**

	com.blackberry.app
	com.blackberry.invoked
	com.blackberry.push

## How to Build

1. Clone this repo to your local machine.

2. Ensure the [BlackBerry 10 WebWorks SDK 2.0](https://developer.blackberry.com/html5/download/sdk) is correctly installed.

3. Open a command prompt (windows) or terminal (mac) and run the following commands:

	```
	webworks create <your source folder>\pushClient
	```

4. **Replace** the default pushClient\www folder with their respective **\www** folders from **this** project

5. **Replace** the default pushClient\config.xml with the config.xml from **this** project

6. From the command prompt (Windows) or terminal (mac), navigate to the **pushClient** folder

	```
	cd <your source folder>\pushClient
	```

7. Run the following commands to configure plugins used by **this app**

	```
	webworks plugin add com.blackberry.invoked
	webworks plugin add com.blackberry.push
	```

8. Update the following files.


	config.xml: You will need to modify the application ID and invoke-target ID to something unique; replace the @ symbols.

	```
		id="com.@@@@@@@@.pushclient"

		id="com.@@@@@@@@.pushclient.invoke.push"
	```

	www/pushClient.js: Update the ops variable with your own client push credentials; replace the @ symbols. Note the invokeTargetId should match what you set the invoke-target ID as in the config.xml

	```
		'ops': {
			'invokeTargetId': 'com.@@@@@@.pushclient.invoke.push',
			'appId': '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@'		//any string you like
		},
	```

9. Update the com.blackberry.push plugin.

	```
	cd <your source folder>\pushClient\plugins\com.blackberry.push
	```

	Open the plugin.xml file. Comment out the _sys_use_consumer_push line like so:

	```
	<!-- <rim:permit system="true">_sys_use_consumer_push</rim:permit> -->
	```

10. Ensure the Work Space is currently active (open) on the test device. Also make sure you have your BES admin apply sideloading IT policy for the work space. More info here: http://developer.blackberry.com/html5/documentation/v2_1/debugging_enterprise_apps.html

11. Run the **webworks run** commands to build and deploy the app to the work space of a device connected via USB. Examples:

	```
	C:\WebWorks\pushCient> webworks run

	Once the App builds and deploys successfully you should see "Successfully created Push Channel" on the screen
	```

12. See the [Server](SimplePushTest/WW2.0/server) doc to push content.

## More Info

* [BlackBerry HTML5 WebWorks](https://bdsc.webapps.blackberry.com/html5/) - Downloads, Getting Started guides, samples, code signing keys.
* [BlackBerry WebWorks Development Guides](https://bdsc.webapps.blackberry.com/html5/documentation)
* [BlackBerry WebWorks Community Forums](http://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/bd-p/browser_dev)
* [BlackBerry Open Source WebWorks Contributions Forums](http://supportforums.blackberry.com/t5/BlackBerry-WebWorks/bd-p/ww_con)


## Bug Reporting and Feature Requests

If you find a bug in a Sample, or have an enhancement request, simply file an [Issue](https://github.com/blackberry/BES10-WebWorks/issues) for the Sample.

## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

