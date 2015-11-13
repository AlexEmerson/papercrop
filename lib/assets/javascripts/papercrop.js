(function ($) {
  window.jcrop_api = null;

  window.init_papercrop = function() {
    $("div[id$=_cropbox]").each(function() {

      var attachment = $(this).attr("id").replace("_cropbox", "");
      var preview    = !!$("#" + attachment + "_crop_preview").length;
      var aspect     = $("input#" + attachment + "_aspect").val();
      var width      = $(this).width();
      var orig_img   = $(this).children('img');

      if (aspect === 'false') {
        aspect = false
      }

      update_crop = function(coords) {
        var preview_width, rx, ry,
            orig_w = Math.round($("input[id$='_" + attachment + "_original_w']").val()),
            orig_h = Math.round($("input[id$='_" + attachment + "_original_h']").val());

            //recalculate aspect based on image actual size
            aspect = $(orig_img).width()/orig_w;
            $("#" + attachment + "_aspect").val(aspect);

        if (preview && aspect) {
          preview_width = $("#" + attachment + "_crop_preview_wrapper").width();

          rx = preview_width / coords.w;
          ry = preview_width / coords.h;

          $("img#" + attachment + "_crop_preview").css({
            width      : rx * orig_w + "px",
            height     : ry * orig_h/aspect + "px",
            marginLeft : "-" + Math.round(rx * coords.x) + "px",
            marginTop  : "-" + Math.round((ry * coords.y) / aspect) + "px"
          });
        }

        $("#" + attachment + "_crop_x").val(Math.round(coords.x / aspect));
        $("#" + attachment + "_crop_y").val(Math.round(coords.y / aspect));
        $("#" + attachment + "_crop_w").val(Math.round(coords.w / aspect));
        $("#" + attachment + "_crop_h").val(Math.round(coords.h / aspect));
      };

      $(this).find("img").Jcrop({
        onChange    : update_crop,
        onSelect    : update_crop,
        setSelect   : [0, 0, 250, 250],
        aspectRatio : aspect === false ? undefined : aspect,
        boxWidth    : $("input[id$='_" + attachment + "_box_w']").val()
      }, function() {
        jcrop_api = this;
      });
    });
  };

  $(document).ready(function() {
    init_papercrop();
  });

}(jQuery));
