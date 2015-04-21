APP_NAME = HeadlessService

CONFIG += qt warn_on

include(config.pri)

LIBS += -lbb -lbbsystem -lbbplatform -lQtLocationSubset -lbbdevice -lbbnetwork
