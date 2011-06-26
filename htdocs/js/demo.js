(function($){
	
	$(function(){
		$('ul#carousel01').vCarousel();
		$('ul#carousel02').vCarousel({
			pageItem: 4,
			usePager: true,
			duration: 450
		});
	});
	
})(jQuery);
