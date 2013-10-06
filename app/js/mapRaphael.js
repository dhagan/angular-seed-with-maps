// open and load GPX Section
$(function (view) {
    "use strict";

    var map;
    var track;
    function initialize() {
        var maui = new google.maps.LatLng(20, -156);
        var myOptions = {
            zoom: 7,
            center: maui,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
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
        parser.setTrackColour("#ff0000");     // Set the track line colour
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

