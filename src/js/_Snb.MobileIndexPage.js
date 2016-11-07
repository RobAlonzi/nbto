/**
 * Navigation
 */
var exports = module.exports = {};

exports.initIndexPage = function() {
	//-------------------
	$("#nav_artist_alpha ul li a").bind("click", function(){
		$("#nav_artist_alpha ul li a").removeClass("selected");
		$(this).addClass("selected");
		alphaartist_hideall();
		alphaartist_show($(this).parent().index());
		//alert($(this).parent().index());
	});
	$(".nav_artist_alpha ul li a").bind("click", function(){
		$(".nav_artist_alpha ul li a").removeClass("selected");
		var myobj = $(this).parent();
		var myobj_parent = $(this).parent().parent();
		var myindex = myobj.index();
		//$(".nav_artist_alpha ul li").eq(myindex).children("a").addClass("selected");
		$(".nav_artist_alpha ul").each(function(newindex){
                    $(this).children("li").eq(myindex).children("a").addClass("selected");
                });
		//$(this).addClass("selected");
		alphaartist_hideall();
		alphaartist_show(myindex);
		//alert($(this).parent().index());
	});

	alphaartist_hideall();
	$(".nav_artist_alpha ul li a").removeClass("selected");
	//$("#nav_artist_alpha ul li a").removeClass("selected");
	$(".nav_artist_alpha ul").each(function(newindex){
		$(this).children("li").eq(0).children("a").addClass("selected");
	});
	//$("#nav_artist_alpha ul li").eq(0).children("a").addClass("selected");
	alphaartist_show(0);
};



function alphaartist_show(myindex){
switch(myindex){
		case 0:
			$(".project-list .cat_A").show(); $(".project-list .cat_B").show(); $(".project-list .cat_C").show(); $(".project-list .cat_D").show();
			break;
		case 1:
			$(".project-list .cat_E").show(); $(".project-list .cat_F").show(); $(".project-list .cat_G").show(); $(".project-list .cat_H").show();
			break;
		case 2:
			$(".project-list .cat_I").show(); $(".project-list .cat_J").show(); $(".project-list .cat_K").show(); $(".project-list .cat_L").show();
			break;
		case 3:
			$(".project-list .cat_M").show(); $(".project-list .cat_N").show(); $(".project-list .cat_O").show(); $(".project-list .cat_P").show();
			break;
		case 4:
			$(".project-list .cat_Q").show(); $(".project-list .cat_R").show(); $(".project-list .cat_S").show(); $(".project-list .cat_T").show();
			break;
		case 5:
			$(".project-list .cat_U").show(); $(".project-list .cat_V").show();
			$(".project-list .cat_W").show(); $(".project-list .cat_X").show(); $(".project-list .cat_Y").show(); $(".project-list .cat_Z").show();
			break;
	}
	$(".project-list li:visible").css({background: "#EEE"})
    $(".project-list li:visible:odd").css({background: "#FFF"})

}

function alphaartist_hideall(){
			$(".project-list .cat_A").hide(); $(".project-list .cat_B").hide(); $(".project-list .cat_C").hide(); $(".project-list .cat_D").hide();
			$(".project-list .cat_E").hide(); $(".project-list .cat_F").hide(); $(".project-list .cat_G").hide(); $(".project-list .cat_H").hide();
			$(".project-list .cat_I").hide(); $(".project-list .cat_J").hide(); $(".project-list .cat_K").hide(); $(".project-list .cat_L").hide();
			$(".project-list .cat_M").hide(); $(".project-list .cat_N").hide(); $(".project-list .cat_O").hide(); $(".project-list .cat_P").hide();
			$(".project-list .cat_Q").hide(); $(".project-list .cat_R").hide(); $(".project-list .cat_S").hide(); $(".project-list .cat_T").hide();
			$(".project-list .cat_U").hide(); $(".project-list .cat_V").hide();
			$(".project-list .cat_W").hide(); $(".project-list .cat_X").hide(); $(".project-list .cat_Y").hide(); $(".project-list .cat_Z").hide();
}