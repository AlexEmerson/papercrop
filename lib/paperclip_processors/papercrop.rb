require "paperclip"

module Paperclip
  class Papercrop < Thumbnail

    def transformation_command
      if crop_command
        #debugger if @options[:style] == :card
        crop_command + (keep_initial_crop? ? fix_initial_crop(super) : drop_initial_parameter(:crop, super))
      else
        super
      end
    end

    def keep_initial_crop?
      @target_geometry.modifier == '#'
    end

    def drop_initial_parameter(parameter, initial)
      initial.join(' ').sub(/ -#{parameter} \S+/, '').split(' ')
    end

    def fix_initial_crop(initial)
      width = @target_geometry.width.to_i
      height = @target_geometry.height.to_i
      initial[initial.index('-crop') + 1] = "#{width}x#{height}+0+0"
      initial[initial.index('-resize') + 1] = "#{width}x#{height}^^"

      %w(+repage -gravity center) + initial
    end

    def crop_command
      target = @attachment.instance

      if target.cropping?(@attachment.name)
        begin
          w = Integer(target.send :"#{@attachment.name}_crop_w")
          h = Integer(target.send :"#{@attachment.name}_crop_h")
          x = Integer(target.send :"#{@attachment.name}_crop_x")
          y = Integer(target.send :"#{@attachment.name}_crop_y")
          ["-crop", "#{w}x#{h}+#{x}+#{y}"]
        rescue Exception => e
          ::Papercrop.log("[papercrop] #{@attachment.name} crop w/h/x/y were non-integer. Error: #{e.to_s}")
          return 
        end
      end
    end
  end
end
