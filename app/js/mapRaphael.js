// open and load GPX Section
$(function (view) {
    "use strict";

    var map, cloud;
    var track;
    var markers = [];

    function initialize() {
        //var maui = new google.maps.LatLng(20, -156);
        // 37.8600° N, 122.4300° W
        var sf =  new google.maps.LatLng(37.86, -122.43);
        var myOptions = {
            zoom: 7,
            center: sf,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
        makeMarker(sf);
        overlay = cloud = new CloudOverlay(markers, map);
    }

    initialize();

    function makeMarker(location) {
        var markerOptions = {map: map, position: new google.maps.LatLng(location.lat, location.lng)};
        var marker = new google.maps.Marker(markerOptions);
        markers.push(marker);
    }

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
    }


    $.ajax({ type: "GET",
        url: "eight_ball.gpx",
        async: false,
        success: function (text) {
           parseGPX(text);
        }
    });

});

