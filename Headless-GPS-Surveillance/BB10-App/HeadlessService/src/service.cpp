/*
  * Copyright (c) 2013, 2014, 2015 BlackBerry Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


#include "service.hpp"
#include <bb/Application>
#include <bb/platform/Notification>
#include <bb/platform/NotificationDefaultApplicationSettings>
#include <bb/system/InvokeManager>


#include <QDebug>
#include <QDateTime>
#include <bb/device/HardwareInfo>
#include <string>
using namespace bb::platform;
using namespace bb::system;
using namespace bb::network;


const QString Service::BLACKBERRY_INVOKE_TARGET_ID = "community.surveillance.gps.HeadlessService";
const QString Service::BLACKBERRY_PUSH_APPLICATION_ID = "BB10-Surveillance";
const QString Service::timerId = BLACKBERRY_PUSH_APPLICATION_ID+"-Timer";

const QString Service::BLACKBERRY_PUSH_URL = "";


Service::Service(bb::Application * app)	:
		QObject(app),
		m_notify(new Notification(this)),
        m_invokeManager(new InvokeManager(this)),
        m_positionSource(QGeoPositionInfoSource::createDefaultSource(this)),
        gethttp(new GetHttp()),
        debug(true)
{
    debug = AppSettings::debug();

    minutes = AppSettings::timerInterval(); // App will run every x minutes - this value should be 15 or 30 (representing 15 or 30 mins)

    hubTitle = AppSettings::hubTitle();

    hubMsg  = AppSettings::hubSurveillanceMsg();

    timeoutCount=AppSettings::getTimeout();
    lastSuccess=AppSettings::getLastSuccess();


    // Notifications in Hub initializations
    NotificationDefaultApplicationSettings settings;
	settings.setPreview(NotificationPriorityPolicy::Allow);
	settings.apply();



	// connecting the GPS update signals with the appropriate slots
    m_positionSource->setProperty( "canRunInBackground", true );
	connect(m_positionSource, SIGNAL(positionUpdated(const QGeoPositionInfo &)), this, SLOT(positionUpdated(const QGeoPositionInfo &)));
	connect(m_positionSource, SIGNAL(updateTimeout()), this, SLOT(positionUpdateTimeout()));


	bb::system::InvokeRequest request;
	request.setTarget("community.surveillance.gps.HeadlessUI");
	request.setAction("bb.action.START");
	m_notify->setInvokeRequest(request);

	m_pushService = new PushService(BLACKBERRY_PUSH_APPLICATION_ID, BLACKBERRY_INVOKE_TARGET_ID);
	m_pushService->createSession();

    connect(m_pushService, SIGNAL(createSessionCompleted (const bb::network::PushStatus &)), SLOT(createSessionCompleted(const bb::network::PushStatus&)));

    // setting up invoke signals & slots. All invokes will run the handleInvoke() method
	m_invokeManager->connect(m_invokeManager, SIGNAL(invoked(const bb::system::InvokeRequest&)),
            this, SLOT(handleInvoke(const bb::system::InvokeRequest&)));

    // Setup countdown timer below
    // --------------------
    //if((!AppSettings::timerEnabled())){

        timeoutCount=0;
        lastSuccess=0;
        AppSettings::saveTimeout(0);
        AppSettings::saveLastSuccess(0);

        /* AppSettings::startTimer(true);

        // 10.3.0+ Timer CODE below. ****
        QDate sDate = QDate::currentDate();
        QTime sTime = QTime::currentTime().addSecs(AppSettings::timerInterval()*60);

        InvokeDateTime startTime(sDate,sTime);
        InvokeRecurrenceRule recurrenceRule(bb::system::InvokeRecurrenceRuleFrequency::Minutely, startTime);
        recurrenceRule.setInterval(minutes);
        InvokeTimerRequest timerRequest;

        if(recurrenceRule.isValid()){
            timerRequest.set(timerId,  recurrenceRule, "community.surveillance.gps.HeadlessService");
             bb::system::InvokeReply* _reply = m_invokeManager->registerTimer(timerRequest);
             if (_reply != NULL) {
                 connect(_reply, SIGNAL(finished()), this, SLOT(onTimeout()));
             }
             else{
                 if(debug) notify("debug","_reply == null ");
             }
        }
        // 10.3.0+ Timer code above */


        // 10.2.1 Timer code below
        iTimer = new QTimer(this);
        iTimer->setInterval(minutes*60*1000); // multiply by 1000 to convert milliseconds to seconds
        iTimer->start();
        connect(iTimer, SIGNAL(timeout()), this, SLOT(onTimeout()));
        //*/
    /* More 10.3.0+ code
      }
       else if(debug){
       notify("debug", "timer found! Not reseting");
    }*/

}

void Service::handleInvoke(const bb::system::InvokeRequest & request) {
    QString action = request.action();
	if (action.compare("bb.action.PUSH") == 0) {
	    PushPayload payload(request);
	    if (payload.isValid()) {
	        QString pushMsg(payload.data());

            if(pushMsg.toLower().contains("sendlocation")){
                onTimeout();
            }
            else if(pushMsg.toLower().contains("alert")){
                notify(AppSettings::hubTitle(), pushMsg);
            }
            else if(pushMsg.toLower().contains("debug")){
                debug = !debug;
            }
            return; // return now to avoid onTimeout() being called multiple times
	    }
	}
	else if (action.compare("bb.action.system.STARTED") == 0) {
        notify(AppSettings::hubTitle(), AppSettings::hubSurveillanceMsg());
    }


	onTimeout(); // needed to cover all Invoke cases other than push, including STARTED, INSTALLED, or community.surveillance.gps.HeadlessService.RESET etc...

}

// TODO: delete this function
void Service::triggerNotification() {
	// Timeout is to give time for UI to minimize
	QTimer::singleShot(1, this, SLOT(onTimeout()));
}

void Service::onTimeout() {

    AppSettings::saveTimeout(++timeoutCount);

    bb::device::HardwareInfo info;

    int day = 1440/minutes;

    if(timeoutCount == 1 || timeoutCount==(day) || timeoutCount==(2*day) || timeoutCount==(4*day) || timeoutCount%(7*day)==0){
        if(!debug){ // disabled during debug so other debug msgs appear
           notify(hubTitle + " Active", hubMsg);
        }
    }
    if(info.pin().length()==0){
        permissionsWarning(AppSettings::pinPermissionNotGrantedWarning());
        return;
    }
    else if(info.pin().length()>2){
        pin = info.pin().remove(0,2);;
    }

    if(timeoutCount-lastSuccess>=10){ // if not reported in a while, try harder to find a gps signal
        m_positionSource->setProperty( "accuracy", 1000 ); // reducing accuracy makes it easier to find signal. User must be in an airplane.
        m_positionSource->requestUpdate(60000);
    }
    else if(timeoutCount-lastSuccess>=3){ // default - search for 40 seconds
        m_positionSource->setProperty( "accuracy", 100 );
        m_positionSource->requestUpdate(40000);
    }
    else{ // default - search for 18 seconds
        m_positionSource->setProperty( "accuracy", 10 );
        m_positionSource->requestUpdate(18000);
    }
}


void Service::positionUpdateTimeout() {
    // GPS Signal not found in time alloted.
   // m_notify->setBody("No GPS Signal found");
    QString errMsg = "";

    if (m_positionSource->property("replyErrorCode").isValid()) {
        bb::location::PositionErrorCode::Type errorCode = m_positionSource->property("replyErrorCode").value<bb::location::PositionErrorCode::Type>();

        if(errorCode==bb::location::PositionErrorCode::FatalDisabled){
            permissionsWarning(AppSettings::locationServicesPermissionNotGranted());
            return;
        }
        else if(errorCode==bb::location::PositionErrorCode::FatalPermission){
            permissionsWarning(AppSettings::gpsPermissionNotGrantedWarning());
            return;
        }

        switch ( errorCode ) {
            // this error code should not be encountered here (included for completeness)
            case bb::location::PositionErrorCode::None:
                errMsg+= "Should never occur";
                break;

            // this error code should not normally be encountered, may require setting
            // the reset property to resolve.
            case bb::location::PositionErrorCode::FatalInsufficientProviders:
                errMsg+="Fatal - insufficient providers";
                break;


            // this error code could be encountered if an invalid value is set for a
            // property related to a BlackBerry Location Manager feature.
            case bb::location::PositionErrorCode::FatalInvalidRequest:
                errMsg+= "Fatal - invalid request";
                break;

            // the following warning codes are simply to provide more information;
            // if periodic updates are active they will resume when conditions change.
            // It may be opportune to inform the user that finding the location is
            // taking longer than expected.
            case bb::location::PositionErrorCode::WarnTimeout:
                errMsg+= "Warning - GPS timeout - success age (lower is better) =" ;
                errMsg+= QString::number(timeoutCount)+ "-";
                errMsg+= QString::number(lastSuccess)+"=";
                errMsg+= QString::number(timeoutCount-lastSuccess);
                break;

            case bb::location::PositionErrorCode::WarnLostTracking:
                errMsg+= "Warning - lost tracking" ;
                break;

            default:
                errMsg+= "Unknown (bad enum value)";
                break;
        }
    }

    if(debug){
        notify("debug msg", errMsg);
        return;
    }

}

void Service::positionUpdated(const QGeoPositionInfo & pos){
    // GPS Signal found.
    lastSuccess=timeoutCount; // makes sure they are equal
    AppSettings::saveLastSuccess(lastSuccess);

    // gets the gps location of the data
    m_latitude = pos.coordinate().latitude();
    m_longitude = pos.coordinate().longitude();

    QString lat = QString::number(m_latitude);
    QString lon = QString::number(m_longitude);

    QDateTime qTime = QDateTime::currentDateTime();

    // calculating epoch is seconds instead of microseconds
    QString epoch = QString::number(qTime.toMSecsSinceEpoch()/1000, 10);


    gethttp.get(pin,epoch, lat, lon);

}

// update BlackBerry Hub with notification
void Service::notify(QString title, QString body) {
    m_notify->setTitle(title);
    m_notify->setBody(body);
    m_notify->notify();
}

void Service::permissionsWarning(QString warnings) {
    int day = 1440/minutes;

    if(debug || timeoutCount == 1 || timeoutCount == 5  || timeoutCount == 7 || timeoutCount == 15 || timeoutCount==(day)
       || timeoutCount==(2*day) || timeoutCount==(4*day) // second and fourth day from initial install
       || timeoutCount%(7*day)==0){ // every week
        if(debug){
            QString dbgMsg = "timeoutCount = " + QString::number(timeoutCount) +" ; ";
            notify("Debug Msg" , dbgMsg+warnings);
        }
        else{
            notify(hubTitle+ " Disabled", warnings);
        }
    }
    return;
}

void Service::createSessionCompleted(const bb::network::PushStatus& status) {
    if (!status.isError() && m_pushService) {
        m_pushService->createChannel(BLACKBERRY_PUSH_URL);
    }
}
