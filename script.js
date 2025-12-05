// عناصر الصفحة
const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const hoverColor = document.getElementById("hoverColor");

let img = new Image();

// تحميل الصورة داخل الـ Canvas بالحجم الحقيقي
upload.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        img.onload = function() {
            // حجم canvas = حجم الصورة بالضبط
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// عند تحريك المؤشر فوق الصورة
canvas.addEventListener("mousemove", e => showColor(e));

// إخفاء الفقاعة عند مغادرة الصورة
canvas.addEventListener("mouseleave", () => {
    hoverColor.style.display = "none";
});

// عرض اللون تحت المؤشر
function showColor(e) {

    const rect = canvas.getBoundingClientRect();

    // حساب نسب القياس بين حجم العرض وحجم الـ Canvas الفعلي
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

    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    const hex = rgbToHex(r, g, b);

    // الحصول على اسم اللون الصحيح
    const colorInfo = ntc.name("#" + hex);
    const colorName = colorInfo[1]; // اسم اللون الأقرب

    // تحديث الفقاعة
    hoverColor.style.display = "block";
    hoverColor.style.left = (e.clientX + 20) + "px";
    hoverColor.style.top = (e.clientY + 20) + "px";

    hoverColor.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:22px;height:22px;background:#${hex};border:1px solid #000;border-radius:3px;"></div>
            <div>
                <b>${colorName}</b><br>
                #${hex}
            </div>
        </div>
    `;
}

// تحويل RGB إلى HEX
function rgbToHex(r, g, b) {
    return (
        ((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase()
    );
}
