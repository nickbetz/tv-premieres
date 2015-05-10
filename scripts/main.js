$(document).ready(function(){
    $('.sort-toggle').click(function(){
        $(this).toggleClass('expanded');
        $('.sortbar-container').slideToggle("slow","swing");
    });
});