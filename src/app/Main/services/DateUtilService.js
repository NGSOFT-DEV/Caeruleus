(function () {
    'use strict';
    MainApp.service('DateUtilService', [
        function () {

            var that = this;

            this.toStringDate = function (dateTime) {
                var historyDateTime = new Date(dateTime);
                return ('0' + historyDateTime.getDate()).slice(-2) + '/' + ('0' + (historyDateTime.getMonth()+1)).slice(-2) + '/' + ('0' + historyDateTime.getFullYear()).slice(-2);
            };

            this.toStringDateTime = function (dateTime) {
                return that.toStringDate(dateTime) + ' - ' + that.toStringTime(dateTime);
            };

            this.toStringTime = function (dateTime) {
                var historyDateTime = new Date(dateTime);
                return ('0' + historyDateTime.getHours()).slice(-2) + ':' + ('0' + historyDateTime.getMinutes()).slice(-2) + ':' + ('0' + historyDateTime.getSeconds()).slice(-2);
            };

            this.toStringDateFullYear = function (dateTime) {
                var dateTimeObject = new Date(dateTime);
                return ('0' + dateTimeObject.getDate()).slice(-2) + '/' + ('0' + (dateTimeObject.getMonth()+1)).slice(-2) + '/' + (dateTimeObject.getFullYear());
            };

            this.toStringTimeHoursMinutes = function (dateTime) {
                var dateTimeObject = new Date(dateTime);
                return ('0' + dateTimeObject.getHours()).slice(-2) + ':' + ('0' + dateTimeObject.getMinutes()).slice(-2);
            };
        }]);
})();