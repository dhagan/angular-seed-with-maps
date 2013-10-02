function TrackMap(options){
	var dataArray = parseDataFile();
	var mapOptions = {
		center: getMapCenter(),
		zoom: 13,
		mapTypeId: google.maps.MapTypeId.TERRAIN
	}
	for(option in options){
		mapOptions[option] = options[option];
	}
	var map = new google.maps.Map(document.getElementById(mapOptions.mapCanvas), mapOptions);
	var metadata = document.getElementById("metadata");

	paper.install(window);
	paper.setup(mapOptions.elevationCanvas);

	var wayPoints = [];
	var tracks = [];
	var trackObjects = [];
	var currentTrack = [];
	var currentTrackObjects = [];
	var trackCount = 0;
	var activeTrack;
	var activeTrackObjs;
	var profileBuffer = 10;
	var activeShape;
	var elevationMarker;
	var tooltip;
	var locationMarkerFill = new google.maps.Marker({
		position: mapOptions.center,
		icon: {
			path: google.maps.SymbolPath.CIRCLE,
			scale: 8,
			fillOpacity: 1,
			fillColor: "#ffffff"
		},
		draggable: false
	});
	var locationMarkerStroke = new google.maps.Marker({
		position: mapOptions.center,
		icon: {
			path: google.maps.SymbolPath.CIRCLE,
			scale: 8,
			strokeWeight: 5
		},
		draggable: false
	});
	var changed = false;

	// Initialise waypoint- & track-making
	for(i = 0; i < dataArray.length; i++){
		switch(dataArray[i][0]){
			case "wpt":
				makeWayPoints(i+2);
				break;
			case "trk":
				nameTracks(i+2);
				break;
			case "trkpt":
				makeTracks(i+2);
				break;
		}
	}

	// Add waypoints to map
	for(i = 0; i < wayPoints.length; i++){
		setWayPoint(wayPoints[i]);
	}

	// Add tracks to map
	for(i = 0; i < tracks.length; i++){
		var colour = new chroma.Color(360/tracks.length*i,0.5,0.7,'hsv');
		colour.hex();
		colour = String(colour);
		var ascent = 0;
		var descent = 0;
		for(j = 1; j < trackObjects[i].track.length; j++){
			var difference = trackObjects[i].track[j].elev - trackObjects[i].track[j-1].elev;
			if(difference > 0){
				ascent += difference;
			}else{
				descent += Math.abs(difference);
			}
		}
		var newTrack = new google.maps.Polyline({
			path: tracks[i].track,
			strokeColor: colour,
			strokeOpacity: 0.5,
			strokeWeight: 3,
			name: tracks[i].name,
			length: 3 , //google.maps.geometry.spherical.computeLength(tracks[i].track),
			ascent: ascent,
			descent: descent
		});
		setTrack(newTrack, trackObjects[i].track);
	}

	// Make waypoint & track arrays
	function makeWayPoints(row){
		var myWayPoint = new google.maps.Marker({
			position: new google.maps.LatLng(dataArray[row][1], dataArray[row][2]),
			title: dataArray[row][7].substring(1,dataArray[row][7].length-1)
		});
		wayPoints.push(myWayPoint);
		if(dataArray[row + 1][0] == Number(dataArray[row][0]) + 1){
			makeWayPoints(row + 1);
		}
	}
	function nameTracks(row){
		tracks.push({name: dataArray[row][1].substring(1,dataArray[row][1].length-1)});
		trackObjects.push({name: dataArray[row][1].substring(1,dataArray[row][1].length-1)});
		if(dataArray[row + 1][0] == Number(dataArray[row][0]) + 1){
			nameTracks(row + 1);
		}
	}
	function makeTracks(row){
		currentTrack.push(new google.maps.LatLng(dataArray[row][2], dataArray[row][3]));
		currentTrackObjects.push({
			point: new google.maps.LatLng(dataArray[row][2], dataArray[row][3]),
			elev: dataArray[row][4]
		});
		if(dataArray[row + 1][1] == dataArray[row][1]){
			makeTracks(row + 1);
		}else{
			tracks[trackCount].track = currentTrack;
			trackObjects[trackCount].track = currentTrackObjects;
			trackCount++;
			currentTrack = [];
			currentTrackObjects = [];
			if(dataArray[row + 1][1] == Number(dataArray[row][1]) + 1){
				makeTracks(row + 1);
			}
		}
	}

	function setWayPoint(wayPoint){
		wayPoint.setMap(map);
	}
	function setTrack(track, trackObjs){
		track.setMap(map);
		google.maps.event.addListener(track, 'click', function(event){
			var contentString = "<div class='col five'><p><em class='proj title small'>" + track.name + "</em></p><p>Distance: " + (Math.round(track.length/100))/10 + " km</p>"+
				"<p>Ascent: " + Math.round(track.ascent) + " m</p><p>Descent: " + Math.round(track.descent) + " m</p></div>" +
				"<p align='right'><a href='" + mapOptions.folderPath + track.name + ".gpx' target='_blank'><c>Download GPS track</c></a></p>";
			metadata.innerHTML = contentString;
			if(activeTrack){
				setInactive(activeTrack);
			}
			activeTrack = track;
			activeTrackObjs = trackObjs;
			drawProfile(track, trackObjs);
		});
		google.maps.event.addListener(track, 'mouseover', function(){
			setActive(track);
		});
		google.maps.event.addListener(track, 'mouseout', function(){
			setInactive(track);
		});
	}

	function drawProfile(track, trackObjs){

		view.canvas.width = view.viewSize.width;
		view.canvas.height = view.viewSize.height;
		for(layer in project.layers){
			project.layers[layer].removeChildren();
		}
		var elevArray = [];
		for(j = 0; j < trackObjs.length; j++){
			elevArray.push(trackObjs[j].elev);
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
		activeShape = myProfile;

		elevationMarker = new Path.Circle(new Point(0,0), 5);
		elevationMarker.fillColor = "#ffffff";
		elevationMarker.strokeWidth = 2;
		elevationMarker.visible = false;

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
		view.draw();
	}

	function parseDataFile(){
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", options.folderPath + options.fileName + ".txt", false);
		xmlhttp.send(null);
		var fileContent = xmlhttp.responseText;
		var myDataArray = fileContent.split("\n");
		for(i = 0; i < myDataArray.length; i++){
			myDataArray[i] = myDataArray[i].split("\t");
		}
		return myDataArray;
	}
	function getMapCenter(){
		for(i = 0; i < dataArray.length; i++){
			if(dataArray[i][0] == "metadata"){
				var minLat;
				var minLon;
				var maxLat;
				var maxLon;
				for(j = 0; j < dataArray[i + 1].length; j++){
					switch(dataArray[i + 1][j]){
						case "minlat":
							minLat = Number(dataArray[i + 2][j]);
							break;
						case "minlon":
							minLon = Number(dataArray[i + 2][j]);
							break;
						case "maxlat":
							maxLat = Number(dataArray[i + 2][j]);
							break;
						case "maxlon":
							maxLon = Number(dataArray[i + 2][j]);
							break;
					}
				}
				if(minLat && minLon && maxLat && maxLon){
					var mapCenter = new google.maps.LatLng((maxLat + minLat)/2, (maxLon + minLon)/2);
					return mapCenter;
				}
			}
		}
	}
	function setActive(track){
		track.strokeOpacity = 1;
		track.strokeWeight = 5;
		track.setMap(map);
	}
	function setInactive(track){
		track.strokeOpacity = 0.5;
		track.strokeWeight = 3;
		track.setMap(map);
	}
}