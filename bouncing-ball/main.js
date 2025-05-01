const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener("resize", setCanvasSize);

canvas.style.backgroundColor = "black";

const colorArray = [
    "#87CEEB", "#FF69B4", "#98FB98", "#FFD700", "#00FFFF",
    "#FF6347", "#7B68EE", "#32CD32", "#FF4500", "#40E0D0",
    "#9370DB", "#F0E68C", "#00FA9A", "#DC143C", "#00BFFF",
    "#FF8C00", "#8A2BE2", "#ADFF2F", "#FF1493", "#1E90FF",
    "#FFA500", "#6A5ACD", "#228B22", "#FF00FF", "#A0522D"
];

class Circle {
    constructor(x, y, radius, dx, dy, color, isStatic = false) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.color = color || colorArray[Math.floor(Math.random() * colorArray.length)];
        this.isStatic = isStatic;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.lineWidth = 4;
        if (this.isStatic) {
            ctx.strokeStyle = this.color;
            ctx.stroke();
        } else {
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    update() {
        if (!this.isStatic) {
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.dx = -this.dx;
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.dy = -this.dy;
            this.x += this.dx;
            this.y += this.dy;
        }
        this.draw();
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    isCollidingWith(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.hypot(dx, dy);
        return distance < this.radius + other.radius;
    }
}

let circles;
let whiteCircle;
let disappearedCircles;

function addNewSphere() {
    const radius = 15;
    const newCircle = new Circle(
        Math.random() * (canvas.width - radius * 2) + radius,
        Math.random() * (canvas.height - radius * 2) + radius,
        radius,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );
    circles.push(newCircle);
    updateSphereCount();
}

function clearAllSpheres() {
    circles = [whiteCircle];
    disappearedCircles = 0;
    updateSphereCount();
}

function updateSphereCount() {
    const sphereCountElement = document.getElementById('sphereCount');
    const activeSpheres = circles.length - 1; // Subtract 1 for the white circle
    sphereCountElement.textContent = `Spheres: ${activeSpheres}`;
}

function init() {
    circles = Array.from({ length: 25 }, () => {
        const radius = 15;
        return new Circle(
            Math.random() * (canvas.width - radius * 2) + radius,
            Math.random() * (canvas.height - radius * 2) + radius,
            radius,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
    });
    
    whiteCircle = new Circle(canvas.width / 2, canvas.height / 2, 15, 0, 0, "white", true);
    circles.push(whiteCircle);
    disappearedCircles = 0;
    updateSphereCount();
}

function handleCollisions() {
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (circles[i].isCollidingWith(circles[j])) {
                let tempDx = circles[i].dx;
                let tempDy = circles[i].dy;
                circles[i].dx = circles[j].dx;
                circles[i].dy = circles[j].dy;
                circles[j].dx = tempDx;
                circles[j].dy = tempDy;
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    handleCollisions();
    
    circles = circles.filter(circle => {
        if (circle !== whiteCircle && whiteCircle.isCollidingWith(circle)) {
            disappearedCircles++;
            return false;
        }
        circle.update();
        return true;
    });
    
    if (disappearedCircles >= 25) {
        setTimeout(init, 1000);
    }
}

// Event Listeners
document.getElementById('addSphere').addEventListener('click', addNewSphere);
document.getElementById('clearSpheres').addEventListener('click', clearAllSpheres);

function updateWhiteCirclePosition(event) {
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if (event.touches && event.touches.length > 0) {
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
    } else {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    }
    whiteCircle.setPosition(x, y);
}

canvas.addEventListener("mousemove", updateWhiteCirclePosition);
canvas.addEventListener("touchmove", updateWhiteCirclePosition);

init();
animate();
