// onDOMReady
$(function () {

	/*
	*
	*	Search
	*
	*/

	// clear input to counter form content caching
	if($('#search-projects').length > 0) {
		$('#search-projects-container').css("display", "block");
		$('#search-projects')[0].value = "";
	}
	// delimiting search event
	$('#search-projects').keyup(function () {
		// hide empty text
		$(".empty-result").remove();
		// setup target and regular expression for search term
		var target = $('.project');
		var search_term = new RegExp(this.value.replace(/\\/g, ''), "i");
		// hide all delimitable elements (& corresponding dates)
		target.hide().prev().hide();
		// show elements which contain search term (& corresponding dates)
		target.filter(function() {
			return ($(this).text() + $(this).prev("p.month").text() + $(this).parent().prev("p.year").text()).match(search_term);
		}).show().prev().show();
		
		$('.projects-by-year').filter(function() {
			return ($(".project:visible", this).length == 0) ? this : false;
		}).append("<h4 class='empty-result'>&mdash;</h4>");

		// above code removes focus from the input, so refocus it
		this.focus();
	});
	
	/*
	*
	*	Keyword truncation
	*
	*/
	
	var h4s = $(".project h4");
	for(var i=0; i < h4s.length; i++) {
		// one line of javascript that proves there is a god
		$(h4s[i]).html($(h4s[i]).text().replace(/(.+?,){8}/, function($1){return "<span>"+$1.slice(0, -1)+"...</span>"}));
	}
	
});