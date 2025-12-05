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

            // اجعل canvas نفس حجم الصورة الحقيقي 100%
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
    
    // احسب الإحداثيات بما يتناسب مع التكبير الحقيقي
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

    hoverColor.style.display = "block";
    hoverColor.style.left = (e.clientX + 15) + "px";
    hoverColor.style.top = (e.clientY + 15) + "px";

    hoverColor.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:20px;height:20px;background:#${hex};border:1px solid #000;"></div>
            <span>#${hex}</span>
        </div>
    `;
}

function rgbToHex(r, g, b) {
    return [r, g, b].map(v => v.toString(16).padStart(2,"0")).join("");
}
