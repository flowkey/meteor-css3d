Package.describe({
    name: "ephemer:css3d",
    version: "0.0.16",
    summary:
        "Thin & performant abstraction for transforming, dragging, and resizing elements using CSS3 matrices",
    git: "https://github.com/flowkey/meteor-css3d.git",
    documentation: "README.md",
});

Package.onUse(function(api) {
    api.versionsFrom("1.2");

    // adding jquery here, also breaks velocity.js being correctly loaded
    api.use(["ecmascript", "underscore"], "client");

    api.addFiles(["css3d.js", "css3d-simple-resize.js", "css3d-simple-drag.js"], "client");
    api.export("css3d", "client");
});
