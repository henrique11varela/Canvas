window.addEventListener('load', () => {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const image1 = document.getElementById("image1");

    class Particle {
        constructor(x, y, size, color) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.origin = [Math.floor(x), Math.floor(y)]
            this.size = size;
            this.color = color;
            this.velocity = [0.1, 0.1];
        }
        draw(context) {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.size, this.size);
        }
        update() {
            this.x += (this.origin[0] - this.x) * this.velocity[0];
            this.y += (this.origin[1] - this.y) * this.velocity[1];
        }
        warp(){
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
                console.log(this.mouse.x, this.mouse.y);
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
                        this.addParticle(x, y, this.gap, color);
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
        addParticle(x, y, size, color) {
            this.particlesArray.push(new Particle(x, y, size, color));
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