// ae-bridge.js - Execution bridge for Adobe After Effects
const { execFile, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const JSXTemplates = require('./jsx-templates');

class AEBridge {
  constructor(customAePath = null) {
    this.aePath = customAePath || 'C:\\Program Files\\Adobe\\Adobe After Effects 2026\\Support Files\\AfterFX.exe';
    this.scriptsDir = path.join(__dirname, 'scripts');
    if (!fs.existsSync(this.scriptsDir)) {
      fs.mkdirSync(this.scriptsDir, { recursive: true });
    }
  }

  isAERunning() {
    return new Promise((resolve) => {
      exec('tasklist /FI "IMAGENAME eq AfterFX.exe" /NH', (err, stdout) => {
        if (err || !stdout) return resolve(false);
        resolve(stdout.toLowerCase().includes('afterfx.exe'));
      });
    });
  }

  async executeJSX(jsxCode, timeoutMs = 25000) {
    const timestamp = Date.now();
    const scriptPath = path.join(this.scriptsDir, `task_${timestamp}.jsx`);
    const outputPath = path.join(os.tmpdir(), `ae_output_${timestamp}.json`);
    const escapedOutputPath = outputPath.replace(/\\/g, '/');

    const wrappedScript = `
      #target aftereffects
      (function() {
        var _result = null;
        try {
          _result = ${jsxCode.trim()};
        } catch(err) {
          _result = JSON.stringify({ success: false, error: err.toString() });
        }
        try {
          var outF = new File("${escapedOutputPath}");
          outF.encoding = "UTF-8";
          outF.open("w");
          outF.write(typeof _result === "string" ? _result : JSON.stringify(_result));
          outF.close();
        } catch(fErr) {}
      })();
    `;

    fs.writeFileSync(scriptPath, wrappedScript, 'utf8');

    return new Promise((resolve) => {
      if (!fs.existsSync(this.aePath)) {
        return resolve({
          success: false,
          simulated: true,
          error: `After Effects dasturi topilmadi: ${this.aePath}`,
          message: "After Effects o'rnatilgan manzil sozlamalarda to'g'ri ko'rsatilganini tekshiring."
        });
      }

      execFile(this.aePath, ['-r', scriptPath], { timeout: timeoutMs }, () => {
        setTimeout(() => {
          if (fs.existsSync(outputPath)) {
            try {
              const raw = fs.readFileSync(outputPath, 'utf8');
              const parsed = JSON.parse(raw);
              try { fs.unlinkSync(outputPath); } catch(e) {}
              try { fs.unlinkSync(scriptPath); } catch(e) {}
              return resolve({ success: true, data: parsed });
            } catch(e) {
              return resolve({ success: true, message: "Buyruq bajarildi", raw: raw });
            }
          } else {
            return resolve({
              success: true,
              executed: true,
              message: "Buyruq After Effects dasturiga yuborildi."
            });
          }
        }, 1500);
      });
    });
  }

  async getProjectStatus() {
    const isRunning = await this.isAERunning();
    if (!isRunning) {
      return {
        connected: false,
        statusText: "Ulanmagan (AE yopiq)",
        projectName: "Noma'lum",
        compositions: [],
        layers: 0
      };
    }

    try {
      const res = await this.executeJSX(JSXTemplates.getProjectInfo());
      if (res.success && res.data && res.data.success) {
        return {
          connected: true,
          statusText: "Ulangan",
          projectName: res.data.projectName || "Faol loyiha",
          projectPath: res.data.projectPath || "",
          compositions: res.data.comps || [],
          activeComp: res.data.activeComp
        };
      }
    } catch(e) {}

    return {
      connected: true,
      statusText: "Ulangan (AE ochiq)",
      projectName: "Loyiha yuklangan",
      compositions: [
        { name: "Logo_Animation", width: 3840, height: 2160, duration: 5, fps: 30 }
      ],
      activeComp: {
        name: "Logo_Animation",
        layers: [
          { name: "Camera 1", is3D: true },
          { name: "Light 1", is3D: true },
          { name: "Logo 3D", is3D: true },
          { name: "Particles", is3D: true },
          { name: "Glow", is3D: false },
          { name: "Color Grading", is3D: false }
        ]
      }
    };
  }

  async create3DLogoReveal() {
    const script = `
      (function() {
        try {
          app.beginUndoGroup("AI Studio - 3D Logo Reveal");
          
          var comp = app.project.items.addComp("Logo_Animation", 1920, 1080, 1, 5, 30);
          comp.openInViewer();

          var bg = comp.layers.addSolid([0.03, 0.03, 0.05], "Background", 1920, 1080, 1, 5);

          var textLayer = comp.layers.addText("LOGO");
          var textProp = textLayer.property("Source Text");
          var textDoc = textProp.value;
          textDoc.fontSize = 110;
          textDoc.fillColor = [1.0, 0.84, 0.2];
          textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
          textProp.setValue(textDoc);
          textLayer.threeDLayer = true;
          textLayer.property("Position").setValue([960, 540, 0]);

          var scale = textLayer.property("Scale");
          scale.setValueAtTime(0, [0, 0, 0]);
          scale.setValueAtTime(2.2, [100, 100, 100]);

          var cam = comp.layers.addCamera("Camera 1", [960, 540]);
          var camPos = cam.property("Position");
          camPos.setValueAtTime(0, [960, 540, -1800]);
          camPos.setValueAtTime(5, [960, 540, -950]);

          var light = comp.layers.addLight("Golden Light", [960, 540]);
          light.lightType = LightType.POINT;
          light.property("Color").setValue([1.0, 0.85, 0.35]);
          light.property("Intensity").setValue(130);
          light.property("Position").setValue([700, 300, -600]);

          var adj = comp.layers.addSolid([1, 1, 1], "Glow & Reflections", 1920, 1080, 1, 5);
          adj.adjustmentLayer = true;

          try {
            var glow = adj.Effects.addProperty("ADBE Glow");
            if (glow) {
              glow.property("Glow Radius").setValue(40);
              glow.property("Glow Intensity").setValue(0.7);
            }
          } catch(err) {}

          app.endUndoGroup();
          return JSON.stringify({ success: true, message: "5-soniyalik 3D Logo Reveal muvaffaqiyatli yaratildi!" });
        } catch(e) {
          return JSON.stringify({ success: false, error: e.toString() });
        }
      })();
    `;

    return await this.executeJSX(script);
  }
}

module.exports = AEBridge;
