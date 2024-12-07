var getUsers = new window.DevExpress.data.AspNet.createStore({
    key: "id",
    loadUrl: "../api/ApplicationUserAPI",
    onBeforeSend: function (method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
    }
});

var getTerminals = new window.DevExpress.data.AspNet.createStore({
    key: "id",
    loadUrl: "../api/TerminalAPI",
    onBeforeSend: function (method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
    }
});