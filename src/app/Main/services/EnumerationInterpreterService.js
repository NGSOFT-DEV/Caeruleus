(function () {
    'use strict';
    MainApp.service('EnumerationInterpreterService', [
        function () {

            var that = this;
            this.loadQueue = [];

            this.getCesiumColorForEnumeration = function (enumerationName, enumerationValue) {

                if(that.settings === undefined){
                    return Cesium.Color.fromCssColorString("#ff00ff");
                }

                var enumerationSettings = that.settings[enumerationName];

                if (enumerationSettings) {

                    var enumerationSettingsForValue = enumerationSettings[enumerationValue + ""];
                    if (enumerationSettingsForValue) {

                        var correspondingCesiumColor = Cesium.Color.fromCssColorString(enumerationSettingsForValue.color);
                        return correspondingCesiumColor;
                    }
                }
            };

            this.getColorForEnumeration = function (enumerationName, enumerationValue) {

                if(that.settings === undefined){
                    return "#ff00ff";
                }

                var enumerationSettings = that.settings[enumerationName];

                if (enumerationSettings) {

                    var enumerationSettingsForValue = enumerationSettings[enumerationValue + ""];
                    if (enumerationSettingsForValue) {

                        var correspondingColor = enumerationSettingsForValue.color;
                        return correspondingColor;
                    }
                }

            };

            this.getNameForEnumeration = function (enumerationName, enumerationValue) {

                var enumerationSettings = that.settings[enumerationName];

                if (enumerationSettings) {

                    var enumerationSettingsForValue = enumerationSettings[enumerationValue + ""];
                    if (enumerationSettingsForValue) {

                        var correspondingName = enumerationSettingsForValue.text;
                        return correspondingName;
                    }
                }
            };

            this.getImageForEnumeration = function (enumerationName, enumerationValue) {

                var enumerationSettings = that.settings[enumerationName];

                if (enumerationSettings) {

                    var enumerationSettingsForValue = enumerationSettings[enumerationValue + ""];
                    if (enumerationSettingsForValue) {

                        var correspondingName = enumerationSettingsForValue.img;
                        return correspondingName;
                    }
                }
            };


            this.getEnumValuesForProperty = function (enumerationName) {
                var enumValuesForProperty = [];
                var enumerationSettings = that.settings[enumerationName];
                if (!enumerationSettings) {
                    return enumValuesForProperty;
                }
                for (var property in enumerationSettings) {
                    
                    var value = JSON.parse(property);
                    enumValuesForProperty.push(value);
                }

                return enumValuesForProperty;

            };

            this.getValueByPropertyNameANDEnumValueANDInnerField = function (propertyName, enumValue, innerField) {

                return that.settings[propertyName][enumValue + ""][innerField];
            };



            this.registerToOnServiceLoaded = function (func) {

                if (that.settings) {
                    func.call();
                }
                else {
                    that.loadQueue.push(func);
                }
            };

            this.settingsLoadedCallback = function () {

                for (var i = 0; i < that.loadQueue.length; i++) {
                    var currentFunction = that.loadQueue[i];
                    currentFunction.call();
                }
            };


            Caeruleus.SettingsLoader.loadSettings({ jsonUrl: "assets/EnumerationInterpreterSettings.json", caller: this, callback: this.settingsLoadedCallback });

        }]);
})();