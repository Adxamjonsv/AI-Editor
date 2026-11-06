// reference-analyzer.js - Media and visual reference analyzer
class ReferenceAnalyzer {
  static getSampleAnalysis(filename = "reference_1.mp4", language = "uz") {
    if (language === "uz") {
      return {
        filename: filename,
        style: "Kinematik, Premium, Hashamatli (Luxury)",
        colors: ["#D4AF37 (Oltin)", "#0B0C10 (Qora)", "#282A3C (To'q kulrang)"],
        camera: "Silliq yaqinlashuv (Push-in, 3D fazo)",
        rhythm: "Sekin, dramatik, toza final hold",
        effects: "Partiklyar, mayin glow, yorug'lik qaytishi (reflection)",
        text: "Minimal, 3D ekstruziya, oltin metallik",
        duration: "00:00:05:00",
        suggestions: [
          "Asl logotip nisbatlarini saqlang (Do not distort)",
          "Kamera tezligini oxirida Easy Ease bilan sekinlashtiring",
          "Oltin yorug'likni chap yuqoridan 45 gradusda yo'naltiring"
        ]
      };
    } else if (language === "ru") {
      return {
        filename: filename,
        style: "Кинематографичный, Премиум, Luxury",
        colors: ["#D4AF37 (Золото)", "#0B0C10 (Черный)", "#282A3C (Графит)"],
        camera: "Плавный наезд (Push-In, 3D пространство)",
        rhythm: "Медленный, драматичный, фиксация в конце",
        effects: "Мягкие частицы, деликатное свечение Glow, блики",
        text: "Минималистичный, объемный 3D, золотой металл",
        duration: "00:00:05:00",
        suggestions: [
          "Сохранить оригинальные пропорции логотипа",
          "Сгладить замедление камеры к 5-й секунде",
          "Направить акцентный золотой свет под углом 45 градусов"
        ]
      };
    } else {
      return {
        filename: filename,
        style: "Cinematic, Premium Luxury",
        colors: ["#D4AF37 (Gold)", "#0B0C10 (Deep Black)", "#282A3C (Dark Slate)"],
        camera: "Smooth 3D push-in forward movement",
        rhythm: "Slow, dramatic, clean final hold",
        effects: "Floating particles, subtle glow, spec reflection",
        text: "Minimal, extruded 3D, metallic gold",
        duration: "00:00:05:00",
        suggestions: [
          "Preserve original logo geometry and proportions",
          "Apply Easy Ease deceleration towards end",
          "Cast key golden light from top-left at 45 degrees"
        ]
      };
    }
  }
}

module.exports = ReferenceAnalyzer;
