import { BlendModes, TextureFilterModes } from "shaku/lib/gfx";
import Shaku from "shaku/lib/shaku";
import TextureAsset from "shaku/lib/assets/texture_asset";
import * as dat from 'dat.gui';
import Color from "shaku/lib/utils/color";
import Vector2 from "shaku/lib/utils/vector2";
import Sprite from "shaku/lib/gfx/sprite";
import Circle from "shaku/lib/utils/circle";
import Perlin from "shaku/lib/utils/perlin";

import Deque from "double-ended-queue";

const CONFIG = {
    player_speed: 355, // 2.25s to cross the 800px screen
    enemy_speed: 150, // about half?
    min_enemy_dist: 120,
    separation_strength: 250,
    dash_duration: 0.07,
    dash_cooldown: .4,
    dash_speed: 2600, // double speed idk
    tail_frames: 20,
    dash_dist: 200,
    player_turn_speed_radians: 3,
    enemy_radius: 20,
    enemy_throwback_dist: 80,
    enemy_throwback_speed: 700,
    enemy_second_hit_dist: 120, // a bit more than throwback dist, to account for speed
    enemy_acc: 360,
    enemy_friction: 3,
    dodge_acc: 1500,
    dodge_prevision_time: .5,
    dodge_prevision_dot: .15,
    invincible_time: .3,
    player_acc: 5000,
    player_friction: 12,
    grab_dist: 20,
    ray_radius: 10,
    dash_hit_duration: 0.25, // freeze screen for extra effect
    player_radius: 20,
    dash_dir_override: 5,
    screen_shake_size: 33,
    screen_shake_speed: 21,
    hit_slowdown: 0.3,
    steer_resolution: 64,
    debug_steer: .1,
};
let gui = new dat.GUI({});
gui.remember(CONFIG);
gui.add(CONFIG, "player_speed", 100, 400);
gui.add(CONFIG, "enemy_speed", 100, 400);
gui.add(CONFIG, "min_enemy_dist", 0, 200);
gui.add(CONFIG, "separation_strength", 1, 2000);
gui.add(CONFIG, "dash_duration", 0, .5);
gui.add(CONFIG, "dash_cooldown", 0, 2);
gui.add(CONFIG, "dash_speed", 300, 3200);
gui.add(CONFIG, "tail_frames", 0, 59);
gui.add(CONFIG, "dash_dist", 0, 400);
gui.add(CONFIG, "player_turn_speed_radians", 0, 20);
gui.add(CONFIG, "enemy_throwback_dist", 0, 500);
gui.add(CONFIG, "enemy_throwback_speed", 0, 2000);
gui.add(CONFIG, "enemy_second_hit_dist", 0, 500);
gui.add(CONFIG, "enemy_acc", 0, 1000);
gui.add(CONFIG, "enemy_friction", 0, 50);
gui.add(CONFIG, "dodge_acc", 0, 2000);
gui.add(CONFIG, "dodge_prevision_time", 0, 1);
gui.add(CONFIG, "dodge_prevision_dot", 0, 1);
gui.add(CONFIG, "player_acc", 0, 8000);
gui.add(CONFIG, "player_friction", 0, 50);
gui.add(CONFIG, "grab_dist", 0, 50);
gui.add(CONFIG, "dash_hit_duration", 0, 1);
gui.add(CONFIG, "dash_dir_override", 0, 5);
gui.add(CONFIG, "screen_shake_size", 0, 100);
gui.add(CONFIG, "screen_shake_speed", 0, 100);
gui.add(CONFIG, "hit_slowdown", 0, 1);
gui.add(CONFIG, "debug_steer", 0, 1);

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

let player_texture = await Shaku.assets.loadTexture("imgs/player.png", { generateMipMaps: true });
player_texture.filter = TextureFilterModes.Linear;
let player_sprite = new Shaku.gfx!.Sprite(player_texture);
player_sprite.size.mulSelf(CONFIG.player_radius / 50);
player_sprite.color = Color.black;
let player_tail_sprite = new Shaku.gfx!.Sprite(player_texture);
player_tail_sprite.color = new Color(0, 0, 0, .5);

let enemy_texture = await Shaku.assets.loadTexture("imgs/enemy.png", { generateMipMaps: true });
enemy_texture.filter = TextureFilterModes.Linear;

let enemy_hit_trail_sprite = new Shaku.gfx!.Sprite(enemy_texture);
enemy_hit_trail_sprite.size.mulSelf(CONFIG.enemy_radius / 50);
enemy_hit_trail_sprite.color = new Color(1, 1, 1, .125);

function setSteer(steer: number[], fn: (dir: Vector2) => number) {
    for (let k = 0; k < CONFIG.steer_resolution; k++) {
        steer[k] = fn(Vector2.fromRadians(Math.PI * 2 * k / CONFIG.steer_resolution));
    }
}

function addSteer(steer: number[], fn: (dir: Vector2) => number) {
    for (let k = 0; k < CONFIG.steer_resolution; k++) {
        steer[k] += fn(Vector2.fromRadians(Math.PI * 2 * k / CONFIG.steer_resolution));
    }
}

function bestDir(steer: number[]) {
    let best_index = argmax(steer);
    return Vector2.fromRadians(Math.PI * 2 * best_index / CONFIG.steer_resolution).mulSelf(steer[best_index]);
}

class Enemy {
    public sprite: Sprite
    public vel: Vector2
    public steer: number[]
    constructor(
        public pos: Vector2,
    ) {
        this.sprite = new Shaku.gfx!.Sprite(enemy_texture);
        this.sprite.size.mulSelf(CONFIG.enemy_radius / 50);
        this.vel = Vector2.zero;
        this.steer = Array(CONFIG.steer_resolution).fill(0);

        this.sprite.position = pos;
    }

    update(dt: number) {
        // Chase steer
        let player_dir = player_pos.sub(this.pos).normalizeSelf();
        setSteer(this.steer, v => {
            return (Vector2.dot(v, player_dir) + 1) * .5 * CONFIG.enemy_acc;
        })
        enemies.forEach(other => {
            if (other === this) return;
            let delta = this.pos.sub(other.pos);
            let delta_len = delta.length;
            let delta_dir = delta.normalized();

            // try to hover at a CONFIG.min_enemy_dist distance
            if (delta_len < CONFIG.min_enemy_dist) {
                addSteer(this.steer, v => {
                    return (1.0 - Math.abs(Vector2.dot(v, delta_dir) - .65)) * CONFIG.separation_strength * lerp(2, 0, delta_len / CONFIG.min_enemy_dist);
                })
            }

            // avoid hurling enemies
            let other_speed = other.vel.length;
            let other_dir = other.vel.mul(1 / other_speed);
            // if enemy is hurling in our general direction...
            if (other_speed > this.vel.length * 1.5 && Vector2.dot(delta_dir, other.vel.normalized()) > CONFIG.dodge_prevision_dot) {
                // time until impact, only taking other enemy into account
                let remaining_time = delta_len / other_speed;
                if (remaining_time < CONFIG.dodge_prevision_time) {
                    let closest_dist_along_ray = Vector2.dot(other_dir, delta);
                    let closest_point_along_ray = other_dir.mul(closest_dist_along_ray).subSelf(delta);
                    if (closest_point_along_ray.length < CONFIG.enemy_radius * 3) {
                        let dodge_dir = closest_point_along_ray.mul(-1).normalizeSelf();
                        addSteer(this.steer, v => {
                            let dot = Vector2.dot(v, dodge_dir);
                            if (dot > .5) {
                                return (dot - .5) * 2 * CONFIG.dodge_acc;
                            } else if (dot < -.5) {
                                return (dot + .5) * 2 * CONFIG.dodge_acc;
                            } else {
                                return 0;
                            }
                            // return (.5 - Math.abs(Vector2.dot(v, other_dir))) * CONFIG.dodge_acc;
                            // return (1.0 - Math.abs(Vector2.dot(v, delta) - .65)) * CONFIG.dodge_acc;
                        })
                    }
                }
            }

        })
        this.vel.addSelf(bestDir(this.steer).mulSelf(dt));
        this.vel.mulSelf(1 / (1 + (dt * CONFIG.enemy_friction)));
        this.pos.addSelf(this.vel.mul(dt));
    }

    draw() {
        this.sprite.rotation = this.vel.getRadians();
        Shaku.gfx.drawSprite(this.sprite);
        for (let k = 0; k < CONFIG.steer_resolution; k++) {
            Shaku.gfx.drawLine(this.pos, this.pos.add(
                Vector2.fromRadians(Math.PI * 2 * k / CONFIG.steer_resolution).mulSelf(CONFIG.debug_steer * Math.abs(this.steer[k]))
            ), this.steer[k] >= 0 ? Color.green : Color.red);
        }
    }
}

// Data for the player shoot moving the enemy
let time_since_dash = Infinity;
let last_dash_pos = Vector2.zero;
let last_dash_dir = Vector2.zero;
let last_dash_dist = 0;

// Data for the actual enemy movement
let last_enemy_dash_pos = Vector2.zero;
let last_enemy_dash_dir = Vector2.zero;
let last_enemy_dash_dist = 0;

let cur_hit: {
    hitter: Enemy,
    hitted: Enemy,
    time_until_end: number,
} | null = null;

let player_pos = Shaku.gfx.getCanvasSize().mulSelf(.5);
let player_dir = Vector2.right;
let player_vel = Vector2.right.mulSelf(CONFIG.player_speed);

let player_pos_history = new Deque(60);
while (player_pos_history.length < CONFIG.tail_frames) {
    player_pos_history.insertFront(player_pos.clone());
}

let screen_shake_noise = new Perlin(Math.random());

let enemies: Enemy[] = [];
for (let k = 0; k < 4; k++) {
    enemies.push(new Enemy(Shaku.gfx.getCanvasSize().mulSelf(Math.random(), Math.random())));
}

interface CollisionInfo {
    hit_dist: number,
    hit_enemy: Enemy,
}
function rayEnemiesCollision(pos: Vector2, dir: Vector2, ray_dist: number, ray_radius: number, exclude: Enemy | null): CollisionInfo | null {
    let best_dist = Infinity;
    let best_enemy = -1;

    for (let k = 0; k < enemies.length; k++) {
        const cur_enemy = enemies[k];
        if (cur_enemy === exclude) continue;
        // ray-circle collision from https://stackoverflow.com/a/1088058/5120619
        let closest_dist_along_ray = Vector2.dot(dir, cur_enemy.pos.sub(pos));
        if (closest_dist_along_ray < 0 || closest_dist_along_ray >= CONFIG.enemy_radius + ray_radius + ray_dist) {
            // early stop
            continue;
        }

        let closest_point_along_ray = pos.add(dir.mul(closest_dist_along_ray));
        let closest_dist_to_enemy = Vector2.distance(closest_point_along_ray, cur_enemy.pos);
        if (closest_dist_to_enemy < CONFIG.enemy_radius + ray_radius) {
            let helper = CONFIG.enemy_radius + ray_radius;
            let dt = Math.sqrt(helper * helper - closest_dist_to_enemy * closest_dist_to_enemy);
            let collision_dist = closest_dist_along_ray - dt;
            if (collision_dist > 0 && collision_dist <= ray_dist) {
                // proper hit!
                if (collision_dist < best_dist) {
                    best_dist = collision_dist;
                    best_enemy = k;
                }
            }
        }
    }

    if (best_enemy === -1) return null;

    return {
        hit_dist: best_dist,
        hit_enemy: enemies[best_enemy],
    }
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
        enemies.forEach(x => x.draw());
        Shaku.gfx!.drawSprite(player_sprite);
        Shaku.endFrame();
        Shaku.requestAnimationFrame(step);
        return;
    }

    let dt = Shaku.gameTime.delta;
    cursor_sprite.position.copy(Shaku.input.mousePosition);

    if (cur_hit !== null) {
        // freezed screen
        let shake_damp = cur_hit.time_until_end / CONFIG.dash_hit_duration;
        Shaku.gfx.setCameraOrthographic(new Vector2(
            shake_damp * (screen_shake_noise.generate(Shaku.gameTime.elapsed * CONFIG.screen_shake_speed, 0, 1) - .5) * CONFIG.screen_shake_size,
            shake_damp * (screen_shake_noise.generate(Shaku.gameTime.elapsed * CONFIG.screen_shake_speed, 1, 1) - .5) * CONFIG.screen_shake_size
        ));
        cur_hit.time_until_end -= Shaku.gameTime.delta;
        dt *= CONFIG.hit_slowdown;

        // draw enemy hit trail
        for (let k = 0; k < last_enemy_dash_dist; k += 4) {
            enemy_hit_trail_sprite.position.copy(last_enemy_dash_pos.add(last_enemy_dash_dir.mul(k)));
            Shaku.gfx!.drawSprite(enemy_hit_trail_sprite);
        }

        if (cur_hit.time_until_end <= 0) {
            cur_hit = null;
            Shaku.gfx.setCameraOrthographic(Vector2.zero);
        }
    } else {
        // Starting a dash?
        if (time_since_dash >= CONFIG.dash_cooldown) {
            last_dash_pos.copy(player_pos);
            // last_dash_dir = player_dir.clone();
            last_dash_dir = (cursor_sprite.position as Vector2).sub(player_pos);
            // last_dash_dist = Math.min(CONFIG.dash_dist, last_dash_dir.length);
            last_dash_dist = CONFIG.dash_dist;
            last_dash_dir.normalizeSelf();
            // player_sprite.color = Color.white;
            // setTimeout(() => {
            //     player_sprite.color = Color.black;
            // }, CONFIG.invincible_time * 1000);

            // collision with enemies
            let first_hit = rayEnemiesCollision(player_pos, last_dash_dir, last_dash_dist, CONFIG.ray_radius, null);
            if (first_hit !== null) {
                last_dash_dist = first_hit.hit_dist;
            }
            let ray_end = last_dash_pos.add(last_dash_dir.mul(last_dash_dist));
            Shaku.gfx.drawLine(last_dash_pos, ray_end, Color.white);
            if (first_hit !== null) {
                Shaku.gfx.outlineCircle(new Circle(ray_end, CONFIG.ray_radius), Color.white);
            }

            if (Shaku.input.mousePressed()) {
                time_since_dash = 0;
                if (first_hit !== null) {
                    // actual collision         

                    // mix billiard direction with original direction
                    let second_ray_dir = first_hit.hit_enemy.pos.sub(ray_end).normalizeSelf();
                    second_ray_dir = second_ray_dir.add(last_dash_dir.mul(CONFIG.dash_dir_override)).normalizeSelf()

                    last_enemy_dash_pos.copy(first_hit.hit_enemy.pos);
                    last_enemy_dash_dir.copy(second_ray_dir);

                    let second_hit = rayEnemiesCollision(
                        first_hit.hit_enemy.pos,
                        second_ray_dir,
                        CONFIG.enemy_second_hit_dist,
                        CONFIG.enemy_radius,
                        first_hit.hit_enemy
                    );

                    // first_hit.hit_enemy.pos.addSelf(second_ray_dir.mul(CONFIG.enemy_throwback_dist));
                    // first_hit.hit_enemy.vel.addSelf(second_ray_dir.mul(CONFIG.enemy_throwback_speed));

                    if (second_hit === null) {
                        first_hit.hit_enemy.pos.addSelf(second_ray_dir.mul(CONFIG.enemy_throwback_dist));
                        first_hit.hit_enemy.vel.addSelf(second_ray_dir.mul(CONFIG.enemy_throwback_speed));
                        last_enemy_dash_dist = CONFIG.enemy_throwback_dist;
                    } else {
                        first_hit.hit_enemy.pos.addSelf(second_ray_dir.mul(second_hit.hit_dist))
                        cur_hit = {
                            hitter: first_hit.hit_enemy,
                            hitted: second_hit.hit_enemy,
                            time_until_end: CONFIG.dash_hit_duration,
                        }
                        last_enemy_dash_dist = second_hit.hit_dist;
                    }
                }
            }
        }

        if (time_since_dash < CONFIG.dash_duration) {
            // draw dash trail
            player_tail_sprite.size.copy(player_sprite.size.mul(.85 * (1. - clamp(time_since_dash / CONFIG.dash_duration, 0, .5))))
            for (let k = 0; k < last_dash_dist; k += 4) {
                player_tail_sprite.position.copy(last_dash_pos.add(last_dash_dir.mul(k)));
                Shaku.gfx!.drawSprite(player_tail_sprite);
            }
        }
    }

    // Keyboard controls
    let dx = (Shaku.input.down("d") ? 1 : 0) - (Shaku.input.down("a") ? 1 : 0);
    let dy = (Shaku.input.down("s") ? 1 : 0) - (Shaku.input.down("w") ? 1 : 0);
    // player_vel.set(dx, dy);    
    // player_vel.mulSelf(CONFIG.player_speed);
    player_vel.addSelf(CONFIG.player_acc * dx * dt, CONFIG.player_acc * dy * dt);
    player_vel.mulSelf(1 / (1 + (dt * CONFIG.player_friction)));
    if (player_vel.length > 1) {
        player_dir = player_vel.normalized();
        player_sprite.rotation = player_dir.getRadians();
    }
    // Tank controls
    // let delta_rot = ((Shaku.input.down("d") ? 1 : 0) - (Shaku.input.down("a") ? 1 : 0)) * CONFIG.player_turn_speed_radians;
    // player_dir = player_dir.rotatedRadians(delta_rot * dt);
    // player_sprite.rotation = player_dir.getRadians();
    // let forward_speed = ((Shaku.input.down("w") ? 1 : 0) - (Shaku.input.down("s") ? 1 : 0)) * CONFIG.player_speed;
    // player_vel = player_dir.mul(forward_speed);

    // Mouse controls
    // let delta = (cursor_sprite.position as Vector2).sub(player_pos);
    // if (delta.length < 3) {
    //     player_vel.set(0, 0);
    // } else {
    //     player_vel = delta.normalizeSelf().mulSelf(CONFIG.player_speed);
    //     player_dir = player_vel.normalized();
    //     player_sprite.rotation = player_dir.getRadians();
    // }

    // Mouse acceleration controls
    // let target_vel = (cursor_sprite.position as Vector2).sub(player_pos);
    // target_vel.normalizeSelf();
    // player_vel = rotateTowards(player_vel, target_vel, CONFIG.player_turn_speed_radians);
    // player_vel.normalizeSelf().mulSelf(CONFIG.player_speed);

    player_pos.addSelf(player_vel.mul(dt));
    player_sprite.position.copy(player_pos);

    enemies.forEach(x => x.update(dt));
    enemies.forEach(x => x.draw());

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
function argmax(vals: number[]) {
    if (vals.length === 0) {
        return -1;
    }
    let best_index = 0;
    let best_value = vals[0];
    for (let k = 0; k < vals.length; k++) {
        const cur = vals[k];
        if (cur > best_value) {
            best_index = k;
            best_value = cur;
        }
    }
    return best_index;
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

