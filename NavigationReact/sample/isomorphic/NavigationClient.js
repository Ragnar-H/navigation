var React = require('react');
var Navigation = require('navigation');
var NavigationShared = require('./NavigationShared');

function registerNavigators() {
	var states = Navigation.StateInfoConfig.dialogs.masterDetails.states;
	states.listing.navigating = function(data, url, navigate) {
		getData('/data/people/' + data.pageNumber, function(data){
			navigate({ people: data });
		})
	}
	
	states.listing.navigated = function(data, asyncData) {
		render(asyncData);
	}

	states.details.navigating = function(data, url, navigate) {
		getData('/data/person/' + data.id, function(data){
			navigate({ person: data });
		})
	}
	
	states.details.navigated = function(data, asyncData) {
		render(asyncData);
	}
	
	function getData(url, callback) {
		var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
			if (req.readyState === 4){
				callback(JSON.parse(req.responseText));
			}
		};
        req.open('get', url);
		req.setRequestHeader("Content-Type", "application/json");
        req.send(null);
	}
}

exports.start = function(props) {
	Navigation.start();
	render(props);
	registerNavigators();
}

function render(props) {
	React.render(
		React.createElement(NavigationShared.getContent(), props),
		document.getElementById('content')
	);		
}
	

