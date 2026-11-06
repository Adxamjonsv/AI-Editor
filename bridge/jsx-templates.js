// jsx-templates.js - ExtendScript generator for Adobe After Effects
const fs = require('fs');
const path = require('path');

class JSXTemplates {
  static createComposition(name = "AI_Comp", width = 1920, height = 1080, fps = 30, duration = 5) {
    return `
      (function() {
        try {
          app.beginUndoGroup("AI Studio - Create Comp");
          var comp = app.project.items.addComp("${name}", ${width}, ${height}, 1, ${duration}, ${fps});
          comp.openInViewer();
          app.endUndoGroup();
          return JSON.stringify({ success: true, compName: comp.name, width: comp.width, height: comp.height, duration: comp.duration });
        } catch(e) {
          return JSON.stringify({ success: false, error: e.toString() });
        }
      })();
    `;
  }

  static addSolid(name = "Background", color = [0.05, 0.05, 0.1], width = 1920, height = 1080, duration = 5) {
    return `
      (function() {
        try {
          var comp = app.project.activeItem;
          if (!comp || !(comp instanceof CompItem)) {
            return JSON.stringify({ success: false, error: "No active composition found" });
          }
          app.beginUndoGroup("AI Studio - Add Solid");
          var solid = comp.layers.addSolid([${color.join(',')}], "${name}", ${width}, ${height}, 1, ${duration});
          app.endUndoGroup();
          return JSON.stringify({ success: true, layerName: solid.name, layerIndex: solid.index });
        } catch(e) {
          return JSON.stringify({ success: false, error: e.toString() });
        }
      })();
    `;
  }

  static addText(text = "AI STUDIO", fontSize = 100, fontColor = [1, 0.85, 0.3], position = [960, 540]) {
    return `
      (function() {
        try {
          var comp = app.project.activeItem;
          if (!comp || !(comp instanceof CompItem)) {
            return JSON.stringify({ success: false, error: "No active composition found" });
          }
          app.beginUndoGroup("AI Studio - Add Text");
          var textLayer = comp.layers.addText("${text}");
          var textProp = textLayer.property("Source Text");
          var textDoc = textProp.value;
          textDoc.fontSize = ${fontSize};
          textDoc.fillColor = [${fontColor.join(',')}];
          textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
          textProp.setValue(textDoc);
          
          textLayer.property("Position").setValue([${position.join(',')}]);
          app.endUndoGroup();
          return JSON.stringify({ success: true, layerName: textLayer.name, layerIndex: textLayer.index });
        } catch(e) {
          return JSON.stringify({ success: false, error: e.toString() });
        }
      })();
    `;
  }

  static setup3DScene() {
    return `
      (function() {
        try {
          var comp = app.project.activeItem;
          if (!comp || !(comp instanceof CompItem)) {
            return JSON.stringify({ success: false, error: "No active composition found" });
          }
          app.beginUndoGroup("AI Studio - Setup 3D Scene");
          
          for (var i = 1; i <= comp.numLayers; i++) {
            var l = comp.layer(i);
            if (!(l instanceof CameraLayer) && !(l instanceof LightLayer)) {
              l.threeDLayer = true;
            }
          }

          var cam = comp.layers.addCamera("AI 3D Camera", [comp.width / 2, comp.height / 2]);
          cam.property("Position").setValue([comp.width / 2, comp.height / 2, -1500]);
          
          var camPos = cam.property("Position");
          camPos.setValueAtTime(0, [comp.width / 2, comp.height / 2, -2200]);
          camPos.setValueAtTime(comp.duration, [comp.width / 2, comp.height / 2, -1200]);

          var light = comp.layers.addLight("Golden Light", [comp.width / 2, comp.height / 2]);
          light.lightType = LightType.POINT;
          light.property("Color").setValue([1.0, 0.85, 0.4]);
          light.property("Intensity").setValue(120);
          light.property("Position").setValue([comp.width / 2 - 300, comp.height / 2 - 400, -800]);

          app.endUndoGroup();
          return JSON.stringify({ success: true, message: "3D Camera and Golden Lighting applied" });
        } catch(e) {
          return JSON.stringify({ success: false, error: e.toString() });
        }
      })();
    `;
  }

  static applyGlowAndParticles() {
    return `
      (function() {
        try {
          var comp = app.project.activeItem;
          if (!comp || !(comp instanceof CompItem)) {
            return JSON.stringify({ success: false, error: "No active composition found" });
          }
          app.beginUndoGroup("AI Studio - Glow & Effects");

          var adj = comp.layers.addSolid([1,1,1], "Color Grading & Glow", comp.width, comp.height, 1, comp.duration);
          adj.adjustmentLayer = true;

          try {
            var glow = adj.Effects.addProperty("ADBE Glow");
            if (glow) {
              glow.property("Glow Radius").setValue(45);
              glow.property("Glow Intensity").setValue(0.8);
            }
          } catch(err) {}

          app.endUndoGroup();
          return JSON.stringify({ success: true, message: "Glow and grading layers added" });
        } catch(e) {
          return JSON.stringify({ success: false, error: e.toString() });
        }
      })();
    `;
  }

  static getProjectInfo() {
    return `
      (function() {
        try {
          var proj = app.project;
          var activeComp = proj.activeItem;
          var comps = [];
          for (var i = 1; i <= proj.numItems; i++) {
            if (proj.item(i) instanceof CompItem) {
              comps.push({
                name: proj.item(i).name,
                width: proj.item(i).width,
                height: proj.item(i).height,
                duration: proj.item(i).duration,
                fps: proj.item(i).frameRate,
                numLayers: proj.item(i).numLayers
              });
            }
          }

          var activeInfo = null;
          if (activeComp && activeComp instanceof CompItem) {
            var layers = [];
            for (var j = 1; j <= activeComp.numLayers; j++) {
              var l = activeComp.layer(j);
              layers.push({
                index: l.index,
                name: l.name,
                enabled: l.enabled,
                is3D: l.threeDLayer,
                inPoint: l.inPoint,
                outPoint: l.outPoint
              });
            }
            activeInfo = {
              name: activeComp.name,
              width: activeComp.width,
              height: activeComp.height,
              duration: activeComp.duration,
              fps: activeComp.frameRate,
              layers: layers
            };
          }

          return JSON.stringify({
            success: true,
            projectName: proj.file ? proj.file.name : "Nomsiz Loyiha",
            projectPath: proj.file ? proj.file.fsName : "",
            totalComps: comps.length,
            comps: comps,
            activeComp: activeInfo
          });
        } catch(e) {
          return JSON.stringify({ success: false, error: e.toString() });
        }
      })();
    `;
  }
}

module.exports = JSXTemplates;
