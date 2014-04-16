/*
 * Copyright 2012 Blackberry Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*=================================================================================
 * The App Namespace
 *=================================================================================*/

app = {};

function msg(text) {
	if (document.getElementById('myMsg') == null) {
		var msg = document.createElement('div');
		msg.setAttribute('id', 'myMsg');
		document.body.appendChild(msg);
	}
	var myMsg = document.getElementById('myMsg');
	myMsg.innerHTML = text;
	myMsg.style.cssText = 'display:inline;text-align:center;z-Index:1000;position:absolute;padding:10px;bottom:20px;left:10%;width:60%;height:50px;border:solid silver 2px;border-radius:15px;background:#000;font-size:15pt;color:white';
}

function msgHide() {
	document.getElementById('myMsg').style.display = 'none';
}
