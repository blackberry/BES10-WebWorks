cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.blackberry.invoke/www/client.js",
        "id": "com.blackberry.invoke.client",
        "merges": [
            "blackberry.invoke"
        ]
    },
    {
        "file": "plugins/com.blackberry.invoke/www/btoa.js",
        "id": "com.blackberry.invoke.btoa",
        "merges": [
            "blackberry.invoke.btoa"
        ]
    },
    {
        "file": "plugins/com.blackberry.ui.dialog/www/client.js",
        "id": "com.blackberry.ui.dialog.client",
        "clobbers": [
            "blackberry.ui.dialog"
        ]
    },
    {
        "file": "plugins/com.blackberry.ui.toast/www/client.js",
        "id": "com.blackberry.ui.toast.client",
        "clobbers": [
            "blackberry.ui.toast"
        ]
    },
    {
        "file": "plugins/com.blackberry.ui.cover/www/client.js",
        "id": "com.blackberry.ui.cover.client",
        "clobbers": [
            "blackberry.ui.cover"
        ]
    },
    {
        "file": "plugins/com.blackberry.app/www/client.js",
        "id": "com.blackberry.app.client",
        "clobbers": [
            "blackberry.app"
        ]
    },
    {
        "file": "plugins/com.blackberry.identity/www/client.js",
        "id": "com.blackberry.identity.client",
        "clobbers": [
            "blackberry.identity"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.blackberry.invoke": "1.0.0",
    "com.blackberry.ui.dialog": "1.0.0",
    "com.blackberry.ui.toast": "1.0.0",
    "com.blackberry.ui.cover": "1.0.0",
    "com.blackberry.app": "1.0.0",
    "com.blackberry.identity": "1.0.0"
}
// BOTTOM OF METADATA
});