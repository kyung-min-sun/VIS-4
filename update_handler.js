import {GeometryParser, TempParser, OutputWriter} from './readers.js';

// handles all controllers, regularly checks for updates
export class ControlHandler {
  constructor() {
    let control_list = [];

    // checks if controllers are loaded
    this.all_loaded = function () {
      return control_list.length;
    }

    // adds to queue of controllers
    this.add = function (controller) {
      control_list.push(controller);
    };

    // checks for user inputs
    this.update_controls = function () {
      for(const control of control_list) {
        control.check_update();
      }
    };

    // exports changes in global extrema to controls
    this.adjust_extrema = function (min, max) {
      if(min == null || max == null) { return; }

      for(const control of control_list) {
        if('new_extrema' in control) {
          control.new_extrema(min, max);
        }
      }

    };

    // exports new data to controllers
    this.adjust_data = function (display_data, frame_count) {
      if(display_data == null || frame_count == null) { return; }

      for(const control of control_list) {
        if('new_data' in control) {
          control.new_data(display_data, frame_count);
        }
      }
    };

    // calls on controllers with opacity element
    this.adjust_opacity = function () {
      for(const control of control_list) {
        if('new_opacity' in control) {
          control.new_opacity();
        }
      }
    };

    // calls on controllers with color element
    this.adjust_color = function () {
      for(const control of control_list) {
        if('new_color' in control) {
          control.new_color();
        }
      }
    };

    // pauses controllers with "pause" element
    this.pause = function() {
      for(const control of control_list) {
        if('pause' in control) {
          control.pause();
        }
      }
    };

    // exports new color gradient across controllers
    this.adjust_gradient = function (hex_color_array) {
      for(const control of control_list) {
        if('new_gradient' in control) {
          control.new_gradient(hex_color_array);
        }
      }
    };
  }
};

// handles all file inputs
export class FileHandler {
  constructor(scene, vertex_data,
              file_input,
              output_link, output_file_button,
              pt_display) {

    let object = new Object();
    let color = new Object();
    let position = new Object();
    let alpha = new Object();

    let geo_reader = new Object();
    let temp_reader = new Object();
    let output_writer = new Object();

    // initalize geometry reader
    geo_reader.parser = new GeometryParser(scene, vertex_data,
                                           object, color, position, alpha,
                                           temp_reader, output_writer,
                                           output_link);
    temp_reader.parser = null;
    output_writer.parser = null;

    let processed = new Set();

    // extensiosn for geometry and temperature files
    let geo_exts = ['stl', 'pt'];
    let temp_exts = ['frm'];

    this.load_files = function () {

      let geo_files = [];
      let frm_files = [];

      for(const file of file_input.files) {

        if(!file || processed.has(file)) { continue; }

        let exts = get_exts(file.name);

        for(const ext of exts) {

          if(geo_exts.includes(ext)) {
            geo_files.push(file);
            break;
          }

          else if(frm_exts.includes(ext)) {
            frm_files.push(file);
            break;
          }


        }

      }

      if(!processed.size && frm_files.length && !geo_files.length) {
        file_input.files = [];
        return alert('Load Geometry File First');
      }

      for(const file of geo_files) {
        // check if valid file or if we've already processed it
        if(temp_reader.parser != null) { break; }

        // adjust display based on stl or pt cloud file
        if(get_exts(file.name).includes('stl')) { adjust_stl('stl'); }

        else { adjust_stl('pt'); }

        // send file through geometry parser
        geo_reader.parser.readAsArrayBuffer(file);

        // add to processed
        processed.add(file);

      }

      for(const file of frm_files) {

        if(temp_reader.parser == null) { break; }

        // send file through temperature parser
        temp_reader.parser.readAsArrayBuffer(file);

        // add to processed
        processed.add(file);

      }



    };

    function get_exts(filename) {
			let exts = filename.split('.');
			exts.shift();
			return exts;
		};

    function adjust_stl(ext) {
      // display point size only when not stl
      if(ext == 'stl') {
        geo_reader.parser.is_stl = true;
        pt_display.style.display = 'none';
      }
      else {
        geo_reader.parser.is_stl = false;
        pt_display.style.display = 'block';
      }
    };

    this.is_stl = function () {
      return geo_reader.parser._is_stl;
    };

    this.all_loaded = function () {
      return (output_writer.writer != null);
    };

    output_file_button.onclick = function () {
      output_file();
    };


    function output_file () {
      // call output writer to turn on link
      output_link.href = output_writer.writer.generate_link();
      // display the link
      output_link.style.display = 'block';
      output_link.download = 'output.txt';
    };

    // getters for all attributes

    this.get_color_attribute = function () {
      return color.attribute;
    }

    this.get_position_attribute = function () {
      return position.attribute;
    }

    this.get_bounding_box = function () {
      return object.geometry.boundingBox;
    }

    this.get_bounding_sphere = function () {
      return object.geometry.boundingSphere;
    }

    this.get_alpha_attribute = function () {
      return alpha.attribute;
    }

    this.get_point_size = function () {
      return object.material.uniforms.pt_size;
    }

    this.get_object_rotation = function () {
      let rotations = [];
      for(const obj of scene.children) {
        if('rotation' in obj) {
          rotations.push(obj.rotation);
        }
      }
      return rotations;
    }


  }
}
