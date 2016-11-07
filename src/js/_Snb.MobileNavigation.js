/**
 * Navigation
 */
var exports = module.exports = {};

exports.initNavigation = function() {
	$(".slidenav ul").append('<li class="odd"><a href="/?disable_mobile_redirect=1">View Full Website</a></li>');
	$("li#mobile_bottom_menu a").bind("click", function(){
		//$(".slidenav").toggle( "slide" );
		$(".slidenav").slideToggle();
	});
	$(window).resize(function() {
		slidenav_fix();
	});
  
	slidenav_fix();
};



function slidenav_fix(){
	if($(window).height() < 400){
		$(".slidenav ").css("height", "280px").css("overflow", "auto");
	}else{
		$(".slidenav ").css("height", "").css("overflow", "");
	}
}