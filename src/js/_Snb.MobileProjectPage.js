/**
 * Navigation
 */
var exports = module.exports = {};

exports.initProjectPage = function() {
	$('#project-details .description-toggle a.show-website-description').on('click', function(e) {
        e.preventDefault();
        $('#project-details .description-toggle').removeClass('mobile').addClass('website');
    });
};


 