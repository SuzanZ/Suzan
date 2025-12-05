canvas.addEventListener("mousemove", e => showColor(e));

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

    const result = ntc.name("#" + hex);
    const englishName = result[1];
    
    hoverColor.style.display = "block";
    hoverColor.style.left = (e.clientX + 20) + "px";
    hoverColor.style.top = (e.clientY + 20) + "px";

    hoverColor.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:22px;height:22px;background:#${hex};border:1px solid #000;"></div>
            <div>
                <b>${englishName}</b><br>
                #${hex}
            </div>
        </div>
    `;
}
