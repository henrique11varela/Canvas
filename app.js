window.addEventListener('load', () => {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const image1 = document.getElementById("image1");

    class Particle {
        constructor(x, y, size, color, effect) {
            this.effect = effect;
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.origin = [Math.floor(x), Math.floor(y)]
            this.size = size;
            this.color = color;
            this.velocity = [0.1, 0.1];
            this.ease = 0.05;
            this.dx = 0;
            this.dy = 0;
            this.distance = 0;
            this.force = 0;
            this.angle = 0;
        }
        draw(context) {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.size, this.size);
        }
        update() {
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = this.dx * this.dx + this.dy * this.dy;
            this.force = -this.effect.mouse.radius / this.distance;
            if (this.effect.mouse.radius > this.distance) {
                this.angle = Math.atan2(this.dy, this.dx);
                this.velocity[0] = this.force * Math.cos(this.angle);
                this.velocity[1] = this.force * Math.sin(this.angle);
            }
            this.x += (this.origin[0] - this.x) * this.ease + (this.velocity[0] *= 0.95);
            this.y += (this.origin[1] - this.y) * this.ease + (this.velocity[1] *= 0.95);
        }
        warp() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
        }
    }

    class Effect {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.particlesArray = [];
            this.image = image1;
            this.gap = 5;
            this.mouse = {
                radius: 3000,
                x: undefined,
                y: undefined
            };
            window.addEventListener('mousemove', (event) => {
                this.mouse.x = event.x;
                this.mouse.y = event.y;
            });
        }
        init(context) {
            context.drawImage(this.image, (this.width - this.image.width) / 2, (this.height - this.image.height) / 2);
            const pixels = context.getImageData(0, 0, this.width, this.height).data;
            for (let y = 0; y < this.height; y += this.gap) {
                for (let x = 0; x < this.width; x += this.gap) {
                    const index = (y * this.width + x) * 4;
                    const red = pixels[index];
                    const green = pixels[index + 1];
                    const blue = pixels[index + 2];
                    const alpha = pixels[index + 3];
                    const color = 'rgb(' + red + ',' + green + ',' + blue + ',' + alpha + ')'
                    if (alpha > 0) {
                        this.addParticle(x, y, this.gap, color, this);
                    }           
                }
            }
        }
        draw(context) {
            this.particlesArray.forEach(element => {
                element.draw(context);
            });
        }
        update() {
            this.particlesArray.forEach(element => {
                element.update();
            });
        }
        addParticle(x, y, size, color, effect) {
            this.particlesArray.push(new Particle(x, y, size, color, this));
        }
        warp() {
            this.particlesArray.forEach(element => {
                element.warp();
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.update();
        effect.draw(ctx);
        window.requestAnimationFrame(animate);
    }

    document.getElementById("button1").addEventListener('click', () => {
        effect.warp();
    });
    /* document.getElementById("button2").addEventListener('click', () => {
        animate();
    }); */

    const effect = new Effect(canvas.width, canvas.height);
    effect.init(ctx);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(ctx);
    animate();

});