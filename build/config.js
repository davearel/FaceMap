// Add your custom task options here...
config.init({

  lint: {
    files: ["build/config.js", "app/modules/*.js"]
  },

  concat: {

    // The core library files
    "dist/debug/js/libs.js": [
      "assets/js/libs/jquery.js",
      "assets/js/libs/underscore.js",
      "assets/js/libs/backbone.js"
    ],

    // Application files
    "dist/debug/js/app.js": ["app/*.js", "app/modules/*.js"],

    // Your CSS
    "dist/debug/css/style.css": ["assets/css/*.css"]
  },
  
  jst: {
    "dist/debug/js/templates.js": ["app/templates/*.html"]
  },

  min: {
    "dist/release/js/libs.js": ["dist/debug/js/libs.js"],
    "dist/release/js/app.js": ["dist/debug/js/app.js"],
    "dist/release/js/templates.js": ["dist/debug/js/templates.js"]
  },

  mincss: {
    "dist/release/css/style.css": ["dist/debug/css/style.css"]
  },

  watch: {
    files: ["assets/**/*", "app/**/*"],
    tasks: "lint:files concat jst"
  }

});

// Run the following tasks...
task.registerTask("default", "lint:files concat jst min mincss");
