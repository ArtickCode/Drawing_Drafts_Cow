document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('picker');
    const eraserBtn = document.getElementById('eraser');
    const toggleTeamsBtn = document.getElementById('toggle-teams-btn');
    const countries = document.querySelectorAll('.kraj');

    let isEraserActive = false;

    // Toggle Eraser Mode
    eraserBtn.addEventListener('click', () => {
        isEraserActive = !isEraserActive;
        if (isEraserActive) {
            eraserBtn.style.backgroundColor = '#dc3545'; // Red to indicate active
            eraserBtn.textContent = 'Eraser (On)';
        } else {
            eraserBtn.style.backgroundColor = '#007bff'; // Default blue
            eraserBtn.textContent = 'Eraser';
        }
    });

    // Apply color or clear fill when clicking on any country path
    countries.forEach(country => {
        country.addEventListener('click', () => {
            if (isEraserActive) {
                country.style.fill = ''; // Resets back to default CSS fill
            } else {
                country.style.fill = colorPicker.value;
            }
        });
    });

    // Toggle Teams Button functionality (Placeholder for custom team naming logic)
    toggleTeamsBtn.addEventListener('click', () => {
        const teamName = prompt("Enter team or player name:");
        if (teamName) {
            toggleTeamsBtn.textContent = `Team: ${teamName}`;
        }
    });
});
