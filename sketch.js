const container = document.querySelector('.container');
const resetButton = document.getElementById('reset-button');
const gridSlider = document.getElementById('grid-slider');
const changeGridButton = document.getElementById('increase-grid-button'); // Updated button ID
const colorPicker = document.getElementById('color-picker');
const eraserButton = document.getElementById('eraser-button');
let isDrawing = false;
let touchStartX, touchStartY; // Variables to track touch start position
let eraserMode = false;
let color = '#333';

function createGrid(size) {
    clearGrid();
    for (let i = 0; i < size * size; i++) {
        const gridSquare = document.createElement('div');
        gridSquare.classList.add('grid-square');
        container.appendChild(gridSquare);
    }
    container.style.gridTemplateColumns = `repeat(${size}, 1fr`;
    container.style.gridTemplateRows = `repeat(${size}, 1fr`;
    addDragColorListeners();
}

function clearGrid() {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function addDragColorListeners() {
    container.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            isDrawing = true;
            if (e.target.classList.contains('grid-square')) {
                e.target.style.backgroundColor = getColor();
            }
        }
    });

    container.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    container.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            if (e.target.classList.contains('grid-square')) {
                if (e.button === 0 && !eraserMode) {
                    e.target.style.backgroundColor = getColor();
                }
            }
        }
    });

    container.addEventListener('mouseover', (e) => {
        if (eraserMode && e.target.classList.contains('grid-square')) {
            e.target.style.backgroundColor = 'transparent';
        }
    });
}

function addTouchColorListeners() {
    let touchStarted = false; // Track if touch event has started

    container.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent default touch behavior
        isDrawing = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStarted = true;

        if (e.target.classList.contains('grid-square')) {
            if (eraserMode) {
                e.target.style.backgroundColor = 'transparent'; // Enable eraser mode for touch
            } else {
                e.target.style.backgroundColor = getColor();
            }
        }
    });

    container.addEventListener('touchend', () => {
        isDrawing = false;
        touchStarted = false;
    });

    container.addEventListener('touchmove', (e) => {
        if (isDrawing && touchStarted) {
            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;

            if (e.target.classList.contains('grid-square')) {
                if (eraserMode) {
                    e.target.style.backgroundColor = 'transparent'; // Enable eraser mode for touch
                } else {
                    e.target.style.backgroundColor = getColor();
                }
            }

            // Determine if the user is swiping left/right or up/down
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                e.preventDefault(); // Prevent horizontal page scrolling
            }

            touchStartX = touchEndX;
            touchStartY = touchEndY;
        }
    });
}

function getColor() {
    return color;
}

gridSlider.addEventListener('input', () => {
    const gridSizeValue = `${gridSlider.value}x${gridSlider.value}`;
    document.querySelector('#grid-slider-value').textContent = gridSizeValue;

    // Show grid size as a tooltip
    gridSlider.title = `Grid Size: ${gridSizeValue}`;
});

changeGridButton.addEventListener('click', () => {
    const newSize = gridSlider.value;
    createGrid(newSize);
});

colorPicker.addEventListener('input', (e) => {
    color = e.target.value;
});

eraserButton.addEventListener('click', () => {
    eraserMode = !eraserMode;
    if (eraserMode) {
        eraserButton.textContent = 'Eraser Mode: ON';
    } else {
        eraserButton.textContent = 'Eraser Mode: OFF';
    }
});

resetButton.addEventListener('click', () => {
    gridSlider.value = 16; // Set the slider value to 16
    document.querySelector('#grid-slider-value').textContent = '16x16'; // Update the displayed size to 16x16
    createGrid(16); // Always reset to 16x16
});
createGrid(16);
addTouchColorListeners(); // Add touch event listeners
