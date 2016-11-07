/** The Gallery functionality
 * @module Gallery
 * @requires slick
 * @see {@link http://kenwheeler.github.io/slick/|Slick Slider} for documentation.
 */

require("slick");

var exports = module.exports = {};


/** 
* <p>Init the functionality required for the ProgramPage.</p>
* @fires rendergallery
*/
exports.initGallery = function() {	
	rendergallery(); 
};


/** 
* <p>Sets up the two gallery's needed with slick (Homepage main slider and home page gallery tile)</p>
*/
function rendergallery() {
    $('#homepageGallery').on('init', function(slick){
      $(this).children('.slick-list').first().removeAttr('aria-live');
    });

	$('#slickimage').slick({
		accessibility: true,
        arrows: true,
        infinite: true,
        speed: 1,    
        draggable: false,
        autoplay: false, 
        lazyLoad: 'ondemand',
        autoplaySpeed: 5000	
    });

     $('#homepageGallery').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      infinite: true,    
      fade: true,
      cssEase: 'linear',
      speed:500,      
      accessibility: true,
      draggable: false,
      swipe: false,
      touchMove: false,
      zIndex: 0
    });

    $('#homepageGallery').slick('slickPlay');

     $("#playPauseHomeRotator").click(function() {
        playPauseSlick($(this));
        return false;
     });

    // hide pause button if only one slide
    if ($("#homepage_hero img").size() < 2) {$("div#playPauseHome").hide()}

}
 

/** 
  Play/Pause functionality for the slick slider for the home page (for accessibility)
*/
function playPauseSlick(obj){
    obj = $('i', obj);
    
    if(obj.hasClass("ion-pause")){
        $('#homepageGallery').slick('slickPause');
        obj.removeClass('ion-pause')
        obj.addClass('ion-play');
        obj.attr("title", 'Play the image rotator.');

    }else if(obj.hasClass("ion-play")){
        $('#homepageGallery').slick('slickPlay');
        obj.removeClass('ion-play')
        obj.addClass('ion-pause');
        obj.attr("title", 'Pause the image rotator.');
    }

    return false;
}