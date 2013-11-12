paper.install(window);

// open and load GPX Section
$(function () {
    "use strict";

    var map;
    var track = [];

    function initialize() {
        //var maui = new google.maps.LatLng(20, -156);
        // 37.8600° N, 122.4300° W
        var sf =  new google.maps.LatLng(37.86, -122.43);
        var myOptions = {
            zoom: 7,
            center: sf,
            mapTypeId: google.maps.MapTypeId.SATELLITE
        };
        map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
    }

    initialize();

   // parse gpx
   function parseGPX(gpx) {
    var parseXml;
    if (typeof window.DOMParser != "undefined") {
        parseXml = function (xmlStr) {
            return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
        };
    } else if (typeof window.ActiveXObject != "undefined" &&
        new window.ActiveXObject("Microsoft.XMLDOM")) {
        parseXml = function (xmlStr) {
            var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
        };
    } else {
        throw new Error("No XML parser found");
    }
    var xml = parseXml(gpx);

    var parser = new GPXParser(xml, map);
        parser.setTrackColour("#ffff00");     // Set the track line colour
        parser.setTrackWidth(1);          // Set the track line width
        parser.setMinTrackPointDelta(0.001);      // Set the minimum distance between track points
        track = parser.centerAndZoom(xml);
        parser.addTrackpointsToMap();         // Add the trackpoints
        parser.addWaypointsToMap();           // Add the waypoints
        //overlay  = new RaceOverlay(track, map);
        drawProfile(track, map);
    }


    $.ajax({ type: "GET",
        url: "eight_ball.gpx",
        async: false,
        success: function (text) {
         parseGPX(text);
     }
 });

/*    function drawProfile(track, trackObjs) {
        paper.setup('graph_canvas');
    var path = new Path();
    path.strokeColor = 'black';
    var start = new Point(100, 100);
    path.moveTo(start);
    path.lineTo(start.add([ 200, -50 ]));
    view.draw();
}*/
function drawProfile(track, trackObjs){
        //paper.setup(mapOptions.elevationCanvas);
        paper.setup('graph_canvas');

        // DJH view.canvas.width = 1000;// view.viewSize.width;
        // DJH view.canvas.height = 1000; //view.viewSize.height;
        for(var layer in project.layers){
            project.layers[layer].removeChildren();
        }

        // draw black diagonal line
        var path = new Path();
        path.strokeColor = 'black';
        var start = new Point(100, 100);
        path.moveTo(start);
        path.lineTo(start.add([ 200, -50 ]));
        view.draw();

        var elevArray = [];
        for(var j = 0; j < 1000; j++){
            elevArray.push(Math.random());
        }
        var minElev = Math.min.apply(null, elevArray);
        var maxElev = Math.max.apply(null, elevArray);

        // Draw elevation graduations
        var elevScale = 1000;
        if(maxElev - minElev < 1000){
            elevScale = 100;
        }
        var minElevLine = Math.floor(minElev/elevScale) * elevScale;
        var maxElevLine = Math.ceil(maxElev/elevScale) * elevScale;
        for(j = 0; j < (maxElevLine - minElevLine) / elevScale * 5; j++){
            var myLine = new Path();
            var myLineElev = minElevLine + (j * elevScale / 5);
            var myLineY = (myLineElev - minElev) * (view.viewSize.height / (maxElev - minElev));
            myLine.add(new Point(0, myLineY), new Point(view.viewSize.width, myLineY));
            if(myLineElev % elevScale == 0){
                myLine.strokeWidth = 2;
                myLine.opacity = 1;
            }else{
                myLine.strokeWidth = 1;
                myLine.opacity = 0.8;
            }
            myLine.strokeColor = "#dddddd";
        }

        // Draw elevation paths
        var cumulativeLength = 0;
        var myProfileFill = new Path();
        var myProfile = new Path();
        for(j = 0; j < trackObjs.length; j++){
            var myX;
            if(j==0){
                myX = 0;
            }else{
                cumulativeLength += google.maps.geometry.spherical.computeDistanceBetween(trackObjs[j-1].point, trackObjs[j].point);
                myX = cumulativeLength/track.length * view.viewSize.width;
            }
            var myY = view.viewSize.height - profileBuffer - ((trackObjs[j].elev-minElev)/(maxElev-minElev) * (view.viewSize.height - (profileBuffer * 2)));
            myProfileFill.add(new Point(myX, myY));
            myProfile.add(new Point(myX, myY));
        }
        myProfileFill.add(new Point(view.viewSize.width, view.viewSize.height), new Point(0, view.viewSize.height));
        myProfileFill.closed = true;
        myProfileFill.strokeColor = null;
        myProfileFill.fillColor = "#eeeeee";
        myProfileFill.opacity = 0.8;
        myProfile.strokeColor = track.strokeColor;
        myProfile.strokeWidth = 2;
        myProfile.strokeCap = "round";
        
        // DJH activeShape = myProfile;

        var elevationMarker = new Path.Circle(new Point(0,0), 5);
        elevationMarker.fillColor = "#ffffff";
        elevationMarker.strokeWidth = 2;
        elevationMarker.visible = false;

/* DJH
        // Add mouse listeners
        var tool = new Tool();
        tool.onMouseMove = function(event){
            if(event.point.x > 0 && event.point.x <= view.viewSize.width && event.point.y > 0 && event.point.y <= view.viewSize.height){
                setActive(activeTrack);
                changed = false;
                for(j = 0; j < activeShape.segments.length; j++){
                    if(event.point.x >= activeShape.segments[j].point.x - 1 && event.point.x <= activeShape.segments[j].point.x + 1){
                        if(tooltip){
                            tooltip.remove();
                        }
                        var tooltipText = new PointText(new Point(10, 0));
                        tooltipText.content = Math.round(activeTrackObjs[j].elev) + " m";
                        tooltipText.fillColor = "#666666";
                        tooltipText.characterStyle.fontSize = 9;
                        var tooltipRect = new Path.Rectangle(new Rectangle(new Point(5, -12), new Size(50, 15)));
                        tooltipRect.fillColor = "#ffffff";
                        tooltipRect.opacity = 0.8;
                        tooltip = new Group(tooltipRect, tooltipText);
                        if(activeShape.segments[j].point.x < view.viewSize.width - 60){
                            tooltip.position = new Point(activeShape.segments[j].point.x + 30, activeShape.segments[j].point.y);
                        }else{
                            tooltip.position = new Point(activeShape.segments[j].point.x - 36, activeShape.segments[j].point.y);
                        }
                        elevationMarker.position = activeShape.segments[j].point;
                        elevationMarker.strokeColor = activeTrack.strokeColor;
                        elevationMarker.visible = true;                     
                        var activePath = activeTrack.getPath();
                        var location = activePath.getAt(j);
                        locationMarkerFill.position = location;
                        locationMarkerFill.setMap(map);
                        locationMarkerStroke.position = location;
                        locationMarkerStroke.icon.strokeColor = activeTrack.strokeColor;
                        locationMarkerStroke.setMap(map);
                    }
                }
            }else if(!changed){
                elevationMarker.visible = false;
                locationMarkerFill.setMap(null);
                locationMarkerStroke.setMap(null);
                setInactive(activeTrack);
                changed = true;
                if(tooltip){
                    tooltip.remove();
                }
            }
            view.draw();
        }
        */

        view.draw();
    }

});

