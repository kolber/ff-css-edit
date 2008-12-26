var AdvancedTextarea = {
	// storage vars
	textarea: null,
	lineCount: 0,
	saveState: '',
	currentSearchMatchIndex: 1,
	currentSearch: '',
	caretPos: 1,
	currentScrollOffset: 0,
	
	init: function(textarea) {
		this.textarea = textarea;
		
		if(!this.textarea) return;
		
		this.initEvents();
		this.updateLineNumbers();
		this.setSaveState();
	},
	
	initEvents: function() {
		var _this = this;
		
		// attach mirrored movement to scroll event of textarea
		if($.browser.safari) {
			/* scroll() event does not fire on the textarea in Safari, so resort to crappy setinterval technique... */
			setInterval(function() { _this.alignLineNumbers(); }, 10);
		} else {
			$(this.textarea).scroll(function() {
				_this.alignLineNumbers();
			});
		}
		
		// handle tabs for textarea
		$(this.textarea).keydown(function(e) {
			var unicode = e.charCode ? e.charCode : e.keyCode;
			if(unicode == 9) {
				e.preventDefault();
				var oldscroll = this.scrollTop;
				if(this.setSelectionRange) {
					var pos_to_leave_caret = this.selectionStart + 2;
					$(this).val($(this).val().substring(0, this.selectionStart) + '  ' + $(this).val().substring(this.selectionEnd, this.value.length));
					this.setSelectionRange(pos_to_leave_caret, pos_to_leave_caret);
				} else {
					document.selection.createRange().text='\t';
				}
				this.scrollTop = oldscroll;
			}
			_this.updateLineNumbers();
		});
		
		$(this.textarea).blur(function() {
			_this.saveCaretPos();
		});
		
		// a bunch of event listeners, basically to cover line number updates for copy-paste commands
		$(this.textarea).keypress(function() { _this.updateLineNumbers(); });
		$(this.textarea).keyup(function() { _this.updateLineNumbers(); });
		$(this.textarea).mouseup(function() { _this.updateLineNumbers(); });
		$(this.textarea).bind('paste', function() { _this.updateLineNumbers(); });
		
		// keyboard shortcuts for gotoLine and Find
		$(window).keydown(function(e) {
			// if css editor is showing...
			if($(_this.textarea).parent().offset().top > -20) {
				var unicode = e.charCode ? e.charCode : e.keyCode;
				// command-l/cntrl-l to focus gotoLine
				if(unicode == 76 && (e.metaKey || e.ctrlKey)) {
					e.preventDefault(); 
					$("input#edit-css-goto-line")[0].focus();
					// select all inside input
					_this.selectRange($("input#edit-css-goto-line")[0], 0, $("input#edit-css-goto-line").val().length);
				}
				// command-f/cntrl-f to focus find
				if(unicode == 70 && (e.metaKey || e.ctrlKey)) {
					e.preventDefault(); 
					$("input#edit-css-find")[0].focus();
					// select all inside input
					_this.selectRange($("input#edit-css-find")[0], 0, $("input#edit-css-find").val().length);
				}
				// command-g/cntrl-g to findNext
				if((unicode == 71 || unicode == 83) && (e.metaKey || e.ctrlKey)) {
					e.preventDefault();
					if($("input#edit-css-find").val() !== '') _this.findText($("input#edit-css-find").val());
				}
				// command-shift-g/cntrl-shift-g to findPrevious (unicode: 71)
			}
			
		});
		
		// textarea - go to line number
		$("input#edit-css-goto-line").keydown(function(e) {
			var unicode = e.charCode ? e.charCode : e.keyCode;
			if(unicode == 13 && $(this).val() !== '') {
				e.preventDefault();
				var targetLine = $(this).val();
				_this.gotoLine(targetLine);
			}
		});


		// textarea find
		$("input#edit-css-find").keydown(function(e) {
			var unicode = e.charCode ? e.charCode : e.keyCode;
			if(unicode == 13 && $(this).val() !== '') {
				e.preventDefault();
				_this.findText($(this).val());
			}
		});
		
		//
		$("div#edit-css-lines").click(function(e) {
			// use event delegation as line numbers are added dynamically
			if(e.target.nodeName == "A") {
				e.preventDefault();
				if($(e.target).is(".selected")) {
					$(e.target).removeClass("selected");
					//window.location.hash = "edit";
				} else {
					$(e.target).addClass("selected").siblings("a.selected").removeClass("selected");
					//window.location.hash = "edit:l" + $(e.target).text();
				 }
				_this.selectLine($(e.target).text() - 1);
				return false;
			}
		});
	},

	saveCaretPos: function() {
		// ignore this functionality for ie
		if(!document.selection) {
			// save caret position
			this.caretPos = this.textarea.selectionStart;
			// save current scroll offset
			this.currentScrollOffset = this.textarea.scrollTop;
		}
	},
	setCaretPos: function() {
		// scroll to correct line
		this.textarea.scrollTop = this.currentScrollOffset;
		// move caret
		this.selectRange(this.textarea, this.caretPos, this.caretPos);
	},
	
	alignLineNumbers: function() {
		$("div#edit-css-lines a:first").css("margin-top", $(this.textarea)[0].scrollTop * -1);
	},
	
	updateLineNumbers: function() {
		var currentLineCount = this.countTextareaLines();
		if((currentLineCount + 50) >= this.lineCount || currentLineCount < (this.lineCount - 150)) {
			// update/insert scrolling line numbers
			var html = "";
			this.lineCount = currentLineCount + 100;
			for(var i=1; i < this.lineCount; i++) {
				html += "<a href='#line" + i + "'>" + i + "</a>";
			}
			// insert line numbers
			$("div#edit-css-lines").html(html);
			this.alignLineNumbers();
			// check if line number container width needs to be increased or decreased
			if ((this.lineCount - 50) > 999) {
				$("div#edit-css-lines").css("width", 32);
			} else {
				$("div#edit-css-lines").css("width", 27);
			}
		}
		// resize line numbers if necessary
		var bottomOffset = ($(this.textarea)[0].scrollWidth > $(this.textarea).width()) ? 20 : 0;
		$("div#edit-css-lines").css("height", $(window).height() - $("div#edit-css-lines").offset().top - bottomOffset);
	},
	
	gotoLine: function(targetLine) {
		// ensure targetLine only contains numbers
		if(!targetLine.match(/\D/)) {
			// get true line height
			var lineHeight = this.getTrueLineHeight();
			// scroll textarea to correct line
			this.textarea.scrollTop = Math.floor(lineHeight * (targetLine - 1));
			// move cursor to matching line
			this.selectLine(targetLine - 1);
		}
	},
	
	selectLine: function(targetLine) {
		// if targeted line is within actual number of lines
		if(targetLine < this.countTextareaLines(this.textarea)) {
			// move cursor to new line
			var lineCount = 0;
			var lastFoundIndex = 0;
			while(lineCount < targetLine) {
				lastFoundIndex = $(this.textarea).val().indexOf('\n', lastFoundIndex + 1);
				lineCount++;
			}
			this.selectRange(this.textarea, lastFoundIndex + 1, lastFoundIndex + 1);
		} else {
			// go to last line
			this.selectRange(this.textarea, $(this.textarea).val().length, $(this.textarea).val().length);
		}
	},
	
	selectRange: function(target, start, end) {
		if (document.selection) {
			// ie
			var range = target.createTextRange();
			range.collapse(true);
			range.moveStart('character', start);
			range.moveEnd('character', end - start);
			range.select();
		} else {
			// focus textarea, if firefox
			if($.browser.mozilla) this.textarea.focus();
			target.setSelectionRange(start, end);
		}
	},
	
	getTrueLineHeight: function() {
		return $(this.textarea).css("line-height").replace('px', '');
	},
	
	countTextareaLines: function() {
		return ($(this.textarea).val().match(/\n/)) ? $(this.textarea).val().match(/\n/ig).length : 1;
	},
	
	findText: function(str) {
		// if there is a match...
		if($(this.textarea).val().match(str, "i")) {
			
			// check if it is a repeat search
			if(this.currentSearch == str) {
				var nextMatchIndex = $(this.textarea).val().indexOf(str, this.currentSearchMatchIndex + 1);
				this.currentSearchMatchIndex = (nextMatchIndex < 0) ? $(this.textarea).val().indexOf(str, 1) : nextMatchIndex;
			} else {
				this.currentSearchMatchIndex = 0;
				this.currentSearch = str;
			}
			
			// set start of selection
			nextMatchIndex = $(this.textarea).val().indexOf(str, this.currentSearchMatchIndex + 1);
			var start = (nextMatchIndex < 0) ? $(this.textarea).val().indexOf(str, 1) : nextMatchIndex;
			
			// go to matching line
			this.gotoLine(String(this.findLineOfChar(start)));
			// select match
			this.selectRange(this.textarea, start, start + str.length);
		} else {
			
			/*
			*	Replace with something more elegant
			*/
			// highlight the fact there was no match
			alert('no match');
		}
	},
	
	findLineOfChar: function(charIndex) {
		var lineCount = 0;
		var lastFoundIndex = 0;
		while(lastFoundIndex < charIndex) {
			lastFoundIndex = $(this.textarea).val().indexOf('\n', lastFoundIndex + 1);
			lineCount++;
		}
		return lineCount;
	},
	
	setSaveState: function() {
		this.saveState = escape($(this.textarea).val());
		// save current line number
		
	},
	
	revertSaveState: function() {
		$(this.textarea).val(unescape(this.saveState));
		this.updateLineNumbers();
	}
};