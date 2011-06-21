$(function(){
	$('div.vCarouselWrapper:eq(0)').vCarousel();
	$('div.vCarouselWrapper:eq(1)').vCarousel({
		effect: 'fade'
	});
	$('div.vCarouselWrapper:eq(2)').vCarousel({
		pageItem: 3,
		usePager: false,
		effect: 'slide',
		duration: 200
	});
	
/*	function animal(){
		var _this = this;
		_this.name = 'cat';
		$.extend(_this,{
			sleep: function(){
				alert('zzz');
			}
		});
	}
	var tom = new animal();
	alert(tom.name);
	tom.sleep();*/
	
});