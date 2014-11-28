jQuery(document).ready(function($){
	'use strict';

	var interval,
		i = 10;

	$('body').append('<div>Redirecting you to Adam Wood Digital in <span id="countdown">10</span>s</div>');

	interval = window.setInterval(function(){
		i--;

		if (i === 0) {
			window.clearInterval(interval);
			window.location = 'http://www.adamwood.nz';
		}

		$('#countdown').html(i);
	}, 1000);
});