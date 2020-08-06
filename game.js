let my_count = document.querySelector('#my-count'),
    opp_count = document.querySelector('#opponent-count'),
    game_window = document.querySelector('#game-window'),
    my_racket = document.querySelector('#my-racket'),
    opp_racket = document.querySelector('#opponent-racket'),
    ball = document.querySelector('#ball'),

    in_collision = 0,
    ball_rad = ball.clientWidth,
    ball_x = game_window.clientWidth / 2 - ball_rad / 2,
    ball_y = game_window.clientHeight / 2 - ball_rad / 2,
    step_x = 2,
    step_y = -2,
    fps = 60;

start_round();

function get_random_integer(min, max) {
    let rand = min + Math.random() * (max + 1 - min);

    return Math.floor(rand);
}

function animate(time, count, action) {
    let i = 1,
        interval = setInterval(function() {
            action();

            i++;
            if (i == count) {
                clearInterval(interval);
            }                
        }, time);

    return interval
}

function is_collision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 + w1 > x2 && x1 < x2 + w2 && y1 + h1 > y2 && y1 < y2 + h2;

    //return x1 < (x2 + w2) && y1 < (y2 + h2) && (x1 + w1) > x2 && (y1 + h1) > y2;
}

function manage_player(event) {
    if (event.which == 38) {
        if (my_racket.getBoundingClientRect().top - 50 > game_window.getBoundingClientRect().top) {
            animate(1000/fps, 10, function() {
                my_racket.style.top = my_racket.offsetTop - 5 + 'px';
            });
        }
    } else if (event.which == 40) {
        if (my_racket.getBoundingClientRect().bottom + 50 < game_window.getBoundingClientRect().bottom) {
            animate(1000/fps, 10, function() {
                my_racket.style.top = my_racket.offsetTop + 5 + 'px';
            });
        }
    } 
}

function manage_opponent() {
    setInterval(function () {
        if (opp_racket.offsetTop + 20 > ball.offsetTop && opp_racket.getBoundingClientRect().top - 50 > game_window.getBoundingClientRect().top) {           
            animate(1000/fps, 10, function() {
                opp_racket.style.top = opp_racket.offsetTop - 5 + 'px';
            });
        } else if (opp_racket.offsetTop - 20 + opp_racket.clientHeight < ball.offsetTop && opp_racket.getBoundingClientRect().bottom + 50 < game_window.getBoundingClientRect().bottom) {
            animate(1000/fps, 10, function() {
                opp_racket.style.top = opp_racket.offsetTop + 5 + 'px';
            });
        }
    }, 50);
}

function ball_move() {
    if (ball_y + step_y < 0 || ball_y + step_y > game_window.clientHeight - ball_rad) {
        step_y = -step_y;
    }
    
    ball_x += step_x;
    ball_y += step_y;

    ball.style.left = ball_x + 'px';    
    ball.style.top = ball_y + 'px';
}

function check_beatoff() {
    if ((is_collision(my_racket.offsetLeft, my_racket.offsetTop, my_racket.clientWidth, my_racket.clientHeight, ball_x, ball_y, ball_rad, ball_rad)) ||
        (is_collision(opp_racket.offsetLeft, opp_racket.offsetTop, opp_racket.clientWidth, opp_racket.clientHeight, ball_x, ball_y, ball_rad, ball_rad))) {
        if (in_collision == 0) {
            if (step_x < 15 && -15 < step_x) {
                if (step_x > 0) {
                    step_x += get_random_integer(1, 3);
                } else {
                    step_x -= get_random_integer(1, 3);
                }
                if (step_y > 0) {
                    step_y += get_random_integer(1, 3);
                } else {
                    step_y -= get_random_integer(1, 3);
                }
            }

            step_x = -step_x;
            step_y = -step_y; 
            
            in_collision++;
        }
    } else {
        in_collision = 0;
    }
}

function check_goal() {
    if (ball_x < 0 - ball_rad || ball_x > game_window.clientWidth + ball_rad) {
        if (ball_x < 0 - ball_rad) {
            update_count(0);

            step_x = -2;
            step_y = 2;
        } else if (ball_x > game_window.clientWidth + ball_rad) {
            update_count(1);

            step_x = 2;
            step_y = -2;
        }       
        
        ball_x = game_window.clientWidth / 2 - ball_rad / 2;
        ball_y = game_window.clientHeight / 2 - ball_rad / 2;
    }
}

function update_count(whom) {
    if (whom == 0) {
        let count  = +opp_count.innerText;

        opp_count.innerText = ++count;
    } else if (whom == 1) {
        let count  = +my_count.innerText;

        my_count.innerText = ++count;
    }
}

function start_round() {
    if (get_random_integer(0, 1) == 1) {
        step_x = -2;
        step_y = 2;
    }

    ball.style.top = ball_y + 'px';        
    ball.style.left = ball_x + 'px';

    animate(1000/fps, false, function() {
        ball_move();
        check_beatoff();
        check_goal();        
    });

    document.addEventListener('keydown', manage_player);
    manage_opponent();
}