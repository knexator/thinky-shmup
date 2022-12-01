import { BlendModes } from "shaku/lib/gfx";
import Shaku from "shaku/lib/shaku";
import TextureAsset from "shaku/lib/assets/texture_asset";
import * as dat from 'dat.gui';
import Color from "shaku/lib/utils/color";
import Vector2 from "shaku/lib/utils/vector2";
import Sprite from "shaku/lib/gfx/sprite";

import Deque from "double-ended-queue";

const CONFIG = {
    player_speed: 355, // 2.25s to cross the 800px screen
    enemy_speed: 150, // about half?
    min_enemy_dist: 100,
    separation_strength: 30,
    dash_duration: 0.07,
    dash_cooldown: .4,
    dash_speed: 2600, // double speed idk
    tail_frames: 20,
    dash_dist: 100,
    player_acc: 50,
    player_turn_speed_radians: 3,
    enemy_radius: 20,
    enemy_throwback_dist: 150, // same as dash dist idk
    enemy_throwback_speed: 700,
    enemy_acc: 6,
    enemy_friction: 3,
    invincible_time: .3,
};
let gui = new dat.GUI({});
gui.remember(CONFIG);
gui.add(CONFIG, "player_speed", 100, 400);
gui.add(CONFIG, "enemy_speed", 100, 400);
gui.add(CONFIG, "min_enemy_dist", 0, 200);
gui.add(CONFIG, "separation_strength", 1, 200);
gui.add(CONFIG, "dash_duration", 0, .5);
gui.add(CONFIG, "dash_cooldown", 0, 2);
gui.add(CONFIG, "dash_speed", 300, 3200);
gui.add(CONFIG, "tail_frames", 0, 59);
gui.add(CONFIG, "dash_dist", 0, 400);
gui.add(CONFIG, "player_acc", 0, 400);
gui.add(CONFIG, "player_turn_speed_radians", 0, 20);
gui.add(CONFIG, "enemy_throwback_dist", 0, 500);
gui.add(CONFIG, "enemy_throwback_speed", 0, 500);
gui.add(CONFIG, "enemy_acc", 0, 50);
gui.add(CONFIG, "enemy_friction", 0, 50);

// init shaku
Shaku.input.setTargetElement(() => Shaku.gfx.canvas)
await Shaku.init([Shaku.assets, Shaku.sfx, Shaku.gfx, Shaku.input]);

// add shaku's canvas to document and set resolution to 800x600
document.body.appendChild(Shaku!.gfx!.canvas);
Shaku.gfx!.setResolution(800, 600, true);
Shaku.gfx!.centerCanvas();
// Shaku.gfx!.maximizeCanvasSize(false, false);


// Loading Screen
Shaku.startFrame();
Shaku.gfx!.clear(Shaku.utils.Color.cornflowerblue);
Shaku.endFrame();

let paused = false;

// TODO: INIT STUFF AND LOAD ASSETS HERE
let cursor_texture = await loadAsciiTexture(`0`, [Color.white]);
let cursor_sprite = new Shaku.gfx!.Sprite(cursor_texture);
cursor_sprite.size.mulSelf(10);

let player_texture = await loadAsciiTexture(`
        00000
        0...0
        0...0
        0...0
        00000
    `, [
    Shaku.utils.Color.white,
]);
let player_sprite = new Shaku.gfx!.Sprite(player_texture);
player_sprite.size.mulSelf(7.5);
player_sprite.color = Color.black;
let player_tail_sprite = new Shaku.gfx!.Sprite(player_texture);
player_tail_sprite.color = new Color(0, 0, 0, .5);

let enemy_texture = await loadAsciiTexture(`
        ..0..
        .000.
        0.0.0
        .000.
        ..0..
    `, [
    Shaku.utils.Color.cyan,
]);

class Enemy {
    public sprite: Sprite
    public vel: Vector2
    constructor(
        public pos: Vector2,
    ) {
        this.sprite = new Shaku.gfx!.Sprite(enemy_texture);
        this.sprite.size.mulSelf(7.5);
        this.vel = Vector2.zero;

        this.sprite.position = pos;
    }

    update_and_draw(dt: number) {
        this.vel.addSelf(player_pos.sub(this.pos).normalizeSelf().mulSelf(CONFIG.enemy_acc));
        // this.vel = player_pos.sub(this.pos).normalizeSelf().mulSelf(CONFIG.enemy_speed);
        enemies.forEach(x => {
            if (x === this) return;
            let delta = this.pos.sub(x.pos);
            let delta_len = delta.length;
            if (delta_len < CONFIG.min_enemy_dist) {
                this.vel.addSelf(delta.mulSelf(smoothstep(CONFIG.min_enemy_dist, CONFIG.min_enemy_dist * .95, delta_len) * CONFIG.separation_strength / delta_len));
            }
        })

        this.vel.mulSelf(1 / (1 + (dt * CONFIG.enemy_friction)));
        this.pos.addSelf(this.vel.mul(dt));
        this.sprite.rotation = this.vel.getRadians();
        Shaku.gfx.drawSprite(this.sprite);
    }
}

let time_since_dash = Infinity;
let last_dash_pos = Vector2.zero;
let last_dash_dir = Vector2.zero;
let last_dash_dist = 0;

let player_pos = Shaku.gfx.getCanvasSize().mulSelf(.5);
let player_vel = Vector2.right.mulSelf(CONFIG.player_speed);

let player_pos_history = new Deque(60);
while (player_pos_history.length < CONFIG.tail_frames) {
    player_pos_history.insertFront(player_pos.clone());
}

let enemies: Enemy[] = [];
for (let k = 0; k < 4; k++) {
    enemies.push(new Enemy(Shaku.gfx.getCanvasSize().mulSelf(Math.random(), Math.random())));
}

// do a single main loop step and request the next step
function step() {
    // start a new frame and clear screen
    Shaku.startFrame();
    Shaku.gfx!.clear(Shaku.utils.Color.cornflowerblue);

    if (Shaku.input.pressed("escape")) {
        paused = !paused;
    }

    if (paused) {
        Shaku.endFrame();
        Shaku.requestAnimationFrame(step);
        return;
    }


    cursor_sprite.position.copy(Shaku.input.mousePosition);

    // let mid_screen = Shaku.gfx.getCanvasSize().mulSelf(.5)
    // cursor_sprite.position = Shaku.input.mousePosition.sub(mid_screen).normalizeSelf().mulSelf(mid_screen.y * .9).addSelf(mid_screen);

    // Single frame dash
    if (time_since_dash >= CONFIG.dash_cooldown && Shaku.input.mousePressed()) {
        time_since_dash = 0;
        last_dash_pos.copy(player_pos);
        last_dash_dir = Shaku.input.mousePosition.sub(player_pos);
        // last_dash_dist = Math.min(CONFIG.dash_dist, last_dash_dir.length);
        last_dash_dist = CONFIG.dash_dist;
        last_dash_dir.normalizeSelf();
        player_sprite.color = Color.white;
        setTimeout(() => {
            player_sprite.color = Color.black;
        }, CONFIG.invincible_time * 1000);

        // collision with enemies
        let collision_distances = enemies.map(enemy => {
            // ray-circle collision from https://stackoverflow.com/a/1088058/5120619
            let closest_dist_along_ray = Vector2.dot(last_dash_dir, enemy.pos.sub(player_pos));
            if (closest_dist_along_ray < 0 || closest_dist_along_ray >= CONFIG.enemy_radius + last_dash_dist) {
                // early stop
                return Infinity;
            }
            let closest_point = player_pos.add(last_dash_dir.mul(closest_dist_along_ray));
            let closest_dist_to_enemy = Vector2.distance(closest_point, enemy.pos);
            if (closest_dist_to_enemy < CONFIG.enemy_radius) {
                let dt = Math.sqrt(CONFIG.enemy_radius * CONFIG.enemy_radius - closest_dist_to_enemy * closest_dist_to_enemy);
                let collision_dist = closest_dist_along_ray - dt;
                if (collision_dist > 0 && collision_dist <= last_dash_dist) {
                    return collision_dist;
                }
            }
            return Infinity;
        });
        let closest_enemy_index = argmin(collision_distances);
        if (collision_distances[closest_enemy_index] < Infinity) {
            // actual collision
            // todo: better collision
            enemies[closest_enemy_index].pos.addSelf(last_dash_dir.mul(CONFIG.enemy_throwback_dist));
            enemies[closest_enemy_index].vel.addSelf(last_dash_dir.mul(CONFIG.enemy_throwback_speed));

            // should player keep on dashing?
            // last_dash_dist = collision_distances[closest_enemy_index];
        }

        player_pos.addSelf(last_dash_dir.mul(last_dash_dist));
    }

    if (time_since_dash < CONFIG.dash_duration) {
        // draw dash trail
        player_tail_sprite.size.copy(player_sprite.size.mul(.85 * (1. - clamp(time_since_dash / CONFIG.dash_duration, 0, .5))))
        for (let k = 0; k < last_dash_dist; k += 4) {
            player_tail_sprite.position.copy(last_dash_pos.add(last_dash_dir.mul(k)));
            Shaku.gfx!.drawSprite(player_tail_sprite);
        }
    }

    // let dx = (Shaku.input.down("d") ? 1 : 0) - (Shaku.input.down("a") ? 1 : 0);
    // let dy = (Shaku.input.down("s") ? 1 : 0) - (Shaku.input.down("w") ? 1 : 0);
    // player_vel.set(dx, dy);
    // player_vel.mulSelf(CONFIG.player_speed);

    let delta = (cursor_sprite.position as Vector2).sub(player_pos);
    if (delta.length < 3) {
        player_vel.set(0, 0);
    } else {
        player_vel = delta.normalizeSelf().mulSelf(CONFIG.player_speed);
    }

    // let target_vel = (cursor_sprite.position as Vector2).sub(player_pos);
    // target_vel.normalizeSelf();
    // player_vel = rotateTowards(player_vel, target_vel, CONFIG.player_turn_speed_radians);
    // player_vel.normalizeSelf().mulSelf(CONFIG.player_speed);

    // player_vel = (cursor_sprite.position as Vector2).sub(player_pos).normalizeSelf().mulSelf(CONFIG.player_speed);

    player_pos.addSelf(player_vel.mul(Shaku.gameTime.delta));
    player_sprite.position.copy(player_pos);

    enemies.forEach(x => x.update_and_draw(Shaku.gameTime.delta));

    player_tail_sprite.size.copy(player_sprite.size)
    for (let k = 0; k < CONFIG.tail_frames; k++) {
        player_tail_sprite.position.copy(player_pos_history.get(k));
        player_tail_sprite.size.mulSelf(.85);
        Shaku.gfx!.drawSprite(player_tail_sprite);
    }
    player_pos_history.removeBack();
    player_pos_history.insertFront(player_pos.clone());
    Shaku.gfx!.drawSprite(player_sprite);
    Shaku.gfx!.drawSprite(cursor_sprite);

    time_since_dash += Shaku.gameTime.delta;

    // end frame and request next step
    Shaku.endFrame();
    Shaku.requestAnimationFrame(step);
}

async function loadAsciiTexture(ascii: string, colors: (string | Color)[]): Promise<TextureAsset> {

    let rows = ascii.trim().split("\n").map(x => x.trim())
    console.log(rows)
    let height = rows.length
    let width = rows[0].length

    // create render target
    // @ts-ignore
    let renderTarget = await Shaku.assets.createRenderTarget(null, width, height, 4);

    // use render target
    Shaku.gfx!.setRenderTarget(renderTarget, false);

    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            let val = rows[j][i];
            if (val === '.' || val === ' ') continue;
            let n = parseInt(val);

            let col = colors[n];
            if (typeof col === 'string') {
                col = Shaku.utils.Color.fromHex(col);
            }
            Shaku.gfx!.fillRect(
                new Shaku.utils.Rectangle(i, height - j - 1, 1, 1),
                col,
                BlendModes.Opaque, 0
            );
        }
    }

    // reset render target
    // @ts-ignore
    Shaku.gfx!.setRenderTarget(null, false);

    return renderTarget;
}

function lerp(a: number, b: number, t: number) {
    return a * (1 - t) + b * t;
};

function smoothstep(toZero: number, toOne: number, value: number) {
    let x = Math.max(0, Math.min(1, (value - toZero) / (toOne - toZero)));
    return x * x * (3 - 2 * x);
};

function remap(value: number, old_a: number, old_b: number, new_a: number, new_b: number) {
    let t = (value - old_a) / (old_b - old_a);
    return t * (new_b - new_a) + new_a;
}

function clamp(value: number, a: number, b: number) {
    if (value < a) return a;
    if (value > b) return b;
    return value;
}

function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

function moveTowardsV(cur_val: Vector2, target_val: Vector2, max_dist: number): Vector2 {
    let delta = target_val.sub(cur_val);
    let dist = delta.length;
    if (dist < max_dist) {
        // already arrived
        return target_val.clone();
    }
    delta.mulSelf(max_dist / dist);
    return cur_val.add(delta);
}

function rotateTowards(cur_val: Vector2, target_val: Vector2, max_radians: number): Vector2 {
    let radians = target_val.getRadians() - cur_val.getRadians();
    // get them in the interval [-PI+eps, PI+eps] to bias the result
    let eps = .01;
    radians = mod(radians + Math.PI + eps, Math.PI * 2) - Math.PI + eps;
    radians = clamp(radians, -max_radians, max_radians);
    return cur_val.rotatedRadians(radians);
}

function argmin(vals: number[]) {
    if (vals.length === 0) {
        return -1;
    }
    let best_index = 0;
    let best_value = vals[0];
    for (let k = 0; k < vals.length; k++) {
        const cur = vals[k];
        if (cur < best_value) {
            best_index = k;
            best_value = cur;
        }
    }
    return best_index;
}

// start main loop
step();

