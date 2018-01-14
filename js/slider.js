$(function() {

  var ul = $(".slider ul");
  var slide_count = ul.children().length;
  var slide_width_pc = 100.0 / slide_count;
  var slide_index = 0;

  var first_slide = ul.find("li:first-child");
  var last_slide = ul.find("li:last-child");

  // Clone the last slide and add as first li element
  last_slide.clone().prependTo(ul);

  // Clone the first slide and add as last li element
  first_slide.clone().appendTo(ul);

  ul.find("li").each(function(indx) {
    var left_percent = (slide_width_pc * indx) + "%";
    $(this).css({"left":left_percent});
    $(this).css({width:(100 / slide_count) + "%"});
  });

  ul.css("margin-left", "-100%");

  // Listen for click of prev button
  $(".slider .prev").click(function() {
    console.log("prev button clicked");
    slide(slide_index - 1);
  });

  // Listen for click of next button
  $(".slider .next").click(function() {
    console.log("next button clicked");
    slide(slide_index + 1);
  });

  function slide(new_slide_index) {

    var margin_left_pc = (new_slide_index * (-100) - 100) + "%";

    ul.animate({"margin-left": margin_left_pc}, 500, function() {

      // If new slide is before first slide...
      if(new_slide_index < 0) {
        ul.css("margin-left", ((slide_count) * (-100)) + "%");
        new_slide_index = slide_count - 1;
      }
      // If new slide is after last slide...
      else if(new_slide_index >= slide_count) {
        ul.css("margin-left", "-100%");
        new_slide_index = 0;
      }

      slide_index = new_slide_index;

    });

  }

});


