/**
 * Race+sparkles custom overlay.
 */
RaceOverlay.prototype = new google.maps.OverlayView();

/**
 * Object for holding race info.
 * @constructor
 */
function Race() {
    this.radius;
    this.div;
    this.canvas;
    //   this.stars = [];
    this.track = [];
}


/**
 * Race overlay.
 * @constructor
 * @param {Array} markers Initial array of markers.
 * @param {Map} map Map to put overlay on.
 */
function RaceOverlay(_markers, _track, _map) {
    this.markers = _markers || [];
    this.track = _track;
    //   this.numRaces = 8;
    //   this.races = [];
    //   this.setupRaces();

    this.setMap(_map);
}

/**
 * Create race objects
 * @private
 */
RaceOverlay.prototype._setSize = function () {
    this.canvasCenter = this.getProjection().fromLatLngToDivPixel(this.getMap().getCenter());
    this.canvasWidth = Math.min(this.getProjection().getWorldWidth(), 60000);
    this.canvasHeight = Math.min(this.getProjection().getWorldWidth(), 60000);
    this.div.style.left = this.canvasCenter.x - this.canvasWidth / 2 + 'px';
    this.div.style.top = this.canvasCenter.y - this.canvasHeight / 2 + 'px';
    this.div.style.width = this.canvasWidth + 'px';
    this.div.style.height = this.canvasHeight + 'px';

    this.canvas.setSize(this.canvasWidth, this.canvasHeight);
}

/**
 * Convert lan/lng map coordinates to the canvas point coordinates.
 */
RaceOverlay.prototype._fromLatLngToCanvasPixel = function (latLng) {
    var divPixel = this.getProjection().fromLatLngToDivPixel(latLng);
    var left = this.canvasCenter.x - this.canvasWidth / 2;
    var top = this.canvasCenter.y - this.canvasHeight / 2;
    var x = divPixel.x - left;
    var y = divPixel.y - top;
    var canvasPixel = new google.maps.Point(x, y);

    return canvasPixel;
};

/**
 * Convert canvas point coordinates to the lan/lng map coordinates.
 */
RaceOverlay.prototype._fromCanvasPixelToLatLng = function (canvasPixel) {
    // borders of the map
    var left = this.canvasCenter.x - this.canvasWidth / 2;
    var top = this.canvasCenter.y - this.canvasHeight / 2;
    // point coordinates on the canvas layer
    var x = canvasPixel.x + left;
    var y = canvasPixel.y + top;
    var divPixel = new google.maps.Point(x, y);
    var latLng = this.getProjection().fromDivPixelToLatLng(divPixel);

    return latLng;
};


/**
 * Create race objects
 * @private
 */
/*RaceOverlay.prototype.setupRaces = function() {
 for (var i = 0; i < this.numRaces; i++) {
 var race = new Race();
 this.races.push(race);
 }
 };*/

/**
 * Set new array of markers, redraw overlay.
 * @param {Array} markers New array of markers.
 */
/*RaceOverlay.prototype.setMarkers = function(_markers) {
 this.markers = _markers;
 this.draw();
 };*/


/**
 * Create initial divs and canvases for races.
 * Called when race overlay is added to map initially.
 */
RaceOverlay.prototype.onAdd = function () {
    //var me = this;
    var panes = this.getPanes();
    //for (var i = 0; i < this.numRaces; i++) {
    this.div = document.createElement('DIV');
    this.div.style.border = '0px solid';
    this.div.style.position = 'absolute';
    this.div.style.overflow = 'visible';
    //this.races[i].div = div;
    panes.overlayImage.appendChild(this.div);
    this.canvas = Raphael(this.div);
    //this.races[i].canvas = canvas;
    //}
    //this.starsTimer_ = window.setInterval(function() { me.animateStars();}, 2000);
};

/**
 * Draws race overlay - race part.
 */
RaceOverlay.prototype.draw = function () {
    if (!this.getProjection()) {
        return;
    }
    var sf =  new google.maps.LatLng(37.86, -122.43);
    this._setSize();

/*    // var randX = Math.floor(Math.random() * (race.radius - 80));
    // var randY = Math.floor(Math.random() * (race.radius - 80));
    var star = this.canvas.g.star(100, 100, 8);
    star.attr({stroke: 'none', fill: '90-#fff-#fff'});

    canvasWidth = Math.min(this.getProjection().getWorldWidth(), 60000);
    canvasHeight = Math.min(this.getProjection().getWorldWidth(), 60000);
    console.log(canvasWidth, canvasHeight);

    var radius = 10;
    var circle = this.canvas.circle(radius / 2, radius / 2, radius / 2);
    circle.attr({stroke: 'none', fill: '90-#fff-#fff'});

    circle = this.canvas.circle(canvasWidth, canvasHeight, 5);
    circle.attr({stroke: 'none', fill: '90-#fff-#fff'});
*/
    var p = this._fromLatLngToCanvasPixel(sf);
    star = this.canvas.g.star(p.x, p.y, 10);
    star.attr({stroke: 'none', fill: '90-#fff-#fff'});
    console.log(p.x, p.y);

//    var divPixel = this.getProjection().fromLatLngToDivPixel(sf);
//    star = this.canvas.g.star(divPixel.x, divPixel.y, 5);
//    star.attr({stroke: 'none', fill: '90-#fff-#fff'});
//    console.log(divPixel.x, divPixel.y);


//    var overlayProjection = this.getProjection();
//    for (var i = 0; i < this.markers.length; i++) {
//        if (this.markers[i]) {
//            var race = this.races[i];
//            var latlng = this.markers[i].getPosition();
//            var div = race.div;
//
//            var radius = 170 - (this.markers.length - i) * 20;
//            var center = overlayProjection.fromLatLngToDivPixel(latlng);
//            var left = center.x - radius / 2;
//            var top = center.y - radius / 2;
//            div.style.left = left + 'px';
//            div.style.top = top + 'px';
//            div.style.width = radius + 'px';
//            div.style.height = radius + 'px';
//            race.canvas.setSize(radius, radius);
//            race.radius = radius;
//            if (race.circle) {
//                race.circle.remove();
//            }
//            race.circle = race.canvas.circle(radius / 2, radius / 2, radius / 2)
//            race.circle.attr({stroke: 'none', fill: 'r(.5,.5)#fff-#fff', opacity: 0.0});
//            for (var j = 0; j < race.stars.length; j++) {
//                race.stars[j].remove();
//            }
//        }
//    }
//    this.animateStars();
};

/**
 * Generates animated stars for current location.
 */
//RaceOverlay.prototype.animateStars = function() {
//    var me = this;
//    var currentNum = this.markers.length - 1;
//    var race = this.races[currentNum];
//    var canvas = race.canvas;
//    var numStars = Math.floor(race.radius / 40);
//    race.stars = [];
//    for (var j = 0; j < numStars; j++) {
//        window.setTimeout(function() {
//            if ((me.markers.length - 1) == currentNum) {
//                var randX = Math.floor(Math.random() * (race.radius - 80));
//                var randY = Math.floor(Math.random() * (race.radius - 80));
//                var star = canvas.g.star(randX + 40, randY + 40, 8);
//                star.attr({stroke: 'none', fill: '90-#fff-#fff'});
//                star.animate({scale: '0.25 0.25', rotation: 180, opacity: 0},
//                    500 + 2000 * Math.random(), function() {this.remove();});
//                race.stars.push(star);
//            }
//        }, j * 300);
//    }
//};

RaceOverlay.prototype.forward = function () {
    console.log('forward()');
};

RaceOverlay.prototype.rewind = function () {
    console.log('rewind()');
};

RaceOverlay.prototype.setIndex = function (value) {
    console.log('index ' + value);
};

/**
 * Called when overlay is removed from map.
 * Removes references to objects.
 */
RaceOverlay.prototype.onRemove = function () {
//    for (var i = 0; i < this.markers.length; i++) {
//        var race = this.races[i];
//        // Check if race exists before continuing
//        if (!race) {
//            continue;
//        }
//        // Remove race circle
//        // Should exist by the time it's removed from the map,
//        // but on the safe side, check for existence.
//        // Edge case: Someone loading map 2 seconds before the flight ends.
//        if (race.circle) {
//            race.circle.remove();
//            race.circle = null;
//        }
//        // Remove stars
//        for (var j = 0; j < race.stars.length; j++) {
//            if (race.stars[j]) {
//                race.stars[j].remove();
//                race.stars[j] = null;
//            }
//        }
//    }
//    // Stop the timer that creates stars.
//    window.clearInterval(this.starsTimer_);


    /**
     * Convert lan/lng map coordinates to the canvas point coordinates.
     */
    RaceOverlay.prototype._fromLatLngToCanvasPixel = function (latLng) {
        var divPixel = this.getProjection().fromLatLngToDivPixel(latLng);
        var left = this.canvasCenter.x - this.canvasWidth / 2;
        var top = this.canvasCenter.y - this.canvasHeight / 2;
        var x = divPixel.x - left;
        var y = divPixel.y - top;
        var canvasPixel = new google.maps.Point(x, y);

        return canvasPixel;
    };

    /**
     * Convert canvas point coordinates to the lan/lng map coordinates.
     */
    RaceOverlay.prototype._fromCanvasPixelToLatLng = function (canvasPixel) {
        // borders of the map
        var left = this.canvasCenter.x - this.canvasWidth / 2;
        var top = this.canvasCenter.y - this.canvasHeight / 2;
        // point coordinates on the canvas layer
        var x = canvasPixel.x + left;
        var y = canvasPixel.y + top;
        var divPixel = new google.maps.Point(x, y);
        var latLng = this.getProjection().fromDivPixelToLatLng(divPixel);

        return latLng;
    };



};
