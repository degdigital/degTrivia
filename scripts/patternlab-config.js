module.exports = {
  "cacheBust": true,
  "cleanPublic" : true,
  "defaultPattern": "all",
  "defaultShowPatternInfo": false,
  "ishControlsHide": {
    "s": false,
    "m": false,
    "l": false,
    "full": false,
    "random": false,
    "disco": false,
    "hay": true,
    "mqs": false,
    "find": false,
    "views-all": false,
    "views-annotations": false,
    "views-code": false,
    "views-new": false,
    "tools-all": false,
    "tools-docs": false
  },
  "ishViewportRange": {
    "s": [240, 500],
    "m": [500, 800],
    "l": [800, 2600]
  },
  "logLevel": "info",
  "outputFileSuffixes": {
    "rendered": ".rendered",
    "rawTemplate": "",
    "markupOnly": ".markup-only"
  },
  "paths" : {
    "source" : {
      "root": "./source/",
      "patterns" : "./source/_patterns/",
      "data" : "./source/_data/",
      "meta": "./source/_meta/",
      "annotations" : "./source/_annotations/",
      "styleguide" : "./node_modules/@pattern-lab/styleguidekit-assets-default/dist/",
      "patternlabFiles" : {
        "general-header": "./node_modules/@pattern-lab/styleguidekit-mustache-default/views/partials/general-header.mustache",
        "general-footer": "./node_modules/@pattern-lab/styleguidekit-mustache-default/views/partials/general-footer.mustache",
        "patternSection": "./node_modules/@pattern-lab/styleguidekit-mustache-default/views/partials/patternSection.mustache",
        "patternSectionSubtype": "./node_modules/@pattern-lab/styleguidekit-mustache-default/views/partials/patternSectionSubtype.mustache",
        "viewall": "./node_modules/@pattern-lab/styleguidekit-mustache-default/views/viewall.mustache"
      }
    },
    "public" : {
      "root" : "./patternlab/",
      "patterns" : "./patternlab/patterns/",
      "data" : "./patternlab/styleguide/data/",
      "annotations" : "./patternlab/annotations/",
      "styleguide" : "./patternlab/styleguide/"
    }
  },
  "patternExtension": "mustache",
  "patternStateCascade": ["inprogress", "inreview", "complete"],
  "patternExportDirectory": "./pattern_exports/",
  "patternExportPatternPartials": [],
  "serverOptions": {
    "wait": 1000
  },
  "starterkitSubDir": "dist",
  "styleGuideExcludes": [
  ],
  "theme": {
    "color": "dark",
    "density": "compact",
    "layout": "horizontal"
  }
};