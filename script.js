const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const hoverColor = document.getElementById("hoverColor");
let img = new Image();

// تحميل الصورة
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

// قراءة اللون تحت المؤشر
canvas.addEventListener("mousemove", e => showColor(e));
canvas.addEventListener("mouseleave", () => hoverColor.style.display = "none");

function showColor(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    let pixel;
    try {
        pixel = ctx.getImageData(x, y, 1, 1).data;
    } catch {
        return;
    }

    const [r, g, b] = pixel;

    const hex = rgbToHex(r, g, b);
    const name = getColorName(hex);

    // تحديث الفقاعة
    hoverColor.style.display = "block";
    hoverColor.style.left = (e.pageX + 20) + "px";
    hoverColor.style.top = (e.pageY + 20) + "px";

    hoverColor.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:20px;height:20px;background:#${hex};border:1px solid #000;"></div>
            <span>${name} (#${hex})</span>
        </div>
    `;
}

// تحويل RGB إلى HEX
function rgbToHex(r, g, b) {
    return [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

// الحصول على اسم اللون من ntc.js
function getColorName(hex) {
    const match = ntc.name("#" + hex);
    return match[1]; // اسم اللون
}
