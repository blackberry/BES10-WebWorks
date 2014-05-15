# Simple Push Test - WebWorks
This sample demonstrates how to implement a BlackBerry Enterprise Push WebWorks client and server application.

The sample code for this application is Open Source under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html).


**Applies To**

* Client: [BlackBerry 10 WebWorks SDK](http://developer.blackberry.com/html5/)
* Server: HTML and JavaScript

**Author(s)**

* [Brent Thornton](http://www.twitter.com/brentthornton32)

**Dependencies**

1. You will need a BlackBerry 10 smartphone to test.
2. You with need a BlackBerry Device Service Server or access to one.

## Initial Client Setup

1. Clone the repository to your local machine.
2. Open config.xml
3. Change the invoke-target id to a unique id for your push application.
```
	<rim:invoke-target id="waa.pushtest.target">
```

4. In js/app.js modify the invokeTargetId to match the ID you choose above.
```
	var ops = {
		// invoke TargetId must match the invoke-id in config.xml, appId can be string or port#
		invokeTargetId : 'waa.pushtest.target',
		appId : 'waapushtest'
	};
```

5. Optional - Modify the appId: this will need to match the server appId.
6. Modify the uri in the following function to point to the place you put your server code.
```
	app.openServerLinkInBrowser = function() {
		// get pin
		var pin = blackberry.identity.uuid;
		if (pin.indexOf('0x') > -1) pin = pin.substring(2);
		app.debug(pin);
		// open web link in browser
		blackberry.invoke.invoke({
			target: "sys.browser",
			uri: 'http://myPushServerTestPage/index.html?' +
				'email=' + pin +
				'&bes=MyBDSName' +
				'&mdsPort=8080' +
				'&appPort=' + ops.appId
		}, null, null);
	};
```

7. Add your BDS Name (bes in above code) and MDS-CS Listen port (mdsPort in above code). Usually the mdsPort is 8080.
8. Package and sign the application.

## Deployment

Usually you can pass the signed bar file to your BES administrator and have them
1. Add it to the BDS.
2. Add it to a software configuration.
3. Apply the software configuration to the user account you are testing with.
*Note: Software policies can take some time to be applied to your device.
[BlackBerry Device Service Documentation](http://docs.blackberry.com/en/admin/subcategories/?userType=2&category=BlackBerry+Device+Service)

## Initial Server Setup

1. Copy the server/index.html file to your server.

## Now What?

1. Launch the application once on the device.
2. Either leave the application open or close it. Now that it has registered with the push service once, the app can receive pushes while open or closed. Even if the device is rebooted.
3. Visit the server push page on a laptop or click the link in the application to launch it in the Work Browser.
4. Ensure all the details of the form are filled in correctly.
5. Click Push

## More Info

* [BlackBerry Enterprise Push Development Guide](http://docs.blackberry.com/en/admin/deliverables/50897/index.jsp?name=Development+Guide+-+Push+Service+for+Enterprise+Apps6.2&language=English&userType=2&category=BlackBerry+Device+Service&subCategory=)


## Bug Reporting and Feature Requests

If you find a bug in a Sample, or have an enhancement request, simply file an Issue for the Sample.

## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.