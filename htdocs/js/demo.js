(function($){
	
	$(function(){
		$('ul#carousel01').vCarousel();
		$('ul#carousel02').vCarousel({
			pageItem: 3,
			usePager: false,
			duration: 450
		});
	});
	
})(jQuery);
