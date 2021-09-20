// resize canvas
let canvas = document.querySelector("#canvas");
let context = canvas.getContext('2d');

// add window resize listener for updating canvas
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // scale to fit content to the canvas
    const scale = Math.min(canvas.width / app.width, canvas.height / app.height);

    // origin for centering our context on the canvas
    const origin = {
        x: (canvas.width - app.width * scale) / 2,
        y: (canvas.height - app.height * scale) / 2
    };

    // set the transform to scale and center on canvas
    context.setTransform(scale, 0, 0, scale, origin.x, origin.y);
}

// trigger resize immediately
resizeCanvas();