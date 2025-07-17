 var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        var ballRadius = 8;
        var x = canvas.width/2;
        var y = canvas.height-30;
        var dx = 3;
        var dy = -3;
        var paddleHeight = 12;
        var paddleWidth = 80;
        var paddleX = (canvas.width-paddleWidth)/2;
        var rightPressed = false;
        var leftPressed = false;
        var brickRowCount = 9;
        var brickColumnCount = 5;
        var brickWidth = 65;
        var brickHeight = 18;
        var brickPadding = 8;
        var brickOffsetTop = 40;
        var brickOffsetLeft = 35;
        var score = 0;
        var lives = 6;

        // Colores para cada fila de ladrillos
        var brickColors = ["#ff4757", "#ffa502", "#2ed573", "#3742fa", "#a55eea", "#ffa502",  "#ff4757", "#2ed573" ];
        
        // Formas de ladrillos (0=rectángulo, 1=círculo, 2=triángulo, 3=hexágono)
        var brickShapes = [0, 1, 2, 0, 1, 0, 2, 1, 0];

        var bricks = [];
        for(var c=0; c<brickColumnCount; c++) {
            bricks[c] = [];
            for(var r=0; r<brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        document.addEventListener("mousemove", mouseMoveHandler, false);

        function keyDownHandler(e) {
            if(e.code == "ArrowRight") {
                rightPressed = true;
            }
            else if(e.code == 'ArrowLeft') {
                leftPressed = true;
            }
        }
        
        function keyUpHandler(e) {
            if(e.code == 'ArrowRight') {
                rightPressed = false;
            }
            else if(e.code == 'ArrowLeft') {
                leftPressed = false;
            }
        }
        
        function mouseMoveHandler(e) {
            var relativeX = e.clientX - canvas.offsetLeft;
            if(relativeX > 0 && relativeX < canvas.width) {
                paddleX = relativeX - paddleWidth/2;
            }
        }
        
        function collisionDetection() {
            for(var c=0; c<brickColumnCount; c++) {
                for(var r=0; r<brickRowCount; r++) {
                    var b = bricks[c][r];
                    if(b.status == 1) {
                        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                            dy = -dy;
                            b.status = 0;
                            score++;
                            if(score == brickRowCount*brickColumnCount) {
                                alert("🎉 ¡GANASTE! 🎉");
                                document.location.reload();
                            }
                        }
                    }
                }
            }
        }

        function drawBall() {
            // Pelota con gradiente
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI*2);
            var gradient = ctx.createRadialGradient(x-2, y-2, 0, x, y, ballRadius);
            gradient.addColorStop(0, "#fff");
            gradient.addColorStop(1, "#ff6b6b");
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.closePath();
        }
        
        function drawPaddle() {
            // Paleta redondeada
            ctx.beginPath();
            ctx.roundRect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight, 6);
            ctx.fillStyle = "#70a1ff";
            ctx.fill();
            ctx.closePath();
        }
        
        function drawBricks() {
            for(var c=0; c<brickColumnCount; c++) {
                for(var r=0; r<brickRowCount; r++) {
                    if(bricks[c][r].status == 1) {
                        var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                        var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        
                        ctx.fillStyle = brickColors[r] || "#0095DD";
                        
                        // Dibujar según la forma
                        var shape = brickShapes[r] || 0;
                        
                        if(shape == 0) {
                            // Rectángulo redondeado
                            ctx.beginPath();
                            ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 4);
                            ctx.fill();
                            ctx.closePath();
                        }
                        else if(shape == 1) {
                            // Círculo/Elipse
                            ctx.beginPath();
                            ctx.ellipse(brickX + brickWidth/2, brickY + brickHeight/2, 
                                       brickWidth/2, brickHeight/2, 0, 0, Math.PI*2);
                            ctx.fill();
                            ctx.closePath();
                        }
                        else if(shape == 2) {
                            // Triángulo
                            ctx.beginPath();
                            ctx.moveTo(brickX + brickWidth/2, brickY);
                            ctx.lineTo(brickX, brickY + brickHeight);
                            ctx.lineTo(brickX + brickWidth, brickY + brickHeight);
                            ctx.closePath();
                            ctx.fill();
                        }
                        else if(shape == 3) {
                            // Hexágono
                            var centerX = brickX + brickWidth/2;
                            var centerY = brickY + brickHeight/2;
                            var size = Math.min(brickWidth, brickHeight)/2;
                            
                            ctx.beginPath();
                            for(var i = 0; i < 6; i++) {
                                var angle = (i * Math.PI) / 3;
                                var px = centerX + size * Math.cos(angle);
                                var py = centerY + size * Math.sin(angle);
                                if(i == 0) ctx.moveTo(px, py);
                                else ctx.lineTo(px, py);
                            }
                            ctx.closePath();
                            ctx.fill();
                        }
                    }
                }
            }
        }
        
        function drawScore() {
            ctx.font = "bold 16px Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText("Score: "+score, 8, 20);
        }
        
        function drawLives() {
            ctx.font = "bold 16px Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText("Lives: "+lives, canvas.width-65, 20);
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawBall();
            drawPaddle();
            drawScore();
            drawLives();
            collisionDetection();

            if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
                dx = -dx;
            }
            if(y + dy < ballRadius) {
                dy = -dy;
            }
            else if(y + dy > canvas.height-ballRadius) {
                if(x > paddleX && x < paddleX + paddleWidth) {
                    dy = -dy;
                }
                else {
                    lives--;
                    if(!lives) {
                        alert("💀 GAME OVER 💀");
                        document.location.reload();
                    }
                    else {
                        x = canvas.width/2;
                        y = canvas.height-30;
                        dx = 3;
                        dy = -3;
                        paddleX = (canvas.width-paddleWidth)/2;
                    }
                }
            }

            if(rightPressed && paddleX < canvas.width-paddleWidth) {
                paddleX += 7;
            }
            else if(leftPressed && paddleX > 0) {
                paddleX -= 7;
            }

            x += dx;
            y += dy;
            requestAnimationFrame(draw);
        }

        // Polyfill para roundRect
        if (!CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
                this.beginPath();
                this.moveTo(x + radius, y);
                this.lineTo(x + width - radius, y);
                this.quadraticCurveTo(x + width, y, x + width, y + radius);
                this.lineTo(x + width, y + height - radius);
                this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                this.lineTo(x + radius, y + height);
                this.quadraticCurveTo(x, y + height, x, y + height - radius);
                this.lineTo(x, y + radius);
                this.quadraticCurveTo(x, y, x + radius, y);
                this.closePath();
            };
        }

        draw();