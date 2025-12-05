/* ---------------------- NTC.js - Names That Color (مضمن بالكامل) ---------------------- */

var ntc = {

  init: function() {
    ntc.names = [
      ["000000", "Black"],
      ["FFFFFF", "White"],
      ["FF0000", "Red"],
      ["00FF00", "Lime"],
      ["0000FF", "Blue"],
      ["FFFF00", "Yellow"],
      ["FFA500", "Orange"],
      ["800080", "Purple"],
      ["00FFFF", "Cyan"],
      ["FFC0CB", "Pink"],
      ["808080", "Gray"],
      ["A52A2A", "Brown"],
      ["008000", "Green"],
      ["ADD8E6", "Light Blue"],
      ["800000", "Maroon"],
      ["FF00FF", "Magenta"],
      ["808000", "Olive"],
      ["000080", "Navy"]
    ];
  },

  name: function(color) {
    color = color.replace("#", "").toUpperCase();
    var rgb = this.rgb(color);
    var r = rgb[0], g = rgb[1], b = rgb[2];

    var bestMatch = [null, "Unknown"];

    var diffMin = 1e20;

    for (var i = 0; i < this.names.length; i++) {

      var testColor = this.names[i][0];
      var testName = this.names[i][1];

      var testRGB = this.rgb(testColor);

      var dr = r - testRGB[0];
      var dg = g - testRGB[1];
      var db = b - testRGB[2];

      var diff = dr * dr + dg * dg + db * db;

      if (diff < diffMin) {
        diffMin = diff;
        bestMatch = [testColor, testName];
      }
    }

    return bestMatch;
  },

  rgb: function(color) {
    return [
      parseInt(color.substring(0,2), 16),
      parseInt(color.substring(2,4), 16),
      parseInt(color.substring(4,6), 16)
    ];
  }
};

ntc.init();

/* ---------------------- بداية كود التطبيق ---------------------- */

const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const hoverColor = document.getElementById("hoverColor");
let img = new Image();

upload.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        img.onload = function() {

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

canvas.addEventListener("mousemove", e => showColor(e));
canvas.addEventListener("mouseleave", () => hoverColor.style.display = "none");


function showColor(e) {
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    let pixel;
    try {
        pixel = ctx.getImageData(x, y, 1, 1).data;
    } catch {
        return;
    }

    const [r, g, b] = pixel;
    const hex = rgbToHex(r, g, b);
    const match = ntc.name(hex);

    const english = match[1];
    const arabic = translateColor(english);

    hoverColor.style.display = "block";
    hoverColor.style.left = (e.clientX + 20) + "px";
    hoverColor.style.top = (e.clientY + 20) + "px";

    hoverColor.innerHTML = `
        <div style="display:flex;gap:10px;align-items:center;">
            <div style="width:22px;height:22px;background:#${hex};border:1px solid #000"></div>
            <div>
                <b>${arabic}</b> (${english})<br>
                #${hex}
            </div>
        </div>
    `;
}

function rgbToHex(r, g, b) {
    return [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function translateColor(name) {
    const map = {
        "Black":"أسود",
        "White":"أبيض",
        "Red":"أحمر",
        "Lime":"أخضر فاقع",
        "Blue":"أزرق",
        "Yellow":"أصفر",
        "Orange":"برتقالي",
        "Purple":"أرجواني",
        "Cyan":"سماوي",
        "Pink":"وردي",
        "Gray":"رمادي",
        "Brown":"بني",
        "Green":"أخضر",
        "Light Blue":"أزرق فاتح",
        "Maroon":"خمري",
        "Magenta":"فوشي",
        "Olive":"زيتي",
        "Navy":"كحلي"
    };

    return map[name] || name;
}
