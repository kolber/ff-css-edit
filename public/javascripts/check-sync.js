$(function() {
	function checkSync() {
		
		$.ajax({
			url: '/syncing/sync_status.js',
			cache: false,
			complete: function(xhr){
				if(xhr.redirect) {
					clearInterval(syncTimer);
					window.location = xhr.redirect
				}
			}
		});
	}
	syncTimer = setInterval(checkSync, 2000);
});