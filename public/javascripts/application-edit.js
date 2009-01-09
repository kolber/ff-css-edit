speed = 350;

var Status = {
	statusContainer: null,
	caller: null,
	init: function(html) {
		// add markup to page
		$("body").prepend('<div id="status"><img src="/images/spinning-black.gif" alt="Spinning arrow"><h2>Saving</h2><p id="status-description"></p><p id="status-actions"><a href="#" id="statuserror-retry-action">Retry</a><a href="#" id="statuserror-cancel-action">Cancel</a></p></div>');
		// store status dom object
		this.statusContainer = $("div#status")[0];
		this.initEvents();
	},
	initEvents: function() {
		var _this = this;
		$("p#status-actions a#statuserror-retry-action", this.statusContainer).click(function() {
			_this.caller(); 
		});
		$("p#status-actions a#statuserror-cancel-action", this.statusContainer).click(function() { 
			_this.statusFinished(); 
		});
	},
	statusStart: function(heading, text) {
		// assign calling function for use with retry action
		this.caller = arguments.callee.caller;
		// overwrite dom elements
		$("p#status-actions", this.statusContainer).hide();
		$("img", this.statusContainer).attr("src", "/images/spinning-black.gif");
		$("h2", this.statusContainer).html(heading);
		$("p#status-description", this.statusContainer).html(text);
		
		/*
		* This bit needs improving, it currently doesn't allow for browser resizing after entering status mode
		*/
		var statusHeight = ($("body").height() > $(window).height()) ? $("body").height() : $(window).height();
		$(this.statusContainer).css("height", statusHeight).fadeIn(200);
	},
	statusError: function(heading, text) {
		// overwrite dom elements
		$("img", this.statusContainer).attr("src", "/images/error-black.gif");
		$("h2", this.statusContainer).html(heading);
		$("p#status-description", this.statusContainer).html(text);
		$("p#status-actions", this.statusContainer).show();
	},
	statusFinished: function() {
		// hide status
		$(this.statusContainer).fadeOut(200);
	}
}

var FlickrfolioEdit = {
	init: function() {
		this.initEvents();
	},
	initEvents: function() {
		var _this = FlickrfolioEdit;
		
		// edit css action
		$("a#edit-css-action").click(function() { 
			_this.showCSSEditor(); 
		});

		// CSS save and undo actions
		$("button#edit-css-save-action").click(function() { 
			//AdvancedTextarea.setSaveState(); 
			_this.saveCSS();
		});
		$("button#edit-css-cancel-action").click(function() { 
			//AdvancedTextarea.revertSaveState(); 
			_this.hideCSSEditor();
		});
	},
	
	saveCSS: function() {
		Status.statusStart('Saving', 'Saving your updates to the CSS file.');
		var _this = FlickrfolioEdit;
				
		/*
		*	Ajax call
		*/
		var hash = (document.URL.split("/")[3]).match(/[\d|\w]+/);
		$.ajax({
			type: "POST",
			url: "/"+hash+"/save-css",
			data: "customcss="+escape($(AdvancedTextarea.textarea).val().replace(/\+/g, "&#43;")),
			success: function(msg){
				if(msg == 'complete') _this.saveCSSCallback();
				else Status.statusError('Error', 'There was an error saving your data. Maybe wait a few minutes before trying again.');
			},
			error: function() {
				Status.statusError('Error', 'There was an error saving your data. Maybe wait a few minutes before trying again.');
			}
		})
	},
	saveCSSCallback: function() {
		this.reloadCustomCSS();
		this.hideCSSEditor();
		// hide status
		Status.statusFinished();
	},
	
	reloadCustomCSS: function() {
		/*
		*	Write to custom CSS file and reload
		*/
		var overwriteSheet = document.getElementsByTagName('link')[2];
		var href = overwriteSheet.href.replace(/(&|\?)reload=\d+/,'');
		overwriteSheet.href = href + (href.indexOf('?') >= 0 ? '&' : '?' ) + 'reload=' + (new Date().valueOf())
	},
	
	showCSSEditor: function() {
		// init scrolling line numbers
		$("div#edit-css-lines p:first").css("margin-top", $("textarea#edit-css-editor")[0].scrollTop * -1);
		// hide any overflows on the body
		$("body").css("overflow", "hidden");
		// resize textarea to height of screen
		$("textarea#edit-css-editor").css("height", $(window).height() - $("textarea#edit-css-editor")[0].offsetTop);
		// used to resize line number container
		AdvancedTextarea.updateLineNumbers();
		// reselect old caret position
		AdvancedTextarea.setCaretPos();
		
		// move things on window resize to keep shit clean no matter what
		$(window).resize(function() {
			$("textarea#edit-css-editor").css("height", $(window).height() - $("textarea#edit-css-editor")[0].offsetTop);
			$("div#edit-header").css("margin-top", $(window).height() + 1000)
			// used to resize line number container
			AdvancedTextarea.updateLineNumbers();
		});
		
		// slide in css editor
		$("div#edit-css").css("top", "-100%").animate({
			top: "0%"
		}, {
			queue:false, 
			duration: speed
		});
		
		// slide out content
		$("div#edit-header").animate({
			marginTop: ($(window).height() + 20)
		}, { 
			queue:false, 
			duration: speed,
			complete: function() {
				$(this).css("margin-top", $(window).height() + 1000);
			}
		});
	},
	hideCSSEditor: function() {
		// remove resize listener
		$(window).unbind("resize");
		
		// slide out css editor
		$("div#edit-css").animate({
			top: "-100%"
		}, { 
			queue:false,
			duration: speed,
			complete: function() {
				$("body").css("overflow", "auto");
				$(this).css("top", "-120%");
			}
		});
		
		// slide in content
		$("div#edit-header").css("margin-top", $(window).height() + 20).animate({
			marginTop: 0
		}, { 
			queue:false, 
			duration: speed
		});
	}
}

// onDOMReady
$(function () {
	// init edit mode
	FlickrfolioEdit.init();
	
	// init CSS editor
	AdvancedTextarea.init($("textarea#edit-css-editor")[0]);
	
	// init status
	Status.init();
});