	// Create a Paper.js Path to draw a line into it:
	var path = new Path();
	// Give the stroke a color
	path.strokeColor = 'black';
	var start = new Point(100, 100);
	// Move to start and draw a line from there
	path.moveTo(start);
	// Note the plus operator on Point objects.
	// PaperScript does that for us, and much more!
	path.lineTo(start + [ 100, -50 ]);


	 function initialize() {
    var chicago = new google.maps.LatLng(20, -156);
    var myOptions = {
      zoom: 7,
      center: chicago,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
}

  google.maps.event.addDomListener(window, 'load', initialize);