/**
 * List
 */
var exports = module.exports = {};
exports.initList = () => {
     $('.filtered-list-wrapper .filters .dropdown-select').on('click', function() {
            var $wrapper = $(this).closest('.filtered-list-wrapper');

            console.log(this);

            $(this).toggleClass('open');
            if ($(this).hasClass('open')) {
                $('.filters .dropdown', $wrapper).show();
            } else {
                $('.filters .dropdown', $wrapper).hide();
            }
        });
        $('.filtered-list-wrapper .filters .dropdown').on('change', '.filter-item input', function(e) {
            var $wrapper = $(this).closest('.filtered-list-wrapper');
            var visible = $(this).prop('checked');
            var value = $(this).val();
            if (isViewAll(this)) {
                if (visible === true) {
                    $('.filters .dropdown .filter-item input', $wrapper).prop('checked', false);
                }
                $(this).prop('checked', true);
            } else {
                if ($('.filters .dropdown .filter-item input:checked', $wrapper).length) {
                    $('.filters .dropdown .filter-item input.view-all', $wrapper).prop('checked', false);
                } else {
                    $('.filters .dropdown .filter-item input.view-all', $wrapper).prop('checked', true);
                }
            }
            updateFilters($wrapper);
        });
};


   
function updateFilters($wrapper) {
	var labels = [];
        $('ul.project-list li', $wrapper).hide();
        $('.filters .dropdown .filter-item input:checked', $wrapper).each(function() {
            labels.push($(this).parent().find('span.label').text());
            if ($(this).val() !== '') {
                var val = $(this).val();
                $('ul.project-list li', $wrapper).each(function() {
                    if ($(this).hasClass(val) === true) {
                        $(this).show();
                    }	
                });
            }
	});
	if ($("input.view-all:checked",$wrapper).size() == 1) {
		 $('ul.project-list li', $wrapper).show();	
	}

    var c = 'odd';
    $('ul.project-list li:visible', $wrapper).removeClass('odd even').each(function() {
        $(this).addClass(c);
        if (c == 'odd') {
            c = 'even';
        } else {
            c = 'odd';
        }
    });
    $('.filtered-by', $wrapper).text(labels.join(', '));
}


function isViewAll(checkbox) {
	return $(checkbox).hasClass('view-all');
}






