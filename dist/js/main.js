var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../Shaku/lib/manager.js
var require_manager = __commonJS({
  "../Shaku/lib/manager.js"(exports, module) {
    "use strict";
    var IManager = class {
      setup() {
        throw new Error("Not Implemented!");
      }
      startFrame() {
        throw new Error("Not Implemented!");
      }
      endFrame() {
        throw new Error("Not Implemented!");
      }
      destroy() {
        throw new Error("Not Implemented!");
      }
    };
    module.exports = IManager;
  }
});

// ../Shaku/lib/utils/math_helper.js
var require_math_helper = __commonJS({
  "../Shaku/lib/utils/math_helper.js"(exports, module) {
    "use strict";
    var _toRadsFactor = Math.PI / 180;
    var _toDegreesFactor = 180 / Math.PI;
    var MathHelper = class {
      static lerp(start, end, amount) {
        if (start === end) {
          return end;
        }
        return (1 - amount) * start + amount * end;
      }
      static dot(x1, y1, x2, y2) {
        return x1 * x2 + y1 * y2;
      }
      static toRadians(degrees) {
        return degrees * _toRadsFactor;
      }
      static toDegrees(radians) {
        return radians * _toDegreesFactor;
      }
      static radiansDistanceSigned(a1, a2) {
        var max = Math.PI * 2;
        var da = (a2 - a1) % max;
        return 2 * da % max - da;
      }
      static radiansDistance(a1, a2) {
        return Math.abs(this.radiansDistanceSigned(a1, a2));
      }
      static degreesDistanceSigned(a1, a2) {
        let a1r = a1 * _toRadsFactor;
        let a2r = a2 * _toRadsFactor;
        let ret = this.radiansDistanceSigned(a1r, a2r);
        return ret * _toDegreesFactor;
      }
      static degreesDistance(a1, a2) {
        let a1r = a1 * _toRadsFactor;
        let a2r = a2 * _toRadsFactor;
        let ret = this.radiansDistance(a1r, a2r);
        return ret * _toDegreesFactor;
      }
      static lerpRadians(a1, a2, alpha) {
        if (a1 === a2) {
          return a2;
        }
        return a1 + this.radiansDistanceSigned(a1, a2) * alpha;
      }
      static lerpDegrees(a1, a2, alpha) {
        if (a1 === a2) {
          return a2;
        }
        a1 = this.toRadians(a1);
        a2 = this.toRadians(a2);
        var ret = this.lerpRadians(a1, a2, alpha);
        return this.toDegrees(ret);
      }
      static round10(num) {
        return Math.round(num * 1e8) / 1e8;
      }
      static wrapDegrees(degrees) {
        return MathHelper.mod(degrees, 360);
      }
      static mod(value, m) {
        return (value % m + m) % m;
      }
    };
    MathHelper.PI2 = Math.PI * 2;
    module.exports = MathHelper;
  }
});

// ../Shaku/lib/utils/color.js
var require_color = __commonJS({
  "../Shaku/lib/utils/color.js"(exports, module) {
    "use strict";
    var MathHelper = require_math_helper();
    var Color3 = class {
      constructor(r, g, b, a) {
        this.set(r, g, b, a);
      }
      set(r, g, b, a) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a === void 0 ? 1 : a;
        this._asHex = null;
        return this;
      }
      setByte(r, g, b, a) {
        this._r = r / 255;
        this._g = g / 255;
        this._b = b / 255;
        this._a = a === void 0 ? 1 : a / 255;
        this._asHex = null;
        return this;
      }
      copy(other) {
        this.set(other.r, other.g, other.b, other.a);
        return this;
      }
      get r() {
        return this._r;
      }
      get g() {
        return this._g;
      }
      get b() {
        return this._b;
      }
      get a() {
        return this._a;
      }
      set r(val) {
        this._r = val;
        this._asHex = null;
        return this._r;
      }
      set g(val) {
        this._g = val;
        this._asHex = null;
        return this._g;
      }
      set b(val) {
        this._b = val;
        this._asHex = null;
        return this._b;
      }
      set a(val) {
        this._a = val;
        this._asHex = null;
        return this._a;
      }
      static componentToHex(c) {
        var hex = Math.round(c).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }
      get asHex() {
        if (!this._asHex) {
          this._asHex = "#" + Color3.componentToHex(this.r * 255) + Color3.componentToHex(this.g * 255) + Color3.componentToHex(this.b * 255) + Color3.componentToHex(this.a * 255);
        }
        return this._asHex;
      }
      static fromHex(val) {
        if (typeof val !== "string" && val[0] != "#") {
          throw new PintarJS.Error("Invalid color format!");
        }
        var parsed = hexToColor(val);
        if (!parsed) {
          throw new Error("Invalid hex value to parse!");
        }
        return new Color3(parsed.r, parsed.g, parsed.b, 1);
      }
      static fromDecimal(val, includeAlpha) {
        let ret = new Color3(1, 1, 1, 1);
        if (includeAlpha) {
          ret.a = (val & 255) / 255;
          val = val >> 8;
        }
        ret.b = (val & 255) / 255;
        val = val >> 8;
        ret.g = (val & 255) / 255;
        val = val >> 8;
        ret.r = (val & 255) / 255;
      }
      static fromDict(data) {
        return new Color3(
          data.r !== void 0 ? data.r : 1,
          data.g !== void 0 ? data.g : 1,
          data.b !== void 0 ? data.b : 1,
          data.a !== void 0 ? data.a : 1
        );
      }
      toDict(minimized) {
        if (minimized) {
          const ret = {};
          if (this.r !== 1) {
            ret.r = this.r;
          }
          if (this.g !== 1) {
            ret.g = this.g;
          }
          if (this.b !== 1) {
            ret.b = this.b;
          }
          if (this.a !== 1) {
            ret.a = this.a;
          }
          return ret;
        }
        return { r: this.r, g: this.g, b: this.b, a: this.a };
      }
      get asDecimalRGBA() {
        return (Math.round(this.r * 255) << 8 * 3 | Math.round(this.g * 255) << 8 * 2 | Math.round(this.b * 255) << 8 * 1 | Math.round(this.a * 255)) >>> 0;
      }
      get asDecimalABGR() {
        return (Math.round(this.a * 255) << 8 * 3 | Math.round(this.b * 255) << 8 * 2 | Math.round(this.g * 255) << 8 * 1 | Math.round(this.r * 255)) >>> 0;
      }
      get floatArray() {
        return [this.r, this.g, this.b, this.a];
      }
      clone() {
        return new Color3(this.r, this.g, this.b, this.a);
      }
      string() {
        return this.r + "," + this.g + "," + this.b + "," + this.a;
      }
      get isBlack() {
        return this.r == 0 && this.g == 0 && this.b == 0;
      }
      static random(includeAlpha) {
        return new Color3(Math.random(), Math.random(), Math.random(), includeAlpha ? Math.random() : 1);
      }
      static fromBytesArray(bytes) {
        return new Color3(bytes[0] / 255, bytes[1] / 255, bytes[2] / 255, bytes[3] !== void 0 ? bytes[3] / 255 : 1);
      }
      get isTransparentBlack() {
        return this._r == this._g && this._g == this._b && this._b == this._a && this._a == 0;
      }
      static get webColorNames() {
        return colorKeys;
      }
      equals(other) {
        return this === other || other && other.constructor === this.constructor && this._r == other._r && this._g == other._g && this._b == other._b && this._a == other._a;
      }
      static lerp(p1, p2, a) {
        let lerpScalar = MathHelper.lerp;
        return new Color3(
          lerpScalar(p1.r, p2.r, a),
          lerpScalar(p1.g, p2.g, a),
          lerpScalar(p1.b, p2.b, a),
          lerpScalar(p1.a, p2.a, a)
        );
      }
    };
    var colorNameToHex = {
      "aliceblue": "#f0f8ff",
      "antiquewhite": "#faebd7",
      "aqua": "#00ffff",
      "aquamarine": "#7fffd4",
      "azure": "#f0ffff",
      "beige": "#f5f5dc",
      "bisque": "#ffe4c4",
      "black": "#000000",
      "blanchedalmond": "#ffebcd",
      "blue": "#0000ff",
      "blueviolet": "#8a2be2",
      "brown": "#a52a2a",
      "burlywood": "#deb887",
      "cadetblue": "#5f9ea0",
      "chartreuse": "#7fff00",
      "chocolate": "#d2691e",
      "coral": "#ff7f50",
      "cornflowerblue": "#6495ed",
      "cornsilk": "#fff8dc",
      "crimson": "#dc143c",
      "cyan": "#00ffff",
      "darkblue": "#00008b",
      "darkcyan": "#008b8b",
      "darkgoldenrod": "#b8860b",
      "darkgray": "#a9a9a9",
      "darkgreen": "#006400",
      "darkkhaki": "#bdb76b",
      "darkmagenta": "#8b008b",
      "darkolivegreen": "#556b2f",
      "darkorange": "#ff8c00",
      "darkorchid": "#9932cc",
      "darkred": "#8b0000",
      "darksalmon": "#e9967a",
      "darkseagreen": "#8fbc8f",
      "darkslateblue": "#483d8b",
      "darkslategray": "#2f4f4f",
      "darkturquoise": "#00ced1",
      "darkviolet": "#9400d3",
      "deeppink": "#ff1493",
      "deepskyblue": "#00bfff",
      "dimgray": "#696969",
      "dodgerblue": "#1e90ff",
      "firebrick": "#b22222",
      "floralwhite": "#fffaf0",
      "forestgreen": "#228b22",
      "fuchsia": "#ff00ff",
      "gainsboro": "#dcdcdc",
      "ghostwhite": "#f8f8ff",
      "gold": "#ffd700",
      "goldenrod": "#daa520",
      "gray": "#808080",
      "green": "#008000",
      "greenyellow": "#adff2f",
      "honeydew": "#f0fff0",
      "hotpink": "#ff69b4",
      "indianred ": "#cd5c5c",
      "indigo": "#4b0082",
      "ivory": "#fffff0",
      "khaki": "#f0e68c",
      "lavender": "#e6e6fa",
      "lavenderblush": "#fff0f5",
      "lawngreen": "#7cfc00",
      "lemonchiffon": "#fffacd",
      "lightblue": "#add8e6",
      "lightcoral": "#f08080",
      "lightcyan": "#e0ffff",
      "lightgoldenrodyellow": "#fafad2",
      "lightgrey": "#d3d3d3",
      "lightgreen": "#90ee90",
      "lightpink": "#ffb6c1",
      "lightsalmon": "#ffa07a",
      "lightseagreen": "#20b2aa",
      "lightskyblue": "#87cefa",
      "lightslategray": "#778899",
      "lightsteelblue": "#b0c4de",
      "lightyellow": "#ffffe0",
      "lime": "#00ff00",
      "limegreen": "#32cd32",
      "linen": "#faf0e6",
      "magenta": "#ff00ff",
      "maroon": "#800000",
      "mediumaquamarine": "#66cdaa",
      "mediumblue": "#0000cd",
      "mediumorchid": "#ba55d3",
      "mediumpurple": "#9370d8",
      "mediumseagreen": "#3cb371",
      "mediumslateblue": "#7b68ee",
      "mediumspringgreen": "#00fa9a",
      "mediumturquoise": "#48d1cc",
      "mediumvioletred": "#c71585",
      "midnightblue": "#191970",
      "mintcream": "#f5fffa",
      "mistyrose": "#ffe4e1",
      "moccasin": "#ffe4b5",
      "navajowhite": "#ffdead",
      "navy": "#000080",
      "oldlace": "#fdf5e6",
      "olive": "#808000",
      "olivedrab": "#6b8e23",
      "orange": "#ffa500",
      "orangered": "#ff4500",
      "orchid": "#da70d6",
      "palegoldenrod": "#eee8aa",
      "palegreen": "#98fb98",
      "paleturquoise": "#afeeee",
      "palevioletred": "#d87093",
      "papayawhip": "#ffefd5",
      "peachpuff": "#ffdab9",
      "peru": "#cd853f",
      "pink": "#ffc0cb",
      "plum": "#dda0dd",
      "powderblue": "#b0e0e6",
      "purple": "#800080",
      "rebeccapurple": "#663399",
      "red": "#ff0000",
      "rosybrown": "#bc8f8f",
      "royalblue": "#4169e1",
      "saddlebrown": "#8b4513",
      "salmon": "#fa8072",
      "sandybrown": "#f4a460",
      "seagreen": "#2e8b57",
      "seashell": "#fff5ee",
      "sienna": "#a0522d",
      "silver": "#c0c0c0",
      "skyblue": "#87ceeb",
      "slateblue": "#6a5acd",
      "slategray": "#708090",
      "snow": "#fffafa",
      "springgreen": "#00ff7f",
      "steelblue": "#4682b4",
      "tan": "#d2b48c",
      "teal": "#008080",
      "thistle": "#d8bfd8",
      "tomato": "#ff6347",
      "turquoise": "#40e0d0",
      "violet": "#ee82ee",
      "wheat": "#f5deb3",
      "white": "#ffffff",
      "whitesmoke": "#f5f5f5",
      "yellow": "#ffff00",
      "yellowgreen": "#9acd32"
    };
    for (key in colorNameToHex) {
      if (colorNameToHex.hasOwnProperty(key)) {
        colorValue = hexToColor(colorNameToHex[key]);
        (function(_colValue) {
          Object.defineProperty(Color3, key, {
            get: function() {
              return _colValue.clone();
            }
          });
        })(colorValue);
      }
    }
    var colorValue;
    var key;
    var colorKeys = Object.keys(colorNameToHex);
    Object.freeze(colorKeys);
    Object.defineProperty(Color3, "transparent", {
      get: function() {
        return new Color3(0, 0, 0, 0);
      }
    });
    Object.defineProperty(Color3, "transwhite", {
      get: function() {
        return new Color3(1, 1, 1, 0);
      }
    });
    function hexToColor(hex) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });
      var result2 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      var components = result2 ? {
        r: parseInt(result2[1], 16) / 255,
        g: parseInt(result2[2], 16) / 255,
        b: parseInt(result2[3], 16) / 255
      } : null;
      if (!components) {
        throw new Error("Invalid hex value to parse!");
      }
      return new Color3(components.r, components.g, components.b, 1);
    }
    module.exports = Color3;
  }
});

// ../Shaku/lib/gfx/blend_modes.js
var require_blend_modes = __commonJS({
  "../Shaku/lib/gfx/blend_modes.js"(exports, module) {
    "use strict";
    var BlendModes2 = {
      AlphaBlend: "alpha",
      Opaque: "opaque",
      Additive: "additive",
      Multiply: "multiply",
      Subtract: "subtract",
      Screen: "screen",
      Overlay: "overlay",
      Invert: "invert",
      Darken: "darken",
      DestIn: "dest-in",
      DestOut: "dest-out"
    };
    Object.defineProperty(BlendModes2, "_values", {
      value: new Set(Object.values(BlendModes2)),
      writable: false
    });
    Object.freeze(BlendModes2);
    module.exports = { BlendModes: BlendModes2 };
  }
});

// ../Shaku/lib/utils/vector2.js
var require_vector2 = __commonJS({
  "../Shaku/lib/utils/vector2.js"(exports, module) {
    "use strict";
    var MathHelper = require_math_helper();
    var Vector22 = class {
      constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
      }
      clone() {
        return new Vector22(this.x, this.y);
      }
      set(x, y) {
        this.x = x;
        this.y = y;
        return this;
      }
      copy(other) {
        this.x = other.x;
        this.y = other.y;
        return this;
      }
      add(other) {
        if (typeof other === "number") {
          return new Vector22(this.x + other, this.y + (arguments[1] === void 0 ? other : arguments[1]));
        }
        return new Vector22(this.x + other.x, this.y + other.y);
      }
      sub(other) {
        if (typeof other === "number") {
          return new Vector22(this.x - other, this.y - (arguments[1] === void 0 ? other : arguments[1]));
        }
        return new Vector22(this.x - other.x, this.y - other.y);
      }
      div(other) {
        if (typeof other === "number") {
          return new Vector22(this.x / other, this.y / (arguments[1] === void 0 ? other : arguments[1]));
        }
        return new Vector22(this.x / other.x, this.y / other.y);
      }
      mul(other) {
        if (typeof other === "number") {
          return new Vector22(this.x * other, this.y * (arguments[1] === void 0 ? other : arguments[1]));
        }
        return new Vector22(this.x * other.x, this.y * other.y);
      }
      round() {
        return new Vector22(Math.round(this.x), Math.round(this.y));
      }
      floor() {
        return new Vector22(Math.floor(this.x), Math.floor(this.y));
      }
      ceil() {
        return new Vector22(Math.ceil(this.x), Math.ceil(this.y));
      }
      normalized() {
        if (this.x == 0 && this.y == 0) {
          return Vector22.zero;
        }
        let mag = this.length;
        return new Vector22(this.x / mag, this.y / mag);
      }
      rotatedRadians(radians) {
        return Vector22.fromRadians(this.getRadians() + radians).mulSelf(this.length);
      }
      rotatedDegrees(degrees) {
        return Vector22.fromDegree(this.getDegrees() + degrees).mulSelf(this.length);
      }
      addSelf(other) {
        if (typeof other === "number") {
          this.x += other;
          this.y += arguments[1] === void 0 ? other : arguments[1];
        } else {
          this.x += other.x;
          this.y += other.y;
        }
        return this;
      }
      subSelf(other) {
        if (typeof other === "number") {
          this.x -= other;
          this.y -= arguments[1] === void 0 ? other : arguments[1];
        } else {
          this.x -= other.x;
          this.y -= other.y;
        }
        return this;
      }
      divSelf(other) {
        if (typeof other === "number") {
          this.x /= other;
          this.y /= arguments[1] === void 0 ? other : arguments[1];
        } else {
          this.x /= other.x;
          this.y /= other.y;
        }
        return this;
      }
      mulSelf(other) {
        if (typeof other === "number") {
          this.x *= other;
          this.y *= arguments[1] === void 0 ? other : arguments[1];
        } else {
          this.x *= other.x;
          this.y *= other.y;
        }
        return this;
      }
      roundSelf() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
      }
      floorSelf() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
      }
      ceilSelf() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
      }
      normalizeSelf() {
        if (this.x == 0 && this.y == 0) {
          return this;
        }
        let mag = this.length;
        this.x /= mag;
        this.y /= mag;
        return this;
      }
      equals(other) {
        return this === other || other.constructor === this.constructor && this.x === other.x && this.y === other.y;
      }
      approximate(other, threshold) {
        threshold = threshold || 1;
        return this === other || Math.abs(this.x - other.x) <= threshold && Math.abs(this.y - other.y) <= threshold;
      }
      get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      }
      scaled(fac) {
        return new Vector22(this.x * fac, this.y * fac);
      }
      static get zero() {
        return new Vector22();
      }
      static get one() {
        return new Vector22(1, 1);
      }
      static get half() {
        return new Vector22(0.5, 0.5);
      }
      static get left() {
        return new Vector22(-1, 0);
      }
      static get right() {
        return new Vector22(1, 0);
      }
      static get up() {
        return new Vector22(0, -1);
      }
      static get down() {
        return new Vector22(0, 1);
      }
      static get random() {
        return Vector22.fromDegree(Math.random() * 360);
      }
      degreesTo(other) {
        return Vector22.degreesBetween(this, other);
      }
      radiansTo(other) {
        return Vector22.radiansBetween(this, other);
      }
      degreesToFull(other) {
        return Vector22.degreesBetweenFull(this, other);
      }
      radiansToFull(other) {
        return Vector22.radiansBetweenFull(this, other);
      }
      distanceTo(other) {
        return Vector22.distance(this, other);
      }
      static fromDegree(degrees) {
        let rads = degrees * (Math.PI / 180);
        return new Vector22(Math.cos(rads), Math.sin(rads));
      }
      static fromRadians(radians) {
        return new Vector22(Math.cos(radians), Math.sin(radians));
      }
      static lerp(p1, p2, a) {
        let lerpScalar = MathHelper.lerp;
        return new Vector22(lerpScalar(p1.x, p2.x, a), lerpScalar(p1.y, p2.y, a));
      }
      static degreesBetween(P1, P2) {
        return MathHelper.toDegrees(Vector22.radiansBetween(P1, P2));
      }
      static radiansBetween(P1, P2) {
        return Math.atan2(Vector22.cross(P1, P2), Vector22.dot(P1, P2));
      }
      static degreesBetweenFull(P1, P2) {
        return MathHelper.toDegrees(Vector22.radiansBetweenFull(P1, P2));
      }
      getDegrees() {
        var angle = Math.atan2(this.y, this.x);
        var degrees = 180 * angle / Math.PI;
        return (360 + Math.round(degrees)) % 360;
      }
      getRadians() {
        var angle = Math.atan2(this.y, this.x);
        return angle;
      }
      static radiansBetweenFull(P1, P2) {
        return MathHelper.mod(Vector22.radiansBetween(P1, P2), Math.PI * 2);
      }
      static distance(p1, p2) {
        let a = p1.x - p2.x;
        let b = p1.y - p2.y;
        return Math.sqrt(a * a + b * b);
      }
      static cross(p1, p2) {
        return p1.x * p2.y - p1.y * p2.x;
      }
      static dot(p1, p2) {
        return p1.x * p2.x + p1.y * p2.y;
      }
      string() {
        return this.x + "," + this.y;
      }
      static parse(str) {
        let parts = str.split(",");
        return new Vector22(parseFloat(parts[0].trim()), parseFloat(parts[1].trim()));
      }
      toArray() {
        return [this.x, this.y];
      }
      static fromArray(arr) {
        return new Vector22(arr[0], arr[1]);
      }
      static fromDict(data) {
        return new Vector22(data.x || 0, data.y || 0);
      }
      toDict(minimized) {
        if (minimized) {
          const ret = {};
          if (this.x) {
            ret.x = this.x;
          }
          if (this.y) {
            ret.y = this.y;
          }
          return ret;
        }
        return { x: this.x, y: this.y };
      }
    };
    module.exports = Vector22;
  }
});

// ../Shaku/lib/utils/circle.js
var require_circle = __commonJS({
  "../Shaku/lib/utils/circle.js"(exports, module) {
    "use strict";
    var MathHelper = require_math_helper();
    var Vector22 = require_vector2();
    var Circle2 = class {
      constructor(center, radius) {
        this.center = center.clone();
        this.radius = radius;
      }
      clone() {
        return new Circle2(this.center, this.radius);
      }
      containsVector(p) {
        return this.center.distanceTo(p) <= this.radius;
      }
      equals(other) {
        return other === this || other && other.constructor === this.constructor && this.center.equals(other.center) && this.radius == other.radius;
      }
      static fromDict(data) {
        return new Circle2(Vector22.fromDict(data.center || {}), data.radius || 0);
      }
      toDict(minimized) {
        if (minimized) {
          const ret = {};
          if (this.radius) {
            ret.radius = this.radius;
          }
          if (this.center.x || this.center.y) {
            ret.center = this.center.toDict(true);
          }
          return ret;
        }
        return { center: this.center.toDict(), radius: this.radius };
      }
      static lerp(p1, p2, a) {
        let lerpScalar = MathHelper.lerp;
        return new Circle2(Vector22.lerp(p1.center, p2.center, a), lerpScalar(p1.radius, p2.radius, a));
      }
    };
    module.exports = Circle2;
  }
});

// ../Shaku/lib/utils/line.js
var require_line = __commonJS({
  "../Shaku/lib/utils/line.js"(exports, module) {
    "use strict";
    var Vector22 = require_vector2();
    var Line2 = class {
      constructor(from, to) {
        this.from = from.clone();
        this.to = to.clone();
      }
      clone() {
        return new Line2(this.from, this.to);
      }
      static fromDict(data) {
        return new Line2(Vector22.fromDict(data.from || {}), Vector22.fromDict(data.to || {}));
      }
      toDict(minimized) {
        if (minimized) {
          const ret = {};
          if (this.from.x || this.from.y) {
            ret.from = this.from.toDict(true);
          }
          if (this.to.x || this.to.y) {
            ret.to = this.to.toDict(true);
          }
          return ret;
        }
        return { from: this.from.toDict(), to: this.to.toDict() };
      }
      containsVector(p, threshold) {
        let A = this.from;
        let B = this.to;
        let distance = Vector22.distance;
        if (threshold === void 0) {
          threshold = 0.5;
        }
        return Math.abs(distance(A, p) + distance(B, p) - distance(A, B)) <= threshold;
      }
      collideLine(other) {
        let p0 = this.from;
        let p1 = this.to;
        let p2 = other.from;
        let p3 = other.to;
        if (p0.equals(p2) || p0.equals(p3) || p1.equals(p2) || p1.equals(p3)) {
          return true;
        }
        let s1_x, s1_y, s2_x, s2_y;
        s1_x = p1.x - p0.x;
        s1_y = p1.y - p0.y;
        s2_x = p3.x - p2.x;
        s2_y = p3.y - p2.y;
        let s, t;
        s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y);
        t = (s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);
        return s >= 0 && s <= 1 && t >= 0 && t <= 1;
      }
      distanceToVector(v) {
        let x1 = this.from.x;
        let x2 = this.to.x;
        let y1 = this.from.y;
        let y2 = this.to.y;
        var A = v.x - x1;
        var B = v.y - y1;
        var C = x2 - x1;
        var D = y2 - y1;
        var dot = A * C + B * D;
        var len_sq = C * C + D * D;
        var param = -1;
        if (len_sq != 0)
          param = dot / len_sq;
        var xx, yy;
        if (param < 0) {
          xx = x1;
          yy = y1;
        } else if (param > 1) {
          xx = x2;
          yy = y2;
        } else {
          xx = x1 + param * C;
          yy = y1 + param * D;
        }
        var dx = v.x - xx;
        var dy = v.y - yy;
        return Math.sqrt(dx * dx + dy * dy);
      }
      equals(other) {
        return this === other || other && other.constructor === this.constructor && this.from.equals(other.from) && this.to.equals(other.to);
      }
      static lerp(l1, l2, a) {
        return new Line2(Vector22.lerp(l1.from, l2.from, a), Vector22.lerp(l1.to, l2.to, a));
      }
    };
    module.exports = Line2;
  }
});

// ../Shaku/lib/utils/rectangle.js
var require_rectangle = __commonJS({
  "../Shaku/lib/utils/rectangle.js"(exports, module) {
    "use strict";
    var Circle2 = require_circle();
    var Line2 = require_line();
    var MathHelper = require_math_helper();
    var Vector22 = require_vector2();
    var Rectangle2 = class {
      constructor(x, y, width, height) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width;
        this.height = height;
      }
      set(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
      }
      copy(other) {
        this.x = other.x;
        this.y = other.y;
        this.width = other.width;
        this.height = other.height;
        return this;
      }
      getPosition() {
        return new Vector22(this.x, this.y);
      }
      getSize() {
        return new Vector22(this.width, this.height);
      }
      getCenter() {
        return new Vector22(Math.round(this.x + this.width / 2), Math.round(this.y + this.height / 2));
      }
      get left() {
        return this.x;
      }
      get right() {
        return this.x + this.width;
      }
      get top() {
        return this.y;
      }
      get bottom() {
        return this.y + this.height;
      }
      clone() {
        return new Rectangle2(this.x, this.y, this.width, this.height);
      }
      getTopLeft() {
        return new Vector22(this.x, this.y);
      }
      getTopRight() {
        return new Vector22(this.x + this.width, this.y);
      }
      getBottomLeft() {
        return new Vector22(this.x, this.y + this.height);
      }
      getBottomRight() {
        return new Vector22(this.x + this.width, this.y + this.height);
      }
      string() {
        return this.x + "," + this.y + "," + this.width + "," + this.height;
      }
      containsVector(p) {
        return p.x >= this.x && p.x <= this.x + this.width && p.y >= this.y && p.y <= this.y + this.height;
      }
      collideRect(other) {
        let r1 = this;
        let r2 = other;
        return !(r2.left >= r1.right || r2.right <= r1.left || r2.top >= r1.bottom || r2.bottom <= r1.top);
      }
      collideLine(line) {
        if (this.containsVector(line.from) || this.containsVector(line.to)) {
          return true;
        }
        let topLeft = this.getTopLeft();
        let topRight = this.getTopRight();
        let bottomLeft = this.getBottomLeft();
        let bottomRight = this.getBottomRight();
        if (line.collideLine(new Line2(topLeft, topRight))) {
          return true;
        }
        if (line.collideLine(new Line2(topLeft, bottomLeft))) {
          return true;
        }
        if (line.collideLine(new Line2(topRight, bottomRight))) {
          return true;
        }
        if (line.collideLine(new Line2(bottomLeft, bottomRight))) {
          return true;
        }
        return false;
      }
      collideCircle(circle) {
        let center = circle.center;
        let radius = circle.radius;
        let rect = this;
        if (rect.containsVector(center)) {
          return true;
        }
        let rectCenter = rect.getCenter();
        let topLeft = rect.getTopLeft();
        let topRight = rect.getTopRight();
        let bottomRight = rect.getBottomRight();
        let bottomLeft = rect.getBottomLeft();
        let lines = [];
        if (rectCenter.x > center.x) {
          lines.push([topLeft, bottomLeft]);
        } else {
          lines.push([topRight, bottomRight]);
        }
        if (rectCenter.y > center.y) {
          lines.push([topLeft, topRight]);
        } else {
          lines.push([bottomLeft, bottomRight]);
        }
        for (let i = 0; i < lines.length; ++i) {
          let disToLine = pointLineDistance(center, lines[i][0], lines[i][1]);
          if (disToLine <= radius) {
            return true;
          }
        }
        return false;
      }
      getBoundingCircle() {
        let center = this.getCenter();
        let radius = center.distanceTo(this.getTopLeft());
        return new Circle2(center, radius);
      }
      static fromPoints(points) {
        let min_x = points[0].x;
        let min_y = points[0].y;
        let max_x = min_x;
        let max_y = min_y;
        for (let i = 1; i < points.length; ++i) {
          min_x = Math.min(min_x, points[i].x);
          min_y = Math.min(min_y, points[i].y);
          max_x = Math.max(max_x, points[i].x);
          max_y = Math.max(max_y, points[i].y);
        }
        return new Rectangle2(min_x, min_y, max_x - min_x, max_y - min_y);
      }
      resize(amount) {
        if (typeof amount === "number") {
          amount = new Vector22(amount, amount);
        }
        return new Rectangle2(this.x - amount.x / 2, this.y - amount.y / 2, this.width + amount.x, this.height + amount.y);
      }
      equals(other) {
        return this === other || other && other.constructor === this.constructor && this.x == other.x && this.y == other.y && this.width == other.width && this.height == other.height;
      }
      static lerp(p1, p2, a) {
        let lerpScalar = MathHelper.lerp;
        return new Rectangle2(
          lerpScalar(p1.x, p2.x, a),
          lerpScalar(p1.y, p2.y, a),
          lerpScalar(p1.width, p2.width, a),
          lerpScalar(p1.height, p2.height, a)
        );
      }
      static fromDict(data) {
        return new Rectangle2(data.x || 0, data.y || 0, data.width || 0, data.height || 0);
      }
      toDict(minimized) {
        if (minimized) {
          const ret = {};
          if (this.x) {
            ret.x = this.x;
          }
          if (this.y) {
            ret.y = this.y;
          }
          if (this.width) {
            ret.width = this.width;
          }
          if (this.height) {
            ret.height = this.height;
          }
          return ret;
        }
        return { x: this.x, y: this.y, width: this.width, height: this.height };
      }
    };
    function pointLineDistance(p1, l1, l2) {
      let x = p1.x;
      let y = p1.y;
      let x1 = l1.x;
      let y1 = l1.y;
      let x2 = l2.x;
      let y2 = l2.y;
      var A = x - x1;
      var B = y - y1;
      var C = x2 - x1;
      var D = y2 - y1;
      var dot = A * C + B * D;
      var len_sq = C * C + D * D;
      var param = -1;
      if (len_sq != 0)
        param = dot / len_sq;
      var xx, yy;
      if (param < 0) {
        xx = x1;
        yy = y1;
      } else if (param > 1) {
        xx = x2;
        yy = y2;
      } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
      }
      var dx = x - xx;
      var dy = y - yy;
      return Math.sqrt(dx * dx + dy * dy);
    }
    module.exports = Rectangle2;
  }
});

// ../Shaku/lib/assets/asset.js
var require_asset = __commonJS({
  "../Shaku/lib/assets/asset.js"(exports, module) {
    "use strict";
    var Asset = class {
      constructor(url) {
        this._url = url;
        this._waitingCallbacks = [];
      }
      onReady(callback) {
        if (this.valid || this._waitingCallbacks === null) {
          callback(this);
          return;
        }
        this._waitingCallbacks.push(callback);
      }
      waitForReady() {
        return new Promise((resolve, reject2) => {
          this.onReady(resolve);
        });
      }
      _notifyReady() {
        if (this._waitingCallbacks) {
          for (let i = 0; i < this._waitingCallbacks.length; ++i) {
            this._waitingCallbacks[i](this);
          }
          this._waitingCallbacks = null;
        }
      }
      get url() {
        return this._url;
      }
      get valid() {
        throw new Error("Not Implemented!");
      }
      load(params) {
        throw new Error("Not Implemented!");
      }
      create(source, params) {
        throw new Error("Not Supported for this asset type.");
      }
      destroy() {
        throw new Error("Not Implemented!");
      }
    };
    module.exports = Asset;
  }
});

// ../Shaku/lib/gfx/texture_filter_modes.js
var require_texture_filter_modes = __commonJS({
  "../Shaku/lib/gfx/texture_filter_modes.js"(exports, module) {
    "use strict";
    var TextureFilterModes2 = {
      Nearest: "NEAREST",
      Linear: "LINEAR",
      NearestMipmapNearest: "NEAREST_MIPMAP_NEAREST",
      LinearMipmapNearest: "LINEAR_MIPMAP_NEAREST",
      NearestMipmapLinear: "NEAREST_MIPMAP_LINEAR",
      LinearMipmapLinear: "LINEAR_MIPMAP_LINEAR"
    };
    Object.defineProperty(TextureFilterModes2, "_values", {
      value: new Set(Object.values(TextureFilterModes2)),
      writable: false
    });
    Object.freeze(TextureFilterModes2);
    module.exports = { TextureFilterModes: TextureFilterModes2 };
  }
});

// ../Shaku/lib/gfx/texture_wrap_modes.js
var require_texture_wrap_modes = __commonJS({
  "../Shaku/lib/gfx/texture_wrap_modes.js"(exports, module) {
    "use strict";
    var TextureWrapModes2 = {
      Clamp: "CLAMP_TO_EDGE",
      Repeat: "REPEAT",
      RepeatMirrored: "MIRRORED_REPEAT"
    };
    Object.defineProperty(TextureWrapModes2, "_values", {
      value: new Set(Object.values(TextureWrapModes2)),
      writable: false
    });
    Object.freeze(TextureWrapModes2);
    module.exports = { TextureWrapModes: TextureWrapModes2 };
  }
});

// ../Shaku/lib/logger.js
var require_logger = __commonJS({
  "../Shaku/lib/logger.js"(exports, module) {
    "use strict";
    var _drivers = console;
    var _application = "Shaku";
    var Logger = class {
      constructor(name) {
        this._nameHeader = "[" + _application + "][" + name + "]";
        this._throwErrors = false;
      }
      trace(msg) {
        _drivers.trace(this._nameHeader, msg);
      }
      debug(msg) {
        _drivers.debug(this._nameHeader, msg);
      }
      info(msg) {
        _drivers.info(this._nameHeader, msg);
      }
      warn(msg) {
        _drivers.warn(this._nameHeader, msg);
        if (this._throwErrors) {
          throw new Error(msg);
        }
      }
      error(msg) {
        _drivers.error(this._nameHeader, msg);
        if (this._throwErrors) {
          throw new Error(msg);
        }
      }
      throwErrorOnWarnings(enable) {
        this._throwErrors = Boolean(enable);
      }
    };
    var NullDrivers = class {
      constructor() {
      }
      trace(msg) {
      }
      debug(msg) {
      }
      info(msg) {
      }
      warn(msg) {
      }
      error(msg) {
      }
    };
    module.exports = {
      getLogger: function(name) {
        return new Logger(name);
      },
      silent: function() {
        _drivers = new NullDrivers();
      },
      setDrivers: function(drivers) {
        _drivers = drivers;
      },
      setApplicationName: function(name) {
        _application = name;
        return this;
      }
    };
  }
});

// ../Shaku/lib/assets/texture_asset.js
var require_texture_asset = __commonJS({
  "../Shaku/lib/assets/texture_asset.js"(exports, module) {
    "use strict";
    var Asset = require_asset();
    var { TextureFilterMode, TextureFilterModes: TextureFilterModes2 } = require_texture_filter_modes();
    var { TextureWrapMode, TextureWrapModes: TextureWrapModes2 } = require_texture_wrap_modes();
    var Color3 = require_color();
    var Vector22 = require_vector2();
    var _logger = require_logger().getLogger("assets");
    var gl = null;
    var TextureAsset = class extends Asset {
      constructor(url) {
        super(url);
        this._image = null;
        this._width = 0;
        this._height = 0;
        this._texture = null;
        this._filter = null;
        this._wrapMode = null;
        this._ctxForPixelData = null;
      }
      static _setWebGl(_gl) {
        gl = _gl;
      }
      get filter() {
        return this._filter;
      }
      set filter(value) {
        this._filter = value;
      }
      get wrapMode() {
        return this._wrapMode;
      }
      set wrapMode(value) {
        this._wrapMode = value;
      }
      load(params) {
        params = params || {};
        return new Promise((resolve, reject2) => {
          if (!gl) {
            return reject2("Can't load textures before initializing gfx manager!");
          }
          const image = new Image();
          if (params.crossOrigin !== void 0) {
            image.crossOrigin = params.crossOrigin;
          }
          image.onload = async () => {
            try {
              await this.create(image, params);
              this._notifyReady();
              resolve();
            } catch (e) {
              reject2(e);
            }
          };
          image.onerror = () => {
            reject2("Failed to load texture image!");
          };
          image.src = this.url;
        });
      }
      createRenderTarget(width, height, channels) {
        const targetTextureWidth = width;
        const targetTextureHeight = height;
        const targetTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, targetTexture);
        var _format = gl.RGBA;
        if (channels !== void 0) {
          switch (channels) {
            case 1:
              _format = gl.LUMINANCE;
              break;
            case 3:
              _format = gl.RGB;
              break;
            case 4:
              _format = gl.RGBA;
              break;
            default:
              throw new Error("Unknown render target format!");
          }
        }
        {
          const level = 0;
          const internalFormat = _format;
          const border = 0;
          const format = _format;
          const type = gl.UNSIGNED_BYTE;
          const data = null;
          gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            targetTextureWidth,
            targetTextureHeight,
            border,
            format,
            type,
            data
          );
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        this._width = width;
        this._height = height;
        this._texture = targetTexture;
        this._notifyReady();
      }
      fromImage(image, params) {
        if (image.width === 0) {
          throw new Error("Image to build texture from must be loaded and have valid size!");
        }
        if (this.valid) {
          throw new Error("Texture asset is already initialized!");
        }
        params = params || {};
        this._image = image;
        this._width = image.width;
        this._height = image.height;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
        if (params.generateMipMaps) {
          if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            _logger.warn("Tried to generate MipMaps for a texture with size that is *not* a power of two. This might not work as expected.");
          }
          gl.generateMipmap(gl.TEXTURE_2D);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        this._texture = texture;
        this._notifyReady();
      }
      create(source, params) {
        return new Promise(async (resolve, reject2) => {
          if (typeof source === "string") {
            let img = new Image();
            img.onload = () => {
              this.fromImage(source, params);
              this._notifyReady();
              resolve();
            };
            if (params.crossOrigin !== void 0) {
              img.crossOrigin = params.crossOrigin;
            }
            img.src = source;
          } else {
            this.fromImage(source, params);
            resolve();
          }
        });
      }
      get image() {
        return this._image;
      }
      get width() {
        return this._width;
      }
      get height() {
        return this._height;
      }
      get size() {
        return new Vector22(this.width, this.height);
      }
      get texture() {
        return this._texture;
      }
      getPixel(x, y) {
        if (!this._image) {
          throw new Error("'getPixel()' only works on textures loaded from image!");
        }
        if (!this._ctxForPixelData) {
          let canvas = document.createElement("canvas");
          canvas.width = 1;
          canvas.height = 1;
          this._ctxForPixelData = canvas.getContext("2d");
        }
        let ctx = this._ctxForPixelData;
        ctx.drawImage(this._image, x, y, 1, 1, 0, 0, 1, 1);
        let pixelData = ctx.getImageData(0, 0, 1, 1).data;
        return Color3.fromBytesArray(pixelData);
      }
      get valid() {
        return Boolean(this._texture);
      }
      destroy() {
        gl.deleteTexture(this._texture);
        this._image = null;
        this._width = this._height = 0;
        this._ctxForPixelData = null;
        this._texture = null;
      }
    };
    function isPowerOf2(value) {
      return (value & value - 1) == 0;
    }
    module.exports = TextureAsset;
  }
});

// ../Shaku/lib/utils/vector3.js
var require_vector3 = __commonJS({
  "../Shaku/lib/utils/vector3.js"(exports, module) {
    "use strict";
    var MathHelper = require_math_helper();
    var Vector32 = class {
      constructor(x = 0, y = 0, z2 = 0) {
        this.x = x;
        this.y = y;
        this.z = z2;
      }
      clone() {
        return new Vector32(this.x, this.y, this.z);
      }
      set(x, y) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
      }
      copy(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
      }
      add(other) {
        if (typeof other === "number") {
          return new Vector32(
            this.x + other,
            this.y + (arguments[1] === void 0 ? other : arguments[1]),
            this.z + (arguments[2] === void 0 ? other : arguments[2])
          );
        }
        return new Vector32(this.x + other.x, this.y + other.y, this.z + other.z);
      }
      sub(other) {
        if (typeof other === "number") {
          return new Vector32(
            this.x - other,
            this.y - (arguments[1] === void 0 ? other : arguments[1]),
            this.z - (arguments[2] === void 0 ? other : arguments[2])
          );
        }
        return new Vector32(this.x - other.x, this.y - other.y, this.z - other.z);
      }
      div(other) {
        if (typeof other === "number") {
          return new Vector32(
            this.x / other,
            this.y / (arguments[1] === void 0 ? other : arguments[1]),
            this.z / (arguments[2] === void 0 ? other : arguments[2])
          );
        }
        return new Vector32(this.x / other.x, this.y / other.y, this.z / other.z);
      }
      mul(other) {
        if (typeof other === "number") {
          return new Vector32(
            this.x * other,
            this.y * (arguments[1] === void 0 ? other : arguments[1]),
            this.z * (arguments[2] === void 0 ? other : arguments[2])
          );
        }
        return new Vector32(this.x * other.x, this.y * other.y, this.z * other.z);
      }
      round() {
        return new Vector32(Math.round(this.x), Math.round(this.y), Math.round(this.z));
      }
      floor() {
        return new Vector32(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
      }
      ceil() {
        return new Vector32(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
      }
      normalized() {
        if (this.x == 0 && this.y == 0 && this.z == 0) {
          return Vector32.zero;
        }
        let mag = this.length;
        return new Vector32(this.x / mag, this.y / mag, this.z / mag);
      }
      addSelf(other) {
        if (typeof other === "number") {
          this.x += other;
          this.y += arguments[1] === void 0 ? other : arguments[1];
          this.z += arguments[2] === void 0 ? other : arguments[2];
        } else {
          this.x += other.x;
          this.y += other.y;
          this.z += other.z;
        }
        return this;
      }
      subSelf(other) {
        if (typeof other === "number") {
          this.x -= other;
          this.y -= arguments[1] === void 0 ? other : arguments[1];
          this.z -= arguments[2] === void 0 ? other : arguments[2];
        } else {
          this.x -= other.x;
          this.y -= other.y;
          this.z -= other.z;
        }
        return this;
      }
      divSelf(other) {
        if (typeof other === "number") {
          this.x /= other;
          this.y /= arguments[1] === void 0 ? other : arguments[1];
          this.z /= arguments[2] === void 0 ? other : arguments[2];
        } else {
          this.x /= other.x;
          this.y /= other.y;
          this.z /= other.z;
        }
        return this;
      }
      mulSelf(other) {
        if (typeof other === "number") {
          this.x *= other;
          this.y *= arguments[1] === void 0 ? other : arguments[1];
          this.z *= arguments[2] === void 0 ? other : arguments[2];
        } else {
          this.x *= other.x;
          this.y *= other.y;
          this.z *= other.z;
        }
        return this;
      }
      roundSelf() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
      }
      floorSelf() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
      }
      ceilSelf() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
      }
      normalizeSelf() {
        if (this.x == 0 && this.y == 0 && this.z == 0) {
          return this;
        }
        let mag = this.length;
        this.x /= mag;
        this.y /= mag;
        this.z /= mag;
        return this;
      }
      equals(other) {
        return this === other || other.constructor === this.constructor && this.x === other.x && this.y === other.y && this.z === other.z;
      }
      approximate(other, threshold) {
        threshold = threshold || 1;
        return this === other || Math.abs(this.x - other.x) <= threshold && Math.abs(this.y - other.y) <= threshold && Math.abs(this.z - other.z) <= threshold;
      }
      get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      }
      scaled(fac) {
        return new Vector32(this.x * fac, this.y * fac, this.z * fac);
      }
      static get zero() {
        return new Vector32();
      }
      static get one() {
        return new Vector32(1, 1, 1);
      }
      static get half() {
        return new Vector32(0.5, 0.5, 0.5);
      }
      static get left() {
        return new Vector32(-1, 0, 0);
      }
      static get right() {
        return new Vector32(1, 0, 0);
      }
      static get up() {
        return new Vector32(0, -1, 0);
      }
      static get down() {
        return new Vector32(0, 1, 0);
      }
      static get front() {
        return new Vector32(0, 0, -1);
      }
      static get back() {
        return new Vector32(0, 0, 1);
      }
      distanceTo(other) {
        return Vector32.distance(this, other);
      }
      static lerp(p1, p2, a) {
        let lerpScalar = MathHelper.lerp;
        return new Vector32(lerpScalar(p1.x, p2.x, a), lerpScalar(p1.y, p2.y, a), lerpScalar(p1.z, p2.z, a));
      }
      static distance(p1, p2) {
        let a = p1.x - p2.x;
        let b = p1.y - p2.y;
        let c = p1.z - p2.z;
        return Math.sqrt(a * a + b * b + c * c);
      }
      static crossVector(p1, p2) {
        const ax = p1.x, ay = p1.y, az = p1.z;
        const bx = p2.x, by = p2.y, bz = p2.z;
        let x = ay * bz - az * by;
        let y = az * bx - ax * bz;
        let z2 = ax * by - ay * bx;
        return new Vector32(x, y, z2);
      }
      string() {
        return this.x + "," + this.y + "," + this.z;
      }
      static parse(str) {
        let parts = str.split(",");
        return new Vector32(parseFloat(parts[0].trim()), parseFloat(parts[1].trim()), parseFloat(parts[2].trim()));
      }
      toArray() {
        return [this.x, this.y, this.z];
      }
      static fromArray(arr) {
        return new Vector32(arr[0], arr[1], arr[2]);
      }
      static fromDict(data) {
        return new Vector32(data.x || 0, data.y || 0, data.z || 0);
      }
      toDict(minimized) {
        if (minimized) {
          const ret = {};
          if (this.x) {
            ret.x = this.x;
          }
          if (this.y) {
            ret.y = this.y;
          }
          if (this.z) {
            ret.z = this.z;
          }
          return ret;
        }
        return { x: this.x, y: this.y, z: this.z };
      }
    };
    module.exports = Vector32;
  }
});

// ../Shaku/lib/utils/animator.js
var require_animator = __commonJS({
  "../Shaku/lib/utils/animator.js"(exports, module) {
    "use strict";
    var _autoAnimators = [];
    var Animator2 = class {
      constructor(target) {
        this._target = target;
        this._fromValues = {};
        this._toValues = {};
        this._progress = 0;
        this._onUpdate = null;
        this._onFinish = null;
        this._smoothDamp = false;
        this._repeats = false;
        this._repeatsWithReverseAnimation = false;
        this._isInAutoUpdate = false;
        this._originalFrom = null;
        this._originalTo = null;
        this._originalRepeats = null;
        this._easing = linearEasing;
        this.speedFactor = 1;
      }
      update(delta) {
        if (this._progress >= 1) {
          return;
        }
        delta *= this.speedFactor;
        this._progress += delta;
        if (this._progress < 0) {
          return;
        }
        if (this._progress >= 1) {
          this._progress = 1;
          if (this._onFinish) {
            this._onFinish();
          }
        }
        let lerp_factor = this._easing(this._progress);
        for (let key in this._toValues) {
          let keyParts = this._toValues[key].keyParts;
          let toValue = this._toValues[key].value;
          let fromValue = this._fromValues[key];
          if (fromValue === void 0) {
            this._fromValues[key] = fromValue = this._getValueFromTarget(keyParts);
            if (fromValue === void 0) {
              throw new Error(`Animator issue: missing origin value for key '${key}' and property not found in target object.`);
            }
          }
          if (typeof toValue === "function") {
            toValue = toValue();
          }
          if (typeof fromValue === "function") {
            fromValue = toValue();
          }
          let newValue = null;
          if (typeof fromValue === "number") {
            newValue = lerp2(fromValue, toValue, lerp_factor);
          } else if (fromValue.constructor.lerp) {
            newValue = fromValue.constructor.lerp(fromValue, toValue, lerp_factor);
          } else {
            throw new Error(`Animator issue: from-value for key '${key}' is not a number, and its class type don't implement a 'lerp()' method!`);
          }
          this._setValueToTarget(keyParts, newValue);
        }
        if (this._onUpdate) {
          this._onUpdate(lerp_factor);
        }
        if (this._repeats && this._progress >= 1) {
          if (typeof this._repeats === "number") {
            this._repeats--;
          }
          this._progress = 0;
          if (this._repeatsWithReverseAnimation) {
            this.flipFromAndTo();
          }
        }
      }
      _getValueFromTarget(keyParts) {
        if (keyParts.length === 1) {
          return this._target[keyParts[0]];
        }
        function index(obj, i) {
          return obj[i];
        }
        return keyParts.reduce(index, this._target);
      }
      _setValueToTarget(keyParts, value) {
        if (keyParts.length === 1) {
          this._target[keyParts[0]] = value;
          return;
        }
        function index(obj, i) {
          return obj[i];
        }
        let parent = keyParts.slice(0, keyParts.length - 1).reduce(index, this._target);
        parent[keyParts[keyParts.length - 1]] = value;
      }
      _validateValueType(value) {
        return typeof value === "number" || typeof value === "function" || value && value.constructor && value.constructor.lerp;
      }
      onUpdate(callback) {
        this._onUpdate = callback;
        return this;
      }
      then(callback) {
        this._onFinish = callback;
        return this;
      }
      delay(value) {
        this._progress = -value;
        return this;
      }
      easing(easing) {
        this._easing = easing;
        return this;
      }
      smoothDamp(enable) {
        this.easing(enable ? smoothDampEasing : lerp2);
        return this;
      }
      repeats(enable, reverseAnimation) {
        this._originalRepeats = this._repeats = enable;
        this._repeatsWithReverseAnimation = Boolean(reverseAnimation);
        return this;
      }
      from(values) {
        for (let key in values) {
          if (!this._validateValueType(values[key])) {
            throw new Error("Illegal value type to use with Animator! All values must be either numbers, methods, or a class instance that has a static lerp() method.");
          }
          this._fromValues[key] = values[key];
        }
        this._originalFrom = null;
        return this;
      }
      to(values) {
        for (let key in values) {
          if (!this._validateValueType(values[key])) {
            throw new Error("Illegal value type to use with Animator! All values must be either numbers, methods, or a class instance that has a static lerp() method.");
          }
          this._toValues[key] = { keyParts: key.split("."), value: values[key] };
        }
        this._originalTo = null;
        return this;
      }
      flipFromAndTo() {
        let newFrom = {};
        let newTo = {};
        if (!this._originalFrom) {
          this._originalFrom = this._fromValues;
        }
        if (!this._originalTo) {
          this._originalTo = this._toValues;
        }
        for (let key in this._toValues) {
          newFrom[key] = this._toValues[key].value;
          newTo[key] = { keyParts: key.split("."), value: this._fromValues[key] };
        }
        this._fromValues = newFrom;
        this._toValues = newTo;
      }
      duration(seconds) {
        this.speedFactor = 1 / seconds;
        return this;
      }
      reset() {
        if (this._originalFrom) {
          this._fromValues = this._originalFrom;
        }
        if (this._originalTo) {
          this._toValues = this._originalTo;
        }
        if (this._originalRepeats !== null) {
          this._repeats = this._originalRepeats;
        }
        this._progress = 0;
        return this;
      }
      play() {
        if (this._isInAutoUpdate) {
          return;
        }
        _autoAnimators.push(this);
        this._isInAutoUpdate = true;
        return this;
      }
      get ended() {
        return this._progress >= 1;
      }
      static updateAutos(delta) {
        for (let i = _autoAnimators.length - 1; i >= 0; --i) {
          _autoAnimators[i].update(delta);
          if (_autoAnimators[i].ended) {
            _autoAnimators[i]._isInAutoUpdate = false;
            _autoAnimators.splice(i, 1);
          }
        }
      }
    };
    function lerp2(start, end, amt) {
      return (1 - amt) * start + amt * end;
    }
    function linearEasing(t) {
      return t;
    }
    function smoothDampEasing(t) {
      return t * t;
    }
    module.exports = Animator2;
  }
});

// ../Shaku/lib/utils/game_time.js
var require_game_time = __commonJS({
  "../Shaku/lib/utils/game_time.js"(exports, module) {
    "use strict";
    var GameTime = class {
      constructor() {
        this.timestamp = _currElapsed;
        this.deltaTime = {
          milliseconds: _currDelta,
          seconds: _currDelta / 1e3
        };
        this.elapsedTime = {
          milliseconds: _currElapsed,
          seconds: _currElapsed / 1e3
        };
        this.delta = this.deltaTime ? this.deltaTime.seconds : null;
        this.elapsed = this.elapsedTime.seconds;
        Object.freeze(this);
      }
      static update() {
        let curr = getAccurateTimestampMs();
        let delta = 0;
        if (_prevTime) {
          delta = curr - _prevTime;
        }
        _prevTime = curr;
        _currDelta = delta;
        _currElapsed += delta;
      }
      static rawTimestamp() {
        return getAccurateTimestampMs();
      }
      static reset() {
        _prevTime = null;
        _currDelta = 0;
        _currElapsed = 0;
      }
      static resetDelta() {
        _prevTime = null;
        _currDelta = 0;
      }
    };
    var gotPerformance = typeof performance !== "undefined" && performance.now;
    function getAccurateTimestampMs() {
      if (gotPerformance) {
        return performance.now();
      }
      return Date.now();
    }
    var _prevTime = null;
    var _currDelta = 0;
    var _currElapsed = 0;
    module.exports = GameTime;
  }
});

// ../Shaku/lib/utils/seeded_random.js
var require_seeded_random = __commonJS({
  "../Shaku/lib/utils/seeded_random.js"(exports, module) {
    "use strict";
    var SeededRandom = class {
      constructor(seed) {
        if (seed === void 0) {
          seed = 0;
        }
        this.seed = seed;
      }
      random(min, max) {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        let rnd = this.seed / 233280;
        if (min && max) {
          return min + rnd * (max - min);
        } else if (min) {
          return rnd * min;
        }
        return rnd;
      }
      pick(options) {
        return options[Math.floor(this.random(options.length))];
      }
    };
    module.exports = SeededRandom;
  }
});

// ../Shaku/lib/utils/perlin.js
var require_perlin = __commonJS({
  "../Shaku/lib/utils/perlin.js"(exports, module) {
    "use strict";
    var MathHelper = require_math_helper();
    var lerp2 = MathHelper.lerp;
    function fade(t) {
      return t * t * t * (t * (t * 6 - 15) + 10);
    }
    function Grad(x, y, z2) {
      this.x = x;
      this.y = y;
      this.z = z2;
    }
    Grad.prototype.dot2 = function(x, y) {
      return this.x * x + this.y * y;
    };
    var p = [
      151,
      160,
      137,
      91,
      90,
      15,
      131,
      13,
      201,
      95,
      96,
      53,
      194,
      233,
      7,
      225,
      140,
      36,
      103,
      30,
      69,
      142,
      8,
      99,
      37,
      240,
      21,
      10,
      23,
      190,
      6,
      148,
      247,
      120,
      234,
      75,
      0,
      26,
      197,
      62,
      94,
      252,
      219,
      203,
      117,
      35,
      11,
      32,
      57,
      177,
      33,
      88,
      237,
      149,
      56,
      87,
      174,
      20,
      125,
      136,
      171,
      168,
      68,
      175,
      74,
      165,
      71,
      134,
      139,
      48,
      27,
      166,
      77,
      146,
      158,
      231,
      83,
      111,
      229,
      122,
      60,
      211,
      133,
      230,
      220,
      105,
      92,
      41,
      55,
      46,
      245,
      40,
      244,
      102,
      143,
      54,
      65,
      25,
      63,
      161,
      1,
      216,
      80,
      73,
      209,
      76,
      132,
      187,
      208,
      89,
      18,
      169,
      200,
      196,
      135,
      130,
      116,
      188,
      159,
      86,
      164,
      100,
      109,
      198,
      173,
      186,
      3,
      64,
      52,
      217,
      226,
      250,
      124,
      123,
      5,
      202,
      38,
      147,
      118,
      126,
      255,
      82,
      85,
      212,
      207,
      206,
      59,
      227,
      47,
      16,
      58,
      17,
      182,
      189,
      28,
      42,
      223,
      183,
      170,
      213,
      119,
      248,
      152,
      2,
      44,
      154,
      163,
      70,
      221,
      153,
      101,
      155,
      167,
      43,
      172,
      9,
      129,
      22,
      39,
      253,
      19,
      98,
      108,
      110,
      79,
      113,
      224,
      232,
      178,
      185,
      112,
      104,
      218,
      246,
      97,
      228,
      251,
      34,
      242,
      193,
      238,
      210,
      144,
      12,
      191,
      179,
      162,
      241,
      81,
      51,
      145,
      235,
      249,
      14,
      239,
      107,
      49,
      192,
      214,
      31,
      181,
      199,
      106,
      157,
      184,
      84,
      204,
      176,
      115,
      121,
      50,
      45,
      127,
      4,
      150,
      254,
      138,
      236,
      205,
      93,
      222,
      114,
      67,
      29,
      24,
      72,
      243,
      141,
      128,
      195,
      78,
      66,
      215,
      61,
      156,
      180
    ];
    var Perlin2 = class {
      constructor(seed) {
        if (seed === void 0) {
          seed = Math.random();
        }
        this.seed(seed);
      }
      seed(seed) {
        if (seed > 0 && seed < 1) {
          seed *= 65536;
        }
        seed = Math.floor(seed);
        if (seed < 256) {
          seed |= seed << 8;
        }
        var perm = new Array(512);
        var gradP = new Array(512);
        var grad3 = [
          new Grad(1, 1, 0),
          new Grad(-1, 1, 0),
          new Grad(1, -1, 0),
          new Grad(-1, -1, 0),
          new Grad(1, 0, 1),
          new Grad(-1, 0, 1),
          new Grad(1, 0, -1),
          new Grad(-1, 0, -1),
          new Grad(0, 1, 1),
          new Grad(0, -1, 1),
          new Grad(0, 1, -1),
          new Grad(0, -1, -1)
        ];
        for (var i = 0; i < 256; i++) {
          var v;
          if (i & 1) {
            v = p[i] ^ seed & 255;
          } else {
            v = p[i] ^ seed >> 8 & 255;
          }
          perm[i] = perm[i + 256] = v;
          gradP[i] = gradP[i + 256] = grad3[v % 12];
        }
        this._perm = perm;
        this._gradP = gradP;
      }
      generateSmooth(x, y, blurDistance, contrast) {
        if (blurDistance === void 0) {
          blurDistance = 0.25;
        }
        let a = this.generate(x - blurDistance, y - blurDistance, contrast);
        let b = this.generate(x + blurDistance, y + blurDistance, contrast);
        let c = this.generate(x - blurDistance, y + blurDistance, contrast);
        let d = this.generate(x + blurDistance, y - blurDistance, contrast);
        return (a + b + c + d) / 4;
      }
      generate(x, y, contrast) {
        if (contrast === void 0) {
          contrast = 1;
        }
        let perm = this._perm;
        let gradP = this._gradP;
        var X = Math.floor(x), Y = Math.floor(y);
        x = x - X;
        y = y - Y;
        X = X & 255;
        Y = Y & 255;
        var n00 = gradP[X + perm[Y]].dot2(x, y) * contrast;
        var n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1) * contrast;
        var n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y) * contrast;
        var n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1) * contrast;
        var u = fade(x);
        return Math.min(lerp2(
          lerp2(n00, n10, u),
          lerp2(n01, n11, u),
          fade(y)
        ) + 0.5, 1);
      }
    };
    module.exports = Perlin2;
  }
});

// ../Shaku/lib/utils/storage_adapter.js
var require_storage_adapter = __commonJS({
  "../Shaku/lib/utils/storage_adapter.js"(exports, module) {
    "use strict";
    var StorageAdapter = class {
      get persistent() {
        throw new Error("Not Implemented.");
      }
      isValid() {
        throw new Error("Not Implemented.");
      }
      exists(key) {
        throw new Error("Not Implemented.");
      }
      setItem(key, value) {
        throw new Error("Not Implemented.");
      }
      getItem(key) {
        throw new Error("Not Implemented.");
      }
      deleteItem(key) {
        throw new Error("Not Implemented.");
      }
      clear(prefix) {
        throw new Error("Not Implemented.");
      }
    };
    var StorageAdapterMemory = class {
      constructor() {
        this._data = {};
      }
      get persistent() {
        return false;
      }
      isValid() {
        return true;
      }
      exists(key) {
        return Boolean(this._data[key]);
      }
      setItem(key, value) {
        this._data[key] = value;
      }
      getItem(key) {
        return this._data[key];
      }
      deleteItem(key) {
        delete this._data[key];
      }
      clear(prefix) {
        for (let key in this._data) {
          if (key.indexOf(prefix) === 0) {
            delete this._data[key];
          }
        }
      }
    };
    StorageAdapter.memory = StorageAdapterMemory;
    var StorageAdapterLocalStorage = class {
      get persistent() {
        return true;
      }
      isValid() {
        try {
          return typeof localStorage !== "undefined" && localStorage !== null;
        } catch (e) {
          return false;
        }
      }
      exists(key) {
        return localStorage.getItem(key) !== null;
      }
      setItem(key, value) {
        localStorage.setItem(key, value);
      }
      getItem(key) {
        return localStorage.getItem(key);
      }
      deleteItem(key) {
        localStorage.deleteItem(key);
      }
      clear(prefix) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.indexOf(prefix) === 0) {
            delete localStorage.deleteItem(key);
          }
        }
      }
    };
    StorageAdapter.localStorage = StorageAdapterLocalStorage;
    var StorageAdapterSessionStorage = class {
      get persistent() {
        return false;
      }
      isValid() {
        try {
          return typeof sessionStorage !== "undefined" && sessionStorage !== null;
        } catch (e) {
          return false;
        }
      }
      exists(key) {
        return sessionStorage.getItem(key) !== null;
      }
      setItem(key, value) {
        sessionStorage.setItem(key, value);
      }
      getItem(key) {
        return sessionStorage.getItem(key);
      }
      deleteItem(key) {
        sessionStorage.deleteItem(key);
      }
      clear(prefix) {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key.indexOf(prefix) === 0) {
            delete sessionStorage.deleteItem(key);
          }
        }
      }
    };
    StorageAdapter.sessionStorage = StorageAdapterSessionStorage;
    module.exports = StorageAdapter;
  }
});

// ../Shaku/lib/utils/storage.js
var require_storage = __commonJS({
  "../Shaku/lib/utils/storage.js"(exports, module) {
    "use strict";
    var StorageAdapter = require_storage_adapter();
    var Storage = class {
      constructor(adapters, prefix, valuesAsBase64, keysAsBase64) {
        adapters = adapters || Storage.defaultAdapters;
        if (!(adapters instanceof Array)) {
          adapters = [adapters];
        }
        this._adapter = null;
        for (let adapter of adapters) {
          if (adapter.isValid()) {
            this._adapter = adapter;
            break;
          }
        }
        this.valuesAsBase64 = Boolean(valuesAsBase64);
        this.keysAsBase64 = Boolean(keysAsBase64);
        this._keysPrefix = "shaku_storage_" + (prefix || "") + "_";
      }
      get persistent() {
        return this.isValid && this._adapter.persistent;
      }
      get isValid() {
        return Boolean(this._adapter);
      }
      normalizeKey(key) {
        key = this._keysPrefix + key.toString();
        if (this.keysAsBase64) {
          key = btoa(key);
        }
        return key;
      }
      exists(key) {
        if (typeof key !== "string") {
          throw new Error("Key must be a string!");
        }
        key = this.normalizeKey(key);
        return this._adapter.exists(key);
      }
      _set(key, value) {
        value = JSON.stringify({
          data: value,
          timestamp: new Date().getTime(),
          src: "Shaku",
          sver: 1
        });
        if (this.valuesAsBase64) {
          value = btoa(value);
        }
        this._adapter.setItem(key, value);
      }
      _get(key) {
        var value = this._adapter.getItem(key);
        if (value === null) {
          return null;
        }
        if (this.valuesAsBase64) {
          try {
            value = atob(value);
          } catch (e) {
            throw new Error("Failed to parse Base64 string while reading data. Did you try to read a value as Base64 that wasn't encoded as Base64 when written to storage?");
          }
        }
        try {
          value = JSON.parse(value);
        } catch (e) {
          throw new Error("Failed to JSON-parse data from storage. Did you try to read something that wasn't written with the Storage utility?");
        }
        return value.data;
      }
      setItem(key, value) {
        if (typeof key !== "string") {
          throw new Error("Key must be a string!");
        }
        key = this.normalizeKey(key);
        this._set(key, value);
      }
      getItem(key) {
        if (typeof key !== "string") {
          throw new Error("Key must be a string!");
        }
        key = this.normalizeKey(key);
        return this._get(key);
      }
      getJson(key) {
        return this.getItem(key) || null;
      }
      setJson(key, value) {
        key = this.normalizeKey(key);
        this._set(key, value);
      }
      deleteItem(key) {
        if (typeof key !== "string") {
          throw new Error("Key must be a string!");
        }
        key = this.normalizeKey(key);
        this._adapter.deleteItem(key);
      }
      clear() {
        this._adapter.clear(this._keysPrefix);
      }
    };
    Storage.defaultAdapters = [new StorageAdapter.localStorage(), new StorageAdapter.sessionStorage(), new StorageAdapter.memory()];
    module.exports = Storage;
  }
});

// ../Shaku/lib/utils/path_finder.js
var require_path_finder = __commonJS({
  "../Shaku/lib/utils/path_finder.js"(exports, module) {
    "use strict";
    var Vector22 = require_vector2();
    var IGrid = class {
      isBlocked(_from, _to) {
        throw new Error("Not Implemented");
      }
      getPrice(_index) {
        throw new Error("Not Implemented");
      }
    };
    var Node = class {
      constructor(position) {
        this.position = position;
        this.gCost = 0;
        this.hCost = 0;
        this.parent = null;
        this.price = 1;
      }
      get fCost() {
        return this.gCost + this.hCost;
      }
    };
    function findPath(grid, startPos, targetPos, options) {
      let ret = _ImpFindPath(grid, startPos, targetPos, options || {});
      return ret;
    }
    function _ImpFindPath(grid, startPos, targetPos, options) {
      const allowDiagonal = options.allowDiagonal;
      let nodesCache = {};
      function getOrCreateNode(position) {
        let key = position.x + "," + position.y;
        if (nodesCache[key]) {
          return nodesCache[key];
        }
        let ret = new Node(position);
        nodesCache[key] = ret;
        return ret;
      }
      let startNode = getOrCreateNode(startPos);
      let targetNode = getOrCreateNode(targetPos);
      let openSet = [];
      openSet.push(startNode);
      let closedSet = /* @__PURE__ */ new Set();
      function removeFromArray(arr, val) {
        let index = arr.indexOf(val);
        if (index !== -1) {
          arr.splice(index, 1);
        }
      }
      let iterationsCount = -1;
      while (openSet.length > 0) {
        if (options.maxIterations) {
          if (iterationsCount++ > options.maxIterations) {
            break;
          }
        }
        let currentNode = openSet[0];
        for (let i = 1; i < openSet.length; i++) {
          if (openSet[i].fCost <= currentNode.fCost && openSet[i].hCost < currentNode.hCost) {
            currentNode = openSet[i];
          }
        }
        removeFromArray(openSet, currentNode);
        closedSet.add(currentNode);
        if (currentNode == targetNode) {
          let finalPath = retracePath(startNode, targetNode);
          return finalPath;
        }
        let neighbors = [];
        for (let nx = -1; nx <= 1; nx++) {
          for (let ny = -1; ny <= 1; ny++) {
            if (nx === 0 && ny === 0) {
              continue;
            }
            if (!allowDiagonal && (nx !== 0 && ny !== 0)) {
              continue;
            }
            neighbors.push(getOrCreateNode({ x: currentNode.position.x + nx, y: currentNode.position.y + ny, z: currentNode.position.z }));
          }
        }
        for (let neighbor of neighbors) {
          if (closedSet.has(neighbor) || grid.isBlocked(currentNode.position, neighbor.position)) {
            continue;
          }
          let price = options.ignorePrices ? 1 : grid.getPrice(neighbor.position);
          let currStepCost = currentNode.gCost + getDistance(currentNode, neighbor) * price;
          let isInOpenSet = openSet.indexOf(neighbor) !== -1;
          if (!isInOpenSet || currStepCost < neighbor.gCost) {
            neighbor.gCost = currStepCost;
            neighbor.hCost = getDistance(neighbor, targetNode);
            neighbor.parent = currentNode;
            if (!isInOpenSet) {
              openSet.push(neighbor);
            }
          }
        }
      }
      return null;
    }
    function retracePath(startNode, endNode) {
      let path = [];
      let currentNode = endNode;
      while (currentNode !== startNode) {
        path.unshift(currentNode.position);
        currentNode = currentNode.parent;
      }
      return path;
    }
    function getDistance(pa, pb) {
      let dx = pa.position.x - pb.position.x;
      let dy = pa.position.y - pb.position.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    var PathFinder = {
      findPath,
      IGrid
    };
    module.exports = PathFinder;
  }
});

// ../Shaku/lib/utils/transform_modes.js
var require_transform_modes = __commonJS({
  "../Shaku/lib/utils/transform_modes.js"(exports, module) {
    "use strict";
    var TransformModes = {
      Relative: "relative",
      AxisAligned: "axis-aligned",
      Absolute: "absolute"
    };
    module.exports = TransformModes;
  }
});

// ../Shaku/lib/utils/transformation.js
var require_transformation = __commonJS({
  "../Shaku/lib/utils/transformation.js"(exports, module) {
    "use strict";
    var MathHelper = require_math_helper();
    var TransformModes = require_transform_modes();
    var Matrix = require_matrix();
    var Vector22 = require_vector2();
    var _defaults = {};
    _defaults.position = Vector22.zero;
    _defaults.positionMode = TransformModes.Relative;
    _defaults.scale = Vector22.one;
    _defaults.scaleMode = TransformModes.AxisAligned;
    _defaults.rotation = 0;
    _defaults.rotationMode = TransformModes.Relative;
    var Transformation = class {
      constructor(position, rotation, scale) {
        this._position = position || _defaults.position.clone();
        this._positionMode = _defaults.positionMode;
        this._scale = scale || _defaults.scale.clone();
        this._scaleMode = _defaults.scaleMode;
        this._rotation = rotation || _defaults.rotation;
        this._rotationMode = _defaults.rotationMode;
        this.onChange = null;
      }
      getPosition() {
        return this._position.clone();
      }
      getPositionMode() {
        return this._positionMode;
      }
      setPosition(value) {
        if (this._position.equals(value)) {
          return;
        }
        this._position.copy(value);
        this._markDirty(true, false);
        return this;
      }
      setPositionX(value) {
        if (this._position.x === value) {
          return;
        }
        this._position.x = value;
        this._markDirty(true, false);
        return this;
      }
      setPositionY(value) {
        if (this._position.y === value) {
          return;
        }
        this._position.y = value;
        this._markDirty(true, false);
        return this;
      }
      move(value) {
        this._position.addSelf(value);
        this._markDirty(true, false);
        return this;
      }
      setPositionMode(value) {
        if (this._positionMode === value) {
          return;
        }
        this._positionMode = value;
        this._markDirty(false, true);
        return this;
      }
      getScale() {
        return this._scale.clone();
      }
      getScaleMode() {
        return this._scaleMode;
      }
      setScale(value) {
        if (this._scale.equals(value)) {
          return;
        }
        this._scale.copy(value);
        this._markDirty(true, false);
        return this;
      }
      setScaleX(value) {
        if (this._scale.x === value) {
          return;
        }
        this._scale.x = value;
        this._markDirty(true, false);
        return this;
      }
      setScaleY(value) {
        if (this._scale.y === value) {
          return;
        }
        this._scale.y = value;
        this._markDirty(true, false);
        return this;
      }
      scale(value) {
        this._scale.mulSelf(value);
        this._markDirty(true, false);
        return this;
      }
      setScaleMode(value) {
        if (this._scaleMode === value) {
          return;
        }
        this._scaleMode = value;
        this._markDirty(false, true);
        return this;
      }
      getRotation() {
        return this._rotation;
      }
      getRotationDegrees() {
        return MathHelper.toDegrees(this._rotation);
      }
      getRotationDegreesWrapped() {
        let ret = this.getRotationDegrees();
        return MathHelper.wrapDegrees(ret);
      }
      getRotationMode() {
        return this._rotationMode;
      }
      setRotation(value, wrap) {
        if (this._rotation === value) {
          return;
        }
        this._rotation = value;
        if (wrap && (this._rotation < 0 || this._rotation > Math.PI * 2)) {
          this._rotation = Math.atan2(Math.sin(this._rotation), Math.cos(this._rotation));
        }
        this._markDirty(true, false);
        return this;
      }
      rotate(value, wrap) {
        this.setRotation(this._rotation + value, wrap);
        return this;
      }
      setRotationDegrees(value, wrap) {
        const rads = MathHelper.toRadians(value, wrap);
        return this.setRotation(rads);
      }
      rotateDegrees(value) {
        this._rotation += MathHelper.toRadians(value);
        this._markDirty(true, false);
        return this;
      }
      setRotationMode(value) {
        if (this._rotationMode === value) {
          return;
        }
        this._rotationMode = value;
        this._markDirty(false, true);
        return this;
      }
      _markDirty(localTransform, transformationModes) {
        this._matrix = null;
        if (this.onChange) {
          this.onChange(this, localTransform, transformationModes);
        }
      }
      equals(other) {
        return this._rotation === other._rotation && this._position.equals(other._position) && this._scale.equals(other._scale);
      }
      clone() {
        const ret = new Transformation(this._position.clone(), this._rotation, this._scale.clone());
        ret._rotationMode = this._rotationMode;
        ret._positionMode = this._positionMode;
        ret._scaleMode = this._scaleMode;
        ret._matrix = this._matrix;
        return ret;
      }
      serialize() {
        const ret = {};
        if (!this._position.equals(_defaults.position)) {
          ret.pos = this._position;
        }
        if (this._positionMode !== _defaults.positionMode) {
          ret.posm = this._positionMode;
        }
        if (!this._scale.equals(_defaults.scale)) {
          ret.scl = this._scale;
        }
        if (this._scaleMode !== _defaults.scaleMode) {
          ret.sclm = this._scaleMode;
        }
        if (this._rotation !== _defaults.rotation) {
          ret.rot = Math.floor(MathHelper.toDegrees(this._rotation));
        }
        if (this._rotationMode !== _defaults.rotationMode) {
          ret.rotm = this._rotationMode;
        }
        return ret;
      }
      deserialize(data) {
        this._position.copy(data.pos || _defaults.position);
        this._scale.copy(data.scl || _defaults.scale);
        this._rotation = MathHelper.toRadians(data.rot || _defaults.rotation);
        this._positionMode = data.posm || _defaults.positionMode;
        this._scaleMode = data.sclm || _defaults.scaleMode;
        this._rotationMode = data.rotm || _defaults.rotationMode;
        this._markDirty(true, true);
      }
      asMatrix() {
        if (this._matrix) {
          return this._matrix;
        }
        let matrices = [];
        if (this._position.x !== 0 || this._position.y !== 0) {
          matrices.push(Matrix.translate(this._position.x, this._position.y, 0));
        }
        if (this._rotation) {
          matrices.push(Matrix.rotateZ(-this._rotation));
        }
        if (this._scale.x !== 1 || this._scale.y !== 1) {
          matrices.push(Matrix.scale(this._scale.x, this._scale.y));
        }
        if (matrices.length === 0) {
          this._matrix = Matrix.identity;
        } else if (matrices.length === 1) {
          this._matrix = matrices[0];
        } else {
          this._matrix = Matrix.multiplyMany(matrices);
        }
        return this._matrix;
      }
      static combine(child, parent) {
        var position = combineVector(child._position, parent._position, parent, child._positionMode);
        var scale = combineVectorMul(child._scale, parent._scale, parent, child._scaleMode);
        var rotation = combineScalar(child._rotation, parent._rotation, parent, child._rotationMode);
        return new Transformation(position, rotation, scale);
      }
    };
    function combineScalar(childValue, parentValue, parent, mode) {
      switch (mode) {
        case TransformModes.Absolute:
          return childValue;
        case TransformModes.AxisAligned:
        case TransformModes.Relative:
          return parentValue + childValue;
        default:
          throw new Error("Unknown transform mode!");
      }
    }
    function combineVector(childValue, parentValue, parent, mode) {
      switch (mode) {
        case TransformModes.Absolute:
          return childValue.clone();
        case TransformModes.AxisAligned:
          return parentValue.add(childValue);
        case TransformModes.Relative:
          return parentValue.add(childValue.rotatedRadians(parent._rotation));
        default:
          throw new Error("Unknown transform mode!");
      }
    }
    function combineVectorMul(childValue, parentValue, parent, mode) {
      switch (mode) {
        case TransformModes.Absolute:
          return childValue.clone();
        case TransformModes.AxisAligned:
          return parentValue.mul(childValue);
        case TransformModes.Relative:
          return parentValue.mul(childValue.rotatedRadians(parent._rotation));
        default:
          throw new Error("Unknown transform mode!");
      }
    }
    module.exports = Transformation;
  }
});

// ../Shaku/lib/utils/index.js
var require_utils = __commonJS({
  "../Shaku/lib/utils/index.js"(exports, module) {
    "use strict";
    module.exports = {
      Vector2: require_vector2(),
      Vector3: require_vector3(),
      Rectangle: require_rectangle(),
      Circle: require_circle(),
      Line: require_line(),
      Color: require_color(),
      Animator: require_animator(),
      GameTime: require_game_time(),
      MathHelper: require_math_helper(),
      SeededRandom: require_seeded_random(),
      Perlin: require_perlin(),
      Storage: require_storage(),
      StorageAdapter: require_storage_adapter(),
      PathFinder: require_path_finder(),
      Transformation: require_transformation(),
      TransformationModes: require_transform_modes()
    };
  }
});

// ../Shaku/lib/gfx/vertex.js
var require_vertex = __commonJS({
  "../Shaku/lib/gfx/vertex.js"(exports, module) {
    "use strict";
    var { Vector2: Vector22, Color: Color3 } = require_utils();
    var Matrix = require_matrix();
    var Vertex = class {
      constructor(position, textureCoord, color) {
        this.position = position || Vector22.zero;
        this.textureCoord = textureCoord || Vector22.zero;
        this.color = color || Color3.white;
      }
      transform(matrix) {
        return this;
      }
      setPosition(position) {
        this.position = position.clone();
        return this;
      }
      setTextureCoords(textureCoord) {
        this.textureCoord = textureCoord.clone();
        return this;
      }
      setColor(color) {
        this.color = color.clone();
        return this;
      }
    };
    module.exports = Vertex;
  }
});

// ../Shaku/lib/gfx/matrix.js
var require_matrix = __commonJS({
  "../Shaku/lib/gfx/matrix.js"(exports, module) {
    "use strict";
    var Vector22 = require_vector2();
    var Vertex = require_vertex();
    var Matrix = class {
      constructor(values, cloneValues) {
        if (!values) {
          values = Matrix.identity.values;
        }
        if (cloneValues || cloneValues === void 0) {
          this.values = values.slice(0);
        } else {
          this.values = values;
        }
      }
      set(v11, v12, v13, v14, v21, v22, v23, v24, v31, v32, v33, v34, v41, v42, v43, v44) {
        this.values = new Float32Array([
          v11,
          v12,
          v13,
          v14,
          v21,
          v22,
          v23,
          v24,
          v31,
          v32,
          v33,
          v34,
          v41,
          v42,
          v43,
          v44
        ]);
      }
      clone() {
        let ret = new Matrix(this.values, true);
        return ret;
      }
      equals(other) {
        if (other === this) {
          return true;
        }
        if (!other) {
          return false;
        }
        for (let i = 0; i < this.values.length; ++i) {
          if (this.values[i] !== other.values[i]) {
            return false;
          }
        }
        return true;
      }
      static orthographic(left, right, bottom, top, near, far) {
        return new Matrix([
          2 / (right - left),
          0,
          0,
          0,
          0,
          2 / (top - bottom),
          0,
          0,
          0,
          0,
          2 / (near - far),
          0,
          (left + right) / (left - right),
          (bottom + top) / (bottom - top),
          (near + far) / (near - far),
          1
        ], false);
      }
      static perspective(fieldOfViewInRadians, aspectRatio, near, far) {
        var f = 1 / Math.tan(fieldOfViewInRadians / 2);
        var rangeInv = 1 / (near - far);
        return new Matrix([
          f / aspectRatio,
          0,
          0,
          0,
          0,
          f,
          0,
          0,
          0,
          0,
          (near + far) * rangeInv,
          -1,
          0,
          0,
          near * far * rangeInv * 2,
          0
        ], false);
      }
      static translate(x, y, z2) {
        return new Matrix([
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          x || 0,
          y || 0,
          z2 || 0,
          1
        ], false);
      }
      static scale(x, y, z2) {
        return new Matrix([
          x || 1,
          0,
          0,
          0,
          0,
          y || 1,
          0,
          0,
          0,
          0,
          z2 || 1,
          0,
          0,
          0,
          0,
          1
        ], false);
      }
      static rotateX(a) {
        let sin = Math.sin;
        let cos = Math.cos;
        return new Matrix([
          1,
          0,
          0,
          0,
          0,
          cos(a),
          -sin(a),
          0,
          0,
          sin(a),
          cos(a),
          0,
          0,
          0,
          0,
          1
        ], false);
      }
      static rotateY(a) {
        let sin = Math.sin;
        let cos = Math.cos;
        return new Matrix([
          cos(a),
          0,
          sin(a),
          0,
          0,
          1,
          0,
          0,
          -sin(a),
          0,
          cos(a),
          0,
          0,
          0,
          0,
          1
        ], false);
      }
      static rotateZ(a) {
        let sin = Math.sin;
        let cos = Math.cos;
        return new Matrix([
          cos(a),
          -sin(a),
          0,
          0,
          sin(a),
          cos(a),
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1
        ], false);
      }
      static multiply(matrixA, matrixB) {
        let row0 = [matrixB.values[0], matrixB.values[1], matrixB.values[2], matrixB.values[3]];
        let row1 = [matrixB.values[4], matrixB.values[5], matrixB.values[6], matrixB.values[7]];
        let row2 = [matrixB.values[8], matrixB.values[9], matrixB.values[10], matrixB.values[11]];
        let row3 = [matrixB.values[12], matrixB.values[13], matrixB.values[14], matrixB.values[15]];
        let result0 = multiplyMatrixAndPoint(matrixA.values, row0);
        let result1 = multiplyMatrixAndPoint(matrixA.values, row1);
        let result2 = multiplyMatrixAndPoint(matrixA.values, row2);
        let result3 = multiplyMatrixAndPoint(matrixA.values, row3);
        return new Matrix([
          result0[0],
          result0[1],
          result0[2],
          result0[3],
          result1[0],
          result1[1],
          result1[2],
          result1[3],
          result2[0],
          result2[1],
          result2[2],
          result2[3],
          result3[0],
          result3[1],
          result3[2],
          result3[3]
        ], false);
      }
      static multiplyMany(matrices) {
        let ret = matrices[0];
        for (let i = 1; i < matrices.length; i++) {
          ret = Matrix.multiply(ret, matrices[i]);
        }
        return ret;
      }
      static multiplyIntoFirst(matrixA, matrixB) {
        let row0 = [matrixB.values[0], matrixB.values[1], matrixB.values[2], matrixB.values[3]];
        let row1 = [matrixB.values[4], matrixB.values[5], matrixB.values[6], matrixB.values[7]];
        let row2 = [matrixB.values[8], matrixB.values[9], matrixB.values[10], matrixB.values[11]];
        let row3 = [matrixB.values[12], matrixB.values[13], matrixB.values[14], matrixB.values[15]];
        let result0 = multiplyMatrixAndPoint(matrixA.values, row0);
        let result1 = multiplyMatrixAndPoint(matrixA.values, row1);
        let result2 = multiplyMatrixAndPoint(matrixA.values, row2);
        let result3 = multiplyMatrixAndPoint(matrixA.values, row3);
        matrixA.set(
          result0[0],
          result0[1],
          result0[2],
          result0[3],
          result1[0],
          result1[1],
          result1[2],
          result1[3],
          result2[0],
          result2[1],
          result2[2],
          result2[3],
          result3[0],
          result3[1],
          result3[2],
          result3[3]
        );
        return matrixA;
      }
      static multiplyManyIntoFirst(matrices) {
        let ret = matrices[0];
        for (let i = 1; i < matrices.length; i++) {
          ret = Matrix.multiplyIntoFirst(ret, matrices[i]);
        }
        return ret;
      }
      static transformVertex(matrix, vertex) {
        return new Vertex(Matrix.transformVector2(matrix, vertex.position), vertex.textureCoord, vertex.color);
      }
      static transformVector2(matrix, vector) {
        const x = vector.x, y = vector.y, z2 = vector.z || 0;
        const e = matrix.values;
        const w = 1 / (e[3] * x + e[7] * y + e[11] * z2 + e[15]);
        const resx = (e[0] * x + e[4] * y + e[8] * z2 + e[12]) * w;
        const resy = (e[1] * x + e[5] * y + e[9] * z2 + e[13]) * w;
        return new Vector22(resx, resy);
      }
      static transformVector3(matrix, vector) {
        const x = vector.x, y = vector.y, z2 = vector.z || 0;
        const e = matrix.values;
        const w = 1 / (e[3] * x + e[7] * y + e[11] * z2 + e[15]);
        const resx = (e[0] * x + e[4] * y + e[8] * z2 + e[12]) * w;
        const resy = (e[1] * x + e[5] * y + e[9] * z2 + e[13]) * w;
        const resz = (e[2] * x + e[6] * y + e[10] * z2 + e[14]) * w;
        return new Vector3(resx, resy, resz);
      }
    };
    function multiplyMatrixAndPoint(matrix, point) {
      let c0r0 = matrix[0], c1r0 = matrix[1], c2r0 = matrix[2], c3r0 = matrix[3];
      let c0r1 = matrix[4], c1r1 = matrix[5], c2r1 = matrix[6], c3r1 = matrix[7];
      let c0r2 = matrix[8], c1r2 = matrix[9], c2r2 = matrix[10], c3r2 = matrix[11];
      let c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];
      let x = point[0];
      let y = point[1];
      let z2 = point[2];
      let w = point[3];
      let resultX = x * c0r0 + y * c0r1 + z2 * c0r2 + w * c0r3;
      let resultY = x * c1r0 + y * c1r1 + z2 * c1r2 + w * c1r3;
      let resultZ = x * c2r0 + y * c2r1 + z2 * c2r2 + w * c2r3;
      let resultW = x * c3r0 + y * c3r1 + z2 * c3r2 + w * c3r3;
      return [resultX, resultY, resultZ, resultW];
    }
    Matrix.identity = new Matrix([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ], false);
    Object.freeze(Matrix.identity);
    module.exports = Matrix;
  }
});

// ../Shaku/lib/gfx/effects/effect.js
var require_effect = __commonJS({
  "../Shaku/lib/gfx/effects/effect.js"(exports, module) {
    "use strict";
    var TextureAsset = require_texture_asset();
    var Color3 = require_color();
    var Rectangle2 = require_rectangle();
    var { TextureFilterMode, TextureFilterModes: TextureFilterModes2 } = require_texture_filter_modes();
    var { TextureWrapMode, TextureWrapModes: TextureWrapModes2 } = require_texture_wrap_modes();
    var Matrix = require_matrix();
    var _logger = require_logger().getLogger("gfx-effect");
    var Effect3 = class {
      _build(gl) {
        let program = gl.createProgram();
        {
          let shader = compileShader(gl, this.vertexCode, gl.VERTEX_SHADER);
          gl.attachShader(program, shader);
        }
        {
          let shader = compileShader(gl, this.fragmentCode, gl.FRAGMENT_SHADER);
          gl.attachShader(program, shader);
        }
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          _logger.error("Error linking shader program:");
          _logger.error(gl.getProgramInfoLog(program));
          throw new Error("Failed to link shader program.");
        }
        this._gl = gl;
        this._program = program;
        this.uniforms = {};
        this._uniformBinds = {};
        for (let uniform in this.uniformTypes) {
          let uniformLocation = this._gl.getUniformLocation(this._program, uniform);
          if (uniformLocation === -1) {
            _logger.error("Could not find uniform: " + uniform);
            throw new Error(`Uniform named '${uniform}' was not found in shader code!`);
          }
          let uniformData = this.uniformTypes[uniform];
          if (!UniformTypes._values.has(uniformData.type)) {
            _logger.error("Uniform has invalid type: " + uniformData.type);
            throw new Error(`Uniform '${uniform}' have illegal value type '${uniformData.type}'!`);
          }
          if (uniformData.type === UniformTypes.Matrix) {
            (function(_this, name, location, method) {
              _this.uniforms[name] = (mat) => {
                _this._gl[method](location, false, mat);
              };
            })(this, uniform, uniformLocation, uniformData.type);
          } else if (uniformData.type === UniformTypes.Texture) {
            (function(_this, name, location, method) {
              _this.uniforms[name] = (texture, index) => {
                index = index || 0;
                const glTexture = texture.texture || texture;
                const textureCode = _this._gl["TEXTURE" + (index || 0)];
                _this._gl.activeTexture(textureCode);
                _this._gl.bindTexture(_this._gl.TEXTURE_2D, glTexture);
                _this._gl.uniform1i(location, index || 0);
                if (texture.filter) {
                  _setTextureFilter(_this._gl, texture.filter);
                }
                if (texture.wrapMode) {
                  _setTextureWrapMode(_this._gl, texture.wrapMode);
                }
              };
            })(this, uniform, uniformLocation, uniformData.type);
          } else {
            (function(_this, name, location, method) {
              _this.uniforms[name] = (v1, v2, v3, v4) => {
                _this._gl[method](location, v1, v2, v3, v4);
              };
            })(this, uniform, uniformLocation, uniformData.type);
          }
          let bindTo = uniformData.bind;
          if (bindTo) {
            this._uniformBinds[bindTo] = uniform;
          }
        }
        this.attributes = {};
        this._attributeBinds = {};
        for (let attr in this.attributeTypes) {
          let attributeLocation = this._gl.getAttribLocation(this._program, attr);
          if (attributeLocation === -1) {
            _logger.error("Could not find attribute: " + attr);
            throw new Error(`Attribute named '${attr}' was not found in shader code!`);
          }
          let attributeData = this.attributeTypes[attr];
          (function(_this, name, location, data) {
            _this.attributes[name] = (buffer) => {
              if (buffer) {
                _this._gl.bindBuffer(_this._gl.ARRAY_BUFFER, buffer);
                _this._gl.vertexAttribPointer(location, data.size, _this._gl[data.type] || _this._gl.FLOAT, data.normalize || false, data.stride || 0, data.offset || 0);
                _this._gl.enableVertexAttribArray(location);
              } else {
                _this._gl.disableVertexAttribArray(location);
              }
            };
          })(this, attr, attributeLocation, attributeData);
          let bindTo = attributeData.bind;
          if (bindTo) {
            this._attributeBinds[bindTo] = attr;
          }
        }
        this._cachedValues = {};
      }
      get uniformTypes() {
        throw new Error("Not Implemented!");
      }
      get attributeTypes() {
        throw new Error("Not Implemented!");
      }
      setAsActive() {
        this._gl.useProgram(this._program);
        if (this.enableDepthTest) {
          this._gl.enable(this._gl.DEPTH_TEST);
        } else {
          this._gl.disable(this._gl.DEPTH_TEST);
        }
        if (this.enableFaceCulling) {
          this._gl.enable(this._gl.CULL_FACE);
        } else {
          this._gl.disable(this._gl.CULL_FACE);
        }
        if (this.enableStencilTest) {
          this._gl.enable(this._gl.STENCIL_TEST);
        } else {
          this._gl.disable(this._gl.STENCIL_TEST);
        }
        if (this.enableDithering) {
          this._gl.enable(this._gl.DITHER);
        } else {
          this._gl.disable(this._gl.DITHER);
        }
        this._cachedValues = {};
      }
      prepareToDrawBatch(mesh, world) {
        this._cachedValues = {};
        this.setPositionsAttribute(mesh.positions);
        this.setTextureCoordsAttribute(mesh.textureCoords);
        this.setColorsAttribute(mesh.colors);
        this.setWorldMatrix(world);
      }
      get vertexCode() {
        throw new Error("Not Implemented!");
      }
      get fragmentCode() {
        throw new Error("Not Implemented!");
      }
      get enableDepthTest() {
        return false;
      }
      get enableFaceCulling() {
        return false;
      }
      get enableStencilTest() {
        return false;
      }
      get enableDithering() {
        return false;
      }
      setTexture(texture) {
        if (texture === this._cachedValues.texture) {
          return false;
        }
        let uniform = this._uniformBinds[Effect3.UniformBinds.MainTexture];
        if (uniform) {
          this._cachedValues.texture = texture;
          let glTexture = texture.texture || texture;
          this._gl.activeTexture(this._gl.TEXTURE0);
          this._gl.bindTexture(this._gl.TEXTURE_2D, glTexture);
          this.uniforms[uniform](texture, 0);
          return true;
        }
        return false;
      }
      setColor(color) {
        let uniform = this._uniformBinds[Effect3.UniformBinds.Color];
        if (uniform) {
          if (color.equals(this._cachedValues.color)) {
            return;
          }
          this._cachedValues.color = color.clone();
          this.uniforms[uniform](color.floatArray);
        }
      }
      setUvOffsetAndScale(sourceRect, texture) {
        if (sourceRect) {
          if (sourceRect.equals(this._cachedValues.sourceRect)) {
            return;
          }
        } else {
          if (this._cachedValues.sourceRect === null) {
            return;
          }
        }
        this._cachedValues.sourceRect = sourceRect ? sourceRect.clone() : null;
        if (!sourceRect) {
          sourceRect = new Rectangle2(0, 0, texture.width, texture.height);
        }
        let uvOffset = this._uniformBinds[Effect3.UniformBinds.UvOffset];
        if (uvOffset) {
          this.uniforms[uvOffset](sourceRect.x / texture.width, sourceRect.y / texture.height);
        }
        let uvScale = this._uniformBinds[Effect3.UniformBinds.UvScale];
        if (uvScale) {
          this.uniforms[uvScale](sourceRect.width / texture.width, sourceRect.height / texture.height);
        }
      }
      setProjectionMatrix(matrix) {
        let uniform = this._uniformBinds[Effect3.UniformBinds.Projection];
        if (uniform) {
          if (matrix.equals(this._cachedValues.projection)) {
            return;
          }
          this._cachedValues.projection = matrix.clone();
          this.uniforms[uniform](matrix.values);
        }
      }
      setWorldMatrix(matrix) {
        let uniform = this._uniformBinds[Effect3.UniformBinds.World];
        if (uniform) {
          this.uniforms[uniform](matrix.values);
        }
      }
      setPositionsAttribute(buffer) {
        let attr = this._attributeBinds[Effect3.AttributeBinds.Position];
        if (attr) {
          if (buffer === this._cachedValues.positions) {
            return;
          }
          this._cachedValues.positions = buffer;
          this.attributes[attr](buffer);
        }
      }
      setTextureCoordsAttribute(buffer) {
        let attr = this._attributeBinds[Effect3.AttributeBinds.TextureCoords];
        if (attr) {
          if (buffer === this._cachedValues.coords) {
            return;
          }
          this._cachedValues.coords = buffer;
          this.attributes[attr](buffer);
        }
      }
      setColorsAttribute(buffer) {
        let attr = this._attributeBinds[Effect3.AttributeBinds.Colors];
        if (attr) {
          if (buffer === this._cachedValues.colors) {
            return;
          }
          this._cachedValues.colors = buffer;
          this.attributes[attr](buffer);
        }
      }
    };
    function compileShader(gl, code, type) {
      let shader = gl.createShader(type);
      gl.shaderSource(shader, code);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        _logger.error(`Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader:`);
        _logger.error(gl.getShaderInfoLog(shader));
        throw new Error("Failed to compile a shader.");
      }
      return shader;
    }
    var UniformTypes = {
      Texture: "texture",
      Matrix: "uniformMatrix4fv",
      Color: "uniform4fv",
      Float: "uniform1f",
      FloatArray: "uniform1fv",
      Int: "uniform1i",
      IntArray: "uniform1iv",
      Float2: "uniform2f",
      Float2Array: "uniform2fv",
      Int2: "uniform2i",
      Int2Array: "uniform2iv",
      Float3: "uniform3f",
      Float3Array: "uniform3fv",
      Int3: "uniform3i",
      Int3Array: "uniform3iv",
      Float4: "uniform4f",
      Float4Array: "uniform4fv",
      Int4: "uniform4i",
      Int4Array: "uniform4iv"
    };
    Object.defineProperty(UniformTypes, "_values", {
      value: new Set(Object.values(UniformTypes)),
      writable: false
    });
    Object.freeze(UniformTypes);
    Effect3.UniformTypes = UniformTypes;
    Effect3.UniformBinds = {
      MainTexture: "texture",
      Color: "color",
      Projection: "projection",
      World: "world",
      UvOffset: "uvOffset",
      UvScale: "uvScale"
    };
    Object.freeze(Effect3.UniformBinds);
    Effect3.AttributeTypes = {
      Byte: "BYTE",
      Short: "SHORT",
      UByte: "UNSIGNED_BYTE",
      UShort: "UNSIGNED_SHORT",
      Float: "FLOAT",
      HalfFloat: "HALF_FLOAT"
    };
    Object.freeze(Effect3.AttributeTypes);
    Effect3.AttributeBinds = {
      Position: "position",
      TextureCoords: "uvs",
      Colors: "colors"
    };
    Object.freeze(Effect3.AttributeBinds);
    function _setTextureFilter(gl, filter) {
      if (!TextureFilterModes2._values.has(filter)) {
        throw new Error("Invalid texture filter mode! Please pick a value from 'TextureFilterModes'.");
      }
      let glMode = gl[filter];
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glMode);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glMode);
    }
    function _setTextureWrapMode(gl, wrapX, wrapY) {
      if (wrapY === void 0) {
        wrapY = wrapX;
      }
      if (!TextureWrapModes2._values.has(wrapX)) {
        throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'.");
      }
      if (!TextureWrapModes2._values.has(wrapY)) {
        throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'.");
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[wrapX]);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[wrapY]);
    }
    module.exports = Effect3;
  }
});

// ../Shaku/lib/gfx/effects/basic.js
var require_basic = __commonJS({
  "../Shaku/lib/gfx/effects/basic.js"(exports, module) {
    "use strict";
    var Effect3 = require_effect();
    var vertexShader3 = `
attribute vec3 position;
attribute vec2 coord;
attribute vec4 color;

uniform mat4 projection;
uniform mat4 world;

varying vec2 v_texCoord;
varying vec4 v_color;

void main(void) {
    gl_Position = projection * world * vec4(position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = coord;
    v_color = color;
}
    `;
    var fragmentShader3 = `  
#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D texture;

varying vec2 v_texCoord;
varying vec4 v_color;

void main(void) {
    gl_FragColor = texture2D(texture, v_texCoord) * v_color;
    gl_FragColor.rgb *= gl_FragColor.a;
}
    `;
    var BasicEffect = class extends Effect3 {
      get vertexCode() {
        return vertexShader3;
      }
      get fragmentCode() {
        return fragmentShader3;
      }
      get uniformTypes() {
        return {
          "texture": { type: Effect3.UniformTypes.Texture, bind: Effect3.UniformBinds.MainTexture },
          "projection": { type: Effect3.UniformTypes.Matrix, bind: Effect3.UniformBinds.Projection },
          "world": { type: Effect3.UniformTypes.Matrix, bind: Effect3.UniformBinds.World }
        };
      }
      get attributeTypes() {
        return {
          "position": { size: 3, type: Effect3.AttributeTypes.Float, normalize: false, bind: Effect3.AttributeBinds.Position },
          "coord": { size: 2, type: Effect3.AttributeTypes.Float, normalize: false, bind: Effect3.AttributeBinds.TextureCoords },
          "color": { size: 4, type: Effect3.AttributeTypes.Float, normalize: false, bind: Effect3.AttributeBinds.Colors }
        };
      }
    };
    module.exports = BasicEffect;
  }
});

// ../Shaku/lib/gfx/effects/msdf_font.js
var require_msdf_font = __commonJS({
  "../Shaku/lib/gfx/effects/msdf_font.js"(exports, module) {
    "use strict";
    var Effect3 = require_effect();
    var vertexShader3 = `#version 300 es
in vec3 a_position;
in vec2 a_coord;
in vec4 a_color;

uniform mat4 u_projection;
uniform mat4 u_world;

out vec2 v_texCoord;
out vec4 v_color;

void main(void) {
    gl_Position = u_projection * u_world * vec4(a_position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = a_coord;
    v_color = a_color;
}`;
    var fragmentShader3 = `#version 300 es
precision highp float;

uniform sampler2D u_texture;

in vec2 v_texCoord;
in vec4 v_color;

out vec4 FragColor;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main(void) {
  vec3 _sample = texture(u_texture, v_texCoord).rgb;
  float sigDist = median(_sample.r, _sample.g, _sample.b) - 0.5;
  float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
  // float alpha = clamp((sigDist / (fwidth(sigDist) * 1.5)) + 0.5, 0.0, 1.0);

  vec3 color = v_color.rgb * alpha;
  FragColor = vec4(color, alpha) * v_color.a;
}`;
    var MsdfFontEffect = class extends Effect3 {
      get vertexCode() {
        return vertexShader3;
      }
      get fragmentCode() {
        return fragmentShader3;
      }
      get uniformTypes() {
        return {
          "u_texture": { type: Effect3.UniformTypes.Texture, bind: Effect3.UniformBinds.MainTexture },
          "u_projection": { type: Effect3.UniformTypes.Matrix, bind: Effect3.UniformBinds.Projection },
          "u_world": { type: Effect3.UniformTypes.Matrix, bind: Effect3.UniformBinds.World }
        };
      }
      get attributeTypes() {
        return {
          "a_position": { size: 3, type: Effect3.AttributeTypes.Float, normalize: false, bind: Effect3.AttributeBinds.Position },
          "a_coord": { size: 2, type: Effect3.AttributeTypes.Float, normalize: false, bind: Effect3.AttributeBinds.TextureCoords },
          "a_color": { size: 4, type: Effect3.AttributeTypes.Float, normalize: false, bind: Effect3.AttributeBinds.Colors }
        };
      }
    };
    module.exports = MsdfFontEffect;
  }
});

// ../Shaku/lib/gfx/effects/index.js
var require_effects = __commonJS({
  "../Shaku/lib/gfx/effects/index.js"(exports, module) {
    "use strict";
    module.exports = {
      Effect: require_effect(),
      BasicEffect: require_basic(),
      MsdfFontEffect: require_msdf_font()
    };
  }
});

// ../Shaku/lib/gfx/mesh.js
var require_mesh = __commonJS({
  "../Shaku/lib/gfx/mesh.js"(exports, module) {
    "use strict";
    var { Color: Color3 } = require_utils();
    var Mesh = class {
      constructor(positions, textureCoords, colorsBuffer, indices, indicesCount) {
        this.positions = positions;
        this.textureCoords = textureCoords;
        this.colors = colorsBuffer;
        this.indices = indices;
        this.indicesCount = indicesCount;
        this.__color = new Color3(-1, -1, -1, -1);
        Object.freeze(this);
      }
      overrideColors(gl, color) {
        if (color.equals(this.__color)) {
          return;
        }
        this.__color.copy(color);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colors);
        const colors = [];
        for (let i = 0; i < this.indicesCount; ++i) {
          colors.push(color.r);
          colors.push(color.g);
          colors.push(color.b);
          colors.push(color.a);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
      }
    };
    module.exports = Mesh;
  }
});

// ../Shaku/lib/gfx/mesh_generator.js
var require_mesh_generator = __commonJS({
  "../Shaku/lib/gfx/mesh_generator.js"(exports, module) {
    "use strict";
    var Mesh = require_mesh();
    var MeshGenerator = class {
      constructor(gl) {
        this._gl = gl;
      }
      quad() {
        const gl = this._gl;
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        let x = 0.5;
        const positions = [
          -x,
          -x,
          0,
          x,
          -x,
          0,
          -x,
          x,
          0,
          x,
          x,
          0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        const textureCoordinates = [
          0,
          0,
          1,
          0,
          0,
          1,
          1,
          1
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
        const colorsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
        const colors = [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        const indices = [
          0,
          1,
          3,
          2
        ];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        return new Mesh(positionBuffer, textureCoordBuffer, colorsBuffer, indexBuffer, indices.length);
      }
    };
    module.exports = MeshGenerator;
  }
});

// ../Shaku/lib/gfx/camera.js
var require_camera = __commonJS({
  "../Shaku/lib/gfx/camera.js"(exports, module) {
    "use strict";
    var Rectangle2 = require_rectangle();
    var Vector22 = require_vector2();
    var Matrix = require_matrix();
    var Camera = class {
      constructor(gfx) {
        this.projection = null;
        this._region = null;
        this._gfx = gfx;
        this.orthographic();
        this._viewport = null;
      }
      get viewport() {
        return this._viewport;
      }
      set viewport(viewport) {
        this._viewport = viewport;
        return viewport;
      }
      getRegion() {
        return this._region.clone();
      }
      orthographicOffset(offset, ignoreViewportSize, near, far) {
        let renderingSize = ignoreViewportSize || !this.viewport ? this._gfx.getCanvasSize() : this.viewport.getSize();
        let region = new Rectangle2(offset.x, offset.y, renderingSize.x, renderingSize.y);
        this.orthographic(region, near, far);
      }
      orthographic(region, near, far) {
        if (region === void 0) {
          region = this._gfx.getRenderingRegion();
        }
        this._region = region;
        this.projection = Matrix.orthographic(region.left, region.right, region.bottom, region.top, near || -1, far || 400);
      }
      _perspective(fieldOfView, aspectRatio, near, far) {
        this.projection = Matrix.perspective(fieldOfView || Math.PI / 2, aspectRatio || 1, near || 0.1, far || 1e3);
      }
    };
    module.exports = Camera;
  }
});

// ../Shaku/lib/gfx/sprite.js
var require_sprite = __commonJS({
  "../Shaku/lib/gfx/sprite.js"(exports, module) {
    "use strict";
    var TextureAsset = require_texture_asset();
    var Color3 = require_color();
    var Rectangle2 = require_rectangle();
    var Vector22 = require_vector2();
    var Vector32 = require_vector3();
    var { BlendMode, BlendModes: BlendModes2 } = require_blend_modes();
    var Sprite2 = class {
      constructor(texture, sourceRect) {
        this.texture = texture;
        this.position = new Vector22(0, 0);
        if (sourceRect) {
          this.size = new Vector22(sourceRect.width, sourceRect.height);
        } else if (texture && texture.valid) {
          this.size = texture.size.clone();
        } else {
          this.size = new Vector22(100, 100);
        }
        this.sourceRect = sourceRect || null;
        this.blendMode = BlendModes2.AlphaBlend;
        this.rotation = 0;
        this.origin = new Vector22(0.5, 0.5);
        this.skew = new Vector22(0, 0);
        this.color = Color3.white;
        this.static = false;
      }
      setSourceFromSpritesheet(index, spritesCount, margin, setSize) {
        margin = margin || 0;
        let w = this.texture.width / spritesCount.x;
        let h = this.texture.height / spritesCount.y;
        let x = w * index.x + margin;
        let y = h * index.y + margin;
        w -= 2 * margin;
        h -= 2 * margin;
        if (setSize || setSize === void 0) {
          this.size.set(w, h);
        }
        if (this.sourceRect) {
          this.sourceRect.set(x, y, w, h);
        } else {
          this.sourceRect = new Rectangle2(x, y, w, h);
        }
      }
      clone() {
        let ret = new Sprite2(this.texture, this.sourceRect);
        ret.position = this.position.clone();
        ret.size = this.size.clone();
        ret.blendMode = this.blendMode;
        ret.rotation = this.rotation;
        ret.origin = this.origin.clone();
        ret.color = this.color.clone();
        ret.static = this.static;
        return ret;
      }
      updateStaticProperties() {
        this._cachedVertices = null;
      }
      get flipX() {
        return this.size.x < 0;
      }
      set flipX(flip) {
        if (flip === void 0)
          flip = !this.flipX;
        this.size.x = Math.abs(this.size.x) * (flip ? -1 : 1);
        return flip;
      }
      get flipY() {
        return this.size.y < 0;
      }
      set flipY(flip) {
        if (flip === void 0)
          flip = !this.flipY;
        this.size.y = Math.abs(this.size.y) * (flip ? -1 : 1);
        return flip;
      }
    };
    module.exports = Sprite2;
  }
});

// ../Shaku/lib/gfx/sprites_group.js
var require_sprites_group = __commonJS({
  "../Shaku/lib/gfx/sprites_group.js"(exports, module) {
    "use strict";
    var Color3 = require_color();
    var Vector22 = require_vector2();
    var Matrix = require_matrix();
    var Sprite2 = require_sprite();
    var SpritesGroup = class {
      constructor() {
        this._sprites = [];
        this.rotation = 0;
        this.position = new Vector22(0, 0);
        this.scale = new Vector22(1, 1);
      }
      forEach(callback) {
        this._sprites.forEach(callback);
      }
      setColor(color) {
        for (let i = 0; i < this._sprites.length; ++i) {
          this._sprites[i].color.copy(color);
        }
      }
      getTransform() {
        let matrices = [];
        if (this.position.x !== 0 || this.position.y !== 0) {
          matrices.push(Matrix.translate(this.position.x, this.position.y, 0));
        }
        if (this.rotation) {
          matrices.push(Matrix.rotateZ(-this.rotation));
        }
        if (this.scale.x !== 1 || this.scale.y !== 1) {
          matrices.push(Matrix.scale(this.scale.x, this.scale.y));
        }
        if (matrices.length === 0) {
          return null;
        }
        ;
        if (matrices.length === 1) {
          return matrices[0];
        }
        return Matrix.multiplyMany(matrices);
      }
      add(sprite) {
        this._sprites.push(sprite);
        return sprite;
      }
      remove(sprite) {
        for (let i = 0; i < this._sprites.length; ++i) {
          if (this._sprites[i] === sprite) {
            this._sprites.splice(i, 1);
            return;
          }
        }
      }
      shift() {
        return this._sprites.shift();
      }
      sort(compare) {
        this._sprites.sort(compare);
      }
      sortForBatching() {
        this._sprites.sort((a, b) => {
          let at = a.texture.url + a.blendMode;
          let bt = b.texture.url + b.blendMode;
          return at > bt ? 1 : bt > at ? -1 : 0;
        });
      }
      get count() {
        return this._sprites.length;
      }
    };
    module.exports = SpritesGroup;
  }
});

// ../Shaku/lib/assets/font_texture_asset.js
var require_font_texture_asset = __commonJS({
  "../Shaku/lib/assets/font_texture_asset.js"(exports, module) {
    "use strict";
    var Asset = require_asset();
    var Vector22 = require_vector2();
    var Rectangle2 = require_rectangle();
    var TextureAsset = require_texture_asset();
    var FontTextureAsset = class extends Asset {
      constructor(url) {
        super(url);
        this._fontName = null;
        this._fontSize = null;
        this._placeholderChar = null;
        this._sourceRects = null;
        this._texture = null;
        this._lineHeight = 0;
      }
      get lineHeight() {
        return this._lineHeight;
      }
      get fontName() {
        return this._fontName;
      }
      get fontSize() {
        return this._fontSize;
      }
      get placeholderCharacter() {
        return this._placeholderChar;
      }
      get texture() {
        return this._texture;
      }
      load(params) {
        return new Promise(async (resolve, reject2) => {
          if (!params || !params.fontName) {
            return reject2("When loading font texture you must provide params with a 'fontName' value!");
          }
          this._placeholderChar = (params.missingCharPlaceholder || "?")[0];
          let smooth = params.smoothFont === void 0 ? true : params.smoothFont;
          let extraPadding = params.extraPadding || { x: 0, y: 0 };
          let maxTextureWidth = params.maxTextureWidth || 1024;
          let charsSet = params.charactersSet || FontTextureAsset.defaultCharactersSet;
          if (charsSet.indexOf(this._placeholderChar) === -1) {
            charsSet += this._placeholderChar;
          }
          let fontFace = new FontFace(params.fontName, `url(${this.url})`);
          await fontFace.load();
          document.fonts.add(fontFace);
          this._fontName = params.fontName;
          this._fontSize = params.fontSize || 52;
          let margin = { x: 10, y: 5 };
          let fontFullName = this.fontSize.toString() + "px " + this.fontName;
          let fontHeight = measureTextHeight(this.fontName, this.fontSize, void 0, extraPadding.y);
          let fontWidth = measureTextWidth(this.fontName, this.fontSize, void 0, extraPadding.x);
          this._lineHeight = fontHeight;
          let estimatedCharSizeInTexture = new Vector22(fontWidth + margin.x * 2, fontHeight + margin.y * 2);
          let charsPerRow = Math.floor(maxTextureWidth / estimatedCharSizeInTexture.x);
          let textureWidth = Math.min(charsSet.length * estimatedCharSizeInTexture.x, maxTextureWidth);
          let textureHeight = Math.ceil(charsSet.length / charsPerRow) * estimatedCharSizeInTexture.y;
          if (params.enforceTexturePowerOfTwo || params.enforceTexturePowerOfTwo === void 0) {
            textureWidth = makePowerTwo(textureWidth);
            textureHeight = makePowerTwo(textureHeight);
          }
          this._sourceRects = {};
          let canvas = document.createElement("canvas");
          canvas.width = textureWidth;
          canvas.height = textureHeight;
          if (!smooth) {
            canvas.style.webkitFontSmoothing = "none";
            canvas.style.fontSmooth = "never";
            canvas.style.textRendering = "geometricPrecision";
          }
          let ctx = canvas.getContext("2d");
          ctx.textBaseline = "bottom";
          ctx.font = fontFullName;
          ctx.fillStyle = "#ffffffff";
          ctx.imageSmoothingEnabled = smooth;
          let x = 0;
          let y = 0;
          for (let i = 0; i < charsSet.length; ++i) {
            let currChar = charsSet[i];
            let currCharWidth = Math.ceil(ctx.measureText(currChar).width + extraPadding.x);
            if (x + currCharWidth > textureWidth) {
              y += Math.round(fontHeight + margin.y);
              x = 0;
            }
            const offsetAdjustment = params.sourceRectOffsetAdjustment || { x: 0, y: 0 };
            let sourceRect = new Rectangle2(x + offsetAdjustment.x, y + offsetAdjustment.y, currCharWidth, fontHeight);
            this._sourceRects[currChar] = sourceRect;
            ctx.fillText(currChar, x, y + fontHeight);
            x += Math.round(currCharWidth + margin.x);
          }
          if (!smooth) {
            let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            let data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              if (data[i + 3] > 0 && (data[i + 3] < 255 || data[i] < 255 || data[i + 1] < 255 || data[i + 2] < 255)) {
                data[i + 3] = 0;
              }
            }
            ctx.putImageData(imageData, 0, 0);
          }
          let img = new Image();
          img.src = canvas.toDataURL("image/png");
          img.onload = () => {
            let texture = new TextureAsset(this.url + "__font-texture");
            texture.fromImage(img);
            this._texture = texture;
            this._notifyReady();
            resolve();
          };
        });
      }
      get valid() {
        return Boolean(this._texture);
      }
      getSourceRect(character) {
        return this._sourceRects[character] || this._sourceRects[this.placeholderCharacter];
      }
      getPositionOffset(character) {
        return Vector22.zero;
      }
      getXAdvance(character) {
        return this.getSourceRect(character).width;
      }
      destroy() {
        if (this._texture)
          this._texture.destroy();
        this._fontName = null;
        this._fontSize = null;
        this._placeholderChar = null;
        this._sourceRects = null;
        this._texture = null;
        this._lineHeight = 0;
      }
    };
    FontTextureAsset.defaultCharactersSet = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE";
    function makePowerTwo(val) {
      let ret = 2;
      while (ret < val) {
        if (ret >= val) {
          return ret;
        }
        ret = ret * 2;
      }
      return ret;
    }
    function measureTextHeight(fontFamily, fontSize, char, extraHeight) {
      let text = document.createElement("pre");
      text.style.fontFamily = fontFamily;
      text.style.fontSize = fontSize + "px";
      text.style.paddingBottom = text.style.paddingLeft = text.style.paddingTop = text.style.paddingRight = "0px";
      text.style.marginBottom = text.style.marginLeft = text.style.marginTop = text.style.marginRight = "0px";
      text.textContent = char || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
      document.body.appendChild(text);
      let result2 = text.getBoundingClientRect().height + (extraHeight || 0);
      document.body.removeChild(text);
      return Math.ceil(result2);
    }
    function measureTextWidth(fontFamily, fontSize, char, extraWidth) {
      if (char === "\n" || char === "\r") {
        return 0;
      }
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      context.font = fontSize.toString() + "px " + fontFamily;
      let result2 = 0;
      let text = char || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
      for (let i = 0; i < text.length; ++i) {
        result2 = Math.max(result2, context.measureText(text[i]).width + (extraWidth || 0));
      }
      return Math.ceil(result2);
    }
    module.exports = FontTextureAsset;
  }
});

// ../Shaku/lib/assets/json_asset.js
var require_json_asset = __commonJS({
  "../Shaku/lib/assets/json_asset.js"(exports, module) {
    "use strict";
    var Asset = require_asset();
    var JsonAsset = class extends Asset {
      constructor(url) {
        super(url);
        this._data = null;
      }
      load() {
        return new Promise((resolve, reject2) => {
          var request = new XMLHttpRequest();
          request.open("GET", this.url, true);
          request.responseType = "json";
          request.onload = () => {
            if (request.readyState == 4) {
              if (request.response) {
                this._data = request.response;
                this._notifyReady();
                resolve();
              } else {
                if (request.status === 200) {
                  reject2("Response is not a valid JSON!");
                } else {
                  reject2(request.statusText);
                }
              }
            }
          };
          request.onerror = (e) => {
            reject2(e);
          };
          request.send();
        });
      }
      create(source) {
        return new Promise((resolve, reject2) => {
          try {
            if (source) {
              if (typeof source === "string") {
                source = JSON.parse(source);
              } else {
                source = JSON.parse(JSON.stringify(source));
              }
            } else {
              source = {};
            }
          } catch (e) {
            return reject2("Data is not a valid JSON serializable object!");
          }
          this._data = source;
          this._notifyReady();
          resolve();
        });
      }
      get data() {
        return this._data;
      }
      get valid() {
        return Boolean(this._data);
      }
      destroy() {
        this._data = null;
      }
    };
    module.exports = JsonAsset;
  }
});

// ../Shaku/lib/assets/msdf_font_texture_asset.js
var require_msdf_font_texture_asset = __commonJS({
  "../Shaku/lib/assets/msdf_font_texture_asset.js"(exports, module) {
    "use strict";
    var Vector22 = require_vector2();
    var Rectangle2 = require_rectangle();
    var TextureAsset = require_texture_asset();
    var FontTextureAsset = require_font_texture_asset();
    var JsonAsset = require_json_asset();
    var MsdfFontTextureAsset = class extends FontTextureAsset {
      constructor(url) {
        super(url);
        this._positionOffsets = null;
        this._xAdvances = null;
      }
      load(params) {
        return new Promise(async (resolve, reject2) => {
          if (!params || !params.jsonUrl || !params.textureUrl) {
            return reject2("When loading an msdf font you must provide params with a 'jsonUrl' and a 'textureUrl'!");
          }
          let atlas_json = new JsonAsset(params.jsonUrl);
          let atlas_texture = new TextureAsset(params.textureUrl);
          await Promise.all([atlas_json.load(), atlas_texture.load()]);
          let atlas_metadata = atlas_json.data;
          atlas_texture.filter = "LINEAR";
          if (atlas_metadata.common.pages > 1) {
            throw new Error("Can't use MSDF font with several pages");
          }
          this._placeholderChar = (params.missingCharPlaceholder || "?")[0];
          if (!atlas_metadata.info.charset.includes(this._placeholderChar)) {
            throw new Error("The atlas' charset doesn't include the given placeholder character");
          }
          this._fontName = atlas_metadata.info.face;
          this._fontSize = atlas_metadata.info.size;
          this._lineHeight = atlas_metadata.common.lineHeight;
          this._sourceRects = {};
          this._positionOffsets = {};
          this._xAdvances = {};
          this._kernings = {};
          for (const charData of atlas_metadata.chars) {
            let currChar = charData.char;
            let sourceRect = new Rectangle2(charData.x, charData.y, charData.width, charData.height);
            this._sourceRects[currChar] = sourceRect;
            this._positionOffsets[currChar] = new Vector22(
              charData.xoffset,
              charData.yoffset
            );
            this._xAdvances[currChar] = charData.xadvance;
          }
          this._texture = atlas_texture;
          this._notifyReady();
          resolve();
        });
      }
      getPositionOffset(character) {
        return this._positionOffsets[character] || this._positionOffsets[this.placeholderCharacter];
      }
      getXAdvance(character) {
        return this._xAdvances[character] || this._xAdvances[this.placeholderCharacter];
      }
      destroy() {
        super.destroy();
        this._positionOffsets = null;
        this._xAdvances = null;
        this._kernings = null;
      }
    };
    module.exports = MsdfFontTextureAsset;
  }
});

// ../Shaku/lib/gfx/text_alignments.js
var require_text_alignments = __commonJS({
  "../Shaku/lib/gfx/text_alignments.js"(exports, module) {
    "use strict";
    var TextAlignments2 = {
      Left: "left",
      Right: "right",
      Center: "center"
    };
    Object.freeze(TextAlignments2);
    module.exports = { TextAlignments: TextAlignments2 };
  }
});

// ../Shaku/lib/gfx/sprite_batch.js
var require_sprite_batch = __commonJS({
  "../Shaku/lib/gfx/sprite_batch.js"(exports, module) {
    "use strict";
    var { Rectangle: Rectangle2, Color: Color3 } = require_utils();
    var Vector22 = require_vector2();
    var Vertex = require_vertex();
    var { BlendModes: BlendModes2 } = require_blend_modes();
    var Matrix = require_matrix();
    var Mesh = require_mesh();
    var _logger = require_logger().getLogger("gfx");
    var SpriteBatch = class {
      constructor(gfx) {
        this._gfx = gfx;
        this._gl = gfx._gl;
        this._positions = gfx._dynamicBuffers.positionArray;
        this._uvs = gfx._dynamicBuffers.textureArray;
        this._colors = gfx._dynamicBuffers.colorsArray;
        this._positionsBuff = gfx._dynamicBuffers.positionBuffer;
        this._uvsBuff = gfx._dynamicBuffers.textureCoordBuffer;
        this._colorsBuff = gfx._dynamicBuffers.colorsBuffer;
        this._indexBuff = gfx._dynamicBuffers.indexBuffer;
        this.snapPixels = true;
        this.applyAntiBleeding = true;
      }
      vertex(position, textureCoord, color) {
        return new Vertex(position, textureCoord, color);
      }
      get drawing() {
        return this._drawing;
      }
      begin(effect, transform) {
        if (this._drawing) {
          _logger.error("Start drawing a batch while already drawing a batch!");
        }
        if (effect) {
          this._gfx.useEffect(effect);
        }
        this._effect = this._gfx._activeEffect;
        this._currBlend = BlendModes2.AlphaBlend;
        this._currTexture = null;
        this._currBatchCount = 0;
        this._transform = transform;
        this._drawing = true;
      }
      end() {
        if (!this._drawing) {
          _logger.error("Stop drawing a batch without starting it first!");
        }
        if (this._currBatchCount) {
          this._drawCurrentBatch();
        }
        this._drawing = false;
      }
      setTexture(texture) {
        if (texture !== this._currTexture) {
          if (this._currBatchCount) {
            this._drawCurrentBatch();
          }
          this._currTexture = texture;
        }
      }
      draw(sprites, cullOutOfScreen) {
        if (sprites.length === void 0) {
          sprites = [sprites];
        }
        let region = cullOutOfScreen ? this._gfx.getRenderingRegion() : null;
        let positions = this._positions;
        let uvs = this._uvs;
        let colors = this._colors;
        for (let sprite of sprites) {
          if (this._currBatchCount) {
            if (this._currBatchCount >= this.batchSpritesCount || sprite.blendMode !== this._currBlend || sprite.texture !== this._currTexture) {
              this._drawCurrentBatch();
            }
          }
          this._currTexture = sprite.texture;
          this._currBlend = sprite.blendMode;
          let ci = this._currBatchCount * 4 * 4;
          if (sprite.color instanceof Array) {
            let lastColor = sprite.color[0];
            for (let x = 0; x < 4; ++x) {
              let curr = sprite.color[x] || lastColor;
              colors[ci + x * 4 + 0] = curr.r;
              colors[ci + x * 4 + 1] = curr.g;
              colors[ci + x * 4 + 2] = curr.b;
              colors[ci + x * 4 + 3] = curr.a;
              lastColor = curr;
            }
          } else {
            for (let x = 0; x < 4; ++x) {
              colors[ci + x * 4 + 0] = sprite.color.r;
              colors[ci + x * 4 + 1] = sprite.color.g;
              colors[ci + x * 4 + 2] = sprite.color.b;
              colors[ci + x * 4 + 3] = sprite.color.a;
            }
          }
          if (sprite.static && sprite._cachedVertices) {
            let topLeft2 = sprite._cachedVertices[0];
            let topRight2 = sprite._cachedVertices[1];
            let bottomLeft2 = sprite._cachedVertices[2];
            let bottomRight2 = sprite._cachedVertices[3];
            let pi2 = this._currBatchCount * 4 * 3;
            positions[pi2 + 0] = topLeft2.position.x;
            positions[pi2 + 1] = topLeft2.position.y;
            positions[pi2 + 2] = topLeft2.position.z || 0;
            positions[pi2 + 3] = topRight2.position.x;
            positions[pi2 + 4] = topRight2.position.y;
            positions[pi2 + 5] = topRight2.position.z || 0;
            positions[pi2 + 6] = bottomLeft2.position.x;
            positions[pi2 + 7] = bottomLeft2.position.y;
            positions[pi2 + 8] = bottomLeft2.position.z || 0;
            positions[pi2 + 9] = bottomRight2.position.x;
            positions[pi2 + 10] = bottomRight2.position.y;
            positions[pi2 + 11] = bottomRight2.position.z || 0;
            let uvi2 = this._currBatchCount * 4 * 2;
            uvs[uvi2 + 0] = topLeft2.uv.x;
            uvs[uvi2 + 1] = topLeft2.uv.y;
            uvs[uvi2 + 2] = bottomRight2.uv.x;
            uvs[uvi2 + 3] = topLeft2.uv.y;
            uvs[uvi2 + 4] = topLeft2.uv.x;
            uvs[uvi2 + 5] = bottomRight2.uv.y;
            uvs[uvi2 + 6] = bottomRight2.uv.x;
            uvs[uvi2 + 7] = bottomRight2.uv.y;
            this._currBatchCount++;
            continue;
          }
          let sizeX = sprite.size.x;
          let sizeY = sprite.size.y;
          let left = -sizeX * sprite.origin.x;
          let top = -sizeY * sprite.origin.y;
          let topLeft = new Vector22(left, top);
          let topRight = new Vector22(left + sizeX, top);
          let bottomLeft = new Vector22(left, top + sizeY);
          let bottomRight = new Vector22(left + sizeX, top + sizeY);
          if (sprite.skew) {
            if (sprite.skew.x) {
              topLeft.x += sprite.skew.x * sprite.origin.y;
              topRight.x += sprite.skew.x * sprite.origin.y;
              bottomLeft.x -= sprite.skew.x * (1 - sprite.origin.y);
              bottomRight.x -= sprite.skew.x * (1 - sprite.origin.y);
            }
            if (sprite.skew.y) {
              topLeft.y += sprite.skew.y * sprite.origin.x;
              bottomLeft.y += sprite.skew.y * sprite.origin.x;
              topRight.y -= sprite.skew.y * (1 - sprite.origin.x);
              bottomRight.y -= sprite.skew.y * (1 - sprite.origin.x);
            }
          }
          if (sprite.rotation) {
            let rotateVec = function(vector) {
              let x = vector.x * cos - vector.y * sin;
              let y = vector.x * sin + vector.y * cos;
              vector.set(x, y);
            };
            let cos = Math.cos(sprite.rotation);
            let sin = Math.sin(sprite.rotation);
            rotateVec(topLeft);
            rotateVec(topRight);
            rotateVec(bottomLeft);
            rotateVec(bottomRight);
          }
          topLeft.addSelf(sprite.position);
          topRight.addSelf(sprite.position);
          bottomLeft.addSelf(sprite.position);
          bottomRight.addSelf(sprite.position);
          if (this.snapPixels) {
            topLeft.floorSelf();
            topRight.floorSelf();
            bottomLeft.floorSelf();
            bottomRight.floorSelf();
          }
          let z2 = sprite.position.z || 0;
          let zDepth = sprite.size.z || 0;
          if (cullOutOfScreen) {
            let destRect = Rectangle2.fromPoints([topLeft, topRight, bottomLeft, bottomRight]);
            if (!region.collideRect(destRect)) {
              continue;
            }
          }
          let pi = this._currBatchCount * 4 * 3;
          positions[pi + 0] = topLeft.x;
          positions[pi + 1] = topLeft.y;
          positions[pi + 2] = z2;
          positions[pi + 3] = topRight.x;
          positions[pi + 4] = topRight.y;
          positions[pi + 5] = z2;
          positions[pi + 6] = bottomLeft.x;
          positions[pi + 7] = bottomLeft.y;
          positions[pi + 8] = z2 + zDepth;
          positions[pi + 9] = bottomRight.x;
          positions[pi + 10] = bottomRight.y;
          positions[pi + 11] = z2 + zDepth;
          let uvi = this._currBatchCount * 4 * 2;
          var uvTl;
          var uvBr;
          if (sprite.sourceRect) {
            uvTl = { x: sprite.sourceRect.x / this._currTexture.width, y: sprite.sourceRect.y / this._currTexture.height };
            uvBr = { x: uvTl.x + sprite.sourceRect.width / this._currTexture.width, y: uvTl.y + sprite.sourceRect.height / this._currTexture.height };
            if (sprite.rotation && this.applyAntiBleeding) {
              let marginX = 0.015 / this._currTexture.width;
              let marginY = 0.015 / this._currTexture.height;
              uvTl.x += marginX;
              uvBr.x -= marginX * 2;
              uvTl.y += marginY;
              uvBr.y -= marginY * 2;
            }
            uvs[uvi + 0] = uvTl.x;
            uvs[uvi + 1] = uvTl.y;
            uvs[uvi + 2] = uvBr.x;
            uvs[uvi + 3] = uvTl.y;
            uvs[uvi + 4] = uvTl.x;
            uvs[uvi + 5] = uvBr.y;
            uvs[uvi + 6] = uvBr.x;
            uvs[uvi + 7] = uvBr.y;
          } else {
            uvs[uvi + 0] = 0;
            uvs[uvi + 1] = 0;
            uvs[uvi + 2] = 1;
            uvs[uvi + 3] = 0;
            uvs[uvi + 4] = 0;
            uvs[uvi + 5] = 1;
            uvs[uvi + 6] = 1;
            uvs[uvi + 7] = 1;
          }
          if (sprite.static) {
            sprite._cachedVertices = [
              { position: topLeft, uv: uvTl || { x: 0, y: 0 } },
              { position: topRight },
              { position: bottomLeft },
              { position: bottomRight, uv: uvBr || { x: 1, y: 1 } }
            ];
          }
          this._currBatchCount++;
        }
      }
      pushVertices(vertices) {
        if (!vertices || vertices.length !== 4) {
          throw new Error("Vertices must be array of 4 values!");
        }
        let positions = this._positions;
        let uvs = this._uvs;
        let colors = this._colors;
        for (let i = 0; i < vertices.length; ++i) {
          let vertex = vertices[i];
          let ci = this._currBatchCount * (4 * 4) + i * 4;
          colors[ci + 0] = vertex.color.r;
          colors[ci + 1] = vertex.color.g;
          colors[ci + 2] = vertex.color.b;
          colors[ci + 3] = vertex.color.a;
        }
        let topLeft = vertices[0].position;
        let topRight = vertices[1].position;
        let bottomLeft = vertices[2].position;
        let bottomRight = vertices[3].position;
        let pi = this._currBatchCount * 4 * 3;
        positions[pi + 0] = topLeft.x;
        positions[pi + 1] = topLeft.y;
        positions[pi + 2] = topLeft.z || 0;
        positions[pi + 3] = topRight.x;
        positions[pi + 4] = topRight.y;
        positions[pi + 5] = topRight.z || 0;
        positions[pi + 6] = bottomLeft.x;
        positions[pi + 7] = bottomLeft.y;
        positions[pi + 8] = bottomLeft.z || 0;
        positions[pi + 9] = bottomRight.x;
        positions[pi + 10] = bottomRight.y;
        positions[pi + 11] = bottomRight.z || 0;
        let uvi = this._currBatchCount * (4 * 2);
        uvs[uvi++] = vertices[0].textureCoord.x / this._currTexture.width;
        uvs[uvi++] = vertices[0].textureCoord.y / this._currTexture.height;
        uvs[uvi++] = vertices[1].textureCoord.x / this._currTexture.width;
        uvs[uvi++] = vertices[1].textureCoord.y / this._currTexture.height;
        uvs[uvi++] = vertices[2].textureCoord.x / this._currTexture.width;
        uvs[uvi++] = vertices[2].textureCoord.y / this._currTexture.height;
        uvs[uvi++] = vertices[3].textureCoord.x / this._currTexture.width;
        uvs[uvi++] = vertices[3].textureCoord.y / this._currTexture.height;
        this._currBatchCount++;
      }
      get batchSpritesCount() {
        return this._gfx.batchSpritesCount;
      }
      _drawCurrentBatch() {
        let gl = this._gl;
        let transform = this._transform;
        let positionArray = this._positions;
        let textureArray = this._uvs;
        let colorsArray = this._colors;
        let positionBuffer = this._positionsBuff;
        let textureCoordBuffer = this._uvsBuff;
        let colorsBuffer = this._colorsBuff;
        let indexBuffer = this._indexBuff;
        if (this._effect !== this._gfx._activeEffect) {
          _logger.error("Effect changed while drawing batch!");
        }
        this._gfx._setBlendMode(this._currBlend);
        let mesh = new Mesh(positionBuffer, textureCoordBuffer, colorsBuffer, indexBuffer, this._currBatchCount * 6);
        this._gfx._activeEffect.prepareToDrawBatch(mesh, transform || Matrix.identity);
        this._gfx._setActiveTexture(this._currTexture);
        let shouldSliceArrays = this._currBatchCount < this.batchSpritesCount / 2;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          shouldSliceArrays ? positionArray.slice(0, this._currBatchCount * 4 * 3) : positionArray,
          gl.DYNAMIC_DRAW
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          shouldSliceArrays ? textureArray.slice(0, this._currBatchCount * 4 * 2) : textureArray,
          gl.DYNAMIC_DRAW
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          shouldSliceArrays ? colorsArray.slice(0, this._currBatchCount * 4 * 4) : colorsArray,
          gl.DYNAMIC_DRAW
        );
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this._currIndices = null;
        gl.drawElements(gl.TRIANGLES, this._currBatchCount * 6, gl.UNSIGNED_SHORT, 0);
        this._gfx._drawCallsCount++;
        this._gfx._drawQuadsCount += this._currBatchCount;
        this._currBatchCount = 0;
      }
    };
    module.exports = SpriteBatch;
  }
});

// ../Shaku/lib/gfx/gfx.js
var require_gfx = __commonJS({
  "../Shaku/lib/gfx/gfx.js"(exports, module) {
    "use strict";
    var IManager = require_manager();
    var Color3 = require_color();
    var { BlendMode, BlendModes: BlendModes2 } = require_blend_modes();
    var Rectangle2 = require_rectangle();
    var { Effect: Effect3, BasicEffect, MsdfFontEffect } = require_effects();
    var TextureAsset = require_texture_asset();
    var { TextureFilterMode, TextureFilterModes: TextureFilterModes2 } = require_texture_filter_modes();
    var { TextureWrapMode, TextureWrapModes: TextureWrapModes2 } = require_texture_wrap_modes();
    var MeshGenerator = require_mesh_generator();
    var Matrix = require_matrix();
    var Camera = require_camera();
    var Sprite2 = require_sprite();
    var SpritesGroup = require_sprites_group();
    var Vector22 = require_vector2();
    var FontTextureAsset = require_font_texture_asset();
    var MsdfFontTextureAsset = require_msdf_font_texture_asset();
    var { TextAlignment, TextAlignments: TextAlignments2 } = require_text_alignments();
    var Mesh = require_mesh();
    var Circle2 = require_circle();
    var SpriteBatch = require_sprite_batch();
    var Vector32 = require_vector3();
    var Vertex = require_vertex();
    var _whiteColor = Color3.white;
    var _logger = require_logger().getLogger("gfx");
    var Gfx = class extends IManager {
      constructor() {
        super();
        this._gl = null;
        this._initSettings = { antialias: true, alpha: true, depth: false, premultipliedAlpha: true, desynchronized: false };
        this._canvas = null;
        this._lastBlendMode = null;
        this._activeEffect = null;
        this._camera = null;
        this._projection = null;
        this._currIndices = null;
        this._dynamicBuffers = null;
        this._fb = null;
        this.builtinEffects = {};
        this.meshes = {};
        this.defaultTextureFilter = TextureFilterModes2.Nearest;
        this.defaultTextureWrapMode = TextureWrapModes2.Clamp;
        this.whiteTexture = null;
        this._renderTarget = null;
        this._viewport = null;
        this._drawCallsCount = 0;
        this._drawQuadsCount = 0;
        this.spritesBatch = null;
      }
      get batchSpritesCount() {
        return 2048;
      }
      get maxLineSegments() {
        return 512;
      }
      setContextAttributes(flags) {
        if (this._gl) {
          throw new Error("Can't call setContextAttributes() after gfx was initialized!");
        }
        this._initSettings = flags;
      }
      setCanvas(element) {
        if (this._gl) {
          throw new Error("Can't call setCanvas() after gfx was initialized!");
        }
        this._canvas = element;
      }
      get canvas() {
        return this._canvas;
      }
      get Effect() {
        return Effect3;
      }
      get BasicEffect() {
        return BasicEffect;
      }
      get MsdfFontEffect() {
        return MsdfFontEffect;
      }
      get Sprite() {
        return Sprite2;
      }
      get SpritesGroup() {
        return SpritesGroup;
      }
      get Matrix() {
        return Matrix;
      }
      get Vertex() {
        return Vertex;
      }
      get TextAlignments() {
        return TextAlignments2;
      }
      get TextAlignment() {
        if (!this._TextAlignment_dep) {
          console.warn(`'gfx.TextAlignment' is deprecated and will be removed in future versions. Please use 'gfx.TextAlignments' instead.`);
          this._TextAlignment_dep = true;
        }
        return TextAlignments2;
      }
      createCamera(withViewport) {
        let ret = new Camera(this);
        if (withViewport) {
          ret.viewport = this.getRenderingRegion();
        }
        return ret;
      }
      setCameraOrthographic(offset) {
        let camera = this.createCamera();
        camera.orthographicOffset(offset);
        this.applyCamera(camera);
        return camera;
      }
      createEffect(type) {
        if (!(type.prototype instanceof Effect3)) {
          throw new Error("'type' must be a class type that inherits from 'Effect'.");
        }
        let effect = new type();
        effect._build(this._gl);
        return effect;
      }
      maximizeCanvasSize(limitToParent, allowOddNumbers) {
        let width = 0;
        let height = 0;
        if (limitToParent) {
          let parent = this._canvas.parentElement;
          width = parent.clientWidth - this._canvas.offsetLeft;
          height = parent.clientHeight - this._canvas.offsetTop;
        } else {
          width = window.innerWidth;
          height = window.innerHeight;
          this._canvas.style.left = "0px";
          this._canvas.style.top = "0px";
        }
        if (!allowOddNumbers) {
          if (width % 2 !== 0) {
            width++;
          }
          if (height % 2 !== 0) {
            height++;
          }
        }
        if (this._canvas.width !== width || this._canvas.height !== height) {
          this.setResolution(width, height, true);
        }
      }
      setRenderTarget(texture, keepCamera) {
        this.presentBufferedData();
        if (texture === null) {
          this._renderTarget = null;
          this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
          this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, false);
          if (!keepCamera) {
            this.resetCamera();
          }
          return;
        }
        if (!(texture instanceof Array)) {
          texture = [texture];
        }
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._fb);
        this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, false);
        var drawBuffers = [];
        for (let index = 0; index < texture.length; ++index) {
          const attachmentPoint = this._gl["COLOR_ATTACHMENT" + index];
          this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, attachmentPoint, this._gl.TEXTURE_2D, texture[index].texture, 0);
          if (index === 0) {
            this._renderTarget = texture[index];
          }
          drawBuffers.push(attachmentPoint);
        }
        this._gl.drawBuffers(drawBuffers);
        if (!keepCamera) {
          this.resetCamera();
        }
      }
      useEffect(effect) {
        this.presentBufferedData();
        if (effect === null) {
          this.useEffect(this.builtinEffects.Basic);
          return;
        }
        if (this._activeEffect === effect) {
          return;
        }
        effect.setAsActive();
        this._activeEffect = effect;
        if (this._projection) {
          this._activeEffect.setProjectionMatrix(this._projection);
        }
      }
      setResolution(width, height, updateCanvasStyle) {
        this.presentBufferedData();
        this._canvas.width = width;
        this._canvas.height = height;
        if (width % 2 !== 0 || height % 2 !== 0) {
          _logger.warn("Resolution to set is not even numbers; This might cause minor artefacts when using texture atlases. Consider using even numbers instead.");
        }
        if (updateCanvasStyle) {
          this._canvas.style.width = width + "px";
          this._canvas.style.height = height + "px";
        }
        this._gl.viewport(0, 0, width, height);
        this.resetCamera();
      }
      resetCamera() {
        this._camera = this.createCamera();
        let size = this.getRenderingSize();
        this._camera.orthographic(new Rectangle2(0, 0, size.x, size.y));
        this.applyCamera(this._camera);
      }
      applyCamera(camera) {
        this.presentBufferedData();
        this._viewport = camera.viewport;
        let viewport = this.getRenderingRegion(true);
        this._gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
        this._projection = camera.projection.clone();
        if (this._activeEffect) {
          this._activeEffect.setProjectionMatrix(this._projection);
        }
      }
      getRenderingRegion(includeOffset) {
        if (this._viewport) {
          let ret = this._viewport.clone();
          if (includeOffset === false) {
            ret.x = ret.y = 0;
          }
          return ret;
        }
        return new Rectangle2(0, 0, (this._renderTarget || this._canvas).width, (this._renderTarget || this._canvas).height);
      }
      getRenderingSize() {
        let region = this.getRenderingRegion();
        return region.getSize();
      }
      getCanvasSize() {
        return new Vector22(this._canvas.width, this._canvas.height);
      }
      setup() {
        return new Promise(async (resolve, reject2) => {
          _logger.info("Setup gfx manager..");
          if (!this._canvas) {
            this._canvas = document.createElement("canvas");
          }
          this._gl = this._canvas.getContext("webgl2", this._initSettings) || this._canvas.getContext("webgl", this._initSettings);
          if (!this._gl) {
            _logger.error("Can't get WebGL context!");
            return reject2("Failed to get WebGL context from canvas!");
          }
          this.builtinEffects.Basic = this.createEffect(BasicEffect);
          this.builtinEffects.MsdfFont = this.createEffect(MsdfFontEffect);
          TextureAsset._setWebGl(this._gl);
          this._fb = this._gl.createFramebuffer();
          let _meshGenerator = new MeshGenerator(this._gl);
          this.meshes = {
            quad: _meshGenerator.quad()
          };
          Object.freeze(this.meshes);
          let whitePixelImage = new Image();
          whitePixelImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
          await new Promise((resolve2, reject3) => {
            whitePixelImage.onload = resolve2;
          });
          this.whiteTexture = new TextureAsset("__runtime_white_pixel__");
          this.whiteTexture.fromImage(whitePixelImage);
          this._dynamicBuffers = {
            positionBuffer: this._gl.createBuffer(),
            positionArray: new Float32Array(3 * 4 * this.batchSpritesCount),
            textureCoordBuffer: this._gl.createBuffer(),
            textureArray: new Float32Array(2 * 4 * this.batchSpritesCount),
            colorsBuffer: this._gl.createBuffer(),
            colorsArray: new Float32Array(4 * 4 * this.batchSpritesCount),
            indexBuffer: this._gl.createBuffer(),
            linesIndexBuffer: this._gl.createBuffer()
          };
          let indices = new Uint16Array(this.batchSpritesCount * 6);
          let inc = 0;
          for (let i = 0; i < indices.length; i += 6) {
            indices[i] = inc;
            indices[i + 1] = inc + 1;
            indices[i + 2] = inc + 2;
            indices[i + 3] = inc + 1;
            indices[i + 4] = inc + 3;
            indices[i + 5] = inc + 2;
            inc += 4;
          }
          this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._dynamicBuffers.indexBuffer);
          this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, indices, this._gl.STATIC_DRAW);
          let lineIndices = new Uint16Array(this.maxLineSegments);
          for (let i = 0; i < lineIndices.length; i += 6) {
            lineIndices[i] = i;
          }
          this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._dynamicBuffers.linesIndexBuffer);
          this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, lineIndices, this._gl.STATIC_DRAW);
          this.spritesBatch = new SpriteBatch(this);
          this.useEffect(null);
          this._camera = this.createCamera();
          this.applyCamera(this._camera);
          resolve();
        });
      }
      buildText(fontTexture, text, fontSize, color, alignment, offset, marginFactor) {
        if (typeof text !== "string") {
          text = "" + text;
        }
        if (!fontTexture || !fontTexture.valid) {
          throw new Error("Font texture is invalid!");
        }
        alignment = alignment || TextAlignments2.Left;
        color = color || Color3.black;
        fontSize = fontSize || fontTexture.fontSize;
        marginFactor = marginFactor || Vector22.one;
        let scale = fontSize / fontTexture.fontSize;
        let position = new Vector22(0, 0);
        let currentLineSprites = [];
        let lineWidth = 0;
        function breakLine() {
          let offsetX = 0;
          switch (alignment) {
            case TextAlignments2.Right:
              offsetX = -lineWidth;
              break;
            case TextAlignments2.Center:
              offsetX = -lineWidth / 2;
              break;
          }
          if (offsetX != 0) {
            for (let i = 0; i < currentLineSprites.length; ++i) {
              currentLineSprites[i].position.x += offsetX;
            }
          }
          position.x = 0;
          position.y += fontTexture.lineHeight * scale * marginFactor.y;
          currentLineSprites = [];
          lineWidth = 0;
        }
        let ret = new SpritesGroup();
        for (let i = 0; i < text.length; ++i) {
          let character = text[i];
          let sourceRect = fontTexture.getSourceRect(character);
          if (character === "\n") {
            breakLine();
            continue;
          }
          let size = new Vector22(sourceRect.width * scale, sourceRect.height * scale);
          if (character !== " ") {
            let sprite = new Sprite2(fontTexture.texture, sourceRect);
            sprite.size = size;
            if (fontTexture instanceof MsdfFontTextureAsset) {
              sprite.origin.set(0, 0);
            } else {
              sprite.origin.set(0.5, 0.5);
            }
            sprite.position.copy(position).addSelf(fontTexture.getPositionOffset(character).mul(scale));
            if (color instanceof Color3) {
              sprite.color.copy(color);
            } else {
              sprite.color = [];
              for (let col of color) {
                sprite.color.push(col.clone());
              }
            }
            sprite.origin.x = 0;
            ret.add(sprite);
            currentLineSprites.push(sprite);
          }
          let moveCursorAmount = fontTexture.getXAdvance(character) * scale * marginFactor.x;
          lineWidth += moveCursorAmount;
          position.x += moveCursorAmount;
        }
        breakLine();
        if (offset) {
          ret.position.set(offset.x, offset.y);
        }
        return ret;
      }
      drawGroup(group, cullOutOfScreen) {
        this._drawBatch(group, Boolean(cullOutOfScreen));
      }
      drawSprite(sprite) {
        if (!sprite.texture || !sprite.texture.valid) {
          return;
        }
        this.__startDrawingSprites(this._activeEffect, null);
        this.spritesBatch.draw(sprite);
      }
      cover(texture, destRect, sourceRect, color, blendMode) {
        if (destRect instanceof Vector22 || destRect instanceof Vector32) {
          destRect = new Rectangle2(0, 0, destRect.x, destRect.y);
        }
        return this.draw(texture, destRect.getCenter(), destRect.getSize(), sourceRect, color, blendMode);
      }
      draw(texture, position, size, sourceRect, color, blendMode, rotation, origin, skew) {
        let sprite = new Sprite2(texture, sourceRect);
        sprite.position = position;
        sprite.size = typeof size === "number" ? new Vector22(size, size) : size;
        if (color) {
          sprite.color = color;
        }
        if (blendMode) {
          sprite.blendMode = blendMode;
        }
        if (rotation !== void 0) {
          sprite.rotation = rotation;
        }
        if (origin) {
          sprite.origin = origin;
        }
        if (skew) {
          sprite.skew = skew;
        }
        this.drawSprite(sprite);
      }
      drawQuadFromVertices(texture, vertices, blendMode) {
        if (!texture || !texture.valid) {
          return;
        }
        this.__startDrawingSprites(this._activeEffect, null);
        this._setBlendMode(blendMode || BlendModes2.AlphaBlend);
        this.spritesBatch.setTexture(texture);
        this.spritesBatch.pushVertices(vertices);
      }
      fillRect(destRect, color, blend, rotation) {
        this.draw(
          this.whiteTexture,
          new Vector22(destRect.x + destRect.width / 2, destRect.y + destRect.height / 2),
          new Vector22(destRect.width, destRect.height),
          null,
          color,
          blend || BlendModes2.Opaque,
          rotation,
          null,
          null
        );
      }
      fillRects(destRects, colors, blend, rotation) {
        if (rotation === void 0) {
          rotation = 0;
        }
        let group = new SpritesGroup();
        for (let i = 0; i < destRects.length; ++i) {
          let sprite = new Sprite2(this.whiteTexture);
          sprite.color = colors[i] || colors;
          sprite.rotation = rotation.length ? rotation[i] : rotation;
          sprite.blendMode = blend || BlendModes2.Opaque;
          let destRect = destRects[i];
          sprite.size.set(destRect.width, destRect.height);
          sprite.position.set(destRect.x + destRect.width / 2, destRect.y + destRect.width / 2);
          sprite.origin.set(0.5, 0.5);
          group.add(sprite);
        }
        this.drawGroup(group);
      }
      outlineRect(destRect, color, blend, rotation) {
        let topLeft = destRect.getTopLeft();
        let topRight = destRect.getTopRight();
        let bottomRight = destRect.getBottomRight();
        let bottomLeft = destRect.getBottomLeft();
        if (rotation) {
          let rotateVec = function(vector) {
            let x = vector.x * cos - vector.y * sin;
            let y = vector.x * sin + vector.y * cos;
            vector.set(x, y);
          };
          let center = destRect.getCenter();
          topLeft.subSelf(center);
          topRight.subSelf(center);
          bottomLeft.subSelf(center);
          bottomRight.subSelf(center);
          let cos = Math.cos(rotation);
          let sin = Math.sin(rotation);
          rotateVec(topLeft);
          rotateVec(topRight);
          rotateVec(bottomLeft);
          rotateVec(bottomRight);
          topLeft.addSelf(center);
          topRight.addSelf(center);
          bottomLeft.addSelf(center);
          bottomRight.addSelf(center);
        }
        this.drawLinesStrip([topLeft, topRight, bottomRight, bottomLeft], color, blend, true);
      }
      outlineCircle(circle, color, blend, lineAmount) {
        if (lineAmount === void 0) {
          lineAmount = 32;
        }
        let lines = [];
        const twicePi = 2 * Math.PI;
        for (let i = 0; i <= lineAmount; i++) {
          let point = new Vector22(
            circle.center.x + circle.radius * Math.cos(i * twicePi / lineAmount),
            circle.center.y + circle.radius * Math.sin(i * twicePi / lineAmount)
          );
          lines.push(point);
        }
        this.drawLinesStrip(lines, color, blend);
      }
      fillCircle(circle, color, blend, lineAmount) {
        if (lineAmount === void 0) {
          lineAmount = 32;
        }
        let lines = [circle.center];
        const twicePi = 2 * Math.PI;
        for (let i = 0; i <= lineAmount; i++) {
          let point = new Vector22(
            circle.center.x + circle.radius * Math.cos(i * twicePi / lineAmount),
            circle.center.y + circle.radius * Math.sin(i * twicePi / lineAmount)
          );
          lines.push(point);
        }
        let gl = this._gl;
        this._fillShapesBuffer(lines, color, blend, (verts) => {
          gl.drawArrays(gl.TRIANGLE_FAN, 0, verts.length);
          this._drawCallsCount++;
        }, true, 1);
      }
      fillCircles(circles, colors, blend, lineAmount) {
        if (lineAmount === void 0) {
          lineAmount = 32;
        }
        let vertsArr = [];
        let colorsArr = colors.length ? [] : null;
        for (let i = 0; i < circles.length; ++i) {
          let circle = circles[i];
          let color = colors[i] || colors;
          const twicePi = 2 * Math.PI;
          for (let i2 = 0; i2 <= lineAmount; i2++) {
            vertsArr.push(new Vector22(
              circle.center.x + circle.radius * Math.cos(i2 * twicePi / lineAmount),
              circle.center.y + circle.radius * Math.sin(i2 * twicePi / lineAmount)
            ));
            vertsArr.push(new Vector22(
              circle.center.x + circle.radius * Math.cos((i2 + 1) * twicePi / lineAmount),
              circle.center.y + circle.radius * Math.sin((i2 + 1) * twicePi / lineAmount)
            ));
            vertsArr.push(circle.center);
            if (colorsArr) {
              colorsArr.push(color);
              colorsArr.push(color);
              colorsArr.push(color);
            }
          }
        }
        let gl = this._gl;
        this._fillShapesBuffer(vertsArr, colorsArr || colors, blend, (verts) => {
          gl.drawArrays(gl.TRIANGLES, 0, verts.length);
          this._drawCallsCount++;
        }, false, 3);
      }
      drawLine(startPoint, endPoint, color, blendMode) {
        return this.drawLines([startPoint, endPoint], color, blendMode, false);
      }
      drawLinesStrip(points, colors, blendMode, looped) {
        let gl = this._gl;
        if (looped) {
          points = points.slice(0);
          points.push(points[0]);
          if (colors && colors.length) {
            colors = colors.slice(0);
            colors.push(colors[0]);
          }
        }
        this._fillShapesBuffer(points, colors, blendMode, (verts) => {
          gl.drawArrays(gl.LINE_STRIP, 0, verts.length);
          this._drawCallsCount++;
        }, true, 2);
      }
      drawLines(points, colors, blendMode) {
        let gl = this._gl;
        this._fillShapesBuffer(points, colors, blendMode, (verts) => {
          gl.drawArrays(gl.LINES, 0, verts.length);
          this._drawCallsCount++;
        }, true, 2);
      }
      drawPoint(point, color, blendMode) {
        return this.drawPoints([point], [color], blendMode);
      }
      drawPoints(points, colors, blendMode) {
        let gl = this._gl;
        this._fillShapesBuffer(points, colors, blendMode, (verts) => {
          gl.drawArrays(gl.POINTS, 0, verts.length);
          this._drawCallsCount++;
        }, false, 1);
      }
      centerCanvas() {
        let canvas = this._canvas;
        let parent = canvas.parentElement;
        let pwidth = Math.min(parent.clientWidth, window.innerWidth);
        let pheight = Math.min(parent.clientHeight, window.innerHeight);
        canvas.style.left = Math.round(pwidth / 2 - canvas.clientWidth / 2) + "px";
        canvas.style.top = Math.round(pheight / 2 - canvas.clientHeight / 2) + "px";
        canvas.style.display = "block";
        canvas.style.position = "relative";
      }
      inScreen(shape) {
        let region = this.getRenderingRegion();
        if (shape instanceof Circle2) {
          return region.collideCircle(shape);
        } else if (shape instanceof Vector22) {
          return region.containsVector(shape);
        } else if (shape instanceof Rectangle2) {
          return region.collideRect(shape);
        } else if (shape instanceof Line) {
          return region.collideLine(shape);
        } else {
          throw new Error("Unknown shape type to check!");
        }
      }
      centerCamera(position, useCanvasSize) {
        let renderSize = useCanvasSize ? this.getCanvasSize() : this.getRenderingSize();
        let halfScreenSize = renderSize.mul(0.5);
        let centeredPos = position.sub(halfScreenSize);
        this.setCameraOrthographic(centeredPos);
      }
      _fillShapesBuffer(points, colors, blendMode, onReady, isStrip, groupsSize) {
        this.presentBufferedData();
        colors = colors || _whiteColor;
        blendMode = blendMode || BlendModes2.Opaque;
        if (colors.length !== void 0 && colors.length !== points.length) {
          _logger.error("When drawing shapes with colors array, the colors array and points array must have the same length!");
          return;
        }
        let maxWithMargin = isStrip ? this.maxLineSegments - 1 : this.maxLineSegments;
        if (groupsSize != 1) {
          while (maxWithMargin % groupsSize !== 0) {
            maxWithMargin--;
          }
        }
        if (points.length > maxWithMargin) {
          let sliceI = 0;
          while (true) {
            let start = sliceI * maxWithMargin;
            let end = start + maxWithMargin;
            if (isStrip && sliceI > 0) {
              start--;
            }
            let subpoints = points.slice(start, end);
            if (subpoints.length === 0) {
              break;
            }
            let subcolors = colors && colors.length ? colors.slice(start, end) : colors;
            this._fillShapesBuffer(subpoints, subcolors, blendMode, onReady, isStrip, groupsSize);
            sliceI++;
          }
          return;
        }
        let gl = this._gl;
        let positionsBuff = this._dynamicBuffers.positionArray;
        let colorsBuff = this._dynamicBuffers.colorsArray;
        for (let i = 0; i < points.length; ++i) {
          positionsBuff[i * 3 + 0] = points[i].x;
          positionsBuff[i * 3 + 1] = points[i].y;
          positionsBuff[i * 3 + 2] = points[i].z || 0;
          let color = colors[i] || colors;
          colorsBuff[i * 4 + 0] = color.r;
          colorsBuff[i * 4 + 1] = color.g;
          colorsBuff[i * 4 + 2] = color.b;
          colorsBuff[i * 4 + 3] = color.a;
        }
        this._setBlendMode(blendMode);
        let mesh = new Mesh(this._dynamicBuffers.positionBuffer, null, this._dynamicBuffers.colorsBuffer, this._dynamicBuffers.indexBuffer, points.length);
        this._activeEffect.prepareToDrawBatch(mesh, Matrix.identity);
        this._setActiveTexture(this.whiteTexture);
        let shouldSliceArrays = points.length <= 8;
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._dynamicBuffers.positionBuffer);
        this._gl.bufferData(
          this._gl.ARRAY_BUFFER,
          shouldSliceArrays ? this._dynamicBuffers.positionArray.slice(0, points.length * 3) : this._dynamicBuffers.positionArray,
          this._gl.DYNAMIC_DRAW
        );
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._dynamicBuffers.colorsBuffer);
        this._gl.bufferData(
          this._gl.ARRAY_BUFFER,
          shouldSliceArrays ? this._dynamicBuffers.colorsArray.slice(0, points.length * 4) : this._dynamicBuffers.colorsArray,
          this._gl.DYNAMIC_DRAW
        );
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._dynamicBuffers.linesIndexBuffer);
        this._currIndices = null;
        onReady(points);
      }
      _drawBatch(group, cullOutOfScreen) {
        if (group._sprites.length === 0) {
          return;
        }
        this.presentBufferedData();
        let transform = group.getTransform();
        this.spritesBatch.begin(this._activeEffect, transform);
        this.spritesBatch.draw(group._sprites, cullOutOfScreen);
        this.spritesBatch.end();
      }
      _setActiveTexture(texture) {
        if (this._activeEffect.setTexture(texture)) {
          this._setTextureFilter(texture.filter || this.defaultTextureFilter);
          this._setTextureWrapMode(texture.wrapMode || this.defaultTextureWrapMode);
        }
      }
      get BlendModes() {
        return BlendModes2;
      }
      get TextureWrapModes() {
        return TextureWrapModes2;
      }
      get TextureFilterModes() {
        return TextureFilterModes2;
      }
      get drawCallsCount() {
        return this._drawCallsCount;
      }
      get quadsDrawCount() {
        return this._drawQuadsCount;
      }
      clear(color) {
        this.presentBufferedData();
        color = color || Color3.black;
        this._gl.clearColor(color.r, color.g, color.b, color.a);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
      }
      _setTextureFilter(filter) {
        if (!TextureFilterModes2._values.has(filter)) {
          throw new Error("Invalid texture filter mode! Please pick a value from 'TextureFilterModes'.");
        }
        let glMode = this._gl[filter];
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, glMode);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, glMode);
      }
      _setTextureWrapMode(wrapX, wrapY) {
        if (wrapY === void 0) {
          wrapY = wrapX;
        }
        if (!TextureWrapModes2._values.has(wrapX)) {
          throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'.");
        }
        if (!TextureWrapModes2._values.has(wrapY)) {
          throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'.");
        }
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl[wrapX]);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl[wrapY]);
      }
      _setBlendMode(blendMode) {
        if (this._lastBlendMode !== blendMode) {
          var gl = this._gl;
          switch (blendMode) {
            case BlendModes2.AlphaBlend:
              gl.enable(gl.BLEND);
              gl.blendEquation(gl.FUNC_ADD);
              gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
              break;
            case BlendModes2.Opaque:
              gl.disable(gl.BLEND);
              break;
            case BlendModes2.Additive:
              gl.enable(gl.BLEND);
              gl.blendEquation(gl.FUNC_ADD);
              gl.blendFunc(gl.ONE, gl.ONE);
              break;
            case BlendModes2.Multiply:
              gl.enable(gl.BLEND);
              gl.blendEquation(gl.FUNC_ADD);
              gl.blendFuncSeparate(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
              break;
            case BlendModes2.Screen:
              gl.enable(gl.BLEND);
              gl.blendEquation(gl.FUNC_ADD);
              gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
              break;
            case BlendModes2.Subtract:
              gl.enable(gl.BLEND);
              gl.blendEquation(gl.FUNC_ADD);
              gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
              gl.blendEquationSeparate(gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_ADD);
              break;
            case BlendModes2.Invert:
              gl.enable(gl.BLEND);
              gl.blendEquation(gl.FUNC_ADD);
              gl.blendFunc(gl.ONE_MINUS_DST_COLOR, gl.ZERO);
              gl.blendFuncSeparate(gl.ONE_MINUS_DST_COLOR, gl.ZERO, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
              break;
            case BlendModes2.Overlay:
              gl.enable(gl.BLEND);
              if (gl.MAX) {
                gl.blendEquation(gl.MAX);
                gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
              } else {
                gl.blendEquation(gl.FUNC_ADD);
                gl.blendFunc(gl.ONE, gl.ONE);
              }
              break;
            case BlendModes2.Darken:
              gl.enable(gl.BLEND);
              gl.blendEquation(gl.MIN);
              gl.blendFuncSeparate(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
              break;
            case BlendModes2.DestIn:
              gl.enable(gl.BLEND);
              gl.blendEquation(gl.FUNC_ADD);
              gl.blendFunc(gl.ZERO, gl.SRC_ALPHA);
              break;
            case BlendModes2.DestOut:
              gl.enable(gl.BLEND);
              gl.blendEquation(gl.FUNC_ADD);
              gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);
              break;
            default:
              throw new Error(`Unknown blend mode '${blendMode}'!`);
          }
          this._lastBlendMode = blendMode;
        }
      }
      presentBufferedData() {
        this.__finishDrawingSprites();
      }
      __startDrawingSprites(activeEffect, transform) {
        if (this.spritesBatch.drawing) {
          if (this.spritesBatch._effect !== activeEffect || this.spritesBatch._transform !== transform) {
            this.spritesBatch.end();
          }
        }
        if (!this.spritesBatch.drawing) {
          this.spritesBatch.begin(activeEffect, transform);
        }
      }
      __finishDrawingSprites() {
        if (this.spritesBatch.drawing) {
          this.spritesBatch.end();
        }
      }
      startFrame() {
        this._lastBlendMode = null;
        this._drawCallsCount = 0;
        this._drawQuadsCount = 0;
      }
      endFrame() {
        this.presentBufferedData();
      }
      destroy() {
        _logger.warn("Cleaning up WebGL is not supported yet!");
      }
    };
    module.exports = new Gfx();
  }
});

// ../Shaku/lib/gfx/index.js
var require_gfx2 = __commonJS({
  "../Shaku/lib/gfx/index.js"(exports, module) {
    "use strict";
    module.exports = require_gfx();
  }
});

// ../Shaku/lib/assets/sound_asset.js
var require_sound_asset = __commonJS({
  "../Shaku/lib/assets/sound_asset.js"(exports, module) {
    "use strict";
    var Asset = require_asset();
    var SoundAsset = class extends Asset {
      constructor(url) {
        super(url);
        this._valid = false;
      }
      load() {
        return new Promise((resolve, reject2) => {
          let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          var request = new XMLHttpRequest();
          request.open("GET", this.url, true);
          request.responseType = "arraybuffer";
          request.onload = () => {
            var audioData = request.response;
            this._valid = true;
            this._notifyReady();
            audioCtx.decodeAudioData(
              audioData,
              function(buffer) {
                resolve();
              },
              (e) => {
                reject2(e.err);
              }
            );
          };
          request.onerror = (e) => {
            reject2(e);
          };
          request.send();
        });
      }
      get valid() {
        return this._valid;
      }
      destroy() {
        this._valid = false;
      }
    };
    module.exports = SoundAsset;
  }
});

// ../Shaku/lib/sfx/sound_instance.js
var require_sound_instance = __commonJS({
  "../Shaku/lib/sfx/sound_instance.js"(exports, module) {
    "use strict";
    var _logger = require_logger().getLogger("sfx");
    var SoundInstance = class {
      constructor(sfxManager, url) {
        if (!url) {
          _logger.error("Sound type can't be null or invalid!");
          throw new Error("Invalid sound type to play in SoundInstance!");
        }
        this._sfx = sfxManager;
        this._audio = new Audio(url);
        this._volume = 1;
      }
      disposeWhenDone() {
        this._audio.onended = () => {
          this.dispose();
        };
      }
      dispose() {
        this._audio.src = "";
        this._audio.srcObject = null;
        this._audio.remove();
        this._audio = null;
      }
      play() {
        if (this.playing) {
          return;
        }
        let promise = this._audio.play();
        this._sfx._playingSounds.add(this);
        return promise;
      }
      get playbackRate() {
        return this._audio.playbackRate;
      }
      set playbackRate(val) {
        if (val < 0.1) {
          _logger.error("playbackRate value set is too low, value was capped to 0.1.");
        }
        if (val > 10) {
          _logger.error("playbackRate value set is too high, value was capped to 10.");
        }
        this._audio.playbackRate = val;
      }
      get preservesPitch() {
        return Boolean(this._audio.preservesPitch || this._audio.mozPreservesPitch);
      }
      set preservesPitch(val) {
        return this._audio.preservesPitch = this._audio.mozPreservesPitch = Boolean(val);
      }
      pause() {
        this._audio.pause();
      }
      replay() {
        this.stop();
        return this.play();
      }
      stop() {
        try {
          this.pause();
          this.currentTime = 0;
          return true;
        } catch (e) {
          return false;
        }
      }
      get loop() {
        return this._audio.loop;
      }
      set loop(value) {
        this._audio.loop = value;
        return this._audio.loop;
      }
      get volume() {
        return this._volume;
      }
      set volume(value) {
        this._volume = value;
        var volume = value * SoundInstance._masterVolume;
        if (volume < 0) {
          volume = 0;
        }
        if (volume > 1) {
          volume = 1;
        }
        this._audio.volume = volume;
        return this._volume;
      }
      get currentTime() {
        return this._audio.currentTime;
      }
      set currentTime(value) {
        return this._audio.currentTime = value;
      }
      get duration() {
        return this._audio.duration;
      }
      get paused() {
        return this._audio.paused;
      }
      get playing() {
        return !this.paused && !this.finished;
      }
      get finished() {
        return this._audio.ended;
      }
    };
    SoundInstance._masterVolume = 1;
    module.exports = SoundInstance;
  }
});

// ../Shaku/lib/sfx/sound_mixer.js
var require_sound_mixer = __commonJS({
  "../Shaku/lib/sfx/sound_mixer.js"(exports, module) {
    "use strict";
    var SoundInstance = require_sound_instance();
    var SoundMixer = class {
      constructor(sound1, sound2, allowOverlapping) {
        this._sound1 = sound1;
        this._sound2 = sound2;
        this.fromSoundVolume = this._sound1 ? this._sound1.volume : 0;
        this.toSoundVolume = this._sound2 ? this._sound2.volume : 0;
        this.allowOverlapping = allowOverlapping;
        this.update(0);
      }
      stop() {
        if (this._sound1) {
          this._sound1.stop();
        }
        if (this._sound2) {
          this._sound2.stop();
        }
      }
      get fromSound() {
        return this._sound1;
      }
      get toSound() {
        return this._sound2;
      }
      get progress() {
        return this._progress;
      }
      updateDelta(delta) {
        this.update(this._progress + delta);
      }
      update(progress) {
        if (progress <= 0) {
          if (this._sound1) {
            this._sound1.volume = this.fromSoundVolume;
          }
          if (this._sound2) {
            this._sound2.volume = 0;
            this._sound2.stop();
          }
          this._progress = 0;
        }
        if (progress >= 1) {
          if (this._sound2) {
            this._sound2.volume = this.toSoundVolume;
          }
          if (this._sound1) {
            this._sound1.volume = 0;
            this._sound1.stop();
          }
          this._progress = 1;
        } else {
          this._progress = progress;
          if (this._sound1) {
            this._sound1.play();
          }
          if (this._sound2) {
            this._sound2.play();
          }
          if (this.allowOverlapping) {
            if (this._sound1) {
              this._sound1.volume = this.fromSoundVolume * (1 - progress);
            }
            if (this._sound2) {
              this._sound2.volume = this.toSoundVolume * progress;
            }
          } else {
            progress *= 2;
            if (this._sound1) {
              this._sound1.volume = Math.max(this.fromSoundVolume * (1 - progress), 0);
            }
            if (this._sound2) {
              this._sound2.volume = Math.max(this.toSoundVolume * (progress - 1), 0);
            }
          }
        }
      }
    };
    module.exports = SoundMixer;
  }
});

// ../Shaku/lib/sfx/sfx.js
var require_sfx = __commonJS({
  "../Shaku/lib/sfx/sfx.js"(exports, module) {
    "use strict";
    var SoundAsset = require_sound_asset();
    var IManager = require_manager();
    var _logger = require_logger().getLogger("sfx");
    var SoundInstance = require_sound_instance();
    var SoundMixer = require_sound_mixer();
    var Sfx = class extends IManager {
      constructor() {
        super();
        this._playingSounds = null;
      }
      setup() {
        return new Promise((resolve, reject2) => {
          _logger.info("Setup sfx manager..");
          this._playingSounds = /* @__PURE__ */ new Set();
          resolve();
        });
      }
      startFrame() {
        var playingSounds = Array.from(this._playingSounds);
        for (var i = 0; i < playingSounds.length; ++i) {
          var sound = playingSounds[i];
          if (!sound.isPlaying) {
            this._playingSounds.delete(sound);
          }
        }
      }
      endFrame() {
        var playingSounds = Array.from(this._playingSounds);
        for (var i = 0; i < playingSounds.length; ++i) {
          var sound = playingSounds[i];
          if (!sound.isPlaying) {
            this._playingSounds.delete(sound);
          }
        }
      }
      destroy() {
        this.stopAll();
        this._playingSounds = /* @__PURE__ */ new Set();
      }
      get SoundMixer() {
        return SoundMixer;
      }
      play(sound, volume, playbackRate, preservesPitch) {
        var sound = this.createSound(sound);
        sound.volume = volume !== void 0 ? volume : 1;
        if (playbackRate !== void 0) {
          sound.playbackRate = playbackRate;
        }
        if (preservesPitch !== void 0) {
          sound.preservesPitch = preservesPitch;
        }
        let ret = sound.play();
        sound.disposeWhenDone();
        return ret;
      }
      stopAll() {
        var playingSounds = Array.from(this._playingSounds);
        for (var i = 0; i < playingSounds.length; ++i) {
          var sound = playingSounds[i];
          sound.stop();
        }
        this._playingSounds = /* @__PURE__ */ new Set();
      }
      get playingSoundsCount() {
        return this._playingSounds.size;
      }
      createSound(sound) {
        if (!(sound instanceof SoundAsset)) {
          throw new Error("Sound type must be an instance of SoundAsset!");
        }
        var ret = new SoundInstance(this, sound.url);
        return ret;
      }
      get masterVolume() {
        return SoundInstance._masterVolume;
      }
      set masterVolume(value) {
        SoundInstance._masterVolume = value;
        return value;
      }
    };
    module.exports = new Sfx();
  }
});

// ../Shaku/lib/sfx/index.js
var require_sfx2 = __commonJS({
  "../Shaku/lib/sfx/index.js"(exports, module) {
    "use strict";
    module.exports = require_sfx();
  }
});

// ../Shaku/lib/input/key_codes.js
var require_key_codes = __commonJS({
  "../Shaku/lib/input/key_codes.js"(exports, module) {
    "use strict";
    var MouseButtons = {
      left: 0,
      middle: 1,
      right: 2
    };
    var KeyboardKeys = {
      backspace: 8,
      tab: 9,
      enter: 13,
      shift: 16,
      ctrl: 17,
      alt: 18,
      break: 19,
      caps_lock: 20,
      escape: 27,
      page_up: 33,
      page_down: 34,
      end: 35,
      home: 36,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      insert: 45,
      delete: 46,
      space: 32,
      n0: 48,
      n1: 49,
      n2: 50,
      n3: 51,
      n4: 52,
      n5: 53,
      n6: 54,
      n7: 55,
      n8: 56,
      n9: 57,
      a: 65,
      b: 66,
      c: 67,
      d: 68,
      e: 69,
      f: 70,
      g: 71,
      h: 72,
      i: 73,
      j: 74,
      k: 75,
      l: 76,
      m: 77,
      n: 78,
      o: 79,
      p: 80,
      q: 81,
      r: 82,
      s: 83,
      t: 84,
      u: 85,
      v: 86,
      w: 87,
      x: 88,
      y: 89,
      z: 90,
      left_window_key: 91,
      right_window_key: 92,
      select_key: 93,
      numpad_0: 96,
      numpad_1: 97,
      numpad_2: 98,
      numpad_3: 99,
      numpad_4: 100,
      numpad_5: 101,
      numpad_6: 102,
      numpad_7: 103,
      numpad_8: 104,
      numpad_9: 105,
      multiply: 106,
      add: 107,
      subtract: 109,
      decimal_point: 110,
      divide: 111,
      f1: 112,
      f2: 113,
      f3: 114,
      f4: 115,
      f5: 116,
      f6: 117,
      f7: 118,
      f8: 119,
      f9: 120,
      f10: 121,
      f11: 122,
      f12: 123,
      numlock: 144,
      scroll_lock: 145,
      semicolon: 186,
      equal_sign: 187,
      plus: 187,
      comma: 188,
      dash: 189,
      minus: 189,
      period: 190,
      forward_slash: 191,
      grave_accent: 192,
      open_bracket: 219,
      back_slash: 220,
      close_braket: 221,
      single_quote: 222
    };
    module.exports = { KeyboardKeys, MouseButtons };
  }
});

// ../Shaku/lib/input/input.js
var require_input = __commonJS({
  "../Shaku/lib/input/input.js"(exports, module) {
    "use strict";
    var IManager = require_manager();
    var Vector22 = require_vector2();
    var { MouseButton, MouseButtons, KeyboardKey, KeyboardKeys } = require_key_codes();
    var _logger = require_logger().getLogger("input");
    var Input = class extends IManager {
      constructor() {
        super();
        this._callbacks = null;
        this._targetElement = window;
        this.MouseButtons = MouseButtons;
        this.KeyboardKeys = KeyboardKeys;
        this.preventDefaults = false;
        this.enableMouseDeltaWhileMouseWheelDown = true;
        this.disableContextMenu = true;
        this.resetOnFocusLoss = true;
        this._resetAll();
      }
      setup() {
        return new Promise((resolve, reject2) => {
          _logger.info("Setup input manager..");
          if (typeof this._targetElement === "function") {
            this._targetElement = this._targetElement();
            if (!this._targetElement) {
              throw new Error("Input target element was set to be a method, but the returned value was invalid!");
            }
          }
          let element = this._targetElement;
          if (element.tabIndex === -1 || element.tabIndex === void 0) {
            element.tabIndex = 1e3;
          }
          window.setTimeout(() => element.focus(), 0);
          var _this = this;
          this._callbacks = {
            "mousedown": function(event2) {
              _this._onMouseDown(event2);
              if (this.preventDefaults)
                event2.preventDefault();
            },
            "mouseup": function(event2) {
              _this._onMouseUp(event2);
              if (this.preventDefaults)
                event2.preventDefault();
            },
            "mousemove": function(event2) {
              _this._onMouseMove(event2);
              if (this.preventDefaults)
                event2.preventDefault();
            },
            "keydown": function(event2) {
              _this._onKeyDown(event2);
              if (this.preventDefaults)
                event2.preventDefault();
            },
            "keyup": function(event2) {
              _this._onKeyUp(event2);
              if (this.preventDefaults)
                event2.preventDefault();
            },
            "blur": function(event2) {
              _this._onBlur(event2);
              if (this.preventDefaults)
                event2.preventDefault();
            },
            "wheel": function(event2) {
              _this._onMouseWheel(event2);
            },
            "touchstart": function(event2) {
              _this._onTouchStart(event2);
              if (this.preventDefaults)
                event2.preventDefault();
            },
            "touchend": function(event2) {
              _this._onMouseUp(event2);
              if (this.preventDefaults)
                event2.preventDefault();
            },
            "touchmove": function(event2) {
              _this._onTouchMove(event2);
              if (this.preventDefaults)
                event2.preventDefault();
            },
            "contextmenu": function(event2) {
              if (_this.disableContextMenu) {
                event2.preventDefault();
              }
            }
          };
          this._resetAll();
          for (var event in this._callbacks) {
            element.addEventListener(event, this._callbacks[event], false);
          }
          if (element !== window) {
            window.addEventListener("mouseup", this._callbacks["mouseup"], false);
            window.addEventListener("touchend", this._callbacks["touchend"], false);
          }
          resolve();
        });
      }
      startFrame() {
      }
      destroy() {
        if (this._callbacks) {
          let element = this._targetElement;
          for (var event in this._callbacks) {
            element.removeEventListener(event, this._callbacks[event]);
          }
          if (element !== window) {
            window.removeEventListener("mouseup", this._callbacks["mouseup"], false);
            window.removeEventListener("touchend", this._callbacks["touchend"], false);
          }
          this._callbacks = null;
        }
      }
      setTargetElement(element) {
        if (this._callbacks) {
          throw new Error("'setTargetElement() must be called before initializing the input manager!");
        }
        this._targetElement = element;
      }
      _resetAll() {
        this._mousePos = new Vector22();
        this._mousePrevPos = new Vector22();
        this._mouseState = {};
        this._mousePrevState = {};
        this._mouseWheel = 0;
        this._keyboardState = {};
        this._keyboardPrevState = {};
        this._touchStarted = false;
      }
      get mousePosition() {
        return this._mousePos.clone();
      }
      get prevMousePosition() {
        return (this._mousePrevPos || this._mousePos).clone();
      }
      get mouseDelta() {
        if (!this._mousePrevPos) {
          return Vector22.zero;
        }
        return new Vector22(this._mousePos.x - this._mousePrevPos.x, this._mousePos.y - this._mousePrevPos.y);
      }
      get mouseMoving() {
        return this._mousePrevPos && !this._mousePrevPos.equals(this._mousePos);
      }
      mousePressed(button = 0) {
        if (button === void 0)
          throw new Error("Invalid button code!");
        return Boolean(this._mouseState[button] && !this._mousePrevState[button]);
      }
      mouseDown(button = 0) {
        if (button === void 0)
          throw new Error("Invalid button code!");
        return Boolean(this._mouseState[button]);
      }
      mouseUp(button = 0) {
        if (button === void 0)
          throw new Error("Invalid button code!");
        return Boolean(!this.mouseDown(button));
      }
      mouseReleased(button = 0) {
        if (button === void 0)
          throw new Error("Invalid button code!");
        return Boolean(!this._mouseState[button] && this._mousePrevState[button]);
      }
      keyDown(key) {
        if (key === void 0)
          throw new Error("Invalid key code!");
        return Boolean(this._keyboardState[key]);
      }
      keyUp(key) {
        if (key === void 0)
          throw new Error("Invalid key code!");
        return Boolean(!this.keyDown(key));
      }
      keyReleased(key) {
        if (key === void 0)
          throw new Error("Invalid key code!");
        return Boolean(!this._keyboardState[key] && this._keyboardPrevState[key]);
      }
      keyPressed(key) {
        if (key === void 0)
          throw new Error("Invalid key code!");
        return Boolean(this._keyboardState[key] && !this._keyboardPrevState[key]);
      }
      get shiftDown() {
        return Boolean(this.keyDown(this.KeyboardKeys.shift));
      }
      get ctrlDown() {
        return Boolean(this.keyDown(this.KeyboardKeys.ctrl));
      }
      get altDown() {
        return Boolean(this.keyDown(this.KeyboardKeys.alt));
      }
      get anyKeyPressed() {
        for (var key in this._keyboardState) {
          if (this._keyboardState[key] && !this._keyboardPrevState[key]) {
            return true;
          }
        }
        return false;
      }
      get anyKeyDown() {
        for (var key in this._keyboardState) {
          if (this._keyboardState[key]) {
            return true;
          }
        }
        return false;
      }
      get anyMouseButtonPressed() {
        for (var key in this._mouseState) {
          if (this._mouseState[key] && !this._mousePrevState[key]) {
            return true;
          }
        }
        return false;
      }
      get anyMouseButtonDown() {
        for (var key in this._mouseState) {
          if (this._mouseState[key]) {
            return true;
          }
        }
        return false;
      }
      _getValueWithCode(code, mouseCheck, keyboardCheck) {
        code = String(code);
        if (code.indexOf("mouse_") === 0) {
          var codename = code.split("_")[1];
          return mouseCheck.call(this, this.MouseButtons[codename]);
        }
        if (!isNaN(parseInt(code)) && code.length === 1) {
          code = "n" + code;
        }
        return keyboardCheck.call(this, this.KeyboardKeys[code]);
      }
      down(code) {
        if (!(code instanceof Array)) {
          code = [code];
        }
        for (let c of code) {
          if (Boolean(this._getValueWithCode(c, this.mouseDown, this.keyDown))) {
            return true;
          }
        }
        return false;
      }
      released(code) {
        if (!(code instanceof Array)) {
          code = [code];
        }
        for (let c of code) {
          if (Boolean(this._getValueWithCode(c, this.mouseReleased, this.keyReleased))) {
            return true;
          }
        }
        return false;
      }
      pressed(code) {
        if (!(code instanceof Array)) {
          code = [code];
        }
        for (let c of code) {
          if (Boolean(this._getValueWithCode(c, this.mousePressed, this.keyPressed))) {
            return true;
          }
        }
        return false;
      }
      get mouseWheelSign() {
        return Math.sign(this._mouseWheel);
      }
      get mouseWheel() {
        return this._mouseWheel;
      }
      endFrame() {
        this._mousePrevPos = this._mousePos.clone();
        this._keyboardPrevState = {};
        for (var key in this._keyboardState) {
          this._keyboardPrevState[key] = this._keyboardState[key];
        }
        this._mousePrevState = {};
        for (var key in this._mouseState) {
          this._mousePrevState[key] = this._mouseState[key];
        }
        if (this._touchStarted) {
          this._mouseState[this.MouseButtons.left] = true;
          this._touchStarted = false;
        }
        this._mouseWheel = 0;
      }
      _getKeyboardKeyCode(event) {
        event = this._getEvent(event);
        return event.keyCode !== void 0 ? event.keyCode : event.key.charCodeAt(0);
      }
      _onBlur(event) {
        if (this.resetOnFocusLoss) {
          this._resetAll();
        }
      }
      _onMouseWheel(event) {
        this._mouseWheel = event.deltaY;
      }
      _onKeyDown(event) {
        var keycode = this._getKeyboardKeyCode(event);
        this._keyboardState[keycode] = true;
      }
      _onKeyUp(event) {
        var keycode = this._getKeyboardKeyCode(event);
        this._keyboardState[keycode || 0] = false;
      }
      _onTouchStart(event) {
        var touches = event.changedTouches;
        if (touches && touches.length) {
          var touch = touches[0];
          var x = touch.pageX || touch.offsetX || touch.clientX;
          var y = touch.pageY || touch.offsetY || touch.clientY;
          if (x !== void 0 && y !== void 0) {
            this._mousePos.x = x;
            this._mousePos.y = y;
            this._normalizeMousePos();
          }
        }
        this._touchStarted = true;
      }
      _onMouseDown(event) {
        event = this._getEvent(event);
        if (this.enableMouseDeltaWhileMouseWheelDown && event.button === this.MouseButtons.middle) {
          event.preventDefault();
        }
        this._mouseState[event.button || 0] = true;
      }
      _onMouseUp(event) {
        event = this._getEvent(event);
        this._mouseState[event.button || 0] = false;
      }
      _onTouchMove(event) {
        event = this._getEvent(event);
        this._mousePos.x = event.touches[0].pageX;
        this._mousePos.y = event.touches[0].pageY;
        this._normalizeMousePos();
      }
      _onMouseMove(event) {
        event = this._getEvent(event);
        if (document.pointerLockElement !== null) {
          this._mousePos.x += event.movementX;
          this._mousePos.y += event.movementY;
          return;
        }
        var pageX = event.clientX;
        if (pageX === void 0) {
          pageX = event.x;
        }
        if (pageX === void 0) {
          pageX = event.offsetX;
        }
        if (pageX === void 0) {
          pageX = event.pageX;
        }
        var pageY = event.clientY;
        if (pageY === void 0) {
          pageY = event.y;
        }
        if (pageY === void 0) {
          pageY = event.offsetY;
        }
        if (pageY === void 0) {
          pageY = event.pageY;
        }
        if (pageX === void 0) {
          pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          pageY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        this._mousePos.x = pageX;
        this._mousePos.y = pageY;
        this._normalizeMousePos();
      }
      _normalizeMousePos() {
        if (this._targetElement && this._targetElement.getBoundingClientRect) {
          var rect = this._targetElement.getBoundingClientRect();
          this._mousePos.x -= rect.left;
          this._mousePos.y -= rect.top;
        }
      }
      _getEvent(event) {
        return event || window.event;
      }
    };
    module.exports = new Input();
  }
});

// ../Shaku/lib/input/index.js
var require_input2 = __commonJS({
  "../Shaku/lib/input/index.js"(exports, module) {
    "use strict";
    module.exports = require_input();
  }
});

// ../Shaku/lib/assets/binary_asset.js
var require_binary_asset = __commonJS({
  "../Shaku/lib/assets/binary_asset.js"(exports, module) {
    "use strict";
    var Asset = require_asset();
    var BinaryAsset = class extends Asset {
      constructor(url) {
        super(url);
        this._data = null;
      }
      load() {
        return new Promise((resolve, reject2) => {
          var request = new XMLHttpRequest();
          request.open("GET", this.url, true);
          request.responseType = "arraybuffer";
          request.onload = () => {
            if (request.readyState == 4) {
              if (request.response) {
                this._data = new Uint8Array(request.response);
                this._notifyReady();
                resolve();
              } else {
                reject2(request.statusText);
              }
            }
          };
          request.onerror = (e) => {
            reject2(e);
          };
          request.send();
        });
      }
      create(source) {
        return new Promise((resolve, reject2) => {
          if (source instanceof Array) {
            source = new Uint8Array(source);
          }
          if (!(source instanceof Uint8Array)) {
            return reject2("Binary asset source must be of type 'Uint8Array'!");
          }
          this._data = source;
          this._notifyReady();
          resolve();
        });
      }
      get valid() {
        return Boolean(this._data);
      }
      destroy() {
        this._data = null;
      }
      get data() {
        return this._data;
      }
      string() {
        return new TextDecoder().decode(this._data);
      }
    };
    module.exports = BinaryAsset;
  }
});

// ../Shaku/lib/assets/assets.js
var require_assets = __commonJS({
  "../Shaku/lib/assets/assets.js"(exports, module) {
    "use strict";
    var SoundAsset = require_sound_asset();
    var IManager = require_manager();
    var BinaryAsset = require_binary_asset();
    var JsonAsset = require_json_asset();
    var TextureAsset = require_texture_asset();
    var FontTextureAsset = require_font_texture_asset();
    var MsdfFontTextureAsset = require_msdf_font_texture_asset();
    var Asset = require_asset();
    var _logger = require_logger().getLogger("assets");
    var Assets = class extends IManager {
      constructor() {
        super();
        this._loaded = null;
        this._waitingAssets = /* @__PURE__ */ new Set();
        this._failedAssets = /* @__PURE__ */ new Set();
        this._successfulLoadedAssetsCount = 0;
        this.root = "";
        this.suffix = "";
      }
      _wrapUrl(url) {
        if (!url) {
          return url;
        }
        return this.root + url + this.suffix;
      }
      get pendingAssets() {
        return Array.from(this._waitingAssets);
      }
      get failedAssets() {
        return Array.from(this._failedAssets);
      }
      waitForAll() {
        return new Promise((resolve, reject2) => {
          _logger.debug("Waiting for all assets..");
          let checkAssets = () => {
            if (this._failedAssets.size !== 0) {
              _logger.warn("Done waiting for assets: had errors.");
              return reject2(this.failedAssets);
            }
            if (this._waitingAssets.size === 0) {
              _logger.debug("Done waiting for assets: everything loaded successfully.");
              return resolve();
            }
            setTimeout(checkAssets, 1);
          };
          checkAssets();
        });
      }
      setup() {
        return new Promise((resolve, reject2) => {
          _logger.info("Setup assets manager..");
          this._loaded = {};
          resolve();
        });
      }
      startFrame() {
      }
      endFrame() {
      }
      _getFromCache(url, type) {
        let cached = this._loaded[url] || null;
        if (cached && type) {
          if (!(cached instanceof type)) {
            throw new Error(`Asset with URL '${url}' is already loaded, but has unexpected type (expecting ${type})!`);
          }
        }
        return cached;
      }
      async _loadAndCacheAsset(newAsset, params) {
        let url = newAsset.url;
        let typeName = newAsset.constructor.name;
        this._loaded[url] = newAsset;
        this._waitingAssets.add(url);
        return new Promise(async (resolve, reject2) => {
          _logger.debug(`Load asset [${typeName}] from URL '${url}'.`);
          try {
            await newAsset.load(params);
          } catch (e) {
            _logger.warn(`Failed to load asset [${typeName}] from URL '${url}'.`);
            this._failedAssets.add(url);
            return reject2(e);
          }
          this._waitingAssets.delete(url);
          if (!newAsset.valid) {
            _logger.warn(`Failed to load asset [${typeName}] from URL '${url}'.`);
            this._failedAssets.add(url);
            return reject2("Loaded asset is not valid!");
          }
          _logger.debug(`Successfully loaded asset [${typeName}] from URL '${url}'.`);
          this._successfulLoadedAssetsCount++;
          resolve(newAsset);
        });
      }
      getCached(url) {
        url = this._wrapUrl(url);
        return this._loaded[url] || null;
      }
      _loadAssetType(url, typeClass, params) {
        url = this._wrapUrl(url);
        let _asset = this._getFromCache(url, typeClass);
        var needLoad = false;
        if (!_asset) {
          _asset = new typeClass(url);
          needLoad = true;
        }
        let promise = new Promise(async (resolve, reject2) => {
          if (needLoad) {
            await this._loadAndCacheAsset(_asset, params);
          }
          _asset.onReady(() => {
            resolve(_asset);
          });
        });
        promise.asset = _asset;
        return promise;
      }
      _createAsset(name, classType, initMethod) {
        name = this._wrapUrl(name);
        var _asset = new classType(name || generateRandomAssetName());
        let promise = new Promise(async (resolve, reject2) => {
          if (name && this._loaded[name]) {
            return reject2(`Asset of type '${classType.name}' to create with URL '${name}' already exist in cache!`);
          }
          initMethod(_asset);
          if (name) {
            this._loaded[name] = _asset;
          }
          resolve(_asset);
        });
        promise.asset = _asset;
        return promise;
      }
      loadSound(url) {
        return this._loadAssetType(url, SoundAsset, void 0);
      }
      loadTexture(url, params) {
        return this._loadAssetType(url, TextureAsset, params);
      }
      createRenderTarget(name, width, height, channels) {
        if (!width || !height) {
          throw new Error("Missing or invalid size!");
        }
        return this._createAsset(name, TextureAsset, (asset) => {
          asset.createRenderTarget(width, height, channels);
        });
      }
      loadFontTexture(url, params) {
        return this._loadAssetType(url, FontTextureAsset, params);
      }
      loadMsdfFontTexture(url, params) {
        return this._loadAssetType(url, MsdfFontTextureAsset, params);
      }
      loadJson(url) {
        return this._loadAssetType(url, JsonAsset);
      }
      createJson(name, data) {
        if (!data) {
          return reject("Missing or invalid data!");
        }
        return this._createAsset(name, JsonAsset, (asset) => {
          asset.create(data);
        });
      }
      loadBinary(url) {
        return this._loadAssetType(url, BinaryAsset);
      }
      createBinary(name, data) {
        if (!data) {
          return reject("Missing or invalid data!");
        }
        return this._createAsset(name, BinaryAsset, (asset) => {
          asset.create(data);
        });
      }
      free(url) {
        url = this._wrapUrl(url);
        let asset = this._loaded[url];
        if (asset) {
          asset.destroy();
          delete this._loaded[url];
        }
      }
      clearCache() {
        for (let key in this._loaded) {
          this._loaded[key].destroy();
        }
        this._loaded = {};
        this._waitingAssets = /* @__PURE__ */ new Set();
        this._failedAssets = /* @__PURE__ */ new Set();
      }
      destroy() {
        this.clearCache();
      }
    };
    var _nextRandomAssetId = 0;
    function generateRandomAssetName() {
      return "_runtime_asset_" + _nextRandomAssetId++ + "_";
    }
    module.exports = new Assets();
  }
});

// ../Shaku/lib/assets/index.js
var require_assets2 = __commonJS({
  "../Shaku/lib/assets/index.js"(exports, module) {
    "use strict";
    module.exports = require_assets();
  }
});

// ../Shaku/lib/collision/shapes/shape.js
var require_shape = __commonJS({
  "../Shaku/lib/collision/shapes/shape.js"(exports, module) {
    "use strict";
    var Color3 = require_color();
    var Rectangle2 = require_rectangle();
    var Vector22 = require_vector2();
    var CollisionWorld = require_collision_world();
    var CollisionShape = class {
      constructor() {
        this._world = null;
        this._worldRange = null;
        this._debugColor = null;
        this._forceDebugColor = null;
        this._collisionFlags = Number.MAX_SAFE_INTEGER;
      }
      get shapeId() {
        throw new Error("Not Implemented!");
      }
      get collisionFlags() {
        return this._collisionFlags;
      }
      set collisionFlags(value) {
        this._debugColor = null;
        this._collisionFlags = value;
        return this._collisionFlags;
      }
      setDebugColor(color) {
        this._forceDebugColor = color;
      }
      debugDraw(opacity) {
        throw new Error("Not Implemented!");
      }
      getCenter() {
        throw new Error("Not Implemented!");
      }
      remove() {
        if (this._world) {
          this._world.removeShape(this);
        }
      }
      _getDebugColor() {
        if (this._forceDebugColor) {
          return this._forceDebugColor.clone();
        }
        if (!this._debugColor) {
          this._debugColor = this._getDefaultDebugColorFor(this.collisionFlags);
        }
        return this._debugColor.clone();
      }
      _getDefaultDebugColorFor(flags) {
        return defaultDebugColors[flags % defaultDebugColors.length];
      }
      _getRadius() {
        throw new Error("Not Implemented!");
      }
      _getBoundingBox() {
        throw new Error("Not Implemented!");
      }
      _setParent(world) {
        if (world === this._world) {
          return;
        }
        if (this._world && world) {
          throw new Error("Cannot add collision shape to world while its already in another world!");
        }
        this._world = world;
        this._worldRange = null;
      }
      _shapeChanged() {
        if (this._world) {
          this._world._queueUpdate(this);
        }
      }
    };
    var defaultDebugColors = [Color3.red, Color3.blue, Color3.green, Color3.yellow, Color3.purple, Color3.teal, Color3.brown, Color3.orange, Color3.khaki, Color3.darkcyan, Color3.cornflowerblue, Color3.darkgray, Color3.chocolate, Color3.aquamarine, Color3.cadetblue, Color3.magenta, Color3.seagreen, Color3.pink, Color3.olive, Color3.violet];
    module.exports = CollisionShape;
  }
});

// ../Shaku/lib/collision/result.js
var require_result = __commonJS({
  "../Shaku/lib/collision/result.js"(exports, module) {
    "use strict";
    var Vector22 = require_vector2();
    var CollisionShape = require_shape();
    var CollisionTestResult = class {
      constructor(position, first, second) {
        this.position = position;
        this.first = first;
        this.second = second;
      }
    };
    module.exports = CollisionTestResult;
  }
});

// ../Shaku/lib/collision/resolver.js
var require_resolver = __commonJS({
  "../Shaku/lib/collision/resolver.js"(exports, module) {
    "use strict";
    var Vector22 = require_vector2();
    var CollisionTestResult = require_result();
    var CollisionShape = require_shape();
    var _logger = require_logger().getLogger("collision");
    var CollisionResolver = class {
      constructor() {
        this._handlers = {};
      }
      _init() {
      }
      setHandler(firstShapeId, secondShapeId, handler) {
        _logger.debug(`Register handler for shapes '${firstShapeId}' and '${secondShapeId}'.`);
        if (!this._handlers[firstShapeId]) {
          this._handlers[firstShapeId] = {};
        }
        this._handlers[firstShapeId][secondShapeId] = handler;
        if (firstShapeId !== secondShapeId) {
          if (!this._handlers[secondShapeId]) {
            this._handlers[secondShapeId] = {};
          }
          this._handlers[secondShapeId][firstShapeId] = (f, s) => {
            return handler(s, f);
          };
        }
      }
      test(first, second) {
        let handler = this._getCollisionMethod(first, second);
        return this.testWithHandler(first, second, handler);
      }
      testWithHandler(first, second, handler) {
        if (!handler) {
          _logger.warn(`Missing collision handler for shapes '${first.shapeId}' and '${second.shapeId}'.`);
          return null;
        }
        let result2 = handler(first, second);
        if (result2) {
          let position = result2 instanceof Vector22 ? result2 : null;
          return new CollisionTestResult(position, first, second);
        }
        return null;
      }
      getHandlers(shape) {
        return this._handlers[shape.shapeId];
      }
      _getCollisionMethod(first, second) {
        let handlersFrom = this._handlers[first.shapeId];
        if (handlersFrom) {
          return handlersFrom[second.shapeId] || null;
        }
        return null;
      }
    };
    module.exports = CollisionResolver;
  }
});

// ../Shaku/lib/collision/shapes/point.js
var require_point = __commonJS({
  "../Shaku/lib/collision/shapes/point.js"(exports, module) {
    "use strict";
    var CollisionShape = require_shape();
    var gfx = require_gfx2();
    var Vector22 = require_vector2();
    var Rectangle2 = require_rectangle();
    var Circle2 = require_circle();
    var PointShape = class extends CollisionShape {
      constructor(position) {
        super();
        this.setPosition(position);
      }
      get shapeId() {
        return "point";
      }
      setPosition(position) {
        this._position = position.clone();
        this._boundingBox = new Rectangle2(position.x, position.y, 1, 1);
        this._shapeChanged();
      }
      getPosition() {
        return this._position.clone();
      }
      getCenter() {
        return this._position.clone();
      }
      _getRadius() {
        return 1;
      }
      _getBoundingBox() {
        return this._boundingBox;
      }
      debugDraw(opacity) {
        if (opacity === void 0)
          opacity = 1;
        let color = this._getDebugColor();
        color.a *= opacity;
        gfx.outlineCircle(new Circle2(this.getPosition(), 3), color, gfx.BlendModes.AlphaBlend, 4);
      }
    };
    module.exports = PointShape;
  }
});

// ../Shaku/lib/collision/shapes/circle.js
var require_circle2 = __commonJS({
  "../Shaku/lib/collision/shapes/circle.js"(exports, module) {
    "use strict";
    var CollisionShape = require_shape();
    var gfx = require_gfx2();
    var Circle2 = require_circle();
    var Rectangle2 = require_rectangle();
    var CircleShape = class extends CollisionShape {
      constructor(circle) {
        super();
        this.setShape(circle);
      }
      get shapeId() {
        return "circle";
      }
      setShape(circle) {
        this._circle = circle;
        this._position = circle.center;
        this._boundingBox = new Rectangle2(circle.center.x - circle.radius, circle.center.y - circle.radius, circle.radius * 2, circle.radius * 2);
        this._shapeChanged();
      }
      _getRadius() {
        return this._circle.radius;
      }
      getCenter() {
        return this._position.clone();
      }
      _getBoundingBox() {
        return this._boundingBox;
      }
      debugDraw(opacity) {
        if (opacity === void 0)
          opacity = 1;
        let color = this._getDebugColor();
        color.a *= opacity;
        gfx.outlineCircle(this._circle, color, gfx.BlendModes.AlphaBlend, 14);
        color.a *= 0.25;
        gfx.fillCircle(this._circle, color, gfx.BlendModes.AlphaBlend, 14);
      }
    };
    module.exports = CircleShape;
  }
});

// ../Shaku/lib/collision/collision_world.js
var require_collision_world = __commonJS({
  "../Shaku/lib/collision/collision_world.js"(exports, module) {
    "use strict";
    var Color3 = require_color();
    var Vector22 = require_vector2();
    var Circle2 = require_circle();
    var CollisionTestResult = require_result();
    var CollisionShape = require_shape();
    var gfx = require_gfx2();
    var Rectangle2 = require_rectangle();
    var CollisionResolver = require_resolver();
    var PointShape = require_point();
    var CircleShape = require_circle2();
    var _logger = require_logger().getLogger("collision");
    var CollisionWorld = class {
      constructor(resolver, gridCellSize) {
        this.resolver = resolver;
        if (typeof gridCellSize === "undefined") {
          gridCellSize = new Vector22(512, 512);
        } else if (typeof gridCellSize === "number") {
          gridCellSize = new Vector22(gridCellSize, gridCellSize);
        } else {
          gridCellSize = gridCellSize.clone();
        }
        this._gridCellSize = gridCellSize;
        this._grid = {};
        this._shapesToUpdate = /* @__PURE__ */ new Set();
        this._cellsToDelete = /* @__PURE__ */ new Set();
      }
      _performUpdates() {
        if (this._cellsToDelete.size > 0) {
          for (let key of this._cellsToDelete) {
            if (this._grid[key] && this._grid[key].size === 0) {
              delete this._grid[key];
            }
          }
          this._cellsToDelete.clear();
        }
        if (this._shapesToUpdate.size > 0) {
          for (let shape of this._shapesToUpdate) {
            this._updateShape(shape);
          }
          this._shapesToUpdate.clear();
        }
      }
      _updateShape(shape) {
        if (shape._world !== this) {
          return;
        }
        let bb = shape._getBoundingBox();
        let minx = Math.floor(bb.left / this._gridCellSize.x);
        let miny = Math.floor(bb.top / this._gridCellSize.y);
        let maxx = Math.ceil(bb.right / this._gridCellSize.x);
        let maxy = Math.ceil(bb.bottom / this._gridCellSize.y);
        if (shape._worldRange) {
          if (shape._worldRange[0] === minx && shape._worldRange[1] === miny && shape._worldRange[2] === maxx && shape._worldRange[3] === maxy) {
            return;
          }
          let ominx = shape._worldRange[0];
          let ominy = shape._worldRange[1];
          let omaxx = shape._worldRange[2];
          let omaxy = shape._worldRange[3];
          for (let i = ominx; i < omaxx; ++i) {
            for (let j = ominy; j < omaxy; ++j) {
              if (i >= minx && i < maxx && j >= miny && j < maxy) {
                continue;
              }
              let key = i + "," + j;
              let currSet = this._grid[key];
              if (currSet) {
                currSet.delete(shape);
                if (currSet.size === 0) {
                  this._cellsToDelete.add(key);
                }
              }
            }
          }
          for (let i = minx; i < maxx; ++i) {
            for (let j = miny; j < maxy; ++j) {
              if (i >= ominx && i < omaxx && j >= ominy && j < omaxy) {
                continue;
              }
              let key = i + "," + j;
              let currSet = this._grid[key];
              if (!currSet) {
                this._grid[key] = currSet = /* @__PURE__ */ new Set();
              }
              currSet.add(shape);
            }
          }
        } else {
          for (let i = minx; i < maxx; ++i) {
            for (let j = miny; j < maxy; ++j) {
              let key = i + "," + j;
              let currSet = this._grid[key];
              if (!currSet) {
                this._grid[key] = currSet = /* @__PURE__ */ new Set();
              }
              currSet.add(shape);
            }
          }
        }
        shape._worldRange = [minx, miny, maxx, maxy];
      }
      _queueUpdate(shape) {
        this._shapesToUpdate.add(shape);
      }
      iterateShapes(callback) {
        for (let key in this._grid) {
          let cell = this._grid[key];
          if (cell) {
            for (let shape of cell) {
              if (callback(shape) === false) {
                return;
              }
            }
          }
        }
      }
      addShape(shape) {
        shape._setParent(this);
        this._updateShape(shape);
        this._performUpdates();
      }
      removeShape(shape) {
        if (shape._world !== this) {
          _logger.warn("Shape to remove is not in this collision world!");
          return;
        }
        if (shape._worldRange) {
          let minx = shape._worldRange[0];
          let miny = shape._worldRange[1];
          let maxx = shape._worldRange[2];
          let maxy = shape._worldRange[3];
          for (let i = minx; i < maxx; ++i) {
            for (let j = miny; j < maxy; ++j) {
              let key = i + "," + j;
              let currSet = this._grid[key];
              if (currSet) {
                currSet.delete(shape);
                if (currSet.size === 0) {
                  this._cellsToDelete.add(key);
                }
              }
            }
          }
        }
        this._shapesToUpdate.delete(shape);
        shape._setParent(null);
        this._performUpdates();
      }
      _iterateBroadPhase(shape, handler, mask, predicate) {
        let bb = shape._getBoundingBox();
        let minx = Math.floor(bb.left / this._gridCellSize.x);
        let miny = Math.floor(bb.top / this._gridCellSize.y);
        let maxx = Math.ceil(bb.right / this._gridCellSize.x);
        let maxy = Math.ceil(bb.bottom / this._gridCellSize.y);
        let checked = /* @__PURE__ */ new Set();
        for (let i = minx; i < maxx; ++i) {
          for (let j = miny; j < maxy; ++j) {
            let key = i + "," + j;
            let currSet = this._grid[key];
            if (currSet) {
              for (let other of currSet) {
                if (mask && (other.collisionFlags & mask) === 0) {
                  continue;
                }
                if (checked.has(other)) {
                  continue;
                }
                checked.add(other);
                if (other === shape) {
                  continue;
                }
                if (predicate && !predicate(other)) {
                  continue;
                }
                let proceedLoop = Boolean(handler(other));
                if (!proceedLoop) {
                  return;
                }
              }
            }
          }
        }
      }
      testCollision(sourceShape, sortByDistance, mask, predicate) {
        this._performUpdates();
        var result2 = null;
        if (sortByDistance) {
          var options = [];
          this._iterateBroadPhase(sourceShape, (other) => {
            options.push(other);
            return true;
          }, mask, predicate);
          sortByDistanceShapes(sourceShape, options);
          var handlers = this.resolver.getHandlers(sourceShape);
          for (let other of options) {
            result2 = this.resolver.testWithHandler(sourceShape, other, handlers[other.shapeId]);
            if (result2) {
              break;
            }
          }
        } else {
          var handlers = this.resolver.getHandlers(sourceShape);
          this._iterateBroadPhase(sourceShape, (other) => {
            result2 = this.resolver.testWithHandler(sourceShape, other, handlers[other.shapeId]);
            return !result2;
          }, mask, predicate);
        }
        return result2;
      }
      testCollisionMany(sourceShape, sortByDistance, mask, predicate, intermediateProcessor) {
        this._performUpdates();
        var ret = [];
        var handlers = this.resolver.getHandlers(sourceShape);
        this._iterateBroadPhase(sourceShape, (other) => {
          let result2 = this.resolver.testWithHandler(sourceShape, other, handlers[other.shapeId]);
          if (result2) {
            ret.push(result2);
            if (intermediateProcessor && intermediateProcessor(result2) === false) {
              return false;
            }
          }
          return true;
        }, mask, predicate);
        if (sortByDistance) {
          sortByDistanceResults(sourceShape, ret);
        }
        return ret;
      }
      pick(position, radius, sortByDistance, mask, predicate) {
        let shape = (radius || 0) <= 1 ? new PointShape(position) : new CircleShape(new Circle2(position, radius));
        let ret = this.testCollisionMany(shape, sortByDistance, mask, predicate);
        return ret.map((x) => x.second);
      }
      debugDraw(gridColor, gridHighlitColor, opacity, camera) {
        this._performUpdates();
        if (!gridColor) {
          gridColor = Color3.black;
          gridColor.a *= 0.75;
        }
        if (!gridHighlitColor) {
          gridHighlitColor = Color3.red;
          gridHighlitColor.a *= 0.75;
        }
        if (opacity === void 0) {
          opacity = 0.5;
        }
        gridColor.a *= opacity;
        gridHighlitColor.a *= opacity;
        let renderedShapes = /* @__PURE__ */ new Set();
        let bb = camera ? camera.getRegion() : gfx.getRenderingRegion(false);
        let minx = Math.floor(bb.left / this._gridCellSize.x);
        let miny = Math.floor(bb.top / this._gridCellSize.y);
        let maxx = minx + Math.ceil(bb.width / this._gridCellSize.x);
        let maxy = miny + Math.ceil(bb.height / this._gridCellSize.y);
        for (let i = minx; i <= maxx; ++i) {
          for (let j = miny; j <= maxy; ++j) {
            let cell = this._grid[i + "," + j];
            let color = cell && cell.size ? gridHighlitColor : gridColor;
            let cellRect = new Rectangle2(i * this._gridCellSize.x, j * this._gridCellSize.y, this._gridCellSize.x - 1, this._gridCellSize.y - 1);
            gfx.outlineRect(cellRect, color, gfx.BlendModes.AlphaBlend, 0);
            if (cell) {
              for (let shape of cell) {
                if (renderedShapes.has(shape)) {
                  continue;
                }
                renderedShapes.add(shape);
                shape.debugDraw(opacity);
              }
            }
          }
        }
      }
    };
    function sortByDistanceShapes(sourceShape, options) {
      let sourceCenter = sourceShape.getCenter();
      options.sort((a, b) => a.getCenter().distanceTo(sourceCenter) - a._getRadius() - (b.getCenter().distanceTo(sourceCenter) - b._getRadius()));
    }
    function sortByDistanceResults(sourceShape, options) {
      let sourceCenter = sourceShape.getCenter();
      options.sort((a, b) => a.second.getCenter().distanceTo(sourceCenter) - a.second._getRadius() - (b.second.getCenter().distanceTo(sourceCenter) - b.second._getRadius()));
    }
    module.exports = CollisionWorld;
  }
});

// ../Shaku/lib/collision/shapes/rectangle.js
var require_rectangle2 = __commonJS({
  "../Shaku/lib/collision/shapes/rectangle.js"(exports, module) {
    "use strict";
    var Rectangle2 = require_rectangle();
    var CollisionShape = require_shape();
    var gfx = require_gfx2();
    var RectangleShape = class extends CollisionShape {
      constructor(rectangle) {
        super();
        this.setShape(rectangle);
      }
      get shapeId() {
        return "rect";
      }
      setShape(rectangle) {
        this._rect = rectangle;
        this._center = rectangle.getCenter();
        this._radius = this._rect.getBoundingCircle().radius;
        this._shapeChanged();
      }
      _getRadius() {
        return this._radius;
      }
      _getBoundingBox() {
        return this._rect;
      }
      getCenter() {
        return this._center.clone();
      }
      debugDraw(opacity) {
        if (opacity === void 0)
          opacity = 1;
        let color = this._getDebugColor();
        color.a *= opacity;
        gfx.outlineRect(this._rect, color, gfx.BlendModes.AlphaBlend);
        color.a *= 0.25;
        gfx.fillRect(this._rect, color, gfx.BlendModes.AlphaBlend);
      }
    };
    module.exports = RectangleShape;
  }
});

// ../Shaku/lib/collision/resolvers_imp.js
var require_resolvers_imp = __commonJS({
  "../Shaku/lib/collision/resolvers_imp.js"(exports, module) {
    "use strict";
    var CollisionsImp = {
      pointPoint: function(v1, v2) {
        return v1._position.approximate(v2._position) ? v1._position : false;
      },
      pointCircle: function(v1, c1) {
        return v1._position.distanceTo(c1._circle.center) <= c1._circle.radius ? v1._position : false;
      },
      pointRectangle: function(v1, r1) {
        return r1._rect.containsVector(v1._position) ? v1._position : false;
      },
      pointLine: function(v1, l1) {
        for (let i = 0; i < l1._lines.length; ++i) {
          if (l1._lines[i].containsVector(v1._position)) {
            return v1._position;
          }
        }
        return false;
      },
      pointTilemap: function(v1, tm) {
        if (tm._intBoundingRect.containsVector(v1._position)) {
          let tile = tm.getTileAt(v1._position);
          return tile ? CollisionsImp.pointRectangle(v1, tile) : false;
        }
        if (tm._borderThickness && tm._boundingRect.containsVector(v1._position)) {
          return v1._position;
        }
        return false;
      },
      circleCircle: function(c1, c2) {
        return c1._circle.center.distanceTo(c2._circle.center) <= c1._circle.radius + c2._circle.radius;
      },
      circleRectangle: function(c1, r1) {
        return r1._rect.collideCircle(c1._circle);
      },
      circleLine: function(c1, l1) {
        for (let i = 0; i < l1._lines.length; ++i) {
          if (l1._lines[i].distanceToVector(c1._circle.center) <= c1._circle.radius) {
            return true;
          }
        }
        return false;
      },
      circleTilemap: function(c1, tm) {
        let collide = false;
        tm.iterateTilesAtRegion(c1._getBoundingBox(), (tile) => {
          if (CollisionsImp.circleRectangle(c1, tile)) {
            collide = true;
            return false;
          }
        });
        return collide;
      },
      rectangleRectangle: function(r1, r2) {
        return r1._rect.collideRect(r2._rect);
      },
      rectangleLine: function(r1, l1) {
        for (let i = 0; i < l1._lines.length; ++i) {
          if (r1._rect.collideLine(l1._lines[i])) {
            return true;
          }
        }
        return false;
      },
      rectangleTilemap: function(r1, tm) {
        let collide = false;
        tm.iterateTilesAtRegion(r1._getBoundingBox(), (tile) => {
          collide = true;
          return false;
        });
        return collide;
      },
      lineLine: function(l1, l2) {
        for (let i = 0; i < l1._lines.length; ++i) {
          for (let j = 0; j < l2._lines.length; ++j) {
            if (l1._lines[i].collideLine(l2._lines[j])) {
              return true;
            }
          }
        }
        return false;
      },
      lineTilemap: function(l1, tm) {
        let collide = false;
        tm.iterateTilesAtRegion(l1._getBoundingBox(), (tile) => {
          if (CollisionsImp.rectangleLine(tile, l1)) {
            collide = true;
            return false;
          }
        });
        return collide;
      }
    };
    module.exports = CollisionsImp;
  }
});

// ../Shaku/lib/collision/shapes/lines.js
var require_lines = __commonJS({
  "../Shaku/lib/collision/shapes/lines.js"(exports, module) {
    "use strict";
    var CollisionShape = require_shape();
    var gfx = require_gfx2();
    var Line2 = require_line();
    var Rectangle2 = require_rectangle();
    var Circle2 = require_circle();
    var LinesShape = class extends CollisionShape {
      constructor(lines) {
        super();
        this._lines = [];
        this.addLines(lines);
      }
      get shapeId() {
        return "lines";
      }
      addLines(lines) {
        if (!Array.isArray(lines)) {
          lines = [lines];
        }
        for (let i = 0; i < lines.length; ++i) {
          this._lines.push(lines[i]);
        }
        let points = [];
        for (let i = 0; i < this._lines.length; ++i) {
          points.push(this._lines[i].from);
          points.push(this._lines[i].to);
        }
        this._boundingBox = Rectangle2.fromPoints(points);
        this._circle = new Circle2(this._boundingBox.getCenter(), Math.max(this._boundingBox.width, this._boundingBox.height));
        this._shapeChanged();
      }
      setLines(lines) {
        this._lines = [];
        this.addLines(lines);
      }
      _getRadius() {
        return this._circle.radius;
      }
      getCenter() {
        return this._circle.center.clone();
      }
      _getBoundingBox() {
        return this._boundingBox;
      }
      debugDraw(opacity) {
        if (opacity === void 0)
          opacity = 1;
        let color = this._getDebugColor();
        color.a *= opacity;
        for (let i = 0; i < this._lines.length; ++i) {
          gfx.drawLine(this._lines[i].from, this._lines[i].to, color, gfx.BlendModes.AlphaBlend);
        }
      }
    };
    module.exports = LinesShape;
  }
});

// ../Shaku/lib/collision/shapes/tilemap.js
var require_tilemap = __commonJS({
  "../Shaku/lib/collision/shapes/tilemap.js"(exports, module) {
    "use strict";
    var CollisionShape = require_shape();
    var Rectangle2 = require_rectangle();
    var Vector22 = require_vector2();
    var gfx = require_gfx2();
    var RectangleShape = require_rectangle2();
    var TilemapShape = class extends CollisionShape {
      constructor(offset, gridSize, tileSize, borderThickness) {
        super();
        borderThickness = borderThickness || 0;
        this._offset = offset.clone();
        this._intBoundingRect = new Rectangle2(offset.x, offset.y, gridSize.x * tileSize.x, gridSize.y * tileSize.y);
        this._boundingRect = this._intBoundingRect.resize(borderThickness * 2);
        this._center = this._boundingRect.getCenter();
        this._radius = this._boundingRect.getBoundingCircle().radius;
        this._borderThickness = borderThickness;
        this._gridSize = gridSize.clone();
        this._tileSize = tileSize.clone();
        this._tiles = {};
      }
      get shapeId() {
        return "tilemap";
      }
      _indexToKey(index) {
        if (index.x < 0 || index.y < 0 || index.x >= this._gridSize.x || index.y >= this._gridSize.y) {
          throw new Error(`Collision tile with index ${index.x},${index.y} is out of bounds!`);
        }
        return index.x + "," + index.y;
      }
      setTile(index, haveCollision, collisionFlags) {
        let key = this._indexToKey(index);
        if (haveCollision) {
          let rect = this._tiles[key] || new RectangleShape(
            new Rectangle2(
              this._offset.x + index.x * this._tileSize.x,
              this._offset.y + index.y * this._tileSize.y,
              this._tileSize.x,
              this._tileSize.y
            )
          );
          if (collisionFlags !== void 0) {
            rect.collisionFlags = collisionFlags;
          }
          this._tiles[key] = rect;
        } else {
          delete this._tiles[key];
        }
      }
      getTileAt(position) {
        let index = new Vector22(Math.floor(position.x / this._tileSize.x), Math.floor(position.y / this._tileSize.y));
        let key = index.x + "," + index.y;
        return this._tiles[key] || null;
      }
      iterateTilesAtRegion(region, callback) {
        let topLeft = region.getTopLeft();
        let bottomRight = region.getBottomRight();
        let startIndex = new Vector22(Math.floor(topLeft.x / this._tileSize.x), Math.floor(topLeft.y / this._tileSize.y));
        let endIndex = new Vector22(Math.floor(bottomRight.x / this._tileSize.x), Math.floor(bottomRight.y / this._tileSize.y));
        for (let i = startIndex.x; i <= endIndex.x; ++i) {
          for (let j = startIndex.y; j <= endIndex.y; ++j) {
            let key = i + "," + j;
            let tile = this._tiles[key];
            if (tile && callback(tile) === false) {
              return;
            }
          }
        }
      }
      getTilesAtRegion(region) {
        let ret = [];
        this.iterateTilesAtRegion(region, (tile) => {
          ret.push(tile);
        });
        return ret;
      }
      _getRadius() {
        return this._radius;
      }
      _getBoundingBox() {
        return this._boundingRect;
      }
      getCenter() {
        return this._center.clone();
      }
      debugDraw(opacity) {
        if (opacity === void 0)
          opacity = 1;
        let color = this._getDebugColor();
        color.a *= opacity;
        if (this._haveBorders) {
          gfx.outlineRect(this._intBoundingRect, color, gfx.BlendModes.AlphaBlend);
          gfx.outlineRect(this._boundingRect, color, gfx.BlendModes.AlphaBlend);
        }
        for (let key in this._tiles) {
          let tile = this._tiles[key];
          tile.setDebugColor(this._forceDebugColor);
          tile.debugDraw(opacity);
        }
      }
    };
    module.exports = TilemapShape;
  }
});

// ../Shaku/lib/collision/collision.js
var require_collision = __commonJS({
  "../Shaku/lib/collision/collision.js"(exports, module) {
    "use strict";
    var IManager = require_manager();
    var Vector22 = require_vector2();
    var CollisionWorld = require_collision_world();
    var CollisionResolver = require_resolver();
    var CircleShape = require_circle2();
    var PointShape = require_point();
    var RectangleShape = require_rectangle2();
    var ResolverImp = require_resolvers_imp();
    var LinesShape = require_lines();
    var TilemapShape = require_tilemap();
    var _logger = require_logger().getLogger("collision");
    var Collision = class extends IManager {
      constructor() {
        super();
        this.resolver = new CollisionResolver();
      }
      setup() {
        return new Promise((resolve, reject2) => {
          _logger.info("Setup collision manager..");
          this.resolver._init();
          this.resolver.setHandler("point", "point", ResolverImp.pointPoint);
          this.resolver.setHandler("point", "circle", ResolverImp.pointCircle);
          this.resolver.setHandler("point", "rect", ResolverImp.pointRectangle);
          this.resolver.setHandler("point", "lines", ResolverImp.pointLine);
          this.resolver.setHandler("point", "tilemap", ResolverImp.pointTilemap);
          this.resolver.setHandler("circle", "circle", ResolverImp.circleCircle);
          this.resolver.setHandler("circle", "rect", ResolverImp.circleRectangle);
          this.resolver.setHandler("circle", "lines", ResolverImp.circleLine);
          this.resolver.setHandler("circle", "tilemap", ResolverImp.circleTilemap);
          this.resolver.setHandler("rect", "rect", ResolverImp.rectangleRectangle);
          this.resolver.setHandler("rect", "lines", ResolverImp.rectangleLine);
          this.resolver.setHandler("rect", "tilemap", ResolverImp.rectangleTilemap);
          this.resolver.setHandler("lines", "lines", ResolverImp.lineLine);
          this.resolver.setHandler("lines", "tilemap", ResolverImp.lineTilemap);
          resolve();
        });
      }
      createWorld(gridCellSize) {
        return new CollisionWorld(this.resolver, gridCellSize);
      }
      get RectangleShape() {
        return RectangleShape;
      }
      get PointShape() {
        return PointShape;
      }
      get CircleShape() {
        return CircleShape;
      }
      get LinesShape() {
        return LinesShape;
      }
      get TilemapShape() {
        return TilemapShape;
      }
      startFrame() {
      }
      endFrame() {
      }
      destroy() {
      }
    };
    module.exports = new Collision();
  }
});

// ../Shaku/lib/collision/index.js
var require_collision2 = __commonJS({
  "../Shaku/lib/collision/index.js"(exports, module) {
    "use strict";
    module.exports = require_collision();
  }
});

// ../Shaku/lib/shaku.js
var require_shaku = __commonJS({
  "../Shaku/lib/shaku.js"(exports, module) {
    "use strict";
    var isBrowser = typeof window !== "undefined";
    var IManager = require_manager();
    var logger = require_logger();
    var sfx = isBrowser ? require_sfx2() : null;
    var gfx = isBrowser ? require_gfx2() : null;
    var input = isBrowser ? require_input2() : null;
    var assets = require_assets2();
    var collision = require_collision2();
    var utils = require_utils();
    var GameTime = require_game_time();
    var _logger = logger.getLogger("shaku");
    var _usedManagers = null;
    var _prevUpdateTime = null;
    var _currFpsCounter = 0;
    var _countSecond = 0;
    var _currFps = 0;
    var _startFrameTime = 0;
    var _frameTimeMeasuresCount = 0;
    var _totalFrameTimes = 0;
    var version = "1.6.1";
    var Shaku2 = class {
      constructor() {
        this.utils = utils;
        this.sfx = sfx;
        this.gfx = gfx;
        this.input = input;
        this.assets = assets;
        this.collision = collision;
        this.pauseWhenNotFocused = false;
        this.paused = false;
        this.pauseTime = false;
        this._managersStarted = false;
        this._wasPaused = false;
      }
      async init(managers) {
        return new Promise(async (resolve, reject2) => {
          if (_usedManagers) {
            throw new Error("Already initialized!");
          }
          _logger.info(`Initialize Shaku v${version}.`);
          GameTime.reset();
          _usedManagers = managers || (isBrowser ? [assets, sfx, gfx, input, collision] : [assets, collision]);
          for (let i = 0; i < _usedManagers.length; ++i) {
            await _usedManagers[i].setup();
          }
          _prevUpdateTime = new GameTime();
          resolve();
        });
      }
      destroy() {
        if (!_usedManagers) {
          throw new Error("Not initialized!");
        }
        for (let i = 0; i < _usedManagers.length; ++i) {
          _usedManagers[i].destroy();
        }
      }
      get isPaused() {
        return this.paused || this.pauseWhenNotFocused && !document.hasFocus();
      }
      startFrame() {
        if (this.isPaused) {
          this._wasPaused = true;
          return;
        }
        if (this._wasPaused) {
          this._wasPaused = false;
          GameTime.resetDelta();
        }
        if (this.pauseTime) {
          GameTime.resetDelta();
        } else {
          GameTime.update();
        }
        _startFrameTime = GameTime.rawTimestamp();
        this._gameTime = new GameTime();
        utils.Animator.updateAutos(this._gameTime.delta);
        for (let i = 0; i < _usedManagers.length; ++i) {
          _usedManagers[i].startFrame();
        }
        this._managersStarted = true;
      }
      endFrame() {
        if (this._managersStarted) {
          for (let i = 0; i < _usedManagers.length; ++i) {
            _usedManagers[i].endFrame();
          }
          this._managersStarted = false;
        }
        if (this.isPaused) {
          return;
        }
        _prevUpdateTime = this._gameTime;
        if (this._gameTime) {
          this._updateFpsAndTimeStats();
        }
      }
      _updateFpsAndTimeStats() {
        _currFpsCounter++;
        _countSecond += this._gameTime.delta;
        if (_countSecond >= 1) {
          _countSecond = 0;
          _currFps = _currFpsCounter;
          _currFpsCounter = 0;
          _totalFrameTimes = this.getAverageFrameTime();
          _frameTimeMeasuresCount = 1;
        }
        let _endFrameTime = GameTime.rawTimestamp();
        _frameTimeMeasuresCount++;
        _totalFrameTimes += _endFrameTime - _startFrameTime;
      }
      silent() {
        logger.silent();
      }
      throwErrorOnWarnings(enable) {
        if (enable === void 0) {
          throw Error("Must provide a value!");
        }
        logger.throwErrorOnWarnings(enable);
      }
      get gameTime() {
        return this._gameTime;
      }
      get version() {
        return version;
      }
      getFpsCount() {
        return _currFps;
      }
      getAverageFrameTime() {
        if (_frameTimeMeasuresCount === 0) {
          return 0;
        }
        return _totalFrameTimes / _frameTimeMeasuresCount;
      }
      requestAnimationFrame(callback) {
        if (window.requestAnimationFrame)
          return window.requestAnimationFrame(callback);
        else if (window.mozRequestAnimationFrame)
          return window.mozRequestAnimationFrame(callback);
        else if (window.webkitRequestAnimationFrame)
          return window.webkitRequestAnimationFrame(callback);
        else if (window.msRequestAnimationFrame)
          return window.msRequestAnimationFrame(callback);
        else
          return setTimeout(callback, 1e3 / 60);
      }
      cancelAnimationFrame(id) {
        if (window.cancelAnimationFrame)
          return window.cancelAnimationFrame(id);
        else if (window.mozCancelAnimationFrame)
          return window.mozCancelAnimationFrame(id);
        else
          clearTimeout(id);
      }
      setLogger(loggerHandler) {
        logger.setDrivers(loggerHandler);
      }
      getLogger(name) {
        return logger.getLogger(name);
      }
    };
    module.exports = new Shaku2();
  }
});

// node_modules/double-ended-queue/js/deque.js
var require_deque = __commonJS({
  "node_modules/double-ended-queue/js/deque.js"(exports, module) {
    "use strict";
    function Deque2(capacity) {
      this._capacity = getCapacity(capacity);
      this._length = 0;
      this._front = 0;
      if (isArray(capacity)) {
        var len = capacity.length;
        for (var i = 0; i < len; ++i) {
          this[i] = capacity[i];
        }
        this._length = len;
      }
    }
    Deque2.prototype.toArray = function Deque$toArray() {
      var len = this._length;
      var ret = new Array(len);
      var front = this._front;
      var capacity = this._capacity;
      for (var j = 0; j < len; ++j) {
        ret[j] = this[front + j & capacity - 1];
      }
      return ret;
    };
    Deque2.prototype.push = function Deque$push(item) {
      var argsLength = arguments.length;
      var length = this._length;
      if (argsLength > 1) {
        var capacity = this._capacity;
        if (length + argsLength > capacity) {
          for (var i = 0; i < argsLength; ++i) {
            this._checkCapacity(length + 1);
            var j = this._front + length & this._capacity - 1;
            this[j] = arguments[i];
            length++;
            this._length = length;
          }
          return length;
        } else {
          var j = this._front;
          for (var i = 0; i < argsLength; ++i) {
            this[j + length & capacity - 1] = arguments[i];
            j++;
          }
          this._length = length + argsLength;
          return length + argsLength;
        }
      }
      if (argsLength === 0)
        return length;
      this._checkCapacity(length + 1);
      var i = this._front + length & this._capacity - 1;
      this[i] = item;
      this._length = length + 1;
      return length + 1;
    };
    Deque2.prototype.pop = function Deque$pop() {
      var length = this._length;
      if (length === 0) {
        return void 0;
      }
      var i = this._front + length - 1 & this._capacity - 1;
      var ret = this[i];
      this[i] = void 0;
      this._length = length - 1;
      return ret;
    };
    Deque2.prototype.shift = function Deque$shift() {
      var length = this._length;
      if (length === 0) {
        return void 0;
      }
      var front = this._front;
      var ret = this[front];
      this[front] = void 0;
      this._front = front + 1 & this._capacity - 1;
      this._length = length - 1;
      return ret;
    };
    Deque2.prototype.unshift = function Deque$unshift(item) {
      var length = this._length;
      var argsLength = arguments.length;
      if (argsLength > 1) {
        var capacity = this._capacity;
        if (length + argsLength > capacity) {
          for (var i = argsLength - 1; i >= 0; i--) {
            this._checkCapacity(length + 1);
            var capacity = this._capacity;
            var j = (this._front - 1 & capacity - 1 ^ capacity) - capacity;
            this[j] = arguments[i];
            length++;
            this._length = length;
            this._front = j;
          }
          return length;
        } else {
          var front = this._front;
          for (var i = argsLength - 1; i >= 0; i--) {
            var j = (front - 1 & capacity - 1 ^ capacity) - capacity;
            this[j] = arguments[i];
            front = j;
          }
          this._front = front;
          this._length = length + argsLength;
          return length + argsLength;
        }
      }
      if (argsLength === 0)
        return length;
      this._checkCapacity(length + 1);
      var capacity = this._capacity;
      var i = (this._front - 1 & capacity - 1 ^ capacity) - capacity;
      this[i] = item;
      this._length = length + 1;
      this._front = i;
      return length + 1;
    };
    Deque2.prototype.peekBack = function Deque$peekBack() {
      var length = this._length;
      if (length === 0) {
        return void 0;
      }
      var index = this._front + length - 1 & this._capacity - 1;
      return this[index];
    };
    Deque2.prototype.peekFront = function Deque$peekFront() {
      if (this._length === 0) {
        return void 0;
      }
      return this[this._front];
    };
    Deque2.prototype.get = function Deque$get(index) {
      var i = index;
      if (i !== (i | 0)) {
        return void 0;
      }
      var len = this._length;
      if (i < 0) {
        i = i + len;
      }
      if (i < 0 || i >= len) {
        return void 0;
      }
      return this[this._front + i & this._capacity - 1];
    };
    Deque2.prototype.isEmpty = function Deque$isEmpty() {
      return this._length === 0;
    };
    Deque2.prototype.clear = function Deque$clear() {
      var len = this._length;
      var front = this._front;
      var capacity = this._capacity;
      for (var j = 0; j < len; ++j) {
        this[front + j & capacity - 1] = void 0;
      }
      this._length = 0;
      this._front = 0;
    };
    Deque2.prototype.toString = function Deque$toString() {
      return this.toArray().toString();
    };
    Deque2.prototype.valueOf = Deque2.prototype.toString;
    Deque2.prototype.removeFront = Deque2.prototype.shift;
    Deque2.prototype.removeBack = Deque2.prototype.pop;
    Deque2.prototype.insertFront = Deque2.prototype.unshift;
    Deque2.prototype.insertBack = Deque2.prototype.push;
    Deque2.prototype.enqueue = Deque2.prototype.push;
    Deque2.prototype.dequeue = Deque2.prototype.shift;
    Deque2.prototype.toJSON = Deque2.prototype.toArray;
    Object.defineProperty(Deque2.prototype, "length", {
      get: function() {
        return this._length;
      },
      set: function() {
        throw new RangeError("");
      }
    });
    Deque2.prototype._checkCapacity = function Deque$_checkCapacity(size) {
      if (this._capacity < size) {
        this._resizeTo(getCapacity(this._capacity * 1.5 + 16));
      }
    };
    Deque2.prototype._resizeTo = function Deque$_resizeTo(capacity) {
      var oldCapacity = this._capacity;
      this._capacity = capacity;
      var front = this._front;
      var length = this._length;
      if (front + length > oldCapacity) {
        var moveItemsCount = front + length & oldCapacity - 1;
        arrayMove(this, 0, this, oldCapacity, moveItemsCount);
      }
    };
    var isArray = Array.isArray;
    function arrayMove(src, srcIndex, dst, dstIndex, len) {
      for (var j = 0; j < len; ++j) {
        dst[j + dstIndex] = src[j + srcIndex];
        src[j + srcIndex] = void 0;
      }
    }
    function pow2AtLeast(n) {
      n = n >>> 0;
      n = n - 1;
      n = n | n >> 1;
      n = n | n >> 2;
      n = n | n >> 4;
      n = n | n >> 8;
      n = n | n >> 16;
      return n + 1;
    }
    function getCapacity(capacity) {
      if (typeof capacity !== "number") {
        if (isArray(capacity)) {
          capacity = capacity.length;
        } else {
          return 16;
        }
      }
      return pow2AtLeast(
        Math.min(
          Math.max(16, capacity),
          1073741824
        )
      );
    }
    module.exports = Deque2;
  }
});

// src/main.ts
var import_gfx = __toESM(require_gfx2());
var import_shaku = __toESM(require_shaku());

// node_modules/dat.gui/build/dat.gui.module.js
function ___$insertStyle(css2) {
  if (!css2) {
    return;
  }
  if (typeof window === "undefined") {
    return;
  }
  var style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.innerHTML = css2;
  document.head.appendChild(style);
  return css2;
}
function colorToString(color, forceCSSHex) {
  var colorFormat = color.__state.conversionName.toString();
  var r = Math.round(color.r);
  var g = Math.round(color.g);
  var b = Math.round(color.b);
  var a = color.a;
  var h = Math.round(color.h);
  var s = color.s.toFixed(1);
  var v = color.v.toFixed(1);
  if (forceCSSHex || colorFormat === "THREE_CHAR_HEX" || colorFormat === "SIX_CHAR_HEX") {
    var str = color.hex.toString(16);
    while (str.length < 6) {
      str = "0" + str;
    }
    return "#" + str;
  } else if (colorFormat === "CSS_RGB") {
    return "rgb(" + r + "," + g + "," + b + ")";
  } else if (colorFormat === "CSS_RGBA") {
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  } else if (colorFormat === "HEX") {
    return "0x" + color.hex.toString(16);
  } else if (colorFormat === "RGB_ARRAY") {
    return "[" + r + "," + g + "," + b + "]";
  } else if (colorFormat === "RGBA_ARRAY") {
    return "[" + r + "," + g + "," + b + "," + a + "]";
  } else if (colorFormat === "RGB_OBJ") {
    return "{r:" + r + ",g:" + g + ",b:" + b + "}";
  } else if (colorFormat === "RGBA_OBJ") {
    return "{r:" + r + ",g:" + g + ",b:" + b + ",a:" + a + "}";
  } else if (colorFormat === "HSV_OBJ") {
    return "{h:" + h + ",s:" + s + ",v:" + v + "}";
  } else if (colorFormat === "HSVA_OBJ") {
    return "{h:" + h + ",s:" + s + ",v:" + v + ",a:" + a + "}";
  }
  return "unknown format";
}
var ARR_EACH = Array.prototype.forEach;
var ARR_SLICE = Array.prototype.slice;
var Common = {
  BREAK: {},
  extend: function extend(target) {
    this.each(ARR_SLICE.call(arguments, 1), function(obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function(key) {
        if (!this.isUndefined(obj[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  defaults: function defaults(target) {
    this.each(ARR_SLICE.call(arguments, 1), function(obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function(key) {
        if (this.isUndefined(target[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  compose: function compose() {
    var toCall = ARR_SLICE.call(arguments);
    return function() {
      var args = ARR_SLICE.call(arguments);
      for (var i = toCall.length - 1; i >= 0; i--) {
        args = [toCall[i].apply(this, args)];
      }
      return args[0];
    };
  },
  each: function each(obj, itr, scope) {
    if (!obj) {
      return;
    }
    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
      obj.forEach(itr, scope);
    } else if (obj.length === obj.length + 0) {
      var key = void 0;
      var l = void 0;
      for (key = 0, l = obj.length; key < l; key++) {
        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
          return;
        }
      }
    } else {
      for (var _key in obj) {
        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
          return;
        }
      }
    }
  },
  defer: function defer(fnc) {
    setTimeout(fnc, 0);
  },
  debounce: function debounce(func, threshold, callImmediately) {
    var timeout = void 0;
    return function() {
      var obj = this;
      var args = arguments;
      function delayed() {
        timeout = null;
        if (!callImmediately)
          func.apply(obj, args);
      }
      var callNow = callImmediately || !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(delayed, threshold);
      if (callNow) {
        func.apply(obj, args);
      }
    };
  },
  toArray: function toArray(obj) {
    if (obj.toArray)
      return obj.toArray();
    return ARR_SLICE.call(obj);
  },
  isUndefined: function isUndefined(obj) {
    return obj === void 0;
  },
  isNull: function isNull(obj) {
    return obj === null;
  },
  isNaN: function(_isNaN) {
    function isNaN2(_x) {
      return _isNaN.apply(this, arguments);
    }
    isNaN2.toString = function() {
      return _isNaN.toString();
    };
    return isNaN2;
  }(function(obj) {
    return isNaN(obj);
  }),
  isArray: Array.isArray || function(obj) {
    return obj.constructor === Array;
  },
  isObject: function isObject(obj) {
    return obj === Object(obj);
  },
  isNumber: function isNumber(obj) {
    return obj === obj + 0;
  },
  isString: function isString(obj) {
    return obj === obj + "";
  },
  isBoolean: function isBoolean(obj) {
    return obj === false || obj === true;
  },
  isFunction: function isFunction(obj) {
    return obj instanceof Function;
  }
};
var INTERPRETATIONS = [
  {
    litmus: Common.isString,
    conversions: {
      THREE_CHAR_HEX: {
        read: function read(original) {
          var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
          if (test === null) {
            return false;
          }
          return {
            space: "HEX",
            hex: parseInt("0x" + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
          };
        },
        write: colorToString
      },
      SIX_CHAR_HEX: {
        read: function read2(original) {
          var test = original.match(/^#([A-F0-9]{6})$/i);
          if (test === null) {
            return false;
          }
          return {
            space: "HEX",
            hex: parseInt("0x" + test[1].toString(), 0)
          };
        },
        write: colorToString
      },
      CSS_RGB: {
        read: function read3(original) {
          var test = original.match(/^rgb\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);
          if (test === null) {
            return false;
          }
          return {
            space: "RGB",
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3])
          };
        },
        write: colorToString
      },
      CSS_RGBA: {
        read: function read4(original) {
          var test = original.match(/^rgba\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);
          if (test === null) {
            return false;
          }
          return {
            space: "RGB",
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3]),
            a: parseFloat(test[4])
          };
        },
        write: colorToString
      }
    }
  },
  {
    litmus: Common.isNumber,
    conversions: {
      HEX: {
        read: function read5(original) {
          return {
            space: "HEX",
            hex: original,
            conversionName: "HEX"
          };
        },
        write: function write(color) {
          return color.hex;
        }
      }
    }
  },
  {
    litmus: Common.isArray,
    conversions: {
      RGB_ARRAY: {
        read: function read6(original) {
          if (original.length !== 3) {
            return false;
          }
          return {
            space: "RGB",
            r: original[0],
            g: original[1],
            b: original[2]
          };
        },
        write: function write2(color) {
          return [color.r, color.g, color.b];
        }
      },
      RGBA_ARRAY: {
        read: function read7(original) {
          if (original.length !== 4)
            return false;
          return {
            space: "RGB",
            r: original[0],
            g: original[1],
            b: original[2],
            a: original[3]
          };
        },
        write: function write3(color) {
          return [color.r, color.g, color.b, color.a];
        }
      }
    }
  },
  {
    litmus: Common.isObject,
    conversions: {
      RGBA_OBJ: {
        read: function read8(original) {
          if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
            return {
              space: "RGB",
              r: original.r,
              g: original.g,
              b: original.b,
              a: original.a
            };
          }
          return false;
        },
        write: function write4(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b,
            a: color.a
          };
        }
      },
      RGB_OBJ: {
        read: function read9(original) {
          if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
            return {
              space: "RGB",
              r: original.r,
              g: original.g,
              b: original.b
            };
          }
          return false;
        },
        write: function write5(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b
          };
        }
      },
      HSVA_OBJ: {
        read: function read10(original) {
          if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
            return {
              space: "HSV",
              h: original.h,
              s: original.s,
              v: original.v,
              a: original.a
            };
          }
          return false;
        },
        write: function write6(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v,
            a: color.a
          };
        }
      },
      HSV_OBJ: {
        read: function read11(original) {
          if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
            return {
              space: "HSV",
              h: original.h,
              s: original.s,
              v: original.v
            };
          }
          return false;
        },
        write: function write7(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v
          };
        }
      }
    }
  }
];
var result = void 0;
var toReturn = void 0;
var interpret = function interpret2() {
  toReturn = false;
  var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
  Common.each(INTERPRETATIONS, function(family) {
    if (family.litmus(original)) {
      Common.each(family.conversions, function(conversion, conversionName) {
        result = conversion.read(original);
        if (toReturn === false && result !== false) {
          toReturn = result;
          result.conversionName = conversionName;
          result.conversion = conversion;
          return Common.BREAK;
        }
      });
      return Common.BREAK;
    }
  });
  return toReturn;
};
var tmpComponent = void 0;
var ColorMath = {
  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
    var hi = Math.floor(h / 60) % 6;
    var f = h / 60 - Math.floor(h / 60);
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
    return {
      r: c[0] * 255,
      g: c[1] * 255,
      b: c[2] * 255
    };
  },
  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h = void 0;
    var s = void 0;
    if (max !== 0) {
      s = delta / max;
    } else {
      return {
        h: NaN,
        s: 0,
        v: 0
      };
    }
    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }
    h /= 6;
    if (h < 0) {
      h += 1;
    }
    return {
      h: h * 360,
      s,
      v: max / 255
    };
  },
  rgb_to_hex: function rgb_to_hex(r, g, b) {
    var hex = this.hex_with_component(0, 2, r);
    hex = this.hex_with_component(hex, 1, g);
    hex = this.hex_with_component(hex, 0, b);
    return hex;
  },
  component_from_hex: function component_from_hex(hex, componentIndex) {
    return hex >> componentIndex * 8 & 255;
  },
  hex_with_component: function hex_with_component(hex, componentIndex, value) {
    return value << (tmpComponent = componentIndex * 8) | hex & ~(255 << tmpComponent);
  }
};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
  return typeof obj;
} : function(obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};
var classCallCheck = function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
var createClass = function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps)
      defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var get = function get2(object, property, receiver) {
  if (object === null)
    object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);
  if (desc === void 0) {
    var parent = Object.getPrototypeOf(object);
    if (parent === null) {
      return void 0;
    } else {
      return get2(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === void 0) {
      return void 0;
    }
    return getter.call(receiver);
  }
};
var inherits = function(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};
var possibleConstructorReturn = function(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};
var Color = function() {
  function Color3() {
    classCallCheck(this, Color3);
    this.__state = interpret.apply(this, arguments);
    if (this.__state === false) {
      throw new Error("Failed to interpret color arguments");
    }
    this.__state.a = this.__state.a || 1;
  }
  createClass(Color3, [{
    key: "toString",
    value: function toString() {
      return colorToString(this);
    }
  }, {
    key: "toHexString",
    value: function toHexString() {
      return colorToString(this, true);
    }
  }, {
    key: "toOriginal",
    value: function toOriginal() {
      return this.__state.conversion.write(this);
    }
  }]);
  return Color3;
}();
function defineRGBComponent(target, component, componentHexIndex) {
  Object.defineProperty(target, component, {
    get: function get$$13() {
      if (this.__state.space === "RGB") {
        return this.__state[component];
      }
      Color.recalculateRGB(this, component, componentHexIndex);
      return this.__state[component];
    },
    set: function set$$13(v) {
      if (this.__state.space !== "RGB") {
        Color.recalculateRGB(this, component, componentHexIndex);
        this.__state.space = "RGB";
      }
      this.__state[component] = v;
    }
  });
}
function defineHSVComponent(target, component) {
  Object.defineProperty(target, component, {
    get: function get$$13() {
      if (this.__state.space === "HSV") {
        return this.__state[component];
      }
      Color.recalculateHSV(this);
      return this.__state[component];
    },
    set: function set$$13(v) {
      if (this.__state.space !== "HSV") {
        Color.recalculateHSV(this);
        this.__state.space = "HSV";
      }
      this.__state[component] = v;
    }
  });
}
Color.recalculateRGB = function(color, component, componentHexIndex) {
  if (color.__state.space === "HEX") {
    color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
  } else if (color.__state.space === "HSV") {
    Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
  } else {
    throw new Error("Corrupted color state");
  }
};
Color.recalculateHSV = function(color) {
  var result2 = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
  Common.extend(color.__state, {
    s: result2.s,
    v: result2.v
  });
  if (!Common.isNaN(result2.h)) {
    color.__state.h = result2.h;
  } else if (Common.isUndefined(color.__state.h)) {
    color.__state.h = 0;
  }
};
Color.COMPONENTS = ["r", "g", "b", "h", "s", "v", "hex", "a"];
defineRGBComponent(Color.prototype, "r", 2);
defineRGBComponent(Color.prototype, "g", 1);
defineRGBComponent(Color.prototype, "b", 0);
defineHSVComponent(Color.prototype, "h");
defineHSVComponent(Color.prototype, "s");
defineHSVComponent(Color.prototype, "v");
Object.defineProperty(Color.prototype, "a", {
  get: function get$$1() {
    return this.__state.a;
  },
  set: function set$$1(v) {
    this.__state.a = v;
  }
});
Object.defineProperty(Color.prototype, "hex", {
  get: function get$$12() {
    if (this.__state.space !== "HEX") {
      this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
      this.__state.space = "HEX";
    }
    return this.__state.hex;
  },
  set: function set$$12(v) {
    this.__state.space = "HEX";
    this.__state.hex = v;
  }
});
var Controller = function() {
  function Controller2(object, property) {
    classCallCheck(this, Controller2);
    this.initialValue = object[property];
    this.domElement = document.createElement("div");
    this.object = object;
    this.property = property;
    this.__onChange = void 0;
    this.__onFinishChange = void 0;
  }
  createClass(Controller2, [{
    key: "onChange",
    value: function onChange(fnc) {
      this.__onChange = fnc;
      return this;
    }
  }, {
    key: "onFinishChange",
    value: function onFinishChange(fnc) {
      this.__onFinishChange = fnc;
      return this;
    }
  }, {
    key: "setValue",
    value: function setValue(newValue) {
      this.object[this.property] = newValue;
      if (this.__onChange) {
        this.__onChange.call(this, newValue);
      }
      this.updateDisplay();
      return this;
    }
  }, {
    key: "getValue",
    value: function getValue() {
      return this.object[this.property];
    }
  }, {
    key: "updateDisplay",
    value: function updateDisplay2() {
      return this;
    }
  }, {
    key: "isModified",
    value: function isModified() {
      return this.initialValue !== this.getValue();
    }
  }]);
  return Controller2;
}();
var EVENT_MAP = {
  HTMLEvents: ["change"],
  MouseEvents: ["click", "mousemove", "mousedown", "mouseup", "mouseover"],
  KeyboardEvents: ["keydown"]
};
var EVENT_MAP_INV = {};
Common.each(EVENT_MAP, function(v, k) {
  Common.each(v, function(e) {
    EVENT_MAP_INV[e] = k;
  });
});
var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
function cssValueToPixels(val) {
  if (val === "0" || Common.isUndefined(val)) {
    return 0;
  }
  var match = val.match(CSS_VALUE_PIXELS);
  if (!Common.isNull(match)) {
    return parseFloat(match[1]);
  }
  return 0;
}
var dom = {
  makeSelectable: function makeSelectable(elem, selectable) {
    if (elem === void 0 || elem.style === void 0)
      return;
    elem.onselectstart = selectable ? function() {
      return false;
    } : function() {
    };
    elem.style.MozUserSelect = selectable ? "auto" : "none";
    elem.style.KhtmlUserSelect = selectable ? "auto" : "none";
    elem.unselectable = selectable ? "on" : "off";
  },
  makeFullscreen: function makeFullscreen(elem, hor, vert) {
    var vertical = vert;
    var horizontal = hor;
    if (Common.isUndefined(horizontal)) {
      horizontal = true;
    }
    if (Common.isUndefined(vertical)) {
      vertical = true;
    }
    elem.style.position = "absolute";
    if (horizontal) {
      elem.style.left = 0;
      elem.style.right = 0;
    }
    if (vertical) {
      elem.style.top = 0;
      elem.style.bottom = 0;
    }
  },
  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
    var params = pars || {};
    var className = EVENT_MAP_INV[eventType];
    if (!className) {
      throw new Error("Event type " + eventType + " not supported.");
    }
    var evt = document.createEvent(className);
    switch (className) {
      case "MouseEvents": {
        var clientX = params.x || params.clientX || 0;
        var clientY = params.y || params.clientY || 0;
        evt.initMouseEvent(
          eventType,
          params.bubbles || false,
          params.cancelable || true,
          window,
          params.clickCount || 1,
          0,
          0,
          clientX,
          clientY,
          false,
          false,
          false,
          false,
          0,
          null
        );
        break;
      }
      case "KeyboardEvents": {
        var init = evt.initKeyboardEvent || evt.initKeyEvent;
        Common.defaults(params, {
          cancelable: true,
          ctrlKey: false,
          altKey: false,
          shiftKey: false,
          metaKey: false,
          keyCode: void 0,
          charCode: void 0
        });
        init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
        break;
      }
      default: {
        evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
        break;
      }
    }
    Common.defaults(evt, aux);
    elem.dispatchEvent(evt);
  },
  bind: function bind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.addEventListener) {
      elem.addEventListener(event, func, bool);
    } else if (elem.attachEvent) {
      elem.attachEvent("on" + event, func);
    }
    return dom;
  },
  unbind: function unbind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.removeEventListener) {
      elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
      elem.detachEvent("on" + event, func);
    }
    return dom;
  },
  addClass: function addClass(elem, className) {
    if (elem.className === void 0) {
      elem.className = className;
    } else if (elem.className !== className) {
      var classes = elem.className.split(/ +/);
      if (classes.indexOf(className) === -1) {
        classes.push(className);
        elem.className = classes.join(" ").replace(/^\s+/, "").replace(/\s+$/, "");
      }
    }
    return dom;
  },
  removeClass: function removeClass(elem, className) {
    if (className) {
      if (elem.className === className) {
        elem.removeAttribute("class");
      } else {
        var classes = elem.className.split(/ +/);
        var index = classes.indexOf(className);
        if (index !== -1) {
          classes.splice(index, 1);
          elem.className = classes.join(" ");
        }
      }
    } else {
      elem.className = void 0;
    }
    return dom;
  },
  hasClass: function hasClass(elem, className) {
    return new RegExp("(?:^|\\s+)" + className + "(?:\\s+|$)").test(elem.className) || false;
  },
  getWidth: function getWidth(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style["border-left-width"]) + cssValueToPixels(style["border-right-width"]) + cssValueToPixels(style["padding-left"]) + cssValueToPixels(style["padding-right"]) + cssValueToPixels(style.width);
  },
  getHeight: function getHeight(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style["border-top-width"]) + cssValueToPixels(style["border-bottom-width"]) + cssValueToPixels(style["padding-top"]) + cssValueToPixels(style["padding-bottom"]) + cssValueToPixels(style.height);
  },
  getOffset: function getOffset(el) {
    var elem = el;
    var offset = { left: 0, top: 0 };
    if (elem.offsetParent) {
      do {
        offset.left += elem.offsetLeft;
        offset.top += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }
    return offset;
  },
  isActive: function isActive(elem) {
    return elem === document.activeElement && (elem.type || elem.href);
  }
};
var BooleanController = function(_Controller) {
  inherits(BooleanController2, _Controller);
  function BooleanController2(object, property) {
    classCallCheck(this, BooleanController2);
    var _this2 = possibleConstructorReturn(this, (BooleanController2.__proto__ || Object.getPrototypeOf(BooleanController2)).call(this, object, property));
    var _this = _this2;
    _this2.__prev = _this2.getValue();
    _this2.__checkbox = document.createElement("input");
    _this2.__checkbox.setAttribute("type", "checkbox");
    function onChange() {
      _this.setValue(!_this.__prev);
    }
    dom.bind(_this2.__checkbox, "change", onChange, false);
    _this2.domElement.appendChild(_this2.__checkbox);
    _this2.updateDisplay();
    return _this2;
  }
  createClass(BooleanController2, [{
    key: "setValue",
    value: function setValue(v) {
      var toReturn2 = get(BooleanController2.prototype.__proto__ || Object.getPrototypeOf(BooleanController2.prototype), "setValue", this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      this.__prev = this.getValue();
      return toReturn2;
    }
  }, {
    key: "updateDisplay",
    value: function updateDisplay2() {
      if (this.getValue() === true) {
        this.__checkbox.setAttribute("checked", "checked");
        this.__checkbox.checked = true;
        this.__prev = true;
      } else {
        this.__checkbox.checked = false;
        this.__prev = false;
      }
      return get(BooleanController2.prototype.__proto__ || Object.getPrototypeOf(BooleanController2.prototype), "updateDisplay", this).call(this);
    }
  }]);
  return BooleanController2;
}(Controller);
var OptionController = function(_Controller) {
  inherits(OptionController2, _Controller);
  function OptionController2(object, property, opts) {
    classCallCheck(this, OptionController2);
    var _this2 = possibleConstructorReturn(this, (OptionController2.__proto__ || Object.getPrototypeOf(OptionController2)).call(this, object, property));
    var options = opts;
    var _this = _this2;
    _this2.__select = document.createElement("select");
    if (Common.isArray(options)) {
      var map2 = {};
      Common.each(options, function(element) {
        map2[element] = element;
      });
      options = map2;
    }
    Common.each(options, function(value, key) {
      var opt = document.createElement("option");
      opt.innerHTML = key;
      opt.setAttribute("value", value);
      _this.__select.appendChild(opt);
    });
    _this2.updateDisplay();
    dom.bind(_this2.__select, "change", function() {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });
    _this2.domElement.appendChild(_this2.__select);
    return _this2;
  }
  createClass(OptionController2, [{
    key: "setValue",
    value: function setValue(v) {
      var toReturn2 = get(OptionController2.prototype.__proto__ || Object.getPrototypeOf(OptionController2.prototype), "setValue", this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      return toReturn2;
    }
  }, {
    key: "updateDisplay",
    value: function updateDisplay2() {
      if (dom.isActive(this.__select))
        return this;
      this.__select.value = this.getValue();
      return get(OptionController2.prototype.__proto__ || Object.getPrototypeOf(OptionController2.prototype), "updateDisplay", this).call(this);
    }
  }]);
  return OptionController2;
}(Controller);
var StringController = function(_Controller) {
  inherits(StringController2, _Controller);
  function StringController2(object, property) {
    classCallCheck(this, StringController2);
    var _this2 = possibleConstructorReturn(this, (StringController2.__proto__ || Object.getPrototypeOf(StringController2)).call(this, object, property));
    var _this = _this2;
    function onChange() {
      _this.setValue(_this.__input.value);
    }
    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.__input = document.createElement("input");
    _this2.__input.setAttribute("type", "text");
    dom.bind(_this2.__input, "keyup", onChange);
    dom.bind(_this2.__input, "change", onChange);
    dom.bind(_this2.__input, "blur", onBlur);
    dom.bind(_this2.__input, "keydown", function(e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass(StringController2, [{
    key: "updateDisplay",
    value: function updateDisplay2() {
      if (!dom.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }
      return get(StringController2.prototype.__proto__ || Object.getPrototypeOf(StringController2.prototype), "updateDisplay", this).call(this);
    }
  }]);
  return StringController2;
}(Controller);
function numDecimals(x) {
  var _x = x.toString();
  if (_x.indexOf(".") > -1) {
    return _x.length - _x.indexOf(".") - 1;
  }
  return 0;
}
var NumberController = function(_Controller) {
  inherits(NumberController2, _Controller);
  function NumberController2(object, property, params) {
    classCallCheck(this, NumberController2);
    var _this = possibleConstructorReturn(this, (NumberController2.__proto__ || Object.getPrototypeOf(NumberController2)).call(this, object, property));
    var _params = params || {};
    _this.__min = _params.min;
    _this.__max = _params.max;
    _this.__step = _params.step;
    if (Common.isUndefined(_this.__step)) {
      if (_this.initialValue === 0) {
        _this.__impliedStep = 1;
      } else {
        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
      }
    } else {
      _this.__impliedStep = _this.__step;
    }
    _this.__precision = numDecimals(_this.__impliedStep);
    return _this;
  }
  createClass(NumberController2, [{
    key: "setValue",
    value: function setValue(v) {
      var _v = v;
      if (this.__min !== void 0 && _v < this.__min) {
        _v = this.__min;
      } else if (this.__max !== void 0 && _v > this.__max) {
        _v = this.__max;
      }
      if (this.__step !== void 0 && _v % this.__step !== 0) {
        _v = Math.round(_v / this.__step) * this.__step;
      }
      return get(NumberController2.prototype.__proto__ || Object.getPrototypeOf(NumberController2.prototype), "setValue", this).call(this, _v);
    }
  }, {
    key: "min",
    value: function min(minValue) {
      this.__min = minValue;
      return this;
    }
  }, {
    key: "max",
    value: function max(maxValue) {
      this.__max = maxValue;
      return this;
    }
  }, {
    key: "step",
    value: function step2(stepValue) {
      this.__step = stepValue;
      this.__impliedStep = stepValue;
      this.__precision = numDecimals(stepValue);
      return this;
    }
  }]);
  return NumberController2;
}(Controller);
function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}
var NumberControllerBox = function(_NumberController) {
  inherits(NumberControllerBox2, _NumberController);
  function NumberControllerBox2(object, property, params) {
    classCallCheck(this, NumberControllerBox2);
    var _this2 = possibleConstructorReturn(this, (NumberControllerBox2.__proto__ || Object.getPrototypeOf(NumberControllerBox2)).call(this, object, property, params));
    _this2.__truncationSuspended = false;
    var _this = _this2;
    var prevY = void 0;
    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!Common.isNaN(attempted)) {
        _this.setValue(attempted);
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onBlur() {
      onFinish();
    }
    function onMouseDrag(e) {
      var diff = prevY - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);
      prevY = e.clientY;
    }
    function onMouseUp() {
      dom.unbind(window, "mousemove", onMouseDrag);
      dom.unbind(window, "mouseup", onMouseUp);
      onFinish();
    }
    function onMouseDown(e) {
      dom.bind(window, "mousemove", onMouseDrag);
      dom.bind(window, "mouseup", onMouseUp);
      prevY = e.clientY;
    }
    _this2.__input = document.createElement("input");
    _this2.__input.setAttribute("type", "text");
    dom.bind(_this2.__input, "change", onChange);
    dom.bind(_this2.__input, "blur", onBlur);
    dom.bind(_this2.__input, "mousedown", onMouseDown);
    dom.bind(_this2.__input, "keydown", function(e) {
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
        onFinish();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass(NumberControllerBox2, [{
    key: "updateDisplay",
    value: function updateDisplay2() {
      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
      return get(NumberControllerBox2.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox2.prototype), "updateDisplay", this).call(this);
    }
  }]);
  return NumberControllerBox2;
}(NumberController);
function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}
var NumberControllerSlider = function(_NumberController) {
  inherits(NumberControllerSlider2, _NumberController);
  function NumberControllerSlider2(object, property, min, max, step2) {
    classCallCheck(this, NumberControllerSlider2);
    var _this2 = possibleConstructorReturn(this, (NumberControllerSlider2.__proto__ || Object.getPrototypeOf(NumberControllerSlider2)).call(this, object, property, { min, max, step: step2 }));
    var _this = _this2;
    _this2.__background = document.createElement("div");
    _this2.__foreground = document.createElement("div");
    dom.bind(_this2.__background, "mousedown", onMouseDown);
    dom.bind(_this2.__background, "touchstart", onTouchStart);
    dom.addClass(_this2.__background, "slider");
    dom.addClass(_this2.__foreground, "slider-fg");
    function onMouseDown(e) {
      document.activeElement.blur();
      dom.bind(window, "mousemove", onMouseDrag);
      dom.bind(window, "mouseup", onMouseUp);
      onMouseDrag(e);
    }
    function onMouseDrag(e) {
      e.preventDefault();
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
      return false;
    }
    function onMouseUp() {
      dom.unbind(window, "mousemove", onMouseDrag);
      dom.unbind(window, "mouseup", onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        return;
      }
      dom.bind(window, "touchmove", onTouchMove);
      dom.bind(window, "touchend", onTouchEnd);
      onTouchMove(e);
    }
    function onTouchMove(e) {
      var clientX = e.touches[0].clientX;
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
    }
    function onTouchEnd() {
      dom.unbind(window, "touchmove", onTouchMove);
      dom.unbind(window, "touchend", onTouchEnd);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.updateDisplay();
    _this2.__background.appendChild(_this2.__foreground);
    _this2.domElement.appendChild(_this2.__background);
    return _this2;
  }
  createClass(NumberControllerSlider2, [{
    key: "updateDisplay",
    value: function updateDisplay2() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
      this.__foreground.style.width = pct * 100 + "%";
      return get(NumberControllerSlider2.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider2.prototype), "updateDisplay", this).call(this);
    }
  }]);
  return NumberControllerSlider2;
}(NumberController);
var FunctionController = function(_Controller) {
  inherits(FunctionController2, _Controller);
  function FunctionController2(object, property, text) {
    classCallCheck(this, FunctionController2);
    var _this2 = possibleConstructorReturn(this, (FunctionController2.__proto__ || Object.getPrototypeOf(FunctionController2)).call(this, object, property));
    var _this = _this2;
    _this2.__button = document.createElement("div");
    _this2.__button.innerHTML = text === void 0 ? "Fire" : text;
    dom.bind(_this2.__button, "click", function(e) {
      e.preventDefault();
      _this.fire();
      return false;
    });
    dom.addClass(_this2.__button, "button");
    _this2.domElement.appendChild(_this2.__button);
    return _this2;
  }
  createClass(FunctionController2, [{
    key: "fire",
    value: function fire() {
      if (this.__onChange) {
        this.__onChange.call(this);
      }
      this.getValue().call(this.object);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
    }
  }]);
  return FunctionController2;
}(Controller);
var ColorController = function(_Controller) {
  inherits(ColorController2, _Controller);
  function ColorController2(object, property) {
    classCallCheck(this, ColorController2);
    var _this2 = possibleConstructorReturn(this, (ColorController2.__proto__ || Object.getPrototypeOf(ColorController2)).call(this, object, property));
    _this2.__color = new Color(_this2.getValue());
    _this2.__temp = new Color(0);
    var _this = _this2;
    _this2.domElement = document.createElement("div");
    dom.makeSelectable(_this2.domElement, false);
    _this2.__selector = document.createElement("div");
    _this2.__selector.className = "selector";
    _this2.__saturation_field = document.createElement("div");
    _this2.__saturation_field.className = "saturation-field";
    _this2.__field_knob = document.createElement("div");
    _this2.__field_knob.className = "field-knob";
    _this2.__field_knob_border = "2px solid ";
    _this2.__hue_knob = document.createElement("div");
    _this2.__hue_knob.className = "hue-knob";
    _this2.__hue_field = document.createElement("div");
    _this2.__hue_field.className = "hue-field";
    _this2.__input = document.createElement("input");
    _this2.__input.type = "text";
    _this2.__input_textShadow = "0 1px 1px ";
    dom.bind(_this2.__input, "keydown", function(e) {
      if (e.keyCode === 13) {
        onBlur.call(this);
      }
    });
    dom.bind(_this2.__input, "blur", onBlur);
    dom.bind(_this2.__selector, "mousedown", function() {
      dom.addClass(this, "drag").bind(window, "mouseup", function() {
        dom.removeClass(_this.__selector, "drag");
      });
    });
    dom.bind(_this2.__selector, "touchstart", function() {
      dom.addClass(this, "drag").bind(window, "touchend", function() {
        dom.removeClass(_this.__selector, "drag");
      });
    });
    var valueField = document.createElement("div");
    Common.extend(_this2.__selector.style, {
      width: "122px",
      height: "102px",
      padding: "3px",
      backgroundColor: "#222",
      boxShadow: "0px 1px 3px rgba(0,0,0,0.3)"
    });
    Common.extend(_this2.__field_knob.style, {
      position: "absolute",
      width: "12px",
      height: "12px",
      border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? "#fff" : "#000"),
      boxShadow: "0px 1px 3px rgba(0,0,0,0.5)",
      borderRadius: "12px",
      zIndex: 1
    });
    Common.extend(_this2.__hue_knob.style, {
      position: "absolute",
      width: "15px",
      height: "2px",
      borderRight: "4px solid #fff",
      zIndex: 1
    });
    Common.extend(_this2.__saturation_field.style, {
      width: "100px",
      height: "100px",
      border: "1px solid #555",
      marginRight: "3px",
      display: "inline-block",
      cursor: "pointer"
    });
    Common.extend(valueField.style, {
      width: "100%",
      height: "100%",
      background: "none"
    });
    linearGradient(valueField, "top", "rgba(0,0,0,0)", "#000");
    Common.extend(_this2.__hue_field.style, {
      width: "15px",
      height: "100px",
      border: "1px solid #555",
      cursor: "ns-resize",
      position: "absolute",
      top: "3px",
      right: "3px"
    });
    hueGradient(_this2.__hue_field);
    Common.extend(_this2.__input.style, {
      outline: "none",
      textAlign: "center",
      color: "#fff",
      border: 0,
      fontWeight: "bold",
      textShadow: _this2.__input_textShadow + "rgba(0,0,0,0.7)"
    });
    dom.bind(_this2.__saturation_field, "mousedown", fieldDown);
    dom.bind(_this2.__saturation_field, "touchstart", fieldDown);
    dom.bind(_this2.__field_knob, "mousedown", fieldDown);
    dom.bind(_this2.__field_knob, "touchstart", fieldDown);
    dom.bind(_this2.__hue_field, "mousedown", fieldDownH);
    dom.bind(_this2.__hue_field, "touchstart", fieldDownH);
    function fieldDown(e) {
      setSV(e);
      dom.bind(window, "mousemove", setSV);
      dom.bind(window, "touchmove", setSV);
      dom.bind(window, "mouseup", fieldUpSV);
      dom.bind(window, "touchend", fieldUpSV);
    }
    function fieldDownH(e) {
      setH(e);
      dom.bind(window, "mousemove", setH);
      dom.bind(window, "touchmove", setH);
      dom.bind(window, "mouseup", fieldUpH);
      dom.bind(window, "touchend", fieldUpH);
    }
    function fieldUpSV() {
      dom.unbind(window, "mousemove", setSV);
      dom.unbind(window, "touchmove", setSV);
      dom.unbind(window, "mouseup", fieldUpSV);
      dom.unbind(window, "touchend", fieldUpSV);
      onFinish();
    }
    function fieldUpH() {
      dom.unbind(window, "mousemove", setH);
      dom.unbind(window, "touchmove", setH);
      dom.unbind(window, "mouseup", fieldUpH);
      dom.unbind(window, "touchend", fieldUpH);
      onFinish();
    }
    function onBlur() {
      var i = interpret(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.__color.toOriginal());
      }
    }
    _this2.__saturation_field.appendChild(valueField);
    _this2.__selector.appendChild(_this2.__field_knob);
    _this2.__selector.appendChild(_this2.__saturation_field);
    _this2.__selector.appendChild(_this2.__hue_field);
    _this2.__hue_field.appendChild(_this2.__hue_knob);
    _this2.domElement.appendChild(_this2.__input);
    _this2.domElement.appendChild(_this2.__selector);
    _this2.updateDisplay();
    function setSV(e) {
      if (e.type.indexOf("touch") === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__saturation_field.getBoundingClientRect();
      var _ref = e.touches && e.touches[0] || e, clientX = _ref.clientX, clientY = _ref.clientY;
      var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (v > 1) {
        v = 1;
      } else if (v < 0) {
        v = 0;
      }
      if (s > 1) {
        s = 1;
      } else if (s < 0) {
        s = 0;
      }
      _this.__color.v = v;
      _this.__color.s = s;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    function setH(e) {
      if (e.type.indexOf("touch") === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__hue_field.getBoundingClientRect();
      var _ref2 = e.touches && e.touches[0] || e, clientY = _ref2.clientY;
      var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (h > 1) {
        h = 1;
      } else if (h < 0) {
        h = 0;
      }
      _this.__color.h = h * 360;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    return _this2;
  }
  createClass(ColorController2, [{
    key: "updateDisplay",
    value: function updateDisplay2() {
      var i = interpret(this.getValue());
      if (i !== false) {
        var mismatch = false;
        Common.each(Color.COMPONENTS, function(component) {
          if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
            mismatch = true;
            return {};
          }
        }, this);
        if (mismatch) {
          Common.extend(this.__color.__state, i);
        }
      }
      Common.extend(this.__temp.__state, this.__color.__state);
      this.__temp.a = 1;
      var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
      var _flip = 255 - flip;
      Common.extend(this.__field_knob.style, {
        marginLeft: 100 * this.__color.s - 7 + "px",
        marginTop: 100 * (1 - this.__color.v) - 7 + "px",
        backgroundColor: this.__temp.toHexString(),
        border: this.__field_knob_border + "rgb(" + flip + "," + flip + "," + flip + ")"
      });
      this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + "px";
      this.__temp.s = 1;
      this.__temp.v = 1;
      linearGradient(this.__saturation_field, "left", "#fff", this.__temp.toHexString());
      this.__input.value = this.__color.toString();
      Common.extend(this.__input.style, {
        backgroundColor: this.__color.toHexString(),
        color: "rgb(" + flip + "," + flip + "," + flip + ")",
        textShadow: this.__input_textShadow + "rgba(" + _flip + "," + _flip + "," + _flip + ",.7)"
      });
    }
  }]);
  return ColorController2;
}(Controller);
var vendors = ["-moz-", "-o-", "-webkit-", "-ms-", ""];
function linearGradient(elem, x, a, b) {
  elem.style.background = "";
  Common.each(vendors, function(vendor) {
    elem.style.cssText += "background: " + vendor + "linear-gradient(" + x + ", " + a + " 0%, " + b + " 100%); ";
  });
}
function hueGradient(elem) {
  elem.style.background = "";
  elem.style.cssText += "background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);";
  elem.style.cssText += "background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
  elem.style.cssText += "background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
  elem.style.cssText += "background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
  elem.style.cssText += "background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
}
var css = {
  load: function load(url, indoc) {
    var doc = indoc || document;
    var link = doc.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    doc.getElementsByTagName("head")[0].appendChild(link);
  },
  inject: function inject(cssContent, indoc) {
    var doc = indoc || document;
    var injected = document.createElement("style");
    injected.type = "text/css";
    injected.innerHTML = cssContent;
    var head = doc.getElementsByTagName("head")[0];
    try {
      head.appendChild(injected);
    } catch (e) {
    }
  }
};
var saveDialogContents = `<div id="dg-save" class="dg dialogue">

  Here's the new load parameter for your <code>GUI</code>'s constructor:

  <textarea id="dg-new-constructor"></textarea>

  <div id="dg-save-locally">

    <input id="dg-local-storage" type="checkbox"/> Automatically save
    values to <code>localStorage</code> on exit.

    <div id="dg-local-explain">The values saved to <code>localStorage</code> will
      override those passed to <code>dat.GUI</code>'s constructor. This makes it
      easier to work incrementally, but <code>localStorage</code> is fragile,
      and your friends may not see the same values you do.

    </div>

  </div>

</div>`;
var ControllerFactory = function ControllerFactory2(object, property) {
  var initialValue = object[property];
  if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
    return new OptionController(object, property, arguments[2]);
  }
  if (Common.isNumber(initialValue)) {
    if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
      if (Common.isNumber(arguments[4])) {
        return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
      }
      return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
    }
    if (Common.isNumber(arguments[4])) {
      return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3], step: arguments[4] });
    }
    return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
  }
  if (Common.isString(initialValue)) {
    return new StringController(object, property);
  }
  if (Common.isFunction(initialValue)) {
    return new FunctionController(object, property, "");
  }
  if (Common.isBoolean(initialValue)) {
    return new BooleanController(object, property);
  }
  return null;
};
function requestAnimationFrame(callback) {
  setTimeout(callback, 1e3 / 60);
}
var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;
var CenteredDiv = function() {
  function CenteredDiv2() {
    classCallCheck(this, CenteredDiv2);
    this.backgroundElement = document.createElement("div");
    Common.extend(this.backgroundElement.style, {
      backgroundColor: "rgba(0,0,0,0.8)",
      top: 0,
      left: 0,
      display: "none",
      zIndex: "1000",
      opacity: 0,
      WebkitTransition: "opacity 0.2s linear",
      transition: "opacity 0.2s linear"
    });
    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = "fixed";
    this.domElement = document.createElement("div");
    Common.extend(this.domElement.style, {
      position: "fixed",
      display: "none",
      zIndex: "1001",
      opacity: 0,
      WebkitTransition: "-webkit-transform 0.2s ease-out, opacity 0.2s linear",
      transition: "transform 0.2s ease-out, opacity 0.2s linear"
    });
    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);
    var _this = this;
    dom.bind(this.backgroundElement, "click", function() {
      _this.hide();
    });
  }
  createClass(CenteredDiv2, [{
    key: "show",
    value: function show2() {
      var _this = this;
      this.backgroundElement.style.display = "block";
      this.domElement.style.display = "block";
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = "scale(1.1)";
      this.layout();
      Common.defer(function() {
        _this.backgroundElement.style.opacity = 1;
        _this.domElement.style.opacity = 1;
        _this.domElement.style.webkitTransform = "scale(1)";
      });
    }
  }, {
    key: "hide",
    value: function hide3() {
      var _this = this;
      var hide4 = function hide5() {
        _this.domElement.style.display = "none";
        _this.backgroundElement.style.display = "none";
        dom.unbind(_this.domElement, "webkitTransitionEnd", hide5);
        dom.unbind(_this.domElement, "transitionend", hide5);
        dom.unbind(_this.domElement, "oTransitionEnd", hide5);
      };
      dom.bind(this.domElement, "webkitTransitionEnd", hide4);
      dom.bind(this.domElement, "transitionend", hide4);
      dom.bind(this.domElement, "oTransitionEnd", hide4);
      this.backgroundElement.style.opacity = 0;
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = "scale(1.1)";
    }
  }, {
    key: "layout",
    value: function layout() {
      this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + "px";
      this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + "px";
    }
  }]);
  return CenteredDiv2;
}();
var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .cr.function .property-name{width:100%}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");
css.inject(styleSheet);
var CSS_NAMESPACE = "dg";
var HIDE_KEY_CODE = 72;
var CLOSE_BUTTON_HEIGHT = 20;
var DEFAULT_DEFAULT_PRESET_NAME = "Default";
var SUPPORTS_LOCAL_STORAGE = function() {
  try {
    return !!window.localStorage;
  } catch (e) {
    return false;
  }
}();
var SAVE_DIALOGUE = void 0;
var autoPlaceVirgin = true;
var autoPlaceContainer = void 0;
var hide = false;
var hideableGuis = [];
var GUI = function GUI2(pars) {
  var _this = this;
  var params = pars || {};
  this.domElement = document.createElement("div");
  this.__ul = document.createElement("ul");
  this.domElement.appendChild(this.__ul);
  dom.addClass(this.domElement, CSS_NAMESPACE);
  this.__folders = {};
  this.__controllers = [];
  this.__rememberedObjects = [];
  this.__rememberedObjectIndecesToControllers = [];
  this.__listening = [];
  params = Common.defaults(params, {
    closeOnTop: false,
    autoPlace: true,
    width: GUI2.DEFAULT_WIDTH
  });
  params = Common.defaults(params, {
    resizable: params.autoPlace,
    hideable: params.autoPlace
  });
  if (!Common.isUndefined(params.load)) {
    if (params.preset) {
      params.load.preset = params.preset;
    }
  } else {
    params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
  }
  if (Common.isUndefined(params.parent) && params.hideable) {
    hideableGuis.push(this);
  }
  params.resizable = Common.isUndefined(params.parent) && params.resizable;
  if (params.autoPlace && Common.isUndefined(params.scrollable)) {
    params.scrollable = true;
  }
  var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, "isLocal")) === "true";
  var saveToLocalStorage = void 0;
  var titleRow = void 0;
  Object.defineProperties(
    this,
    {
      parent: {
        get: function get$$13() {
          return params.parent;
        }
      },
      scrollable: {
        get: function get$$13() {
          return params.scrollable;
        }
      },
      autoPlace: {
        get: function get$$13() {
          return params.autoPlace;
        }
      },
      closeOnTop: {
        get: function get$$13() {
          return params.closeOnTop;
        }
      },
      preset: {
        get: function get$$13() {
          if (_this.parent) {
            return _this.getRoot().preset;
          }
          return params.load.preset;
        },
        set: function set$$13(v) {
          if (_this.parent) {
            _this.getRoot().preset = v;
          } else {
            params.load.preset = v;
          }
          setPresetSelectIndex(this);
          _this.revert();
        }
      },
      width: {
        get: function get$$13() {
          return params.width;
        },
        set: function set$$13(v) {
          params.width = v;
          setWidth(_this, v);
        }
      },
      name: {
        get: function get$$13() {
          return params.name;
        },
        set: function set$$13(v) {
          params.name = v;
          if (titleRow) {
            titleRow.innerHTML = params.name;
          }
        }
      },
      closed: {
        get: function get$$13() {
          return params.closed;
        },
        set: function set$$13(v) {
          params.closed = v;
          if (params.closed) {
            dom.addClass(_this.__ul, GUI2.CLASS_CLOSED);
          } else {
            dom.removeClass(_this.__ul, GUI2.CLASS_CLOSED);
          }
          this.onResize();
          if (_this.__closeButton) {
            _this.__closeButton.innerHTML = v ? GUI2.TEXT_OPEN : GUI2.TEXT_CLOSED;
          }
        }
      },
      load: {
        get: function get$$13() {
          return params.load;
        }
      },
      useLocalStorage: {
        get: function get$$13() {
          return useLocalStorage;
        },
        set: function set$$13(bool) {
          if (SUPPORTS_LOCAL_STORAGE) {
            useLocalStorage = bool;
            if (bool) {
              dom.bind(window, "unload", saveToLocalStorage);
            } else {
              dom.unbind(window, "unload", saveToLocalStorage);
            }
            localStorage.setItem(getLocalStorageHash(_this, "isLocal"), bool);
          }
        }
      }
    }
  );
  if (Common.isUndefined(params.parent)) {
    this.closed = params.closed || false;
    dom.addClass(this.domElement, GUI2.CLASS_MAIN);
    dom.makeSelectable(this.domElement, false);
    if (SUPPORTS_LOCAL_STORAGE) {
      if (useLocalStorage) {
        _this.useLocalStorage = true;
        var savedGui = localStorage.getItem(getLocalStorageHash(this, "gui"));
        if (savedGui) {
          params.load = JSON.parse(savedGui);
        }
      }
    }
    this.__closeButton = document.createElement("div");
    this.__closeButton.innerHTML = GUI2.TEXT_CLOSED;
    dom.addClass(this.__closeButton, GUI2.CLASS_CLOSE_BUTTON);
    if (params.closeOnTop) {
      dom.addClass(this.__closeButton, GUI2.CLASS_CLOSE_TOP);
      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
    } else {
      dom.addClass(this.__closeButton, GUI2.CLASS_CLOSE_BOTTOM);
      this.domElement.appendChild(this.__closeButton);
    }
    dom.bind(this.__closeButton, "click", function() {
      _this.closed = !_this.closed;
    });
  } else {
    if (params.closed === void 0) {
      params.closed = true;
    }
    var titleRowName = document.createTextNode(params.name);
    dom.addClass(titleRowName, "controller-name");
    titleRow = addRow(_this, titleRowName);
    var onClickTitle = function onClickTitle2(e) {
      e.preventDefault();
      _this.closed = !_this.closed;
      return false;
    };
    dom.addClass(this.__ul, GUI2.CLASS_CLOSED);
    dom.addClass(titleRow, "title");
    dom.bind(titleRow, "click", onClickTitle);
    if (!params.closed) {
      this.closed = false;
    }
  }
  if (params.autoPlace) {
    if (Common.isUndefined(params.parent)) {
      if (autoPlaceVirgin) {
        autoPlaceContainer = document.createElement("div");
        dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
        dom.addClass(autoPlaceContainer, GUI2.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer);
        autoPlaceVirgin = false;
      }
      autoPlaceContainer.appendChild(this.domElement);
      dom.addClass(this.domElement, GUI2.CLASS_AUTO_PLACE);
    }
    if (!this.parent) {
      setWidth(_this, params.width);
    }
  }
  this.__resizeHandler = function() {
    _this.onResizeDebounced();
  };
  dom.bind(window, "resize", this.__resizeHandler);
  dom.bind(this.__ul, "webkitTransitionEnd", this.__resizeHandler);
  dom.bind(this.__ul, "transitionend", this.__resizeHandler);
  dom.bind(this.__ul, "oTransitionEnd", this.__resizeHandler);
  this.onResize();
  if (params.resizable) {
    addResizeHandle(this);
  }
  saveToLocalStorage = function saveToLocalStorage2() {
    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, "isLocal")) === "true") {
      localStorage.setItem(getLocalStorageHash(_this, "gui"), JSON.stringify(_this.getSaveObject()));
    }
  };
  this.saveToLocalStorageIfPossible = saveToLocalStorage;
  function resetWidth() {
    var root = _this.getRoot();
    root.width += 1;
    Common.defer(function() {
      root.width -= 1;
    });
  }
  if (!params.parent) {
    resetWidth();
  }
};
GUI.toggleHide = function() {
  hide = !hide;
  Common.each(hideableGuis, function(gui2) {
    gui2.domElement.style.display = hide ? "none" : "";
  });
};
GUI.CLASS_AUTO_PLACE = "a";
GUI.CLASS_AUTO_PLACE_CONTAINER = "ac";
GUI.CLASS_MAIN = "main";
GUI.CLASS_CONTROLLER_ROW = "cr";
GUI.CLASS_TOO_TALL = "taller-than-window";
GUI.CLASS_CLOSED = "closed";
GUI.CLASS_CLOSE_BUTTON = "close-button";
GUI.CLASS_CLOSE_TOP = "close-top";
GUI.CLASS_CLOSE_BOTTOM = "close-bottom";
GUI.CLASS_DRAG = "drag";
GUI.DEFAULT_WIDTH = 245;
GUI.TEXT_CLOSED = "Close Controls";
GUI.TEXT_OPEN = "Open Controls";
GUI._keydownHandler = function(e) {
  if (document.activeElement.type !== "text" && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
    GUI.toggleHide();
  }
};
dom.bind(window, "keydown", GUI._keydownHandler, false);
Common.extend(
  GUI.prototype,
  {
    add: function add(object, property) {
      return _add(this, object, property, {
        factoryArgs: Array.prototype.slice.call(arguments, 2)
      });
    },
    addColor: function addColor(object, property) {
      return _add(this, object, property, {
        color: true
      });
    },
    remove: function remove(controller) {
      this.__ul.removeChild(controller.__li);
      this.__controllers.splice(this.__controllers.indexOf(controller), 1);
      var _this = this;
      Common.defer(function() {
        _this.onResize();
      });
    },
    destroy: function destroy() {
      if (this.parent) {
        throw new Error("Only the root GUI should be removed with .destroy(). For subfolders, use gui.removeFolder(folder) instead.");
      }
      if (this.autoPlace) {
        autoPlaceContainer.removeChild(this.domElement);
      }
      var _this = this;
      Common.each(this.__folders, function(subfolder) {
        _this.removeFolder(subfolder);
      });
      dom.unbind(window, "keydown", GUI._keydownHandler, false);
      removeListeners(this);
    },
    addFolder: function addFolder(name) {
      if (this.__folders[name] !== void 0) {
        throw new Error('You already have a folder in this GUI by the name "' + name + '"');
      }
      var newGuiParams = { name, parent: this };
      newGuiParams.autoPlace = this.autoPlace;
      if (this.load && this.load.folders && this.load.folders[name]) {
        newGuiParams.closed = this.load.folders[name].closed;
        newGuiParams.load = this.load.folders[name];
      }
      var gui2 = new GUI(newGuiParams);
      this.__folders[name] = gui2;
      var li = addRow(this, gui2.domElement);
      dom.addClass(li, "folder");
      return gui2;
    },
    removeFolder: function removeFolder(folder) {
      this.__ul.removeChild(folder.domElement.parentElement);
      delete this.__folders[folder.name];
      if (this.load && this.load.folders && this.load.folders[folder.name]) {
        delete this.load.folders[folder.name];
      }
      removeListeners(folder);
      var _this = this;
      Common.each(folder.__folders, function(subfolder) {
        folder.removeFolder(subfolder);
      });
      Common.defer(function() {
        _this.onResize();
      });
    },
    open: function open() {
      this.closed = false;
    },
    close: function close() {
      this.closed = true;
    },
    hide: function hide2() {
      this.domElement.style.display = "none";
    },
    show: function show() {
      this.domElement.style.display = "";
    },
    onResize: function onResize() {
      var root = this.getRoot();
      if (root.scrollable) {
        var top = dom.getOffset(root.__ul).top;
        var h = 0;
        Common.each(root.__ul.childNodes, function(node) {
          if (!(root.autoPlace && node === root.__save_row)) {
            h += dom.getHeight(node);
          }
        });
        if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
          dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
          root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + "px";
        } else {
          dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
          root.__ul.style.height = "auto";
        }
      }
      if (root.__resize_handle) {
        Common.defer(function() {
          root.__resize_handle.style.height = root.__ul.offsetHeight + "px";
        });
      }
      if (root.__closeButton) {
        root.__closeButton.style.width = root.width + "px";
      }
    },
    onResizeDebounced: Common.debounce(function() {
      this.onResize();
    }, 50),
    remember: function remember() {
      if (Common.isUndefined(SAVE_DIALOGUE)) {
        SAVE_DIALOGUE = new CenteredDiv();
        SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
      }
      if (this.parent) {
        throw new Error("You can only call remember on a top level GUI.");
      }
      var _this = this;
      Common.each(Array.prototype.slice.call(arguments), function(object) {
        if (_this.__rememberedObjects.length === 0) {
          addSaveMenu(_this);
        }
        if (_this.__rememberedObjects.indexOf(object) === -1) {
          _this.__rememberedObjects.push(object);
        }
      });
      if (this.autoPlace) {
        setWidth(this, this.width);
      }
    },
    getRoot: function getRoot() {
      var gui2 = this;
      while (gui2.parent) {
        gui2 = gui2.parent;
      }
      return gui2;
    },
    getSaveObject: function getSaveObject() {
      var toReturn2 = this.load;
      toReturn2.closed = this.closed;
      if (this.__rememberedObjects.length > 0) {
        toReturn2.preset = this.preset;
        if (!toReturn2.remembered) {
          toReturn2.remembered = {};
        }
        toReturn2.remembered[this.preset] = getCurrentPreset(this);
      }
      toReturn2.folders = {};
      Common.each(this.__folders, function(element, key) {
        toReturn2.folders[key] = element.getSaveObject();
      });
      return toReturn2;
    },
    save: function save() {
      if (!this.load.remembered) {
        this.load.remembered = {};
      }
      this.load.remembered[this.preset] = getCurrentPreset(this);
      markPresetModified(this, false);
      this.saveToLocalStorageIfPossible();
    },
    saveAs: function saveAs(presetName) {
      if (!this.load.remembered) {
        this.load.remembered = {};
        this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
      }
      this.load.remembered[presetName] = getCurrentPreset(this);
      this.preset = presetName;
      addPresetOption(this, presetName, true);
      this.saveToLocalStorageIfPossible();
    },
    revert: function revert(gui2) {
      Common.each(this.__controllers, function(controller) {
        if (!this.getRoot().load.remembered) {
          controller.setValue(controller.initialValue);
        } else {
          recallSavedValue(gui2 || this.getRoot(), controller);
        }
        if (controller.__onFinishChange) {
          controller.__onFinishChange.call(controller, controller.getValue());
        }
      }, this);
      Common.each(this.__folders, function(folder) {
        folder.revert(folder);
      });
      if (!gui2) {
        markPresetModified(this.getRoot(), false);
      }
    },
    listen: function listen(controller) {
      var init = this.__listening.length === 0;
      this.__listening.push(controller);
      if (init) {
        updateDisplays(this.__listening);
      }
    },
    updateDisplay: function updateDisplay() {
      Common.each(this.__controllers, function(controller) {
        controller.updateDisplay();
      });
      Common.each(this.__folders, function(folder) {
        folder.updateDisplay();
      });
    }
  }
);
function addRow(gui2, newDom, liBefore) {
  var li = document.createElement("li");
  if (newDom) {
    li.appendChild(newDom);
  }
  if (liBefore) {
    gui2.__ul.insertBefore(li, liBefore);
  } else {
    gui2.__ul.appendChild(li);
  }
  gui2.onResize();
  return li;
}
function removeListeners(gui2) {
  dom.unbind(window, "resize", gui2.__resizeHandler);
  if (gui2.saveToLocalStorageIfPossible) {
    dom.unbind(window, "unload", gui2.saveToLocalStorageIfPossible);
  }
}
function markPresetModified(gui2, modified) {
  var opt = gui2.__preset_select[gui2.__preset_select.selectedIndex];
  if (modified) {
    opt.innerHTML = opt.value + "*";
  } else {
    opt.innerHTML = opt.value;
  }
}
function augmentController(gui2, li, controller) {
  controller.__li = li;
  controller.__gui = gui2;
  Common.extend(controller, {
    options: function options(_options) {
      if (arguments.length > 1) {
        var nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui2, controller.object, controller.property, {
          before: nextSibling,
          factoryArgs: [Common.toArray(arguments)]
        });
      }
      if (Common.isArray(_options) || Common.isObject(_options)) {
        var _nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui2, controller.object, controller.property, {
          before: _nextSibling,
          factoryArgs: [_options]
        });
      }
    },
    name: function name(_name) {
      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
      return controller;
    },
    listen: function listen2() {
      controller.__gui.listen(controller);
      return controller;
    },
    remove: function remove2() {
      controller.__gui.remove(controller);
      return controller;
    }
  });
  if (controller instanceof NumberControllerSlider) {
    var box = new NumberControllerBox(controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });
    Common.each(["updateDisplay", "onChange", "onFinishChange", "step", "min", "max"], function(method) {
      var pc = controller[method];
      var pb = box[method];
      controller[method] = box[method] = function() {
        var args = Array.prototype.slice.call(arguments);
        pb.apply(box, args);
        return pc.apply(controller, args);
      };
    });
    dom.addClass(li, "has-slider");
    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
  } else if (controller instanceof NumberControllerBox) {
    var r = function r2(returned) {
      if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
        controller.remove();
        var newController = _add(gui2, controller.object, controller.property, {
          before: controller.__li.nextElementSibling,
          factoryArgs: [controller.__min, controller.__max, controller.__step]
        });
        newController.name(oldName);
        if (wasListening)
          newController.listen();
        return newController;
      }
      return returned;
    };
    controller.min = Common.compose(r, controller.min);
    controller.max = Common.compose(r, controller.max);
  } else if (controller instanceof BooleanController) {
    dom.bind(li, "click", function() {
      dom.fakeEvent(controller.__checkbox, "click");
    });
    dom.bind(controller.__checkbox, "click", function(e) {
      e.stopPropagation();
    });
  } else if (controller instanceof FunctionController) {
    dom.bind(li, "click", function() {
      dom.fakeEvent(controller.__button, "click");
    });
    dom.bind(li, "mouseover", function() {
      dom.addClass(controller.__button, "hover");
    });
    dom.bind(li, "mouseout", function() {
      dom.removeClass(controller.__button, "hover");
    });
  } else if (controller instanceof ColorController) {
    dom.addClass(li, "color");
    controller.updateDisplay = Common.compose(function(val) {
      li.style.borderLeftColor = controller.__color.toString();
      return val;
    }, controller.updateDisplay);
    controller.updateDisplay();
  }
  controller.setValue = Common.compose(function(val) {
    if (gui2.getRoot().__preset_select && controller.isModified()) {
      markPresetModified(gui2.getRoot(), true);
    }
    return val;
  }, controller.setValue);
}
function recallSavedValue(gui2, controller) {
  var root = gui2.getRoot();
  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);
  if (matchedIndex !== -1) {
    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
    if (controllerMap === void 0) {
      controllerMap = {};
      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
    }
    controllerMap[controller.property] = controller;
    if (root.load && root.load.remembered) {
      var presetMap = root.load.remembered;
      var preset = void 0;
      if (presetMap[gui2.preset]) {
        preset = presetMap[gui2.preset];
      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
      } else {
        return;
      }
      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== void 0) {
        var value = preset[matchedIndex][controller.property];
        controller.initialValue = value;
        controller.setValue(value);
      }
    }
  }
}
function _add(gui2, object, property, params) {
  if (object[property] === void 0) {
    throw new Error('Object "' + object + '" has no property "' + property + '"');
  }
  var controller = void 0;
  if (params.color) {
    controller = new ColorController(object, property);
  } else {
    var factoryArgs = [object, property].concat(params.factoryArgs);
    controller = ControllerFactory.apply(gui2, factoryArgs);
  }
  if (params.before instanceof Controller) {
    params.before = params.before.__li;
  }
  recallSavedValue(gui2, controller);
  dom.addClass(controller.domElement, "c");
  var name = document.createElement("span");
  dom.addClass(name, "property-name");
  name.innerHTML = controller.property;
  var container = document.createElement("div");
  container.appendChild(name);
  container.appendChild(controller.domElement);
  var li = addRow(gui2, container, params.before);
  dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
  if (controller instanceof ColorController) {
    dom.addClass(li, "color");
  } else {
    dom.addClass(li, _typeof(controller.getValue()));
  }
  augmentController(gui2, li, controller);
  gui2.__controllers.push(controller);
  return controller;
}
function getLocalStorageHash(gui2, key) {
  return document.location.href + "." + key;
}
function addPresetOption(gui2, name, setSelected) {
  var opt = document.createElement("option");
  opt.innerHTML = name;
  opt.value = name;
  gui2.__preset_select.appendChild(opt);
  if (setSelected) {
    gui2.__preset_select.selectedIndex = gui2.__preset_select.length - 1;
  }
}
function showHideExplain(gui2, explain) {
  explain.style.display = gui2.useLocalStorage ? "block" : "none";
}
function addSaveMenu(gui2) {
  var div = gui2.__save_row = document.createElement("li");
  dom.addClass(gui2.domElement, "has-save");
  gui2.__ul.insertBefore(div, gui2.__ul.firstChild);
  dom.addClass(div, "save-row");
  var gears = document.createElement("span");
  gears.innerHTML = "&nbsp;";
  dom.addClass(gears, "button gears");
  var button = document.createElement("span");
  button.innerHTML = "Save";
  dom.addClass(button, "button");
  dom.addClass(button, "save");
  var button2 = document.createElement("span");
  button2.innerHTML = "New";
  dom.addClass(button2, "button");
  dom.addClass(button2, "save-as");
  var button3 = document.createElement("span");
  button3.innerHTML = "Revert";
  dom.addClass(button3, "button");
  dom.addClass(button3, "revert");
  var select = gui2.__preset_select = document.createElement("select");
  if (gui2.load && gui2.load.remembered) {
    Common.each(gui2.load.remembered, function(value, key) {
      addPresetOption(gui2, key, key === gui2.preset);
    });
  } else {
    addPresetOption(gui2, DEFAULT_DEFAULT_PRESET_NAME, false);
  }
  dom.bind(select, "change", function() {
    for (var index = 0; index < gui2.__preset_select.length; index++) {
      gui2.__preset_select[index].innerHTML = gui2.__preset_select[index].value;
    }
    gui2.preset = this.value;
  });
  div.appendChild(select);
  div.appendChild(gears);
  div.appendChild(button);
  div.appendChild(button2);
  div.appendChild(button3);
  if (SUPPORTS_LOCAL_STORAGE) {
    var explain = document.getElementById("dg-local-explain");
    var localStorageCheckBox = document.getElementById("dg-local-storage");
    var saveLocally = document.getElementById("dg-save-locally");
    saveLocally.style.display = "block";
    if (localStorage.getItem(getLocalStorageHash(gui2, "isLocal")) === "true") {
      localStorageCheckBox.setAttribute("checked", "checked");
    }
    showHideExplain(gui2, explain);
    dom.bind(localStorageCheckBox, "change", function() {
      gui2.useLocalStorage = !gui2.useLocalStorage;
      showHideExplain(gui2, explain);
    });
  }
  var newConstructorTextArea = document.getElementById("dg-new-constructor");
  dom.bind(newConstructorTextArea, "keydown", function(e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE.hide();
    }
  });
  dom.bind(gears, "click", function() {
    newConstructorTextArea.innerHTML = JSON.stringify(gui2.getSaveObject(), void 0, 2);
    SAVE_DIALOGUE.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });
  dom.bind(button, "click", function() {
    gui2.save();
  });
  dom.bind(button2, "click", function() {
    var presetName = prompt("Enter a new preset name.");
    if (presetName) {
      gui2.saveAs(presetName);
    }
  });
  dom.bind(button3, "click", function() {
    gui2.revert();
  });
}
function addResizeHandle(gui2) {
  var pmouseX = void 0;
  gui2.__resize_handle = document.createElement("div");
  Common.extend(gui2.__resize_handle.style, {
    width: "6px",
    marginLeft: "-3px",
    height: "200px",
    cursor: "ew-resize",
    position: "absolute"
  });
  function drag(e) {
    e.preventDefault();
    gui2.width += pmouseX - e.clientX;
    gui2.onResize();
    pmouseX = e.clientX;
    return false;
  }
  function dragStop() {
    dom.removeClass(gui2.__closeButton, GUI.CLASS_DRAG);
    dom.unbind(window, "mousemove", drag);
    dom.unbind(window, "mouseup", dragStop);
  }
  function dragStart(e) {
    e.preventDefault();
    pmouseX = e.clientX;
    dom.addClass(gui2.__closeButton, GUI.CLASS_DRAG);
    dom.bind(window, "mousemove", drag);
    dom.bind(window, "mouseup", dragStop);
    return false;
  }
  dom.bind(gui2.__resize_handle, "mousedown", dragStart);
  dom.bind(gui2.__closeButton, "mousedown", dragStart);
  gui2.domElement.insertBefore(gui2.__resize_handle, gui2.domElement.firstElementChild);
}
function setWidth(gui2, w) {
  gui2.domElement.style.width = w + "px";
  if (gui2.__save_row && gui2.autoPlace) {
    gui2.__save_row.style.width = w + "px";
  }
  if (gui2.__closeButton) {
    gui2.__closeButton.style.width = w + "px";
  }
}
function getCurrentPreset(gui2, useInitialValues) {
  var toReturn2 = {};
  Common.each(gui2.__rememberedObjects, function(val, index) {
    var savedValues = {};
    var controllerMap = gui2.__rememberedObjectIndecesToControllers[index];
    Common.each(controllerMap, function(controller, property) {
      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
    });
    toReturn2[index] = savedValues;
  });
  return toReturn2;
}
function setPresetSelectIndex(gui2) {
  for (var index = 0; index < gui2.__preset_select.length; index++) {
    if (gui2.__preset_select[index].value === gui2.preset) {
      gui2.__preset_select.selectedIndex = index;
    }
  }
}
function updateDisplays(controllerArray) {
  if (controllerArray.length !== 0) {
    requestAnimationFrame$1.call(window, function() {
      updateDisplays(controllerArray);
    });
  }
  Common.each(controllerArray, function(c) {
    c.updateDisplay();
  });
}
var GUI$1 = GUI;

// src/main.ts
var import_color = __toESM(require_color());
var import_vector2 = __toESM(require_vector2());
var import_sprite = __toESM(require_sprite());
var import_circle = __toESM(require_circle());
var import_perlin = __toESM(require_perlin());
var import_rectangle = __toESM(require_rectangle());
var import_animator = __toESM(require_animator());
var import_double_ended_queue = __toESM(require_deque());

// src/background_effect.ts
var import_effect = __toESM(require_effect());
var vertexShader = `#version 300 es
in vec3 a_position;
in vec2 a_coord;

uniform mat4 u_projection;
uniform mat4 u_world;
uniform float u_aspect_ratio;

out vec2 v_texCoord;

void main(void) {
    gl_Position = u_projection * u_world * vec4(a_position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = a_coord * vec2(u_aspect_ratio * 2.0, 2.0) - vec2(u_aspect_ratio, 1.0);
}`;
var fragmentShader = `#version 300 es
precision highp float;

uniform float u_time;
uniform sampler2D u_texture;
uniform float u_alpha;

in vec2 v_texCoord;
out vec4 FragColor;

/* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}

/* skew constants for 3d simplex functions */
const float F3 =  0.3333333;
const float G3 =  0.1666667;

/* 3d simplex noise */
float simplex3d(vec3 p) {
	 /* 1. find current tetrahedron T and it's four vertices */
	 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
	 /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
	 
	 /* calculate s and x */
	 vec3 s = floor(p + dot(p, vec3(F3)));
	 vec3 x = p - s + dot(s, vec3(G3));
	 
	 /* calculate i1 and i2 */
	 vec3 e = step(vec3(0.0), x - x.yzx);
	 vec3 i1 = e*(1.0 - e.zxy);
	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);
	 	
	 /* x1, x2, x3 */
	 vec3 x1 = x - i1 + G3;
	 vec3 x2 = x - i2 + 2.0*G3;
	 vec3 x3 = x - 1.0 + 3.0*G3;
	 
	 /* 2. find four surflets and store them in d */
	 vec4 w, d;
	 
	 /* calculate surflet weights */
	 w.x = dot(x, x);
	 w.y = dot(x1, x1);
	 w.z = dot(x2, x2);
	 w.w = dot(x3, x3);
	 
	 /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
	 w = max(0.6 - w, 0.0);
	 
	 /* calculate surflet components */
	 d.x = dot(random3(s), x);
	 d.y = dot(random3(s + i1), x1);
	 d.z = dot(random3(s + i2), x2);
	 d.w = dot(random3(s + 1.0), x3);
	 
	 /* multiply d by w^4 */
	 w *= w;
	 w *= w;
	 d *= w;
	 
	 /* 3. return the sum of the four surflets */
	 return dot(d, vec4(52.0)) + .25;
}


vec2 pong(vec2 value, float pong_value) {
    vec2 v = mod(value, pong_value * 2.0);
    return min(v, pong_value * 2.0 - v);
}

void main(void) {

    // Normalized pixel coordinates (from -1 to 1 on vertical axis, -ratio to ratio on horizontal)
    vec2 uv = v_texCoord;

    // size of game area
    vec2 size = vec2(1.333333 - .2, .8);
    float radius = 0.065;
    float thickness = 0.15;
    float d = length(max(abs(uv),size) - size) - radius;
    float border = smoothstep(0.55, 0.45, abs(d / thickness) * 5.0);

    float noise1 = simplex3d(vec3(uv * 1.0, u_time * 1.1)) * clamp(u_time - .3, 0.0, 1.0);
    float noise2 = simplex3d(vec3(u_time * 1.0, uv * 0.9)) * clamp(u_time - .3, 0.0, 1.0);
    float noise3 = simplex3d(vec3(uv.y * .9, u_time * 1.0, uv.x * .9)) * clamp(u_time - .3, 0.0, 1.0);
    // float noise3 = abs(simplex3d(vec3(uv * 0.9 + vec2(.3, .6), u_time * 1.0)) * clamp(u_time - .3, 0.0, 1.0) + .01) + .01;
    // vec3 total = vec3(noise1, noise2, noise3) / (noise1 + noise2 + noise3);

    vec3 sampled = texture(u_texture, v_texCoord * .5).xyz;
    // float thing = dot(total, sampled) * 2.2;
    // float thing = mix(sampled.r, sampled.g, noise1) * 1.2;
    float thing1 = mix(sampled.r, sampled.g, smoothstep(.1, .7, noise1));
    float thing2 = mix(sampled.b, 0.1, smoothstep(.1, .7, noise2));
    float thing3 = mix(thing1, thing2, smoothstep(.1, .7, noise3));
    vec3 result = vec3(thing3,thing3-.025,thing3+.025);
    FragColor = vec4((result + border * .8) * u_alpha, u_alpha);
    // FragColor = vec4(total, 1.0);
    // FragColor = vec4(border, border, border, 1.0);

    // Output to screen
    // FragColor = vec4(mix(vec3(.1843, .3098, .3098), vec3(.149, .2471, .2471), noise), 1.0);
    // vec4 color0 = texture(u_texture, v_texCoord * .5);
    // FragColor = vec4(mix(color0, color1, noise1), 1.0);
}`;
var BackgroundEffect = class extends import_effect.default {
  get vertexCode() {
    return vertexShader;
  }
  get fragmentCode() {
    return fragmentShader;
  }
  get uniformTypes() {
    return {
      "u_texture": { type: import_effect.default.UniformTypes.Texture, bind: "u_texture" },
      "u_projection": { type: import_effect.default.UniformTypes.Matrix, bind: import_effect.default.UniformBinds.Projection },
      "u_world": { type: import_effect.default.UniformTypes.Matrix, bind: import_effect.default.UniformBinds.World },
      "u_time": { type: import_effect.default.UniformTypes.Float, bind: "u_time" },
      "u_alpha": { type: import_effect.default.UniformTypes.Float, bind: "u_alpha" },
      "u_aspect_ratio": { type: import_effect.default.UniformTypes.Float, bind: "u_aspect_ratio" }
    };
  }
  get attributeTypes() {
    return {
      "a_position": { size: 3, type: import_effect.default.AttributeTypes.Float, normalize: false, bind: import_effect.default.AttributeBinds.Position },
      "a_coord": { size: 2, type: import_effect.default.AttributeTypes.Float, normalize: false, bind: import_effect.default.AttributeBinds.TextureCoords }
    };
  }
};

// src/font_effect.ts
var import_effect2 = __toESM(require_effect());
var vertexShader2 = `#version 300 es
in vec3 a_position;
in vec2 a_coord;

uniform mat4 u_projection;
uniform mat4 u_world;
uniform float u_aspect_ratio;

out vec2 v_texCoord;
out vec2 v_screenCoord;

void main(void) {
    gl_Position = u_projection * u_world * vec4(a_position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = a_coord;
    v_screenCoord = (gl_Position.xy / gl_Position.w);
    v_screenCoord.x *= u_aspect_ratio;
}`;
var fragmentShader2 = `#version 300 es
precision highp float;

uniform float u_time;
uniform sampler2D u_texture;
uniform sampler2D u_texture_grunge;

in vec2 v_texCoord;
in vec2 v_screenCoord;
out vec4 FragColor;

/* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}

/* skew constants for 3d simplex functions */
const float F3 =  0.3333333;
const float G3 =  0.1666667;

/* 3d simplex noise */
float simplex3d(vec3 p) {
	 /* 1. find current tetrahedron T and it's four vertices */
	 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
	 /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
	 
	 /* calculate s and x */
	 vec3 s = floor(p + dot(p, vec3(F3)));
	 vec3 x = p - s + dot(s, vec3(G3));
	 
	 /* calculate i1 and i2 */
	 vec3 e = step(vec3(0.0), x - x.yzx);
	 vec3 i1 = e*(1.0 - e.zxy);
	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);
	 	
	 /* x1, x2, x3 */
	 vec3 x1 = x - i1 + G3;
	 vec3 x2 = x - i2 + 2.0*G3;
	 vec3 x3 = x - 1.0 + 3.0*G3;
	 
	 /* 2. find four surflets and store them in d */
	 vec4 w, d;
	 
	 /* calculate surflet weights */
	 w.x = dot(x, x);
	 w.y = dot(x1, x1);
	 w.z = dot(x2, x2);
	 w.w = dot(x3, x3);
	 
	 /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
	 w = max(0.6 - w, 0.0);
	 
	 /* calculate surflet components */
	 d.x = dot(random3(s), x);
	 d.y = dot(random3(s + i1), x1);
	 d.z = dot(random3(s + i2), x2);
	 d.w = dot(random3(s + 1.0), x3);
	 
	 /* multiply d by w^4 */
	 w *= w;
	 w *= w;
	 d *= w;
	 
	 /* 3. return the sum of the four surflets */
	 return dot(d, vec4(52.0)) + .25;
}


vec2 pong(vec2 value, float pong_value) {
    vec2 v = mod(value, pong_value * 2.0);
    return min(v, pong_value * 2.0 - v);
}

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main(void) {

    // Normalized pixel coordinates (from -1 to 1 on vertical axis, -ratio to ratio on horizontal)
    vec2 uv = v_screenCoord;

    // size of game area
    vec2 size = vec2(1.333333 - .2, .8);
    float radius = 0.065;
    float thickness = 0.15;
    float d = length(max(abs(uv),size) - size) - radius;
    float border = smoothstep(0.55, 0.45, abs(d / thickness) * 5.0);

    float noise1 = simplex3d(vec3(uv * 1.0, u_time * 1.1)) * clamp(u_time - .3, 0.0, 1.0);
    float noise2 = simplex3d(vec3(u_time * 1.0, uv * 0.9)) * clamp(u_time - .3, 0.0, 1.0);
    float noise3 = simplex3d(vec3(uv.y * .9, u_time * 1.0, uv.x * .9)) * clamp(u_time - .3, 0.0, 1.0);
    // float noise3 = abs(simplex3d(vec3(uv * 0.9 + vec2(.3, .6), u_time * 1.0)) * clamp(u_time - .3, 0.0, 1.0) + .01) + .01;
    // vec3 total = vec3(noise1, noise2, noise3) / (noise1 + noise2 + noise3);

    vec3 sampled = texture(u_texture_grunge, v_screenCoord * .5).xyz;
    // float thing = dot(total, sampled) * 2.2;
    // float thing = mix(sampled.r, sampled.g, noise1) * 1.2;
    float thing1 = mix(sampled.r, sampled.g, smoothstep(.1, .7, noise1));
    float thing2 = mix(sampled.b, 0.1, smoothstep(.1, .7, noise2));
    float thing3 = mix(thing1, thing2, smoothstep(.1, .7, noise3));
    vec3 result = vec3(thing3,thing3-.025,thing3+.025);
    FragColor = vec4(.9 + (result + border * .8), 1.0);
    // FragColor = vec4(total, 1.0);
    // FragColor = vec4(border, border, border, 1.0);

    vec3 _sample = texture(u_texture, v_texCoord).rgb;
    float sigDist = median(_sample.r, _sample.g, _sample.b) - 0.5;
    float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
    FragColor *= alpha;

    // Output to screen
    // FragColor = vec4(mix(vec3(.1843, .3098, .3098), vec3(.149, .2471, .2471), noise), 1.0);
    // vec4 color0 = texture(u_texture, v_texCoord * .5);
    // FragColor = vec4(mix(color0, color1, noise1), 1.0);
}`;
var FontEffect = class extends import_effect2.default {
  get vertexCode() {
    return vertexShader2;
  }
  get fragmentCode() {
    return fragmentShader2;
  }
  get uniformTypes() {
    return {
      "u_texture_grunge": { type: import_effect2.default.UniformTypes.Texture, bind: "u_texture_grunge" },
      "u_texture": { type: import_effect2.default.UniformTypes.Texture, bind: import_effect2.default.UniformBinds.MainTexture },
      "u_projection": { type: import_effect2.default.UniformTypes.Matrix, bind: import_effect2.default.UniformBinds.Projection },
      "u_world": { type: import_effect2.default.UniformTypes.Matrix, bind: import_effect2.default.UniformBinds.World },
      "u_time": { type: import_effect2.default.UniformTypes.Float, bind: "u_time" },
      "u_aspect_ratio": { type: import_effect2.default.UniformTypes.Float, bind: "u_aspect_ratio" }
    };
  }
  get attributeTypes() {
    return {
      "a_position": { size: 3, type: import_effect2.default.AttributeTypes.Float, normalize: false, bind: import_effect2.default.AttributeBinds.Position },
      "a_coord": { size: 2, type: import_effect2.default.AttributeTypes.Float, normalize: false, bind: import_effect2.default.AttributeBinds.TextureCoords }
    };
  }
};

// src/main.ts
var CONFIG = {
  post_merge_speed: 750,
  player_speed: 355,
  enemy_speed: 150,
  min_enemy_dist: 170,
  separation_strength: 350,
  dash_duration: 0.07,
  dash_cooldown: 0.3,
  dash_speed: 2600,
  tail_frames: 20,
  dash_dist: 250,
  player_turn_speed_radians: 3,
  enemy_radius: 35,
  enemy_throwback_dist: 100,
  enemy_throwback_speed: 700,
  enemy_second_hit_dist: 185,
  enemy_acc: 600,
  enemy_friction: 2.5,
  dodge_acc: 1500,
  dodge_prevision_time: 0.5,
  dodge_prevision_dot: 0.15,
  invincible_time: 0.3,
  player_acc: 8e3,
  player_friction: 12,
  grab_dist: 20,
  ray_radius: 10,
  dash_hit_duration: 0.25,
  player_radius: 25,
  stun_generosity: 0.75,
  dash_dir_override: 5,
  screen_shake_size: 33,
  screen_shake_speed: 21,
  hit_slowdown: 0.3,
  steer_resolution: 64,
  debug_steer: 0.1,
  bullet_speed: 200,
  bullet_radius: 30,
  turret_delay: 3,
  delayed_rot_speed: 1,
  spawn_time: 0.2,
  stun_time: 0.5,
  enemy_stun_time: 0.8
};
var gui = new GUI$1({});
gui.remember(CONFIG);
gui.add(CONFIG, "player_speed", 100, 400);
gui.add(CONFIG, "enemy_speed", 100, 400);
gui.add(CONFIG, "min_enemy_dist", 0, 200);
gui.add(CONFIG, "separation_strength", 1, 2e3);
gui.add(CONFIG, "dash_duration", 0, 0.5);
gui.add(CONFIG, "dash_cooldown", 0, 2);
gui.add(CONFIG, "dash_speed", 300, 3200);
gui.add(CONFIG, "tail_frames", 0, 59);
gui.add(CONFIG, "dash_dist", 0, 400);
gui.add(CONFIG, "player_turn_speed_radians", 0, 20);
gui.add(CONFIG, "enemy_throwback_dist", 0, 500);
gui.add(CONFIG, "enemy_throwback_speed", 0, 2e3);
gui.add(CONFIG, "enemy_second_hit_dist", 0, 500);
gui.add(CONFIG, "enemy_acc", 0, 1e3);
gui.add(CONFIG, "enemy_friction", 0, 50);
gui.add(CONFIG, "dodge_acc", 0, 2e3);
gui.add(CONFIG, "dodge_prevision_time", 0, 1);
gui.add(CONFIG, "dodge_prevision_dot", 0, 1);
gui.add(CONFIG, "player_acc", 0, 8e3);
gui.add(CONFIG, "player_friction", 0, 50);
gui.add(CONFIG, "grab_dist", 0, 50);
gui.add(CONFIG, "dash_hit_duration", 0, 1);
gui.add(CONFIG, "dash_dir_override", 0, 5);
gui.add(CONFIG, "screen_shake_size", 0, 100);
gui.add(CONFIG, "screen_shake_speed", 0, 100);
gui.add(CONFIG, "hit_slowdown", 0, 1);
gui.add(CONFIG, "debug_steer", 0, 1);
gui.add(CONFIG, "bullet_speed", 0, 1e3);
gui.add(CONFIG, "turret_delay", 0, 10);
gui.hide();
import_shaku.default.input.setTargetElement(() => import_shaku.default.gfx.canvas);
await import_shaku.default.init([import_shaku.default.assets, import_shaku.default.sfx, import_shaku.default.gfx, import_shaku.default.input]);
document.body.appendChild(import_shaku.default.gfx.canvas);
import_shaku.default.gfx.maximizeCanvasSize(false, false);
var SCALING = import_shaku.default.gfx.getCanvasSize().y / 937;
CONFIG.enemy_radius *= SCALING;
CONFIG.player_radius *= SCALING;
CONFIG.ray_radius *= SCALING;
CONFIG.dash_dist *= SCALING;
CONFIG.min_enemy_dist *= SCALING;
CONFIG.enemy_throwback_speed *= SCALING;
CONFIG.enemy_throwback_dist *= SCALING;
CONFIG.enemy_second_hit_dist *= SCALING;
CONFIG.enemy_speed *= SCALING;
CONFIG.player_speed *= SCALING;
CONFIG.screen_shake_size *= SCALING;
CONFIG.dodge_acc *= SCALING;
CONFIG.enemy_acc *= SCALING;
CONFIG.player_acc *= SCALING;
CONFIG.separation_strength *= SCALING;
CONFIG.post_merge_speed *= SCALING;
var muted = false;
var paused = true;
var in_win_screen = false;
var animators = [];
var COLOR_BACKGROUND = new import_color.default(0.2, 0.195, 0.205);
var logo_font = import_shaku.default.assets.loadMsdfFontTexture("fonts/ZenDots.ttf", { jsonUrl: "fonts/ZenDots.json", textureUrl: "fonts/ZenDots.png" }).asset;
var SoundCollection = class {
  instances;
  constructor(sources) {
    this.instances = sources.map((x) => import_shaku.default.sfx.createSound(x));
  }
  play() {
    if (muted)
      return;
    let options = this.instances.filter((x) => !x.playing);
    if (options.length === 0) {
      let cur = choice(this.instances);
      cur.stop();
      cur.play();
    } else {
      let cur = choice(options);
      cur.play();
    }
  }
};
var wood_merge_srcs = ["sounds/wood_merge_1.mp3", "sounds/wood_merge_2.mp3", "sounds/wood_merge_3.mp3"].map((x) => import_shaku.default.assets.loadSound(x).asset);
var wood_touch_srcs = ["sounds/wood_touch_1.mp3", "sounds/wood_touch_2.mp3", "sounds/wood_touch_3.mp3"].map((x) => import_shaku.default.assets.loadSound(x).asset);
var wood_crash_srcs = ["sounds/wood_crash_1.mp3", "sounds/wood_crash_2.mp3", "sounds/wood_crash_3.mp3"].map((x) => import_shaku.default.assets.loadSound(x).asset);
var metal_merge_srcs = ["sounds/metal_merge_1.mp3", "sounds/metal_merge_2.mp3", "sounds/metal_merge_3.mp3"].map((x) => import_shaku.default.assets.loadSound(x).asset);
var metal_touch_srcs = ["sounds/metal_touch_1.mp3", "sounds/metal_touch_2.mp3", "sounds/metal_touch_3.mp3"].map((x) => import_shaku.default.assets.loadSound(x).asset);
var metal_crash_srcs = ["sounds/metal_crash_1.mp3", "sounds/metal_crash_2.mp3", "sounds/metal_crash_3.mp3"].map((x) => import_shaku.default.assets.loadSound(x).asset);
var cursor_texture = import_shaku.default.assets.loadTexture("imgs/cursor.png", { generateMipMaps: true }).asset;
var enemy_atlas_texture = import_shaku.default.assets.loadTexture("imgs/enemies.png", { generateMipMaps: true }).asset;
var player_tail_texture = import_shaku.default.assets.loadTexture("imgs/trail_particle.png", { generateMipMaps: true }).asset;
var merge_particle_texture = import_shaku.default.assets.loadTexture("imgs/merge_particle.png", { generateMipMaps: true }).asset;
var background_texture = import_shaku.default.assets.loadTexture("imgs/background.png", { generateMipMaps: true }).asset;
await import_shaku.default.assets.waitForAll();
cursor_texture.filter = import_gfx.TextureFilterModes.Linear;
var cursor_sprite = new import_sprite.default(cursor_texture);
cursor_sprite.size.mulSelf(SCALING);
enemy_atlas_texture.filter = import_gfx.TextureFilterModes.Linear;
var player_sprite = new import_shaku.default.gfx.Sprite(enemy_atlas_texture);
player_sprite.setSourceFromSpritesheet(new import_vector2.default(2, 3), new import_vector2.default(3, 4), 0, true);
player_sprite.size.mulSelf(CONFIG.player_radius / 50);
player_tail_texture.filter = import_gfx.TextureFilterModes.Linear;
var player_tail_sprite = new import_shaku.default.gfx.Sprite(player_tail_texture);
player_tail_sprite.color = new import_color.default(1, 1, 1, 0.5);
merge_particle_texture.filter = import_gfx.TextureFilterModes.Linear;
background_texture.filter = import_gfx.TextureFilterModes.Linear;
background_texture.wrapMode = import_gfx.TextureWrapModes.Repeat;
var FULL_SCREEN_SPRITE = new import_sprite.default(import_shaku.default.gfx.whiteTexture);
FULL_SCREEN_SPRITE.origin = import_vector2.default.zero;
FULL_SCREEN_SPRITE.size = import_shaku.default.gfx.getCanvasSize();
var board_h = FULL_SCREEN_SPRITE.size.y * 0.8 - 10;
var board_w = FULL_SCREEN_SPRITE.size.y * (4 / 3 - 0.2) - 10;
var board_area = new import_rectangle.default(FULL_SCREEN_SPRITE.size.x / 2 - board_w / 2, FULL_SCREEN_SPRITE.size.y / 2 - board_h / 2, board_w, board_h);
var wood_merge_sound = new SoundCollection(wood_merge_srcs);
var wood_touch_sound = new SoundCollection(wood_touch_srcs);
var wood_crash_sound = new SoundCollection(wood_crash_srcs);
var metal_merge_sound = new SoundCollection(metal_merge_srcs);
var metal_touch_sound = new SoundCollection(metal_touch_srcs);
var metal_crash_sound = new SoundCollection(metal_crash_srcs);
var background_effect = import_shaku.default.gfx.createEffect(BackgroundEffect);
import_shaku.default.gfx.useEffect(background_effect);
background_effect.uniforms["u_texture"](background_texture, 4);
background_effect.uniforms["u_aspect_ratio"](FULL_SCREEN_SPRITE.size.x / FULL_SCREEN_SPRITE.size.y);
background_effect.uniforms["u_alpha"](1);
var font_effect = import_shaku.default.gfx.createEffect(FontEffect);
import_shaku.default.gfx.useEffect(font_effect);
font_effect.uniforms["u_texture_grunge"](background_texture, 4);
font_effect.uniforms["u_aspect_ratio"](FULL_SCREEN_SPRITE.size.x / FULL_SCREEN_SPRITE.size.y);
import_shaku.default.gfx.useEffect(null);
function addSteer(steer, fn) {
  for (let k = 0; k < CONFIG.steer_resolution; k++) {
    steer[k] += fn(import_vector2.default.fromRadians(Math.PI * 2 * k / CONFIG.steer_resolution));
  }
}
function bestDir(steer) {
  let best_index = argmax(steer);
  return import_vector2.default.fromRadians(Math.PI * 2 * best_index / CONFIG.steer_resolution).mulSelf(steer[best_index]);
}
var rules = [
  [[0 /* C */, 1 /* M */], [3 /* CM */, 9 /* P1 */]],
  [[1 /* M */, 2 /* Y */], [4 /* MY */, 9 /* P1 */]],
  [[2 /* Y */, 0 /* C */], [5 /* YC */, 9 /* P1 */]],
  [[0 /* C */, 0 /* C */], [6 /* CC */, 9 /* P1 */]],
  [[2 /* Y */, 2 /* Y */], [8 /* YY */, 9 /* P1 */]],
  [[1 /* M */, 1 /* M */], [7 /* MM */, 9 /* P1 */]],
  [[0 /* C */, 6 /* CC */], [4 /* MY */, 10 /* P2 */]],
  [[2 /* Y */, 8 /* YY */], [3 /* CM */, 10 /* P2 */]],
  [[1 /* M */, 7 /* MM */], [5 /* YC */, 10 /* P2 */]],
  [[0 /* C */, 4 /* MY */], [6 /* CC */, 10 /* P2 */]],
  [[2 /* Y */, 3 /* CM */], [8 /* YY */, 10 /* P2 */]],
  [[1 /* M */, 5 /* YC */], [7 /* MM */, 10 /* P2 */]]
];
function combine(a, b) {
  let input = [a, b];
  for (let k = 0; k < rules.length; k++) {
    let cur_rule = rules[k];
    if (sameShips(input, cur_rule[0])) {
      return cur_rule[1];
    }
    if (sameShips(input, cur_rule[1])) {
      return cur_rule[0];
    }
  }
  return null;
}
function sameShips(a, b) {
  return a[0] === b[0] && a[1] === b[1] || a[0] === b[1] && a[1] === b[0];
}
function setSpriteToType(spr, x) {
  let n = [
    1 /* M */,
    2 /* Y */,
    0 /* C */,
    7 /* MM */,
    8 /* YY */,
    6 /* CC */,
    5 /* YC */,
    3 /* CM */,
    4 /* MY */,
    9 /* P1 */,
    10 /* P2 */,
    11 /* P3 */
  ].indexOf(x);
  spr.setSourceFromSpritesheet(
    new import_vector2.default(n % 3, Math.floor(n / 3)),
    new import_vector2.default(3, 4),
    0,
    true
  );
  spr.size.mulSelf(CONFIG.enemy_radius / 50);
  if (x === 9 /* P1 */) {
    spr.size.mulSelf(1.3);
  }
}
var Enemy = class {
  constructor(pos) {
    this.pos = pos;
    this.sprite = new import_shaku.default.gfx.Sprite(enemy_atlas_texture);
    this.sprite.size.mulSelf(CONFIG.enemy_radius / 50);
    this.dir = import_vector2.default.random;
    this.vel = import_vector2.default.zero;
    this.steer = Array(CONFIG.steer_resolution).fill(0);
    this.sprite.position = pos;
    this.ship_type = 0 /* C */;
    this.setType(this.ship_type);
    this.flying = false;
    this.friction = 1;
    this.acc = 1;
    this.hoverForce = 1;
    this.dodgeForce = 1;
    this.dodgeTime = 1;
  }
  sprite;
  vel;
  dir;
  steer;
  ship_type;
  flying;
  friction;
  acc;
  hoverForce;
  dodgeForce;
  dodgeTime;
  setType(x) {
    this.ship_type = x;
    setSpriteToType(this.sprite, x);
  }
  steer_chaseDir(target_dir, acc) {
    addSteer(this.steer, (v) => {
      return (import_vector2.default.dot(v, target_dir) + 1) * 0.5 * acc;
    });
  }
  steer_chasePlayer(acc) {
    let player_dir2 = player_pos.sub(this.pos).normalizeSelf();
    if (enemy_stun_time_remaining > 0) {
      player_dir2.mulSelf(-0.25);
    }
    this.steer_chaseDir(player_dir2, acc);
  }
  steer_hoverAndDodge() {
    enemies.forEach((other) => {
      if (other === this)
        return;
      let delta = this.pos.sub(other.pos);
      let delta_len = delta.length;
      let delta_dir = delta.normalized();
      if (delta_len < CONFIG.min_enemy_dist) {
        addSteer(this.steer, (v) => {
          return (1 - Math.abs(import_vector2.default.dot(v, delta_dir) - 0.65)) * this.hoverForce * CONFIG.separation_strength * lerp(2, 0, delta_len / CONFIG.min_enemy_dist);
        });
      }
      let other_speed = other.vel.length;
      let other_dir = other.vel.mul(1 / other_speed);
      if (other_speed > this.vel.length * 1.5 && import_vector2.default.dot(delta_dir, other.vel.normalized()) > CONFIG.dodge_prevision_dot) {
        let remaining_time = delta_len / other_speed;
        if (remaining_time < CONFIG.dodge_prevision_time * this.dodgeTime) {
          let closest_dist_along_ray = import_vector2.default.dot(other_dir, delta);
          let closest_point_along_ray = other_dir.mul(closest_dist_along_ray).subSelf(delta);
          if (closest_point_along_ray.length < CONFIG.enemy_radius * 3) {
            let dodge_dir = closest_point_along_ray.mul(-1).normalizeSelf();
            addSteer(this.steer, (v) => {
              let dot = import_vector2.default.dot(v, dodge_dir);
              if (dot > 0.5) {
                return (dot - 0.5) * 2 * CONFIG.dodge_acc * this.dodgeForce;
              } else if (dot < -0.5) {
                return (dot + 0.5) * 2 * CONFIG.dodge_acc * this.dodgeForce;
              } else {
                return 0;
              }
            });
          }
        }
      }
    });
  }
  endUpdate(dt) {
    this.vel.addSelf(bestDir(this.steer).mulSelf(dt));
    this.vel.mulSelf(1 / (1 + dt * this.friction * CONFIG.enemy_friction));
    this.pos.addSelf(this.vel.mul(dt));
    this.bounce();
    if (this.vel.x !== 0 || this.vel.y !== 0) {
      this.dir.copy(this.vel).normalizeSelf();
    }
  }
  bounce() {
    if (this.pos.x < board_area.left) {
      this.vel.x *= -1;
      this.pos.x += (board_area.left - this.pos.x) * 2;
    } else if (this.pos.x > board_area.right) {
      this.vel.x *= -1;
      this.pos.x += (board_area.right - this.pos.x) * 2;
    } else if (this.pos.y < board_area.top) {
      this.vel.y *= -1;
      this.pos.y += (board_area.top - this.pos.y) * 2;
    } else if (this.pos.y > board_area.bottom) {
      this.vel.y *= -1;
      this.pos.y += (board_area.bottom - this.pos.y) * 2;
    }
  }
  update(dt) {
    this.steer.fill(0);
    this.steer_chasePlayer(CONFIG.enemy_acc * this.acc);
    this.steer_hoverAndDodge();
    this.endUpdate(dt);
  }
  draw() {
    this.sprite.rotation = this.dir.getRadians();
    import_shaku.default.gfx.drawSprite(this.sprite);
  }
};
var time_since_dash = Infinity;
var last_dash_pos = import_vector2.default.zero;
var last_dash_dir = import_vector2.default.zero;
var last_dash_dist = 0;
var last_enemy_dash_pos = import_vector2.default.zero;
var last_enemy_dash_dir = import_vector2.default.zero;
var last_enemy_dash_dist = 0;
var last_dash_hit_enemy = null;
var cur_hit = null;
var player_pos = import_shaku.default.gfx.getCanvasSize().mulSelf(0.5);
var player_dir = import_vector2.default.right;
var player_vel = import_vector2.default.right.mulSelf(CONFIG.player_speed);
var player_stun_time_remaining = 0;
var enemy_stun_time_remaining = 0;
var player_pos_history = new import_double_ended_queue.default(60);
while (player_pos_history.length < CONFIG.tail_frames) {
  player_pos_history.insertFront([0, import_vector2.default.zero]);
}
var screen_shake_noise = new import_perlin.default(Math.random());
var enemies = [];
var bullets = [];
var spawn_sprites = [];
var cur_level_n = -1;
var menu_level_n = 0;
var menu_vertical = -1;
var levels = [
  [[0 /* C */, 0 /* C */, 7 /* MM */], [6 /* CC */, 1 /* M */, 1 /* M */]],
  [[7 /* MM */, 8 /* YY */, 9 /* P1 */, 9 /* P1 */], [4 /* MY */, 4 /* MY */, 9 /* P1 */, 9 /* P1 */]],
  [[0 /* C */, 0 /* C */, 0 /* C */], [2 /* Y */, 1 /* M */, 10 /* P2 */]],
  [[0 /* C */, 2 /* Y */, 1 /* M */], [2 /* Y */, 2 /* Y */, 10 /* P2 */]],
  [[1 /* M */, 1 /* M */, 10 /* P2 */], [0 /* C */, 0 /* C */, 10 /* P2 */]],
  [[0 /* C */, 2 /* Y */, 10 /* P2 */, 10 /* P2 */], [1 /* M */, 1 /* M */, 0 /* C */, 2 /* Y */]],
  [[1 /* M */, 1 /* M */, 1 /* M */, 2 /* Y */], [6 /* CC */, 1 /* M */, 2 /* Y */, 9 /* P1 */]],
  [[0 /* C */, 1 /* M */, 2 /* Y */, 10 /* P2 */], [6 /* CC */, 6 /* CC */, 9 /* P1 */, 9 /* P1 */]],
  [[8 /* YY */, 8 /* YY */, 6 /* CC */, 9 /* P1 */], [5 /* YC */, 3 /* CM */, 4 /* MY */, 9 /* P1 */]],
  [[2 /* Y */, 2 /* Y */, 2 /* Y */, 2 /* Y */], [0 /* C */, 0 /* C */, 0 /* C */, 0 /* C */]],
  [[1 /* M */, 1 /* M */, 1 /* M */, 2 /* Y */], [1 /* M */, 2 /* Y */, 2 /* Y */, 2 /* Y */]],
  [[6 /* CC */, 8 /* YY */, 10 /* P2 */, 10 /* P2 */], [6 /* CC */, 7 /* MM */, 10 /* P2 */, 10 /* P2 */]],
  [[6 /* CC */, 8 /* YY */, 7 /* MM */, 9 /* P1 */, 9 /* P1 */], [6 /* CC */, 6 /* CC */, 6 /* CC */, 9 /* P1 */, 9 /* P1 */]],
  [[0 /* C */, 1 /* M */, 10 /* P2 */, 10 /* P2 */], [0 /* C */, 0 /* C */, 0 /* C */, 1 /* M */]],
  [[0 /* C */, 0 /* C */, 1 /* M */, 1 /* M */, 2 /* Y */], [2 /* Y */, 2 /* Y */, 2 /* Y */, 2 /* Y */, 2 /* Y */]],
  [[5 /* YC */, 5 /* YC */, 9 /* P1 */, 7 /* MM */, 10 /* P2 */, 10 /* P2 */], [8 /* YY */, 6 /* CC */, 9 /* P1 */, 7 /* MM */, 10 /* P2 */, 10 /* P2 */]]
];
var initial_types = [];
var target_types = [];
var target_types_sprites = [];
var outdated_types_sprites = [];
var logo_text = import_shaku.default.gfx.buildText(logo_font, "Catalyst", 178 * SCALING, import_color.default.white, import_gfx.TextAlignments.Center);
logo_text.position = import_shaku.default.gfx.getCanvasSize().mul(0.5, 0.125);
var thanks_text = import_shaku.default.gfx.buildText(logo_font, "Thanks for\nplaying!", 138 * SCALING, import_color.default.white, import_gfx.TextAlignments.Center);
thanks_text.position = import_shaku.default.gfx.getCanvasSize().mul(0.5, 0.12);
var thanks_2_text = import_shaku.default.gfx.buildText(logo_font, "- knexator", 48 * SCALING, import_color.default.white, import_gfx.TextAlignments.Center);
thanks_2_text.position = import_shaku.default.gfx.getCanvasSize().mul(0.5, 0.5);
thanks_2_text.position.x += SCALING * 225;
var start_text = import_shaku.default.gfx.buildText(logo_font, "Start", 120 * SCALING, import_color.default.white, import_gfx.TextAlignments.Center);
start_text.position = import_shaku.default.gfx.getCanvasSize().mul(0.5, 0.5);
var continue_text = import_shaku.default.gfx.buildText(logo_font, "Continue", 100 * SCALING, import_color.default.white, import_gfx.TextAlignments.Center);
continue_text.position = import_shaku.default.gfx.getCanvasSize().mul(0.5, 0.45);
var restart_text = import_shaku.default.gfx.buildText(logo_font, "Restart", 100 * SCALING, import_color.default.white, import_gfx.TextAlignments.Center);
restart_text.position = import_shaku.default.gfx.getCanvasSize().mul(0.5, 0.6);
var level_n_text = [];
for (let k = 0; k < levels.length; k++) {
  let cur = import_shaku.default.gfx.buildText(logo_font, `Level ${k + 1}`, 54 * SCALING, import_color.default.white, import_gfx.TextAlignments.Center);
  cur.position = import_shaku.default.gfx.getCanvasSize().mul(0.5, 0.75);
  level_n_text.push(cur);
}
var arrow_right_text = import_shaku.default.gfx.buildText(logo_font, ">", 54 * SCALING, import_color.default.white, import_gfx.TextAlignments.Center);
arrow_right_text.position = import_shaku.default.gfx.getCanvasSize().mul(0.5, 0.75);
arrow_right_text.position.x += SCALING * 175;
var arrow_right_text_x = arrow_right_text.position.x;
var arrow_left_text = import_shaku.default.gfx.buildText(logo_font, "<", 54 * SCALING, import_color.default.white, import_gfx.TextAlignments.Center);
arrow_left_text.position = import_shaku.default.gfx.getCanvasSize().mul(0.5, 0.75);
arrow_left_text.position.x -= SCALING * 175;
var arrow_left_text_x = arrow_left_text.position.x;
var pause_menu_types_sprites = levels.map(([initial, target]) => {
  let smaller = 0.8;
  let res = [];
  initial.forEach((x, k) => {
    let cur = new import_shaku.default.gfx.Sprite(enemy_atlas_texture);
    setSpriteToType(cur, x);
    cur.size.mulSelf(smaller);
    cur.position = board_area.getBottomLeft().addSelf((k + 0.5) * CONFIG.enemy_radius * 2.5 * smaller, -CONFIG.enemy_radius * smaller);
    cur.rotation = Math.PI;
    res.push(cur);
  });
  target.forEach((x, k) => {
    let cur = new import_shaku.default.gfx.Sprite(enemy_atlas_texture);
    setSpriteToType(cur, x);
    cur.size.mulSelf(smaller);
    cur.position = board_area.getBottomRight().addSelf(-(k + 0.5) * CONFIG.enemy_radius * 2.5 * smaller, -CONFIG.enemy_radius * smaller);
    res.push(cur);
  });
  return res;
});
var level_ended = false;
function updateCompletedTargets() {
  level_ended = enemies.length === target_types_sprites.length;
  let existing = enemies.map((x) => x.ship_type);
  console.log("existing: ", existing);
  target_types_sprites.forEach((x, k) => {
    let existing_index = existing.indexOf(target_types[k]);
    if (existing_index !== -1) {
      existing.splice(existing_index, 1);
      x.color = new import_color.default(1, 1, 1, 0.5);
    } else {
      x.color = new import_color.default(1, 1, 1, 1);
      level_ended = false;
    }
  });
}
function fastSpawnEnemy(x, pos) {
  let enemy_class = Enemy;
  let enemy = new enemy_class(pos);
  enemy.setType(x);
  switch (x) {
    case 0 /* C */:
    case 1 /* M */:
    case 2 /* Y */:
      enemy.friction = 1.25;
      enemy.acc = 1.25;
      break;
    case 10 /* P2 */:
      enemy.friction = 1;
      enemy.acc = 1;
      break;
    case 9 /* P1 */:
      enemy.friction = 2;
      enemy.acc = 1;
      break;
    default:
      enemy.dodgeForce = 1.2;
      enemy.dodgeTime = 1.2;
      enemy.hoverForce = 1.2;
      enemy.friction = 0.7;
      enemy.acc = 0.85;
      break;
  }
  enemies.push(enemy);
  return enemy;
}
function spawnEnemy(x, delay) {
  animators.push(new import_animator.default(null).duration(delay).then(() => {
    let pos = new import_vector2.default(Math.random(), Math.random()).mulSelf(board_area.getSize()).addSelf(board_area.getTopLeft());
    while (pos.distanceTo(player_pos) < SCALING * CONFIG.player_radius * 4) {
      pos = new import_vector2.default(Math.random(), Math.random()).mulSelf(board_area.getSize()).addSelf(board_area.getTopLeft());
    }
    let spawn_sprite = new import_sprite.default(merge_particle_texture);
    spawn_sprite.position.copy(pos);
    spawn_sprite.setSourceFromSpritesheet(
      new import_vector2.default(0, 0),
      new import_vector2.default(3, 3),
      0,
      true
    );
    spawn_sprite.size.mulSelf(1.7 * SCALING);
    spawn_sprites.push(spawn_sprite);
    let spawned = false;
    animators.push(new import_animator.default(spawn_sprite).duration(CONFIG.spawn_time).onUpdate((t) => {
      let n = Math.floor(t * 9);
      spawn_sprite.setSourceFromSpritesheet(
        new import_vector2.default(n % 3, Math.floor(n / 3)),
        new import_vector2.default(3, 3),
        0,
        true
      );
      spawn_sprite.size.mulSelf(1.7 * SCALING);
      if (!spawned && t > 0.5) {
        spawned = true;
        fastSpawnEnemy(x, pos);
      }
    }).then(() => {
      spawn_sprites = spawn_sprites.filter((y) => y !== spawn_sprite);
    }));
  }));
}
function unloadCurrentEnemies() {
  enemies = [];
}
function loadLevel(n, regenerate_targets = true) {
  level_ended = false;
  in_win_screen = false;
  let also_end_prev_level = regenerate_targets && target_types_sprites.length > 0;
  if (also_end_prev_level) {
    outdated_types_sprites = [...target_types_sprites];
    outdated_types_sprites.forEach((x, k) => {
      animators.push(new import_animator.default(x).to(
        { "position.y": import_shaku.default.gfx.getCanvasSize().y + CONFIG.enemy_radius * 3 }
      ).duration(0.75 - k * 0.04).delay((outdated_types_sprites.length - k) * 0.1).smoothDamp(true));
    });
  }
  initial_types = levels[n][0];
  target_types = levels[n][1];
  initial_types.forEach((x, k) => {
    spawnEnemy(x, k * 0.1);
  });
  if (regenerate_targets) {
    target_types_sprites = target_types.map((x, k) => {
      let res = new import_shaku.default.gfx.Sprite(enemy_atlas_texture);
      setSpriteToType(res, x);
      res.position.set(board_area.x + board_area.width + CONFIG.enemy_radius * 3, -CONFIG.enemy_radius * 3);
      animators.push(new import_animator.default(res).to(
        { "position.y": board_area.y + (k + 0.5) * CONFIG.enemy_radius * 3 }
      ).duration(0.75 - k * 0.02).delay((also_end_prev_level ? 1 : 0) + (target_types.length - k) * 0.03).smoothDamp(true));
      return res;
    });
  }
}
function playTouchSound(x) {
  switch (x) {
    case 9 /* P1 */:
    case 10 /* P2 */:
      metal_touch_sound.play();
      console.log("playing metal_touch_sound");
      break;
    default:
      wood_touch_sound.play();
      console.log("playing wood_touch_sound");
      break;
  }
}
function playMergeSound(x1, x2) {
  if (x1 === 9 /* P1 */ || x1 === 10 /* P2 */ || x2 === 9 /* P1 */ || x2 === 10 /* P2 */) {
    metal_merge_sound.play();
    console.log("playing metal_merge_sound");
  } else {
    wood_merge_sound.play();
    console.log("playing wood_merge_sound");
  }
}
function playCrashSound(x1, x2) {
  if (x1 === 9 /* P1 */ || x1 === 10 /* P2 */ || x2 === 9 /* P1 */ || x2 === 10 /* P2 */) {
    metal_crash_sound.play();
    console.log("playing metal_crash_sound");
  } else {
    wood_crash_sound.play();
    console.log("playing wood_crash_sound");
  }
}
function rayEnemiesCollision(pos, dir, ray_dist, ray_radius, exclude) {
  let best_dist = Infinity;
  let best_enemy = -1;
  for (let k = 0; k < enemies.length; k++) {
    const cur_enemy = enemies[k];
    if (cur_enemy === exclude)
      continue;
    let closest_dist_along_ray = import_vector2.default.dot(dir, cur_enemy.pos.sub(pos));
    if (closest_dist_along_ray < 0 || closest_dist_along_ray >= CONFIG.enemy_radius + ray_radius + ray_dist) {
      continue;
    }
    let closest_point_along_ray = pos.add(dir.mul(closest_dist_along_ray));
    let closest_dist_to_enemy = import_vector2.default.distance(closest_point_along_ray, cur_enemy.pos);
    if (closest_dist_to_enemy < CONFIG.enemy_radius + ray_radius) {
      let helper = CONFIG.enemy_radius + ray_radius;
      let dt = Math.sqrt(helper * helper - closest_dist_to_enemy * closest_dist_to_enemy);
      let collision_dist = closest_dist_along_ray - dt;
      if (collision_dist > 0 && collision_dist <= ray_dist) {
        if (collision_dist < best_dist) {
          best_dist = collision_dist;
          best_enemy = k;
        }
      }
    }
  }
  if (best_enemy === -1)
    return null;
  return {
    hit_dist: best_dist,
    hit_enemy: enemies[best_enemy]
  };
}
function drawGame() {
  if (cur_hit !== null) {
    let original_size = cur_hit.hitter.sprite.size.clone();
    cur_hit.hitter.sprite.size.copy(player_sprite.size.mul(0.85));
    for (let k = last_enemy_dash_dist * 0.5; k < last_enemy_dash_dist * 1.25; k += 4) {
      cur_hit.hitter.sprite.color = new import_color.default(0.65, 0.65, 0.65, clamp(k / (1.5 * last_enemy_dash_dist) - 0.2 * (time_since_dash / CONFIG.dash_duration), 0, 1));
      cur_hit.hitter.sprite.position.copy(last_enemy_dash_pos.add(last_enemy_dash_dir.mul(k)));
      import_shaku.default.gfx.drawSprite(cur_hit.hitter.sprite);
    }
    cur_hit.hitter.sprite.size.copy(original_size);
    cur_hit.hitter.sprite.color = import_color.default.white;
  }
  target_types_sprites.forEach((x) => import_shaku.default.gfx.drawSprite(x));
  outdated_types_sprites.forEach((x) => import_shaku.default.gfx.drawSprite(x));
  enemies.forEach((x) => x.draw());
  bullets.forEach((x) => x.draw());
  spawn_sprites.forEach((x) => import_shaku.default.gfx.drawSprite(x));
  if (cur_hit !== null && cur_hit.merge) {
    let t = cur_hit.time_until_end / CONFIG.dash_hit_duration;
    t = remap(t, 0.9, 0, 0, 1);
    t = Math.floor(t * 9);
    if (t >= 0) {
      cur_hit.particle.setSourceFromSpritesheet(
        new import_vector2.default(t % 3, Math.floor(t / 3)),
        new import_vector2.default(3, 3),
        0,
        true
      );
      cur_hit.particle.size.mulSelf(1.7 * SCALING);
      import_shaku.default.gfx.drawSprite(cur_hit.particle);
    }
  }
  player_tail_sprite.size.copy(player_sprite.size.mul(0.5));
  for (let k = 0; k < CONFIG.tail_frames; k++) {
    let cur = player_pos_history.get(k);
    player_tail_sprite.size.mulSelf(0.9);
    player_tail_sprite.position.copy(cur[1]);
    player_tail_sprite.color = new import_color.default(1, 1, 1, cur[0]);
    import_shaku.default.gfx.drawSprite(player_tail_sprite);
  }
  import_shaku.default.gfx.drawSprite(player_sprite);
}
function updateAnimators(delta) {
  for (let i = animators.length - 1; i >= 0; --i) {
    animators[i].update(delta);
    if (animators[i].ended) {
      animators.splice(i, 1);
    }
  }
}
function step() {
  import_shaku.default.startFrame();
  import_shaku.default.gfx.clear(COLOR_BACKGROUND);
  cursor_sprite.position.copy(import_shaku.default.input.mousePosition);
  import_shaku.default.gfx.useEffect(background_effect);
  background_effect.uniforms.u_time(import_shaku.default.gameTime.elapsed);
  background_effect.uniforms["u_alpha"](1);
  import_shaku.default.gfx.drawSprite(FULL_SCREEN_SPRITE);
  import_shaku.default.gfx.useEffect(null);
  if (cur_level_n !== -1 && import_shaku.default.input.pressed("escape")) {
    paused = !paused;
    menu_vertical = 0;
    menu_level_n = cur_level_n;
  }
  if (import_shaku.default.input.pressed("m")) {
    muted = !muted;
    document.querySelector("audio").muted = muted;
  }
  if (paused) {
    if (cur_level_n !== -1) {
      drawGame();
      import_shaku.default.gfx.useEffect(background_effect);
      background_effect.uniforms.u_alpha(0.5);
      import_shaku.default.gfx.drawSprite(FULL_SCREEN_SPRITE);
      import_shaku.default.gfx.useEffect(null);
    }
    updateAnimators(import_shaku.default.gameTime.delta * 2);
    let menu_horizontal = 0;
    if (cursor_sprite.position.x > import_shaku.default.gfx.getCanvasSize().x / 2 + 160 * SCALING) {
      menu_horizontal = 1;
    } else if (cursor_sprite.position.x < import_shaku.default.gfx.getCanvasSize().x / 2 - 160 * SCALING) {
      menu_horizontal = -1;
    }
    if (menu_vertical === 2 && menu_level_n < levels.length - 1) {
      if (import_shaku.default.input.pressed(["right", "d"]) || import_shaku.default.input.mousePressed() && menu_horizontal === 1) {
        menu_level_n += 1;
        level_n_text[menu_level_n].scale.x = Math.random() * 0.1 + 1.1;
        level_n_text[menu_level_n].scale.y = level_n_text[menu_level_n].scale.x;
        level_n_text[menu_level_n].rotation = 0.1;
        animators.push(new import_animator.default(level_n_text[menu_level_n]).to({ "scale.x": 1, "scale.y": 1, "rotation": 0 }).duration(0.1));
      }
    }
    if (menu_vertical === 2 && menu_level_n > 0) {
      if (import_shaku.default.input.pressed(["left", "a"]) || import_shaku.default.input.mousePressed() && menu_horizontal === -1) {
        menu_level_n -= 1;
        level_n_text[menu_level_n].scale.x = Math.random() * 0.2 + 1.1;
        level_n_text[menu_level_n].scale.y = level_n_text[menu_level_n].scale.x;
        level_n_text[menu_level_n].rotation = -0.1;
        animators.push(new import_animator.default(level_n_text[menu_level_n]).to({ "scale.x": 1, "scale.y": 1, "rotation": 0 }).duration(0.1));
      }
    }
    if (import_shaku.default.input.pressed(["up", "w"])) {
      menu_vertical = Math.max(menu_vertical - 1, 0);
    }
    if (import_shaku.default.input.pressed(["down", "s"])) {
      menu_vertical = Math.min(menu_vertical + 1, 2);
    }
    if (import_shaku.default.input.mouseMoving) {
      menu_vertical = cursor_sprite.position.y * SCALING < 565 ? 0 : cursor_sprite.position.y * SCALING < 695 ? 1 : 2;
    }
    let scale = Math.sin(import_shaku.default.gameTime.elapsed * 6) * 0.03 + 1;
    import_shaku.default.gfx.useEffect(font_effect);
    import_shaku.default.gfx.drawGroup(logo_text, false);
    if (cur_level_n === -1) {
      if (menu_vertical === 2) {
        start_text.scale.set(1, 1);
      } else {
        start_text.scale.set(scale, scale);
      }
      import_shaku.default.gfx.drawGroup(start_text, false);
    } else {
      if (menu_vertical === 0) {
        continue_text.scale.set(scale, scale);
        restart_text.scale.set(1, 1);
      } else if (menu_vertical === 1) {
        restart_text.scale.set(scale, scale);
        continue_text.scale.set(1, 1);
      }
      import_shaku.default.gfx.drawGroup(continue_text, false);
      import_shaku.default.gfx.drawGroup(restart_text, false);
    }
    level_n_text[menu_level_n].scale.set(1, 1);
    arrow_right_text.position.x = arrow_right_text_x;
    arrow_left_text.position.x = arrow_left_text_x;
    if (menu_vertical === 2) {
      if (menu_horizontal === 0) {
        level_n_text[menu_level_n].scale.set(scale, scale);
      } else if (menu_horizontal === 1) {
        arrow_right_text.position.x = arrow_right_text_x + (scale - 1) * 400;
      } else if (menu_horizontal === -1) {
        arrow_left_text.position.x = arrow_left_text_x - (scale - 1) * 400;
      }
    }
    import_shaku.default.gfx.drawGroup(level_n_text[menu_level_n], false);
    if (menu_level_n > 0) {
      import_shaku.default.gfx.drawGroup(arrow_left_text, false);
    }
    if (menu_level_n < levels.length - 1) {
      import_shaku.default.gfx.drawGroup(arrow_right_text, false);
    }
    import_shaku.default.gfx.useEffect(null);
    pause_menu_types_sprites[menu_level_n].forEach((x) => import_shaku.default.gfx.drawSprite(x));
    import_shaku.default.gfx.drawSprite(cursor_sprite);
    if (cur_level_n === -1) {
      if (import_shaku.default.input.pressed("space") || import_shaku.default.input.mousePressed() && (menu_vertical < 2 || menu_horizontal === 0)) {
        document.querySelector("audio").play();
        cur_level_n = menu_level_n;
        loadLevel(cur_level_n);
        paused = false;
      }
    } else {
      if (menu_vertical === 0) {
        if (import_shaku.default.input.pressed("space") || import_shaku.default.input.mousePressed()) {
          paused = false;
        }
      } else if (menu_vertical === 1) {
        if (import_shaku.default.input.pressed("space") || import_shaku.default.input.mousePressed()) {
          unloadCurrentEnemies();
          loadLevel(cur_level_n, false);
          paused = false;
        }
      } else if (menu_vertical === 2) {
        if (import_shaku.default.input.pressed("space") || import_shaku.default.input.mousePressed() && (menu_vertical < 2 || menu_horizontal === 0)) {
          unloadCurrentEnemies();
          cur_level_n = menu_level_n;
          loadLevel(cur_level_n);
          paused = false;
        }
      }
    }
    import_shaku.default.endFrame();
    import_shaku.default.requestAnimationFrame(step);
    return;
  }
  let dt = import_shaku.default.gameTime.delta;
  updateAnimators(dt);
  if (cur_hit !== null) {
    let shake_damp = cur_hit.time_until_end / CONFIG.dash_hit_duration;
    import_shaku.default.gfx.setCameraOrthographic(new import_vector2.default(
      shake_damp * (screen_shake_noise.generate(import_shaku.default.gameTime.elapsed * CONFIG.screen_shake_speed, 0, 1) - 0.5) * CONFIG.screen_shake_size,
      shake_damp * (screen_shake_noise.generate(import_shaku.default.gameTime.elapsed * CONFIG.screen_shake_speed, 1, 1) - 0.5) * CONFIG.screen_shake_size
    ));
    cur_hit.time_until_end -= import_shaku.default.gameTime.delta;
    dt *= CONFIG.hit_slowdown;
    if (cur_hit.starting) {
      dt *= 0.2;
      if (cur_hit.time_until_end / CONFIG.dash_hit_duration < 0.5) {
        cur_hit.starting = false;
        let new_types = combine(cur_hit.hitter.ship_type, cur_hit.hitted.ship_type);
        if (new_types !== null) {
          cur_hit.merge = true;
          enemies = enemies.filter((x) => x !== cur_hit.hitted && x !== cur_hit.hitter);
          let new_enemy_1 = fastSpawnEnemy(new_types[0], cur_hit.hitted.pos.clone());
          let new_enemy_2 = fastSpawnEnemy(new_types[1], cur_hit.hitter.pos.clone());
          cur_hit.hitted = new_enemy_1;
          cur_hit.hitter = new_enemy_2;
          updateCompletedTargets();
          if (level_ended) {
            let delays = [];
            for (let i = 0; i < enemies.length; i++) {
              delays.push(i * 0.2);
            }
            shuffle(delays);
            let pending = Array(target_types.length).fill(true);
            let target_type_index = [];
            enemies.forEach((x) => {
              let res = 0;
              while (target_types[res] !== x.ship_type || !pending[res]) {
                res++;
              }
              pending[res] = false;
              target_type_index.push(res);
            });
            enemies.forEach((x, k) => {
              x.flying = true;
              let p0 = x.pos.clone();
              let pE = target_types_sprites[target_type_index[k]].position;
              let p1 = import_vector2.default.lerp(p0, pE, 0.5);
              p1.addSelf(import_vector2.default.random.mulSelf(200));
              let original_size = x.sprite.size.clone();
              animators.push(new import_animator.default(x).onUpdate((t) => {
                x.pos.copy(bezier3(t, p0, p1, pE));
                x.sprite.size = original_size.mul(1 - t * (1 - t) * (1 - t) * 3);
              }).duration(0.75).smoothDamp(true).delay(delays[k]).then(() => {
                enemies = enemies.filter((y) => y !== x);
                target_types_sprites[target_type_index[k]].color = import_color.default.white;
                console.log("end");
              }));
            });
            animators.push(new import_animator.default(null).duration((enemies.length - 1) * 0.2 + 0.76).then(() => {
              if (cur_level_n + 1 < levels.length) {
                cur_level_n += 1;
                loadLevel(cur_level_n);
              } else {
                in_win_screen = true;
                outdated_types_sprites = [...target_types_sprites];
                outdated_types_sprites.forEach((x, k) => {
                  animators.push(new import_animator.default(x).to(
                    { "position.y": import_shaku.default.gfx.getCanvasSize().y + CONFIG.enemy_radius * 3 }
                  ).duration(0.75 - k * 0.04).delay((outdated_types_sprites.length - k) * 0.1).smoothDamp(true));
                });
              }
            }));
          }
        } else {
          cur_hit.merge = false;
          cur_hit.hitted.vel.addSelf(cur_hit.hitted_new_vel);
          cur_hit.hitter.vel.addSelf(cur_hit.hitter_new_vel);
        }
      }
    }
    if (cur_hit.time_until_end <= 0) {
      import_shaku.default.gfx.setCameraOrthographic(import_vector2.default.zero);
      if (cur_hit.merge) {
        cur_hit.hitted.vel.addSelf(cur_hit.hitted_new_vel);
        cur_hit.hitter.vel.addSelf(cur_hit.hitter_new_vel);
      }
      cur_hit = null;
    }
  } else {
    if (time_since_dash >= CONFIG.dash_cooldown && !level_ended && player_stun_time_remaining === 0) {
      last_dash_pos.copy(player_pos);
      last_dash_dir = cursor_sprite.position.sub(player_pos);
      last_dash_dist = CONFIG.dash_dist;
      last_dash_dir.normalizeSelf();
      let first_hit = rayEnemiesCollision(player_pos, last_dash_dir, last_dash_dist, CONFIG.ray_radius, null);
      if (first_hit !== null) {
        last_dash_dist = first_hit.hit_dist;
      }
      let ray_end = last_dash_pos.add(last_dash_dir.mul(last_dash_dist));
      let perp_dir = last_dash_dir.rotatedDegrees(90).normalizeSelf().mul(CONFIG.ray_radius);
      if (first_hit !== null) {
        import_shaku.default.gfx.drawLine(last_dash_pos.add(perp_dir).add(last_dash_dir.mul(30)), ray_end.add(perp_dir), import_color.default.white);
        import_shaku.default.gfx.drawLine(last_dash_pos.sub(perp_dir).add(last_dash_dir.mul(30)), ray_end.sub(perp_dir), import_color.default.white);
        import_shaku.default.gfx.fillCircle(new import_circle.default(ray_end, CONFIG.ray_radius), import_color.default.white);
      } else {
        import_shaku.default.gfx.drawLines([last_dash_pos.add(perp_dir).add(last_dash_dir.mul(30)), ray_end.add(perp_dir)], [import_color.default.white, import_color.default.black]);
        import_shaku.default.gfx.drawLines([last_dash_pos.sub(perp_dir).add(last_dash_dir.mul(30)), ray_end.sub(perp_dir)], [import_color.default.white, import_color.default.black]);
      }
      if (import_shaku.default.input.mousePressed()) {
        time_since_dash = 0;
        last_dash_hit_enemy = null;
        if (first_hit !== null) {
          last_dash_hit_enemy = first_hit.hit_enemy;
          let second_ray_dir = first_hit.hit_enemy.pos.sub(ray_end).normalizeSelf();
          second_ray_dir = second_ray_dir.add(last_dash_dir.mul(CONFIG.dash_dir_override)).normalizeSelf();
          last_enemy_dash_pos.copy(first_hit.hit_enemy.pos);
          last_enemy_dash_dir.copy(second_ray_dir);
          let wall_collision_time = Infinity;
          let wall_vector_modify = import_vector2.default.one;
          let collision_time_left = (board_area.left - first_hit.hit_enemy.pos.x) / second_ray_dir.x;
          if (collision_time_left > 0 && collision_time_left <= CONFIG.enemy_throwback_dist) {
            wall_collision_time = collision_time_left;
            wall_vector_modify = new import_vector2.default(-1, 1);
          }
          let collision_time_right = (board_area.right - first_hit.hit_enemy.pos.x) / second_ray_dir.x;
          if (collision_time_right > 0 && collision_time_right <= CONFIG.enemy_throwback_dist && collision_time_right < wall_collision_time) {
            wall_collision_time = collision_time_right;
            wall_vector_modify = new import_vector2.default(-1, 1);
          }
          let collision_time_up = (board_area.top - first_hit.hit_enemy.pos.y) / second_ray_dir.y;
          if (collision_time_up > 0 && collision_time_up <= CONFIG.enemy_throwback_dist && collision_time_up < wall_collision_time) {
            wall_collision_time = collision_time_up;
            wall_vector_modify = new import_vector2.default(1, -1);
          }
          let collision_time_down = (board_area.bottom - first_hit.hit_enemy.pos.y) / second_ray_dir.y;
          if (collision_time_down > 0 && collision_time_down <= CONFIG.enemy_throwback_dist && collision_time_down < wall_collision_time) {
            wall_collision_time = collision_time_down;
            wall_vector_modify = new import_vector2.default(1, -1);
          }
          let second_hit = rayEnemiesCollision(
            first_hit.hit_enemy.pos,
            second_ray_dir,
            CONFIG.enemy_second_hit_dist,
            CONFIG.enemy_radius,
            first_hit.hit_enemy
          );
          if (second_hit !== null) {
            second_hit.hit_dist -= CONFIG.enemy_radius / 2;
          }
          if (second_hit === null || wall_collision_time < second_hit.hit_dist) {
            if (wall_collision_time < Infinity) {
              first_hit.hit_enemy.pos.addSelf(second_ray_dir.mul(wall_collision_time));
              first_hit.hit_enemy.vel.addSelf(second_ray_dir.mul(CONFIG.enemy_throwback_speed * (1 - wall_collision_time / CONFIG.enemy_throwback_dist)).mulSelf(wall_vector_modify));
              last_enemy_dash_dist = wall_collision_time;
            } else {
              first_hit.hit_enemy.pos.addSelf(second_ray_dir.mul(CONFIG.enemy_throwback_dist));
              first_hit.hit_enemy.vel.addSelf(second_ray_dir.mul(CONFIG.enemy_throwback_speed));
              last_enemy_dash_dist = CONFIG.enemy_throwback_dist;
            }
            playTouchSound(first_hit.hit_enemy.ship_type);
          } else {
            let new_types = combine(first_hit.hit_enemy.ship_type, second_hit.hit_enemy.ship_type);
            console.log("new types are: ", new_types);
            if (new_types === null) {
              playCrashSound(first_hit.hit_enemy.ship_type, second_hit.hit_enemy.ship_type);
            } else {
              playMergeSound(first_hit.hit_enemy.ship_type, second_hit.hit_enemy.ship_type);
            }
            first_hit.hit_enemy.pos.addSelf(second_ray_dir.mul(second_hit.hit_dist));
            let hit_to_hitter = second_hit.hit_enemy.pos.sub(first_hit.hit_enemy.pos).normalizeSelf();
            let hitted_new_vel = hit_to_hitter.mul(import_vector2.default.dot(hit_to_hitter, second_ray_dir));
            let hitter_new_vel = second_ray_dir.sub(hitted_new_vel);
            let new_particle = new import_sprite.default(merge_particle_texture);
            new_particle.size.mulSelf(SCALING);
            new_particle.position = first_hit.hit_enemy.pos.add(hit_to_hitter.mul(CONFIG.enemy_radius));
            new_particle.rotation = hit_to_hitter.getRadians() + Math.PI / 2;
            let damp = remap(import_vector2.default.dot(second_ray_dir, hit_to_hitter), 0, 1, 1, 0.75);
            cur_hit = {
              hitter: first_hit.hit_enemy,
              hitted: second_hit.hit_enemy,
              time_until_end: CONFIG.dash_hit_duration,
              hitter_new_vel: hitter_new_vel.mul(CONFIG.post_merge_speed * damp),
              hitted_new_vel: hitted_new_vel.mul(CONFIG.post_merge_speed * damp),
              starting: true,
              merge: true,
              particle: new_particle
            };
            last_enemy_dash_dist = second_hit.hit_dist;
          }
        }
      }
    }
    if (time_since_dash < CONFIG.dash_duration) {
      player_tail_sprite.size.copy(player_sprite.size.mul(0.35));
      for (let k = 0; k < last_dash_dist; k += 4) {
        player_tail_sprite.color = new import_color.default(0.65, 0.65, 0.65, clamp(k / last_dash_dist - 0.2 * (time_since_dash / CONFIG.dash_duration), 0, 1));
        player_tail_sprite.position.copy(last_dash_pos.add(last_dash_dir.mul(k)));
        import_shaku.default.gfx.drawSprite(player_tail_sprite);
      }
    }
  }
  if (player_stun_time_remaining === 0) {
    let dx = (import_shaku.default.input.down("d") || import_shaku.default.input.down("right") ? 1 : 0) - (import_shaku.default.input.down("a") || import_shaku.default.input.down("left") ? 1 : 0);
    let dy = (import_shaku.default.input.down("s") || import_shaku.default.input.down("down") ? 1 : 0) - (import_shaku.default.input.down("w") || import_shaku.default.input.down("up") ? 1 : 0);
    let normalizer = Math.abs(dx) + Math.abs(dy) === 2 ? Math.SQRT1_2 : 1;
    player_vel.addSelf(CONFIG.player_acc * dx * normalizer * dt, CONFIG.player_acc * dy * normalizer * dt);
    player_vel.mulSelf(1 / (1 + dt * CONFIG.player_friction));
    if (player_vel.length > 1) {
      player_dir = player_vel.normalized();
      player_sprite.rotation = player_dir.getRadians();
    }
  } else {
    player_vel.mulSelf(1 / (1 + dt * CONFIG.player_friction * 0.35));
  }
  player_pos.addSelf(player_vel.mul(dt));
  if (player_pos.x < board_area.left) {
    player_vel.x *= -1;
    player_pos.x += (board_area.left - player_pos.x) * 2;
  } else if (player_pos.x > board_area.right) {
    player_vel.x *= -1;
    player_pos.x += (board_area.right - player_pos.x) * 2;
  } else if (player_pos.y < board_area.top) {
    player_vel.y *= -1;
    player_pos.y += (board_area.top - player_pos.y) * 2;
  } else if (player_pos.y > board_area.bottom) {
    player_vel.y *= -1;
    player_pos.y += (board_area.bottom - player_pos.y) * 2;
  }
  player_sprite.position.copy(player_pos);
  if (!level_ended) {
    enemies.forEach((x) => x.update(dt));
  }
  bullets.forEach((x) => x.update(dt));
  if (cur_hit === null && player_stun_time_remaining === 0) {
    let colliding_index = enemies.findIndex((x) => !x.flying && import_vector2.default.distance(player_pos, x.pos) < CONFIG.stun_generosity * (CONFIG.enemy_radius + CONFIG.player_radius));
    if (colliding_index !== -1) {
      player_stun_time_remaining = CONFIG.stun_time;
      enemy_stun_time_remaining = CONFIG.enemy_stun_time;
    }
  }
  enemy_stun_time_remaining = Math.max(0, enemy_stun_time_remaining - dt);
  if (player_stun_time_remaining > 0) {
    player_stun_time_remaining -= dt;
    if (player_stun_time_remaining <= 0) {
      player_sprite.color = import_color.default.white;
      player_stun_time_remaining = 0;
    } else {
      player_sprite.color = Math.floor(player_stun_time_remaining * 7) % 2 === 0 ? import_color.default.white : import_color.default.gray;
    }
  }
  if (in_win_screen) {
    import_shaku.default.gfx.useEffect(font_effect);
    import_shaku.default.gfx.drawGroup(thanks_text, false);
    import_shaku.default.gfx.drawGroup(thanks_2_text, false);
    import_shaku.default.gfx.useEffect(null);
  }
  drawGame();
  player_pos_history.removeBack();
  player_pos_history.insertFront([player_vel.length / 600, player_pos.sub(player_dir.mul(CONFIG.player_radius * 0.7))]);
  import_shaku.default.gfx.drawSprite(cursor_sprite);
  import_shaku.default.gfx.useEffect(null);
  time_since_dash += import_shaku.default.gameTime.delta;
  import_shaku.default.endFrame();
  import_shaku.default.requestAnimationFrame(step);
}
function choice(arr) {
  if (arr.length === 0) {
    return void 0;
  }
  return arr[Math.floor(Math.random() * arr.length)];
}
function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}
function remap(value, old_a, old_b, new_a, new_b) {
  let t = (value - old_a) / (old_b - old_a);
  return t * (new_b - new_a) + new_a;
}
function clamp(value, a, b) {
  if (value < a)
    return a;
  if (value > b)
    return b;
  return value;
}
function argmax(vals) {
  if (vals.length === 0) {
    return -1;
  }
  let best_index = 0;
  let best_value = vals[0];
  for (let k = 0; k < vals.length; k++) {
    const cur = vals[k];
    if (cur > best_value) {
      best_index = k;
      best_value = cur;
    }
  }
  return best_index;
}
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }
  return array;
}
function bezier3(t, p0, p1, p2) {
  let result2 = p2.mul(t * t);
  result2.addSelf(p1.mul(2 * t * (1 - t)));
  result2.addSelf(p0.mul((1 - t) * (1 - t)));
  return result2;
}
document.getElementById("loading").style.opacity = "0";
step();
import_shaku.default.gfx.canvas.style.cursor = "none";
/**
 * A utility to hold gametime.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\game_time.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * All default collision detection implementations.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\resolvers_imp.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * An object to store collision detection result.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\result.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Assets base class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Camera class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\camera.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Define a color object.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\color.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Define a mesh object.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\mesh.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Define a sprite object.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\sprite.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Define a sprites group.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\sprites_group.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Define keyboard and mouse key codes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\input\key_codes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Define possible text alignments.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\text_alignment.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Define possible texture filter modes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\texture_filter_modes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Define possible texture wrap modes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\texture_wrap_modes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Define supported blend modes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\blend_modes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Define the managers interface.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\manager.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Define utility to generate meshes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\mesh_generator.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Effect base class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\effects\effect.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement a 3d vector.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\vector3.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement a MSDF font texture asset type.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\msdf_font_texture_asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement a basic effect to draw sprites.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\effects\basic.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement a font texture asset type.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\font_texture_asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement a math utilities class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\math_helper.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement a seeded random generator.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\seeded_random.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement a simple 2d circle.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\circle.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement a simple 2d line.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\line.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement a simple 2d rectangle.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\rectangle.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement a simple 2d vector.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\vector2.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement a sound effect instance.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\sfx\sound_instance.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement a sound mixer class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\sfx\sound_mixer.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement a storage adapter.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\storage_adapter.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement a storage wrapper.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\storage.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement an animator helper class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\animator.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement an effect to draw MSDF font textures.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\effects\msdf_font.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement basic logger.
 * By default, uses console for logging, but it can be replaced with setDrivers().
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\logger.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement binary data asset type.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\binary_asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement collision circle.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\circle.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement collision lines.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\lines.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement collision point.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\point.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement collision rectangle.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\rectangle.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement collision shape base class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\shape.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement collision tilemap.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\tilemap.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement json asset type.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\json_asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement sound asset type.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\sound_asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement texture asset type.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\texture_asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement the assets manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\assets.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement the collision manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\collision.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement the collision manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\collision_world.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement the collision resolver class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\resolver.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement the gfx manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\gfx.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement the gfx sprite batch renderer.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\sprite_batch.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement the gfx vertex container.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\vertex.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement the input manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\input\input.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implement the sfx manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\sfx\sfx.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Implements 2d perlin noise generator.
 * Based on code from noisejs by Stefan Gustavson.
 * https://github.com/josephg/noisejs/blob/master/perlin.js
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\perlin.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Include all built-in effects.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\effects\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Include all util classes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Just an alias to main manager so we can require() this folder as a package.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Just an alias to main manager so we can require() this folder as a package.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Just an alias to main manager so we can require() this folder as a package.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Just an alias to main manager so we can require() this folder as a package.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\input\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Just an alias to main manager so we can require() this folder as a package.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\sfx\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Matrix class.
 * Based on code from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\matrix.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Provide a pathfinding algorithm.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\path_finder.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
*/
/**
 * Shaku Main.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\shaku.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Transformation modes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\transform_modes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
/**
 * Transformations object to store position, rotation and scale, that also support transformations inheritance.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\transformation.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
//# sourceMappingURL=main.js.map
