(function($){
	function vCarousel(object,options){
		var _this = this;
		
		$.extend(_this,{
			init: function(){
				_this.$carousel = object;
				_this.conf = options;
				_this.currentPage = 1;
				_this.totalPage = Math.ceil(_this.$carousel.find('ul.pageSet li').length / _this.conf.pageItem);
				_this.buttonClickable = true;
			},
			
			initCarousel: function(){
				//Initialize
				_this.$carousel.find('ul.pageSet').addClass('pageSetWrapper');
				if(_this.conf.effect == 'slide') _this.conf.duration = _this.conf.duration * _this.conf.pageItem;
				
				//Arrange list items
				var blankItem = _this.conf.pageItem * _this.totalPage - _this.$carousel.find('ul.pageSetWrapper li').length;
				for(var i=0; i<blankItem; i++) {
					_this.$carousel.find('ul.pageSetWrapper').append('<li></li>');
				}
				for(var i=0; i<_this.totalPage; i++){
					_this.$carousel.find('ul.pageSetWrapper li')
						.slice(0, _this.conf.pageItem)
						.appendTo(_this.$carousel.find('div.vCarouselInner'))
						.wrapAll('<ul class="pageSet"></ul>');
				}
				_this.$carousel.find('ul.pageSetWrapper').remove();
				
				//Exceptions
				switch(_this.totalPage){
					case 1:
						_this.$carousel.find('ul.pageSet').clone().appendTo(_this.$carousel.find('div.vCarouselInner'));
						_this.$carousel.find('li.nextButton, li.prevButton').hide();
						break;
					case 2:
						_this.$carousel.find('ul.pageSet').clone().appendTo(_this.$carousel.find('div.vCarouselInner'));
						break;
				}
				
				//Setup carousel
				_this.$carousel.find('ul.pageSet:last').prependTo(_this.$carousel.find('div.vCarouselInner'));
				_this.$carousel.find('div.vCarousel')
					.height(_this.$carousel.find('ul.pageSet:eq(1)').outerHeight())
					.find('div.vCarouselInner')
						.css('margin-top','-'+_this.$carousel.find('ul.pageSet:first').outerHeight()+'px');
				
				if (_this.conf.usePager) _this.$carousel.find('div.vCarousel').before('<div class="vCarouselPager"></div>');
				_this.updatePager();
			},
			
			initEvent: function(){
				var _this = this;
				
				//Perv button
				_this.$carousel.find('li.prevButton').click(function(){
					if(!_this.buttonClickable) return;
					_this.switchPage('up');
					_this.currentPage--;
					if(_this.currentPage <= 0) _this.currentPage += _this.totalPage;
					_this.updatePager();
				});
				
				//Next button
				_this.$carousel.find('li.nextButton').click(function(){
					if(!_this.buttonClickable) return;
					_this.switchPage('down');
					_this.currentPage++;
					if(_this.currentPage > _this.totalPage) _this.currentPage -= _this.totalPage;
					_this.updatePager();
				});
			},
			
			switchPage: function(direction){
				var _this = this;
				
				_this.buttonClickable = false;
				var nextPage, nextPageHeight, slideDistance;
				switch(direction){
					case 'up':
						nextPage = _this.$carousel.find('ul.pageSet:eq(0)');
						nextPageHeight = nextPage.outerHeight();
						slideDistance = -_this.$carousel.find('ul.pageSet:eq(0)').outerHeight();
						break;
					case 'down':
					default:
						nextPage = _this.$carousel.find('ul.pageSet:eq(2)');
						nextPageHeight = nextPage.outerHeight();
						slideDistance = _this.$carousel.find('ul.pageSet:eq(1)').outerHeight();
						break;
				}
				
				_this.$carousel.find('div.vCarousel').animate({
					height : parseInt(nextPageHeight + 'px')
				}, _this.conf.duration, 'swing');
				
				switch(_this.conf.effect){
					//Slide effect
					case 'slide':
						_this.$carousel.find('div.vCarouselInner').animate({
							marginTop : parseInt(_this.$carousel.find('div.vCarouselInner').css('margin-top')) - slideDistance + 'px'
						}, _this.conf.duration, 'swing', 
						function(){
							switch (direction){
								case 'up':
									_this.$carousel.find('ul.pageSet:last').prependTo(_this.$carousel.find('div.vCarouselInner'));
									break;
								case 'down':
								default:
									_this.$carousel.find('ul.pageSet:first').appendTo(_this.$carousel.find('div.vCarouselInner'));
									break;
							}
							_this.$carousel.find('div.vCarouselInner').css('margin-top', '-' + _this.$carousel.find('ul.pageSet:first').outerHeight() + 'px');
							_this.buttonClickable = true;
						});
						break;
					
					//Fade effect
					case 'fade':
					default:
						nextClone = nextPage.clone()
							.css({
								position: 'absolute',
								top: '0',
								left: '0',
								zIndex: '1'
							})
							.find('li').css({visibility:'hidden',opacity:'0'})		//Set both properties not to blink in IE
								.end()
							.appendTo(_this.$carousel.find('div.vCarouselInner'));
						_this.$carousel.find('ul.pageSet:eq(2)').css('visibility','hidden');
						for(var i=0; i<nextClone.find('li').length; i++){
							switch (direction){
								case 'up': var j = i; break;
								case 'down': default: var j = nextClone.find('li').length - 1 - i; break;
							}
							if(i != nextClone.find('li').length - 1){
								(function(arg){
									setTimeout(function(){
										nextClone.find('li').eq(arg).css('visibility','visible').fadeTo(_this.conf.duration,1);
									}, _this.conf.duration / 2 * i);
								})(j);
							}
							else {
								(function(arg){
									setTimeout(function(){
										nextClone.find('li').eq(arg).css('visibility','visible').fadeTo(_this.conf.duration,1,
										function(){
											_this.$carousel.find('div.vCarouselInner').css('margin-top', parseInt(_this.$carousel.find('div.vCarouselInner').css('margin-top')) - slideDistance + 'px');
											_this.$carousel.find('ul.pageSet:eq(2)').css('visibility','visible');
											nextClone.remove();
											switch (direction){
												case 'up':
													_this.$carousel.find('ul.pageSet:last').prependTo(_this.$carousel.find('div.vCarouselInner'));
													break;
												case 'down':
												default:
													_this.$carousel.find('ul.pageSet:first').appendTo(_this.$carousel.find('div.vCarouselInner'));
													break;
											}
											_this.$carousel.find('div.vCarouselInner').css('margin-top', '-' + _this.$carousel.find('ul.pageSet:first').outerHeight() + 'px');
											_this.buttonClickable = true;
										});
									}, _this.conf.duration/2*i);
								})(j);
							}
						}
						break;
				}
			},
			
			updatePager: function(){
				if (!_this.conf.usePager) return;
				var pagerText = (_this.totalPage == 1)? 'page: 1' : 'page: '+_this.currentPage+' / '+_this.totalPage;
				_this.$carousel.find('div.vCarouselPager').text(pagerText);
			}
		});
	}
	
	$.fn.vCarousel = function(options){
		options = $.extend({
			pageItem:	4,			//Item amount per a page
			usePager:	true,		//Show or hide the page number
			effect:		'slide',	//Use 'slide' or 'fade' effect
			duration:	100			//Time for switching animation (Msec)
		},options);
		return this.each(function(){
			var carousel = new vCarousel($(this),options);
			carousel.init();
			carousel.initCarousel();
			carousel.initEvent();
		});
	};
	
})(jQuery);
