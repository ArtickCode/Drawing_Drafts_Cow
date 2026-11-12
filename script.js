let selectedColor = "#000000";
let eraserMode = false;

const picker = document.querySelector("#picker");
const eraserBtn = document.querySelector("#eraser");

picker.addEventListener("input", () => {
    selectedColor = picker.value;
    eraserMode = false;
    eraserBtn.classList.remove("active");
});

eraserBtn.addEventListener("click", () => {
    eraserMode = !eraserMode;
    eraserBtn.classList.toggle("active", eraserMode);
});

// Color countries
document.querySelectorAll(".region").forEach(element => {
    element.addEventListener("click", () => {
        let countryCode = "";

        element.classList.forEach(className => {
            if (className !== "region") countryCode = className;
        });

        document.querySelectorAll("." + countryCode).forEach(part => {
            if (eraserMode) {
                part.style.fill = "gray";
            } else {
                part.style.fill = selectedColor;
            }
        });
    });
});

// Show/hide teams
const toggleTeamsBtn = document.querySelector("#toggle-teams-btn");
const teamBlocks = document.querySelectorAll(".text-block");
let areTeamsVisible = false;

if (toggleTeamsBtn) {
    toggleTeamsBtn.addEventListener("click", () => {
        areTeamsVisible = !areTeamsVisible;
        teamBlocks.forEach(block => {
            block.classList.toggle("show", areTeamsVisible);
        });
        toggleTeamsBtn.classList.toggle("active", areTeamsVisible);
    });
}

// Handling DRAGGING and RESIZING (Pointer Events - Mouse + Touch)
document.querySelectorAll(".text-block").forEach(block => {
    const header = block.querySelector(".block-header");
    const colorInput = block.querySelector(".block-color");
    const textarea = block.querySelector(".block-content");
    const handle = block.querySelector(".resize-handle");

    // Change text color
    if (colorInput && textarea) {
        colorInput.addEventListener("input", () => {
            textarea.style.color = colorInput.value;
        });
    }

    // --- 1. DRAGGING THE WINDOW ---
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener("pointerdown", (e) => {
        if (e.target === colorInput) return; // Clicking the color picker doesn't drag

        isDragging = true;
        header.setPointerCapture(e.pointerId); // "Pins" touch to the header bar

        const rect = block.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // Bring active window to the front
        document.querySelectorAll(".text-block").forEach(b => b.style.zIndex = "50");
        block.style.zIndex = "60";
    });

    header.addEventListener("pointermove", (e) => {
        if (!isDragging) return;

        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        block.style.left = `${newX}px`;
        block.style.top = `${newY}px`;
    });

    function stopDragging(e) {
        if (isDragging) {
            isDragging = false;
            try {
                header.releasePointerCapture(e.pointerId);
            } catch (err) {}
        }
    }

    header.addEventListener("pointerup", stopDragging);
    header.addEventListener("pointercancel", stopDragging);

    // --- 2. RESIZING THE WINDOW ---
    if (handle) {
        let isResizing = false;
        let startX = 0, startY = 0;
        let startW = 0, startH = 0;

        handle.addEventListener("pointerdown", (e) => {
            isResizing = true;
            handle.setPointerCapture(e.pointerId);

            startX = e.clientX;
            startY = e.clientY;

            const rect = block.getBoundingClientRect();
            startW = rect.width;
            startH = rect.height;

            e.stopPropagation();
        });

        handle.addEventListener("pointermove", (e) => {
            if (!isResizing) return;

            const newWidth = Math.max(140, startW + (e.clientX - startX));
            const newHeight = Math.max(80, startH + (e.clientY - startY));

            block.style.width = `${newWidth}px`;
            block.style.height = `${newHeight}px`;
        });

        function stopResizing(e) {
            if (isResizing) {
                isResizing = false;
                try {
                    handle.releasePointerCapture(e.pointerId);
                } catch (err) {}
            }
        }

        handle.addEventListener("pointerup", stopResizing);
        handle.addEventListener("pointercancel", stopResizing);
    }
});
