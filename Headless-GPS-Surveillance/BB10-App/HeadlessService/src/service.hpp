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

#ifndef SERVICE_H_
#define SERVICE_H_

#include <QObject>
#include <QTimer>
#include <QtLocationSubset/QGeoPositionInfo>
#include <QtLocationSubset/QGeoPositionInfoSource>
#include <QtLocationSubset/QGeoSatelliteInfo>
#include <QtLocationSubset/QGeoSatelliteInfoSource>
#include <bb/location/PositionErrorCode>
#include <bb/network/PushService>
#include <bb/network/PushStatus>
#include <bb/network/PushPayload>

/* 10.3.0 code below
#include <bb/system/InvokeRecurrenceRule>
#include <bb/system/InvokeRecurrenceRuleFrequency>
*/

#include "GetHttp.hpp"
#include "AppSettings.hpp"

using namespace QtMobilitySubset;

namespace bb {
	class Application;
	namespace platform {
		class Notification;
		class Geolocation;
	}
	namespace system {
		class InvokeManager;
		class InvokeRequest;
	}
	namespace network {
	    class PushStatus;
	    class PushService;
	}
}

class Service: public QObject {
	Q_OBJECT
public:
	Service(bb::Application * app);

	// The accessor method for the internal geo position object
    QGeoPositionInfoSource* positionSource() const;

private Q_SLOTS:
	void handleInvoke(const bb::system::InvokeRequest &);
	void onTimeout();

    // This slot is invoked whenever new location information are retrieved
    void positionUpdated(const QGeoPositionInfo & pos);
    // This slot is invoked whenever a timeout happend while retrieving location information
    void positionUpdateTimeout();
    void createSessionCompleted(const bb::network::PushStatus&);

private:
	bb::platform::Notification * m_notify;
	bb::system::InvokeManager * m_invokeManager;
    bb::network::PushService* m_pushService; //The service that will handle push registration/reception
    QTimer* iTimer;

	void triggerNotification();
    void startTimer(int seconds);
    void setTimerInterval(int seconds);
    void stopTimer();
    static const QString BLACKBERRY_PUSH_APPLICATION_ID;
    static const QString BLACKBERRY_PUSH_URL;
    static const QString BLACKBERRY_INVOKE_TARGET_ID;
    static const QString timerId;

    QGeoPositionInfoSource *m_positionSource;
    QString m_method;
    QString hubTitle;
    QString hubMsg;
    double m_latitude;
    double m_longitude;
    int timeoutCount;
    int lastSuccess;
    QString pin; // device PIN
    int minutes;
    GetHttp gethttp;
    int timerCounter; // useful for debugging
    bool debug;
    void notify(QString header, QString body);
    void permissionsWarning(QString warnings);

};

#endif /* SERVICE_H_ */
