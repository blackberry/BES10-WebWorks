/****************************************************************************
** Meta object code from reading C++ file 'PostHttp.hpp'
**
** Created by: The Qt Meta Object Compiler version 63 (Qt 4.8.6)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include "../../src/PostHttp.hpp"
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'PostHttp.hpp' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 63
#error "This file was generated using the moc from 4.8.6. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
static const uint qt_meta_data_PostHttp[] = {

 // content:
       6,       // revision
       0,       // classname
       0,    0, // classinfo
       3,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       1,       // signalCount

 // signals: signature, parameters, type, tag, flags
      15,   10,    9,    9, 0x05,

 // slots: signature, parameters, type, tag, flags
      38,   33,    9,    9, 0x0a,
      52,    9,    9,    9, 0x08,

       0        // eod
};

static const char qt_meta_stringdata_PostHttp[] = {
    "PostHttp\0\0info\0complete(QString)\0body\0"
    "post(QString)\0onPostReply()\0"
};

void PostHttp::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        Q_ASSERT(staticMetaObject.cast(_o));
        PostHttp *_t = static_cast<PostHttp *>(_o);
        switch (_id) {
        case 0: _t->complete((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 1: _t->post((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 2: _t->onPostReply(); break;
        default: ;
        }
    }
}

const QMetaObjectExtraData PostHttp::staticMetaObjectExtraData = {
    0,  qt_static_metacall 
};

const QMetaObject PostHttp::staticMetaObject = {
    { &QObject::staticMetaObject, qt_meta_stringdata_PostHttp,
      qt_meta_data_PostHttp, &staticMetaObjectExtraData }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &PostHttp::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *PostHttp::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *PostHttp::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_PostHttp))
        return static_cast<void*>(const_cast< PostHttp*>(this));
    return QObject::qt_metacast(_clname);
}

int PostHttp::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 3)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 3;
    }
    return _id;
}

// SIGNAL 0
void PostHttp::complete(const QString & _t1)
{
    void *_a[] = { 0, const_cast<void*>(reinterpret_cast<const void*>(&_t1)) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}
QT_END_MOC_NAMESPACE
