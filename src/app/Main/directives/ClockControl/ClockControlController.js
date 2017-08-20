(function (){
    'use strict';

    MainApp.controller( 'ClockControlController', [ '$interval',
        function($interval){

            var that = this;
            this.interval = 1000; // 1 second

            this.currentTime = undefined;

            this.hour = undefined;
            this.minutes = undefined;
            this.seconds = undefined;
            this.day = undefined;
            this.month = undefined;
            this.year = undefined;

            this.hourDialDeg = undefined;
            this.minuteDialDeg = undefined;

            this.getNormalizedTime = function(timeField){
                if(timeField){
                    var timeFieldString = timeField.toString();
                    if(timeFieldString.length<2){
                        return "0"+timeFieldString;
                    }

                    return timeFieldString;
                }

                return "00";
            };


            this.intervalFunction = function(){
                that.currentTime = new Date();
                that.hour = that.currentTime.getHours();
                that.minutes = that.currentTime.getMinutes();
                that.seconds = that.currentTime.getSeconds();
                that.day = that.currentTime.getUTCDate();
                that.month = that.currentTime.getUTCMonth()+1;
                that.year = that.currentTime.getUTCFullYear();

                var degPerHour = 360/12;
                var degPerMinute = 360/60;

                var hourDialRelativeMovement = (that.minutes/60) * degPerHour;
                that.hourDialDeg = -(((that.hour % 12) * degPerHour) + hourDialRelativeMovement);
                that.minuteDialDeg = -that.minutes * degPerMinute;

            };

            this.initializeClock = function(){
                $interval(this.intervalFunction, this.interval);
            };

            this.initializeClock();



        }]);
})();