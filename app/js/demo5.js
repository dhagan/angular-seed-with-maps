/**
 * Created by dhagan on 12/22/2014.
 */

var map;
var polylines = [];

function initialize() {

    var center = new google.maps.LatLng(30.35, 47.21);


    var mapOptions = {
        zoom: 8,
        center: center,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var markerArray = [
        {
            position : new  google.maps.LatLng(30.35, 47.21),
            icon: 'img/red-cross.png'
        },
        {
            position : new  google.maps.LatLng(30.46,45.90),
            icon: 'img/red-cross.png'
        },
        {
            position : new  google.maps.LatLng(30.12, 47.98),
            icon: 'img/red-cross.png'
        },
        {
            position : new  google.maps.LatLng(29.37, 48.39),
            icon: 'img/red-cross.png'
        }
        ]

    var markers = [];

    var circleSymbol = {
        path        : google.maps.SymbolPath.CIRCLE,
        scale       : 8,
        strokeColor : '#009ee0'
    };

    for (var i = 0; i < markerArray.length; i++) {
        var marker = new google.maps.Marker({
            position: markerArray[i].position,
            map: map,
            icon: markerArray[i].icon
            //title: 'Hello World!'
        });
        markers.push(marker);

        if (i > 0) {
            var polyline = new google.maps.Polyline( {
                path          : [
                    markerArray[i-1].position,
                    markerArray[i].position
                ],
                icons         : [ {
                    icon   : circleSymbol,
                    offset : '0%'
                } ],
                clickable     : false,
                geodesic      : true,
                strokeColor   : 'black',
                strokeOpacity : .6,
                strokeWeight  :  3,
                map           : map
            } );
            polylines.push(polyline);
        }
    }

    var counter = 0;

    window.setInterval( function() {
        var icons = polylines[0].get( 'icons' );

        counter = ( counter +1 ) % 200;

        icons[0].offset = ( counter /2 ) + '%';
        polylines[0].set( 'icons', icons );
    }, 20 );

    addLine();
}

function addLine() {
    polylines[0].setMap(map);
}

function removeLine() {
    polylines[0].setMap(null);
}