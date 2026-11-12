let wybranyKolor = "#000000";
let trybGumki = false;

const picker = document.querySelector("#picker");
const eraserBtn = document.querySelector("#eraser");

picker.addEventListener("input", () => {
    wybranyKolor = picker.value;
    trybGumki = false;
    eraserBtn.classList.remove("active");
});

eraserBtn.addEventListener("click", () => {
    trybGumki = !trybGumki;
    eraserBtn.classList.toggle("active", trybGumki);
});

// Color countries
document.querySelectorAll(".kraj").forEach(element => {
    element.addEventListener("click", () => {
        let kodKraju = "";

        element.classList.forEach(klasa => {
            if (klasa !== "kraj") kodKraju = klasa;
        });

        document.querySelectorAll("." + kodKraju).forEach(czesc => {
            if (trybGumki) {
                czesc.style.fill = "gray";
            } else {
                czesc.style.fill = wybranyKolor;
            }
        });
    });
});

// Show/hide teams
const toggleTeamsBtn = document.querySelector("#toggle-teams-btn");
const blokiDruzyn = document.querySelectorAll(".tekst-blok");
let czyDruzynyWidoczne = false;

if (toggleTeamsBtn) {
    toggleTeamsBtn.addEventListener("click", () => {
        czyDruzynyWidoczne = !czyDruzynyWidoczne;
        blokiDruzyn.forEach(blok => {
            blok.classList.toggle("pokaz", czyDruzynyWidoczne);
        });
        toggleTeamsBtn.classList.toggle("active", czyDruzynyWidoczne);
    });
}

// Handling DRAGGING and RESIZING (Pointer Events - Mouse + Touch)
document.querySelectorAll(".tekst-blok").forEach(blok => {
    const naglowek = blok.querySelector(".blok-naglowek");
    const colorInput = blok.querySelector(".blok-kolor");
    const textarea = blok.querySelector(".blok-tresc");
    const uchwyt = blok.querySelector(".uchwyt-rozmiaru");

    // Change text color
    if (colorInput && textarea) {
        colorInput.addEventListener("input", () => {
            textarea.style.color = colorInput.value;
        });
    }

    // --- 1. DRAGGING THE WINDOW ---
    let czyPrzesuwa = false;
    let przesuniecieX = 0;
    let przesuniecieY = 0;

    naglowek.addEventListener("pointerdown", (e) => {
        if (e.target === colorInput) return; // Clicking the color picker doesn't drag

        czyPrzesuwa = true;
        naglowek.setPointerCapture(e.pointerId); // "Pins" touch to the header bar

        const rect = blok.getBoundingClientRect();
        przesuniecieX = e.clientX - rect.left;
        przesuniecieY = e.clientY - rect.top;

        // Bring active window to the front
        document.querySelectorAll(".tekst-blok").forEach(b => b.style.zIndex = "50");
        blok.style.zIndex = "60";
    });

    naglowek.addEventListener("pointermove", (e) => {
        if (!czyPrzesuwa) return;

        const nowyX = e.clientX - przesuniecieX;
        const nowyY = e.clientY - przesuniecieY;

        blok.style.left = `${nowyX}px`;
        blok.style.top = `${nowyY}px`;
    });

    function zakonczPrzesuwanie(e) {
        if (czyPrzesuwa) {
            czyPrzesuwa = false;
            try {
                naglowek.releasePointerCapture(e.pointerId);
            } catch (err) {}
        }
    }

    naglowek.addEventListener("pointerup", zakonczPrzesuwanie);
    naglowek.addEventListener("pointercancel", zakonczPrzesuwanie);

    // --- 2. RESIZING THE WINDOW ---
    if (uchwyt) {
        let czySkaluje = false;
        let startX = 0, startY = 0;
        let startW = 0, startH = 0;

        uchwyt.addEventListener("pointerdown", (e) => {
            czySkaluje = true;
            uchwyt.setPointerCapture(e.pointerId);

            startX = e.clientX;
            startY = e.clientY;

            const rect = blok.getBoundingClientRect();
            startW = rect.width;
            startH = rect.height;

            e.stopPropagation();
        });

        uchwyt.addEventListener("pointermove", (e) => {
            if (!czySkaluje) return;

            const nowaSzerokosc = Math.max(140, startW + (e.clientX - startX));
            const nowaWysokosc = Math.max(80, startH + (e.clientY - startY));

            blok.style.width = `${nowaSzerokosc}px`;
            blok.style.height = `${nowaWysokosc}px`;
        });

        function zakonczSkalowanie(e) {
            if (czySkaluje) {
                czySkaluje = false;
                try {
                    uchwyt.releasePointerCapture(e.pointerId);
                } catch (err) {}
            }
        }

        uchwyt.addEventListener("pointerup", zakonczSkalowanie);
        uchwyt.addEventListener("pointercancel", zakonczSkalowanie);
    }
});
