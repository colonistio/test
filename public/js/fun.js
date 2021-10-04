function randomColor() {
    let color = Math.floor(Math.random() * 16777215).toString(16);
    document.getElementById("canvas").style.backgroundColor = "#" + color;
}

function randomValue(max, min) { return Math.random() * (max - min) + min; }

export { randomColor, randomValue }