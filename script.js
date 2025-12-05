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

            // اجعل canvas بحجم الصورة الحقيقي (مهم جداً)
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// عند تحريك المؤشر
canvas.addEventListener("mousemove", e => showColor(e));
canvas.addEventListener("mouseleave", () => hoverColor.style.display = "none");

// تحويل RGB إلى HEX
function rgbToHex(r, g, b) {
    return [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

// ترجمة للألوان الشائعة
const arabicColors = {
    "Black": "أسود",
    "White": "أبيض",
    "Red": "أحمر",
    "Blue": "أزرق",
    "Green": "أخضر",
    "Yellow": "أصفر",
    "Pink": "وردي",
    "Purple": "أرجواني",
    "Gray": "رمادي",
    "Cyan": "سماوي",
    "Magenta": "بنفسجي فاتح",
    "Orange": "برتقالي",
    // سيتم عرض أي لون آخر كما هو بالعربية
};

function translateToArabic(name) {
    return arabicColors[name] || name;
}

// دالة عرض اللون
function showColor(e) {

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    let data;
    try {
        data = ctx.getImageData(x, y, 1, 1).data;
    } catch {
        return;
    }

    const [r, g, b] = data;
    const hex = rgbToHex(r, g, b);

    // ntc.js
    const ntcResult = ntc.name("#" + hex);
    const englishName = ntcResult[1]; 
    const arabicName = translateToArabic(englishName);

    // إظهار الفقاعة
    hoverColor.style.display = "block";
    hoverColor.style.left = (e.clientX + 20) + "px";
    hoverColor.style.top = (e.clientY + 20) + "px";

    hoverColor.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:22px;height:22px;background:#${hex};border:1px solid #000;border-radius:3px;"></div>
            <div>
                <div><b>${arabicName}</b> (${englishName})</div>
                <div>#${hex}</div>
            </div>
        </div>
    `;
}
