(function (){
    'use strict';
    MainApp.service('GeographicConverterService', [ 
        function (){

        var that = this;
        var drad = Math.PI/180;
        var k0 = 0.9996;//scale on central meridian

        //this.loaded = false;
        //this.loadQueue = [];

        this.convertDecimalDegToDegMinSec = function(decDeg){
            
            var sign = 1;
            if(decDeg<0){
                sign = -1;
            }
            decDeg = Math.abs(decDeg);

            var deg = Math.floor(decDeg);
            var remainder = decDeg - deg;
            var relativeForMin = remainder * 60;
            var min = Math.floor(relativeForMin);
            var remainderforSec = relativeForMin - min;
            var sec = remainderforSec * 60;
            
            return {degrees: deg * sign, minutes: min, seconds: sec};

        };

        this.convertDegMinSecToDecimalDegTo = function(degminsecObject){
            
            var degrees = degminsecObject.degrees;
            var sign = 1;
            if(degrees<0){
                sign = -1;
            }
            degrees = Math.abs(degrees);

            var decSec = degminsecObject.seconds / 60;
            var relativeForMin = decSec + degminsecObject.minutes;
            var remainder = relativeForMin / 60;
            var decDeg = remainder + degrees;

            return sign * decDeg;

        };
      

        this.convertDecimalDegLatLongToUTM = function(latitude, longitude, datumName){


            var datum = that.settings.datums[datumName];
            if(datum === undefined){
                return;
            }
          
            var latd = latitude;
            var lngd = longitude;
            var phi = latd*drad;//Convert latitude to radians
            var lng = lngd*drad;//Convert longitude to radians
            var utmz = 1 + Math.floor((lngd+180)/6);//calculate utm zone
            var latz = 0;//Latitude zone: A-B S of -80, C-W -80 to +72, X 72-84, Y,Z N of 84
            if (latd > -80 && latd < 72){latz = Math.floor((latd + 80)/8)+2;}
            if (latd > 72 && latd < 84){latz = 21;}
            if (latd > 84){latz = 23;}
                
            var zcm = 3 + 6*(utmz-1) - 180;//Central meridian of zone
            //alert(utmz + "   " + zcm);
            //Calculate Intermediate Terms
            var a = datum.ellipsoid.a;
            var f = 1/datum.ellipsoid.f;
            var b = a*(1-f);
            var e = Math.sqrt(1 - (b*b)/(a*a));//eccentricity
            var e0 = e/Math.sqrt(1 - e*e);//Called e prime in reference
            var esq = (1 - (b/a)*(b/a));//e squared for use in expansions
            var e0sq = e*e/(1-e*e);// e0 squared - always even powers
            //alert(esq+"   "+e0sq)
            var N = a/Math.sqrt(1-Math.pow(e*Math.sin(phi),2));

            var T = Math.pow(Math.tan(phi),2);

            var C = e0sq*Math.pow(Math.cos(phi),2);

            var A = (lngd-zcm)*drad*Math.cos(phi);

            //Calculate M
            var M = phi*(1 - esq*(1/4 + esq*(3/64 + 5*esq/256)));
            M = M - Math.sin(2*phi)*(esq*(3/8 + esq*(3/32 + 45*esq/1024)));
            M = M + Math.sin(4*phi)*(esq*esq*(15/256 + esq*45/1024));
            M = M - Math.sin(6*phi)*(esq*esq*esq*(35/3072));
            M = M*a;//Arc length along standard meridian

            var M0 = 0;//M0 is M for some origin latitude other than zero. Not needed for standard UTM

            //Calculate UTM Values
            var x = k0*N*A*(1 + A*A*((1-T+C)/6 + A*A*(5 - 18*T + T*T + 72*C -58*e0sq)/120));//Easting relative to CM
            x=x+500000;//Easting standard 
            var y = k0*(M - M0 + N*Math.tan(phi)*(A*A*(1/2 + A*A*((5 - T + 9*C + 4*C*C)/24 + A*A*(61 - 58*T + T*T + 600*C - 330*e0sq)/720))));//Northing from equator
            var yg = y + 10000000;//yg = y global, from S. Pole
            if (y < 0){y = 10000000+y;}

            var zone = utmz;
            var easting = Math.round(10*(x))/10;
            var northing = Math.round(10*y)/10;
            var southOfEquator = (phi<0);


            return { x: easting , y: northing, zone: zone, southHemisphere: southOfEquator};

        };

        this.convertUTMToDecimalDeg = function(east, north, zone, southHemisphere, datumName){

            var datum = that.settings.datums[datumName];
            if(datum === undefined){
                return;
            }
            
            var a = datum.ellipsoid.a;
            var f = 1/datum.ellipsoid.f;
            var b = a*(1-f);
            var n = ((a-b)/(a+b));
            var e2 = (1 - (b/a)*(b/a));
            var A1 = a/(1+n)*(n*n*(n*n*((n*n)+4)+64)+256)/256;
            var h1 = n*(n*(n*(n*(n*(384796*n-382725)-6720)+932400)-1612800)+1209600)/2419200;
            var h2 = n*n*(n*(n*((1695744-1118711*n)*n-1174656)+258048)+80640)/3870720;
            var h3 = n*n*n*(n*(n*(22276*n-16929)-15984)+12852)/362880;
            var h4 = n*n*n*n*((-830251*n-158400)*n+197865)/7257600;
            var h5 = (453717-435388*n)*n*n*n*n*n/15966720;
            var h6 = 20648693*n*n*n*n*n*n/638668800;
            var M = that.calculateMeridian(0,0,n,b,k0);
            var E = (north+M)/(A1*k0);
            var FE = 500000;
            var nn = (east-FE)/(A1*k0);
            var E1i = h1*Math.sin(2*E)*Math.cosh(2*nn);
            var E2i = h2*Math.sin(4*E)*Math.cosh(4*nn);
            var E3i = h3*Math.sin(6*E)*Math.cosh(6*nn);
            var E4i = h4*Math.sin(8*E)*Math.cosh(8*nn);
            var E5i = h5*Math.sin(10*E)*Math.cosh(10*nn);
            var E6i = h6*Math.sin(12*E)*Math.cosh(12*nn);
            var n1i = h1*Math.cos(2*E)*Math.sinh(2*nn);
            var n2i = h2*Math.cos(4*E)*Math.sinh(4*nn);
            var n3i = h3*Math.cos(6*E)*Math.sinh(6*nn);
            var n4i = h4*Math.cos(8*E)*Math.sinh(8*nn);
            var n5i = h5*Math.cos(10*E)*Math.sinh(10*nn);
            var n6i = h6*Math.cos(12*E)*Math.sinh(12*nn);
            var Ei = E-(E1i+E2i+E3i+E4i+E5i+E6i);
            var ni = nn-(n1i+n2i+n3i+n4i+n5i+n6i);
            var B = Math.asin(that.sech(ni)*Math.sin(Ei));
            var l = Math.asin(Math.tanh(ni)/Math.cos(B));
            var Q = Math.asinh(Math.tan(B));
            var Qi = Q+(Math.sqrt(e2)*Math.atanh(Math.sqrt(e2)*Math.tanh(Q)));
            var precisionAchieved = false;
            do {
            var newv = Q+(Math.sqrt(e2)*Math.atanh(Math.sqrt(e2)*Math.tanh(Qi)));
            if (Math.abs(Qi-newv) < 1e-11) { precisionAchieved = true; }
                Qi = newv; 
            } while (precisionAchieved === false);

            var Lat0 = (zone*6) - 183;
            var Hemi = 1;
            if(southHemisphere){
                Hemi = -1;
            }
            return {latitude: Hemi*(180/Math.PI)*Math.atan(Math.sinh(Qi)), longitude: Lat0+(180/Math.PI)*l};
        };

        this.sech = function(x) 
        { 
            return (1/Math.cosh(x)); 
        };

        this.calculateMeridian = function(latdiff, latsum, nn, eb, F0) {
            var n2 = Math.pow(nn,2);
            var n3 = Math.pow(nn,3);
            var BB = (1+nn+((5/4)*n2)+((5/4)*n3))*latdiff;
            var CC = ((3*nn)+(3*n2)+((21/8)*n3))*Math.sin(latdiff)*Math.cos(latsum);
            var DD = (((15/8)*n2)+((15/8)*n3))*Math.sin(2*latdiff)*Math.cos(2*latsum);
            var EE = ((35/24)*n3)*Math.sin(3*latdiff)*Math.cos(3*latsum);
            return (eb*F0*(BB-CC+DD-EE));
        };
        

        this.convertGeoFromDatumToDatum = function(latDeg, lonDeg, fromDatumName, toDatumName){

            var lat = latDeg*drad;
            var lon = lonDeg*drad;

            var datum_a = that.settings.datums[fromDatumName];
            if(datum_a === undefined){
                return;
            }

            var datum_b = that.settings.datums[toDatumName];
            if(datum_b === undefined){
                return;
            }

            var a = datum_a.ellipsoid.a;
            var f = 1/datum_a.ellipsoid.f;
            var b = a*(1-f);
            var e2 = (1 - (b/a)*(b/a));
            var N = datum_a.ellipsoid.a/Math.sqrt(1-(e2*Math.pow(Math.sin(lat),2)));
            var Xa = N*Math.cos(lat)*Math.cos(lon);
            var Ya = N*Math.cos(lat)*Math.sin(lon);
            var Za = N*(1-e2)*Math.sin(lat);
            var Xm;
            var dX;
            var rX;
            var Ym;
            var Zm;
            var X;
            var Y;
            var Z;
            if (fromDatumName == "WGS84") {
                Xm = Xa; Ym = Ya; Zm = Za;
            } else {
                dX = datum_a.dX; var dY = datum_a.dY; var dZ = datum_a.dZ; var sf = datum_a.sf*1e-6;
                rX = that.sec2rad(datum_a.rX); var rY = that.sec2rad(datum_a.rY); var rZ = that.sec2rad(datum_a.rZ);
                var Xt = (Xa-dX)/(1+sf); var Yt = (Ya-dY)/(1+sf); var Zt = (Za-dZ)/(1+sf);
                Xm = (Xt+(rZ*Yt)-(rY*Zt));
                Ym = (Yt+(rX*Zt)-(rZ*Xt));
                Zm = (Zt+(rY*Xt)-(rX*Yt));
            }
            if (toDatumName == "WGS84") {
                X = Xm; Y = Ym; Z = Zm;
            } else {
                var dX2 = datum_b.dX; var dY2 = datum_b.dY; var dZ2 = datum_b.dZ; var sf2 = datum_b.sf*1e-6;
                var rX2 = that.sec2rad(datum_b.rX); var rY2 = that.sec2rad(datum_b.rY); var rZ2 = that.sec2rad(datum_b.rZ);
                X = dX2 + ((1+sf2)*(Xm-(rZ2*Ym)+(rY2*Zm)));
                Y = dY2 + ((1+sf2)*((rZ2*Xm)+Ym-(rX2*Zm)));
                Z = dZ2 + ((1+sf2)*((rX2*Ym)-(rY2*Xm)+Zm));
            }

            var a2 = datum_b.ellipsoid.a;
            var f2 = 1/datum_b.ellipsoid.f;
            var b2 = a2*(1-f2);
            var ei2 = (Math.pow(a2,2)-Math.pow(b2,2))/Math.pow(b2,2);
            var e22 = (1 - (b2/a2)*(b2/a2));
            var p = Math.sqrt(Math.pow(X,2) + Math.pow(Y,2));
            var theta = Math.atan((Z*a2)/(p*b2));
            var ttop = Z+(ei2*b2*Math.pow(Math.sin(theta),3));
            var bbot = p-(e22*a2*Math.pow(Math.cos(theta),3));
            // return new geodesic(Math.atan(ttop/bbot),Math.atan2(Y,X));
            return {latitude: (180/Math.PI)*Math.atan(ttop/bbot),longitude: (180/Math.PI)*Math.atan2(Y,X)};
        };

        this.sec2rad = function(value_in) 
        { 
            return ((Math.PI*value_in)/648000); 
        };

        // this.registerToLoadQueue = function(callback){
            
        //     if(that.loaded){
        //         callback.call();
        //     }
        //     else{
        //         that.loadQueue.push(callback);
        //     }
            
        // };

        // this.onLoaded = function(){

        //     var loadQueue = that.loadQueue;
        //     for(var i=0;i<loadQueue.length;i++)
        //     {
        //         var currentCallback = loadQueue[i];
        //         if(currentCallback){
        //             currentCallback.call();
        //         }
        //     }
        // };

        this.settingsLoaded = function(){
            
            //that.onLoaded();
            //that.loaded = true;
            Hermes.componentLoaded(that);
        };

    
        Caeruleus.SettingsLoader.loadSettings({jsonUrl: "assets/GeographicConverterSettings.json", caller: this, callback: this.settingsLoaded});

        }]);
})();