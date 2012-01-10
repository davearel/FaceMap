// ============================================================================
// TASKS
// ============================================================================

task.registerTask("jst", "Compile underscore templates to JST file", function(name) {
  if (!name) {
    // An argument wasn't passed. Run this task once for each concat sub-prop.
    return task.runAllProps("jst");
  }

  // Any name with a possible "." has to be escaped!
  var propname = "jst." + config.escape(name);
  // If namespace is specified use that, otherwise fallback
  var namespace = config("jst.namespace") || "JST";
  // If template settings are available use those
  var templateSettings = config("jst.templateSettings") || null;

  // Fail if any required config properties have been omitted.
  config.requires(propname);

  // Create JST file.
  var errorcount = fail.errorcount;
  var files = file.expand(config(propname));
  file.write(name, task.helper('jst', files, namespace, templateSettings));

  // Fail task if there were errors.
  if (fail.errorcount > errorcount) { return false; }

  // Otherwise, print a success message.
  log.writeln("File \"" + name + "\" created.");
});

// ============================================================================
// HELPERS
// ============================================================================

task.registerHelper("jst", function(files, namespace, templateSettings) {
  // Pulled from underscore 1.2.4
  function underscoreTemplating(str) {
      // Merge in the templateSettings that may be passed
      var c  = _.extend({}, _.templateSettings, templateSettings) ||
        _.templateSettings;

      var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
        'with(obj||{}){__p.push(\'' +
        str.replace(/\\/g, '\\\\')
           .replace(/'/g, "\\'")
           .replace(c.escape || noMatch, function(match, code) {
             return "',_.escape(" + code.replace(/\\'/g, "'") + "),'";
           })
           .replace(c.interpolate || noMatch, function(match, code) {
             return "'," + code.replace(/\\'/g, "'") + ",'";
           })
           .replace(c.evaluate || noMatch, function(match, code) {
             return "');" + code.replace(/\\'/g, "'")
                                .replace(/[\r\n\t]/g, ' ')
                                .replace(/\\\\/g, '\\') + ";__p.push('";
           })
           .replace(/\r/g, '\\r')
           .replace(/\n/g, '\\n')
           .replace(/\t/g, '\\t')
           + "');}return __p.join('');";

      return new Function('obj', '_', tmpl).toString();
  };

  namespace = "this['" + namespace + "']";

  // Comes out looking like this["JST"] = this["JST"] || {};
  var contents = namespace + " = " + namespace + " || {};\n\n";

  // Compile the template and get the function source
  contents += files ? files.map(function(filepath) {
    var templateFunction = [
      "function(data) { ",

        "return ",
        underscoreTemplating(file.read(filepath)).replace("anonymous", ""),

      "};"].join("");

    return namespace + "['" + filepath + "'] = " + templateFunction;
  }).join("\n\n") : "";

  return contents;
});
