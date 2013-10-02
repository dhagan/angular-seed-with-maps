
var loaded = false;
var text1a, text1b, text2a, text2b;



$(document).ready(function() {
	var style= [
				  {
					"elementType": "geometry.fill",
					"stylers": [
					  { "visibility": "on" },
					  { "color": "#ffffff" },
					  { "invert_lightness": true }
					]
				  },{
					"featureType": "water",
					"elementType": "geometry.fill",
					"stylers": [
					  { "visibility": "on" },
					  { "color": "#ffffff" },
					  { "invert_lightness": false }
					]
				  },{
					"featureType": "road",
					"elementType": "geometry",
					"stylers": [
					  { "visibility": "off" }
					]
				  },{
					"featureType": "road",
					"elementType": "labels",
					"stylers": [
					  { "visibility": "off" }
					]
				  },{
					"featureType": "administrative.land_parcel",
					"elementType": "geometry.fill",
					"stylers": [
					  { "visibility": "off" }
					]
				  },{
					"featureType": "poi.park",
					"elementType": "geometry.fill",
					"stylers": [
					  { "visibility": "off" }
					]
				  }
				]
	
	var myLatLng1 = new google.maps.LatLng(51.177915, -115.572094);
	var myLatLng2 = new google.maps.LatLng(-51.177915, 180-115.572094);
	
	var myOptions1 = {
	zoom: 3,
	center: myLatLng1,
	disableDefaultUI: true,
	mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	
	var myOptions2 = {
	zoom: 3,
	center: myLatLng2,
	disableDefaultUI: true,
	mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map1a = new google.maps.Map(document.getElementById("map1a"), myOptions2);
	var map1 = new google.maps.Map(document.getElementById("map1"), myOptions1);
	var map2a = new google.maps.Map(document.getElementById("map2a"), myOptions1);
	var map2 = new google.maps.Map(document.getElementById("map2"), myOptions2);
	map1a.setOptions({styles: style});
	map1.setOptions({styles: style});
	map2a.setOptions({styles: style});
	map2.setOptions({styles: style});
	var activeMap;
	
	google.maps.event.addListener(map1, 'center_changed', function() {
      if (activeMap==1)
	  {
		map1a.panTo(flipCoords(map1.getCenter()));
		map2.panTo(flipCoords(map1.getCenter()));
		map2a.panTo(map1.getCenter());
		text1a.content = text1b.content = Math.round(map1.getCenter().lat()*100)/100 + ", " + Math.round(map1.getCenter().lng()*100)/100;
		text2a.content = text2b.content = Math.round(map2.getCenter().lat()*100)/100 + ", " + Math.round(map2.getCenter().lng()*100)/100;
	  }
	});
	google.maps.event.addListener(map1, 'mouseover', function() {
		activeMap = 1;
	});
	
	google.maps.event.addListener(map2, 'center_changed', function() {
	  if (activeMap==2)
	  {
		map1a.panTo(map2.getCenter());
		map2a.panTo(flipCoords(map2.getCenter()));
		map1.panTo(flipCoords(map2.getCenter()));
		text1a.content = text1b.content = Math.round(map1.getCenter().lat()*100)/100 + ", " + Math.round(map1.getCenter().lng()*100)/100;
		text2a.content = text2b.content = Math.round(map2.getCenter().lat()*100)/100 + ", " + Math.round(map2.getCenter().lng()*100)/100;
	  }
	});
	google.maps.event.addListener(map2, 'mouseover', function() {
		activeMap = 2;
	});
	
	google.maps.event.addListener(map1, 'zoom_changed', function() {
	  if (activeMap==1)
	  {
		map2.setZoom(map1.getZoom());
		map2a.setZoom(map1.getZoom());
		map1a.setZoom(map1.getZoom());
	  }
	});
	google.maps.event.addListener(map2, 'zoom_changed', function() {
      if (activeMap==2)
	  {
		map1.setZoom(map2.getZoom());
		map2a.setZoom(map2.getZoom());
		map1a.setZoom(map2.getZoom());
	  }
	});
	
	text1a = new PointText(new Point(250, 375));
	text1a.justification = 'center';
	text1a.fillColor = 'red';
	text1a.fontSize = 12;
	text1a.content = Math.round(map1.getCenter().lat()*100)/100 + ", " + Math.round(map1.getCenter().lng()*100)/100;
	text1b = text1a.clone();
	text1b.rotate(180, new Point(250,500));
	text2a = new PointText(new Point(750, 375));
	text2a.justification = 'center';
	text2a.fillColor = 'red';
	text2a.fontSize = 12;
	text2a.content = Math.round(map2.getCenter().lat()*100)/100 + ", " + Math.round(map2.getCenter().lng()*100)/100;
	text2b = text2a.clone();
	text2b.rotate(180, new Point(750,500));
	
	loaded = true;
	
	$( "#sliderOpacity" ).slider({
			value:0.35,
			step: 0.01,
			min:0,
			max:1,
			slide: function( event, ui ) {
                $( "#map1" ).css( {opacity: ui.value} );
				$( "#map1a" ).css( {opacity: 1 - ui.value} );
				$( "#map2" ).css( {opacity: ui.value} );
				$( "#map2a" ).css( {opacity: 1 - ui.value} );
            },
			stop: function( event, ui ) {
                $( "#map1" ).css( {opacity: ui.value} );
				$( "#map1a" ).css( {opacity: 1 - ui.value} );
				$( "#map2" ).css( {opacity: ui.value} );
				$( "#map2a" ).css( {opacity: 1 - ui.value} );
            }
		}).attr("title", "Opacity Control");
	$('.ui-slider-handle').height(50);
});

var rect1 = new Path.Rectangle(new Point(0,0),new Size(500, 1000));
rect1.strokeColor = 'black';
rect1.strokeWidth = 2;
var rect2 = new Path.Rectangle(new Point(500,0),new Size(500, 1000));
rect2.strokeColor = 'black';
rect2.strokeWidth = 2;

var circle1a = new Path.Circle(new Point(250, 500), 100);
var circle1b = new Path.Circle(new Point(250, 500), 25);
var vert1a = new Path.Line(new Point(250,450), new Point(250,475));
var vert1b = new Path.Line(new Point(250,525), new Point(250,550));
var hor1a = new Path.Line(new Point(200,500), new Point(225,500));
var hor1b = new Path.Line(new Point(275,500), new Point(300,500));

var crosshair1 = new Group();
crosshair1.addChildren([circle1a, circle1b, vert1a, vert1b, hor1a, hor1b]);
crosshair1.strokeColor = 'red';
crosshair1.strokeWidth = 2;

var crosshair2 = crosshair1.clone();
crosshair2.position = new Point(750,500);


function onFrame(event) {
    if (loaded==true)
	{
	text1a.rotate(1, new Point(250,500));
	text1b.rotate(1, new Point(250,500));
	text2a.rotate(1, new Point(750,500));
	text2b.rotate(1, new Point(750,500));
	}
}


function flipCoords(latlng)
{
	var lat = latlng.lat() * -1;
	var lng = 180 + latlng.lng();
	return new google.maps.LatLng(lat,lng);
}

