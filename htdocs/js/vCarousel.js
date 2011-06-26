(function($){
	
	// ---------------------------------------- //
	// Variables
	
	var
	vCarousel,
	defaults = {
		pageItem:	4,			//Item amount per a page
		usePager:	true,		//Show or hide the page number
		duration:	450			//Time for switching animation (Msec)
	},
	prefix = 'vc';
	
	// ---------------------------------------- //
	// Helper function
	
	function $div(className) {
		var classSrc = className ? ' class="' + prefix + className + '"' : '';
		return $('<div' + classSrc + ' />');
	}
	
	// ---------------------------------------- //
	// Main function
	
	vCarousel = $.fn.vCarousel = function(options) {
		var opts = $.extend({}, vCarousel.defaults, options);
		
		return this.each(function() {
			var
			// Status
			totalItem = $(this).find('li').length,
			currentPage = 1,
			totalPage = Math.ceil(totalItem / opts.pageItem),
			buttonClickable = true,
			
			// DOM
			$this = $(this),
			$wrapper,
			$carousel,
			$inner,
			$page,
			$perv,
			$next,
			$pager;
			
			// Initialize
			initDOM();
			initEvent();
			
			function initDOM() {
				// Create carousel
				$inner = $this.wrap($div('Inner')).parent();
				$carousel = $inner.wrap($div('Carousel')).parent();
				$wrapper = $carousel.wrap($div('Wrapper')).parent();
				
				// Split list items
				$this.addClass(prefix + 'Page');
				var blanks = opts.pageItem * totalPage - totalItem;
				for (var i=0; i<blanks; i++) {
					$this.append('<li />');
				}
				if (totalPage <= 2) {
					$('li', $this).clone().appendTo($this);
				}
				for (;;) {
					if ($this.find('li').length <= opts.pageItem) break;
					temp = $this.find('li')
					.slice(opts.pageItem, opts.pageItem * 2)
					.appendTo($inner)
					.wrapAll('<ul />').parent()
					.addClass(prefix + 'Page');
				}
				
				// Attach buttons
				$prev = $div('Prev').text('prev').appendTo($wrapper);
				$next = $div('Next').text('next').appendTo($wrapper);
				if (totalPage == 1) {
					$prev.addClass('disabled');
					$next.addClass('disabled');
					buttonClickable = false;
				}
				
				// Attach pager
				if (opts.usePager) $pager = $div('Pager').appendTo($wrapper);;
				
				// Setup carousel
				$page = $('.' + prefix + 'Page', $carousel);
				$page.eq(-1).prependTo($inner);
				updatePage();
				$carousel.height($page.eq(1).outerHeight());
				$inner.css('margin-top', '-' + $page.eq(0).outerHeight() + 'px');
			}
			
			function initEvent() {
				//Perv button
				$prev.click(function() {
					if(!buttonClickable) return;
					currentPage += (currentPage > 1) ? -1 : -1 + totalPage;
					slidePage('up');
				});
				
				//Next button
				$next.click(function() {
					if(!buttonClickable) return;
					currentPage += (currentPage < totalPage) ? 1 : 1 - totalPage;
					slidePage('down');
				});
			}
			
			function slidePage(direction) {
				buttonClickable = false;
				var nextPage, slideDistance;
				switch (direction) {
					case 'up':
						nextPage = $page.eq(0);
						slideDistance = - $page.eq(0).outerHeight();
						break;
					case 'down':
						nextPage = $page.eq(2);
						slideDistance = $page.eq(1).outerHeight();
						break;
				}
				
				$carousel.animate({
					height : nextPage.outerHeight() + 'px'
				}, opts.duration, 'swing');
				
				$inner.animate({
					marginTop : parseInt($inner.css('margin-top')) - slideDistance + 'px'
				}, opts.duration, 'swing', 
				function() {
					switch (direction) {
						case 'up':
							$page.eq(-1).prependTo($inner);
							break;
						case 'down':
							$page.eq(0).appendTo($inner);
							break;
					}
					updatePage();
					$inner.css('margin-top', '-' + $page.eq(0).outerHeight() + 'px');
					buttonClickable = true;
				});
			}
			
			function updatePage() {
				$page = $('.' + prefix + 'Page', $carousel);
				if (opts.usePager) {
					$pager.text((totalPage == 1) ? 'page: 1' : 'page: ' + currentPage + ' / ' + totalPage);
				}
			}
		});
	};
	
	// ---------------------------------------- //
	// Initialize
	
	vCarousel.defaults = defaults;
	
})(jQuery);
