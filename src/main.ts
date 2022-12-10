import { BlendModes, builtinEffects, TextAlignments, TextureFilterModes, TextureWrapModes } from "shaku/lib/gfx";
import Shaku from "shaku/lib/shaku";
import TextureAsset from "shaku/lib/assets/texture_asset";
import * as dat from 'dat.gui';
import Color from "shaku/lib/utils/color";
import Vector2 from "shaku/lib/utils/vector2";
import Sprite from "shaku/lib/gfx/sprite";
import Circle from "shaku/lib/utils/circle";
import Perlin from "shaku/lib/utils/perlin";
import Rectangle from "shaku/lib/utils/rectangle";
import Animator from "shaku/lib/utils/animator";
import MsdfFontTextureAsset from "shaku/lib/assets/msdf_font_texture_asset";
import SpritesGroup from "shaku/lib/gfx/sprites_group";
import SoundAsset from "shaku/lib/assets/sound_asset";

import Deque from "double-ended-queue";
// import { ScreenTextureEffect } from "./screen_texture_effect";
import { BackgroundEffect } from "./background_effect";
import SoundInstance from "shaku/types/sfx/sound_instance";

const CONFIG = {
    post_merge_speed: 750,
    player_speed: 355, // 2.25s to cross the 800px screen
    enemy_speed: 150, // about half?
    min_enemy_dist: 150,
    separation_strength: 250,
    dash_duration: 0.07,
    dash_cooldown: .4,
    dash_speed: 2600, // double speed idk
    tail_frames: 20,
    dash_dist: 200,
    player_turn_speed_radians: 3,
    enemy_radius: 35,
    enemy_throwback_dist: 80,
    enemy_throwback_speed: 700,
    enemy_second_hit_dist: 150, // a bit more than throwback dist, to account for speed
    enemy_acc: 600,
    enemy_friction: 2.5,
    dodge_acc: 1500,
    dodge_prevision_time: .5,
    dodge_prevision_dot: .15,
    invincible_time: .3,
    player_acc: 8000,
    player_friction: 12,
    grab_dist: 20,
    ray_radius: 10,
    dash_hit_duration: 0.25, // freeze screen for extra effect
    player_radius: 30,
    dash_dir_override: 5,
    screen_shake_size: 33,
    screen_shake_speed: 21,
    hit_slowdown: 0.3,
    steer_resolution: 64,
    debug_steer: .1,
    bullet_speed: 200,
    bullet_radius: 30,
    turret_delay: 3,
    delayed_rot_speed: 1,
    spawn_time: .2,
    stun_time: .8,
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
gui.add(CONFIG, "bullet_speed", 0, 1000);
gui.add(CONFIG, "turret_delay", 0, 10);
gui.hide();

// init shaku
Shaku.input.setTargetElement(() => Shaku.gfx.canvas)
await Shaku.init([Shaku.assets, Shaku.sfx, Shaku.gfx, Shaku.input]);

// add shaku's canvas to document and set resolution to 800x600
document.body.appendChild(Shaku.gfx.canvas);
// Shaku.gfx!.setResolution(800, 600, true);
// Shaku.gfx!.centerCanvas();
Shaku.gfx.maximizeCanvasSize(false, false);
const SCALING = Shaku.gfx.getCanvasSize().y / 937;
// Shaku.gfx.canvas.style.display = "none";

CONFIG.enemy_radius *= SCALING;
CONFIG.player_radius *= SCALING;
CONFIG.ray_radius *= SCALING;
CONFIG.dash_dist *= SCALING;
CONFIG.min_enemy_dist *= SCALING;
CONFIG.enemy_throwback_speed *= SCALING;
CONFIG.enemy_throwback_dist *= SCALING;
CONFIG.enemy_second_hit_dist *= SCALING;
CONFIG.enemy_speed *= SCALING;
CONFIG.player_speed *= SCALING;
CONFIG.screen_shake_size *= SCALING;
CONFIG.dodge_acc *= SCALING;
CONFIG.enemy_acc *= SCALING;
CONFIG.player_acc *= SCALING;
CONFIG.separation_strength *= SCALING;
CONFIG.post_merge_speed *= SCALING;

// Loading Screen
// Shaku.startFrame();
// Shaku.gfx!.clear(Shaku.utils.Color.cornflowerblue);
// Shaku.endFrame();

let paused = true;
let animators: Animator[] = [];

enum Ship {
    C, M, Y,
    CM, MY, YC,
    CC, MM, YY,
    P1, P2, P3,
}

const COLOR_BACKGROUND = new Color(.2, .195, .205);

// @ts-ignore
const logo_font = await Shaku.assets.loadMsdfFontTexture('fonts/ZenDots.ttf', { jsonUrl: 'fonts/ZenDots.json', textureUrl: 'fonts/ZenDots.png' });

class SoundCollection {
    public instances: SoundInstance[]
    constructor(
        sources: SoundAsset[]
    ) {
        this.instances = sources.map(x => Shaku.sfx.createSound(x));
    }

    play() {
        let options = this.instances.filter(x => !x.playing);
        if (options.length === 0) {
            let cur = choice(this.instances)!;
            cur.stop();
            cur.play();
        } else {
            let cur = choice(options)!;
            cur.play();
        }
    }
}

let wood_merge_sound = new SoundCollection([
    await Shaku.assets.loadSound("sounds/wood_merge_1.mp3"),
    await Shaku.assets.loadSound("sounds/wood_merge_2.mp3"),
    await Shaku.assets.loadSound("sounds/wood_merge_3.mp3"),
]);
let wood_touch_sound = new SoundCollection([
    await Shaku.assets.loadSound("sounds/wood_touch_1.mp3"),
    await Shaku.assets.loadSound("sounds/wood_touch_2.mp3"),
    await Shaku.assets.loadSound("sounds/wood_touch_3.mp3"),
]);
let wood_crash_sound = new SoundCollection([
    await Shaku.assets.loadSound("sounds/wood_crash_1.mp3"),
    await Shaku.assets.loadSound("sounds/wood_crash_2.mp3"),
    await Shaku.assets.loadSound("sounds/wood_crash_3.mp3"),
]);

let metal_merge_sound = new SoundCollection([
    await Shaku.assets.loadSound("sounds/metal_merge_1.mp3"),
    await Shaku.assets.loadSound("sounds/metal_merge_2.mp3"),
    await Shaku.assets.loadSound("sounds/metal_merge_3.mp3"),
]);
let metal_touch_sound = new SoundCollection([
    await Shaku.assets.loadSound("sounds/metal_touch_1.mp3"),
    await Shaku.assets.loadSound("sounds/metal_touch_2.mp3"),
    await Shaku.assets.loadSound("sounds/metal_touch_3.mp3"),
]);
let metal_crash_sound = new SoundCollection([
    await Shaku.assets.loadSound("sounds/metal_crash_1.mp3"),
    await Shaku.assets.loadSound("sounds/metal_crash_2.mp3"),
    await Shaku.assets.loadSound("sounds/metal_crash_3.mp3"),
]);
let cursor_texture = await Shaku.assets.loadTexture("imgs/cursor.png", { generateMipMaps: true });
cursor_texture.filter = TextureFilterModes.Linear;
let cursor_sprite = new Sprite(cursor_texture);
cursor_sprite.size.mulSelf(SCALING);
// cursor_sprite.color = new Color(1, 1, 1, .75);

let enemy_atlas_texture = await Shaku.assets.loadTexture("imgs/enemies.png", { generateMipMaps: true });
enemy_atlas_texture.filter = TextureFilterModes.Linear;

// let player_texture = await Shaku.assets.loadTexture("imgs/player.png", { generateMipMaps: true });
// player_texture.filter = TextureFilterModes.Linear;
let player_sprite = new Shaku.gfx!.Sprite(enemy_atlas_texture);
player_sprite.setSourceFromSpritesheet(new Vector2(2, 3), new Vector2(3, 4), 0, true);
player_sprite.size.mulSelf(CONFIG.player_radius / 50);
// player_sprite.color = Color.black;
let player_tail_texture = await Shaku.assets.loadTexture("imgs/trail_particle.png", { generateMipMaps: true });
player_tail_texture.filter = TextureFilterModes.Linear;
let player_tail_sprite = new Shaku.gfx!.Sprite(player_tail_texture);
player_tail_sprite.color = new Color(1, 1, 1, .5);

// let enemy_texture = await Shaku.assets.loadTexture("imgs/enemy.png", { generateMipMaps: true });
// enemy_texture.filter = TextureFilterModes.Linear;

// let enemy_hit_trail_sprite = new Shaku.gfx!.Sprite(enemy_texture);
// enemy_hit_trail_sprite.size.mulSelf(CONFIG.enemy_radius / 50);
// enemy_hit_trail_sprite.color = new Color(1, 1, 1, .125);

let bullet_texture = await Shaku.assets.loadTexture("imgs/bullet.png", { generateMipMaps: true });
bullet_texture.filter = TextureFilterModes.Linear;

// let crash_particle_texture = await Shaku.assets.loadTexture("imgs/crash_particle.png", { generateMipMaps: true });
// crash_particle_texture.filter = TextureFilterModes.Linear;

let merge_particle_texture = await Shaku.assets.loadTexture("imgs/merge_particle.png", { generateMipMaps: true });
merge_particle_texture.filter = TextureFilterModes.Linear;


let background_texture = await Shaku.assets.loadTexture("imgs/background.png", { generateMipMaps: true });
background_texture.filter = TextureFilterModes.Linear;
background_texture.wrapMode = TextureWrapModes.Repeat;

const FULL_SCREEN_SPRITE = new Sprite(Shaku.gfx.whiteTexture);
FULL_SCREEN_SPRITE.origin = Vector2.zero;
FULL_SCREEN_SPRITE.size = Shaku.gfx.getCanvasSize();

let board_h = FULL_SCREEN_SPRITE.size.y * .8 - 10; // enemy radius hack thing
let board_w = FULL_SCREEN_SPRITE.size.y * (4 / 3 - .2) - 10;
let board_area = new Rectangle(FULL_SCREEN_SPRITE.size.x / 2 - board_w / 2, FULL_SCREEN_SPRITE.size.y / 2 - board_h / 2, board_w, board_h);

// let grunge_r_texture = await Shaku.assets.loadTexture("imgs/grunge_r.png", { generateMipMaps: true });
// grunge_r_texture.filter = TextureFilterModes.Linear;
// grunge_r_texture.wrapMode = TextureWrapModes.Repeat;
// let grunge_g_texture = await Shaku.assets.loadTexture("imgs/grunge_g.png", { generateMipMaps: true });
// grunge_g_texture.filter = TextureFilterModes.Linear;
// grunge_g_texture.wrapMode = TextureWrapModes.Repeat;
// let grunge_b_texture = await Shaku.assets.loadTexture("imgs/grunge_b.png", { generateMipMaps: true });
// grunge_b_texture.filter = TextureFilterModes.Linear;
// grunge_b_texture.wrapMode = TextureWrapModes.Repeat;

// let screen_texture_effect = Shaku.gfx.createEffect(ScreenTextureEffect);
// Shaku.gfx.useEffect(screen_texture_effect);
// // @ts-ignore
// screen_texture_effect.uniforms.textureR(grunge_r_texture, 1);
// // @ts-ignore
// screen_texture_effect.uniforms.textureG(grunge_g_texture, 2);
// // @ts-ignore
// screen_texture_effect.uniforms.textureB(grunge_b_texture, 3);
// // @ts-ignore
// Shaku.gfx.useEffect(null);

const background_effect = Shaku.gfx.createEffect(BackgroundEffect);
Shaku.gfx.useEffect(background_effect);
// @ts-ignore
background_effect.uniforms["u_texture"](background_texture, 4);
// @ts-ignore
background_effect.uniforms["u_aspect_ratio"](FULL_SCREEN_SPRITE.size.x / FULL_SCREEN_SPRITE.size.y);
// @ts-ignore
background_effect.uniforms["u_alpha"](1);
// @ts-ignore
Shaku.gfx.useEffect(null);

function addSteer(steer: number[], fn: (dir: Vector2) => number) {
    for (let k = 0; k < CONFIG.steer_resolution; k++) {
        steer[k] += fn(Vector2.fromRadians(Math.PI * 2 * k / CONFIG.steer_resolution));
    }
}

function bestDir(steer: number[]) {
    let best_index = argmax(steer);
    return Vector2.fromRadians(Math.PI * 2 * best_index / CONFIG.steer_resolution).mulSelf(steer[best_index]);
}

class Bullet {
    public sprite: Sprite
    constructor(
        public pos: Vector2,
        public vel: Vector2,
    ) {
        this.sprite = new Shaku.gfx!.Sprite(bullet_texture);
        this.sprite.size.mulSelf(CONFIG.bullet_radius / 50);
        this.sprite.position = pos;
    }

    update(dt: number) {
        this.pos.addSelf(this.vel.mul(dt));
    }

    draw() {
        this.sprite.rotation = this.vel.getRadians();
        Shaku.gfx.drawSprite(this.sprite);
    }
}

class StaticBullet extends Bullet {
    public sprite: Sprite
    constructor(
        public pos: Vector2,
        public remaining_life: number,
    ) {
        super(pos, Vector2.zero);
        this.sprite = new Shaku.gfx!.Sprite(bullet_texture);
        this.sprite.size.mulSelf(CONFIG.bullet_radius / 50);
        this.sprite.position = pos;
    }

    update(dt: number) {
        this.remaining_life -= dt;
        if (this.remaining_life <= 0) {
            bullets = bullets.filter(x => x !== this);
        }
    }

    draw() {
        Shaku.gfx.drawSprite(this.sprite);
    }
}

const rules: [Ship, Ship][][] = [
    [[Ship.C, Ship.M], [Ship.CM, Ship.P1]],
    [[Ship.M, Ship.Y], [Ship.MY, Ship.P1]],
    [[Ship.Y, Ship.C], [Ship.YC, Ship.P1]],

    [[Ship.C, Ship.C], [Ship.CC, Ship.P1]],
    [[Ship.Y, Ship.Y], [Ship.YY, Ship.P1]],
    [[Ship.M, Ship.M], [Ship.MM, Ship.P1]],

    [[Ship.C, Ship.CC], [Ship.MY, Ship.P2]],
    [[Ship.Y, Ship.YY], [Ship.CM, Ship.P2]],
    [[Ship.M, Ship.MM], [Ship.YC, Ship.P2]],

    [[Ship.C, Ship.MY], [Ship.CC, Ship.P2]],
    [[Ship.Y, Ship.CM], [Ship.YY, Ship.P2]],
    [[Ship.M, Ship.YC], [Ship.MM, Ship.P2]],

    // [[Ship.P1, Ship.P1], [Ship.P2, Ship.P2]],
    // [[Ship.P1, Ship.P2], [Ship.P3, Ship.P3]],
];

function combine(a: Ship, b: Ship): [Ship, Ship] | null {
    let input: [Ship, Ship] = [a, b];
    for (let k = 0; k < rules.length; k++) {
        let cur_rule = rules[k];
        if (sameShips(input, cur_rule[0])) {
            return cur_rule[1];
        }
        if (sameShips(input, cur_rule[1])) {
            return cur_rule[0];
        }
    }
    return null;
}

function sameShips(a: [Ship, Ship], b: [Ship, Ship]) {
    return (a[0] === b[0] && a[1] === b[1]) || (a[0] === b[1] && a[1] === b[0]);
}

function setSpriteToType(spr: Sprite, x: Ship) {
    let n = [
        Ship.M, Ship.Y, Ship.C,
        Ship.MM, Ship.YY, Ship.CC,
        Ship.YC, Ship.CM, Ship.MY,
        Ship.P1, Ship.P2, Ship.P3,
    ].indexOf(x);
    spr.setSourceFromSpritesheet(
        new Vector2(n % 3, Math.floor(n / 3)),
        new Vector2(3, 4),
        0, true
    );
    spr.size.mulSelf(CONFIG.enemy_radius / 50);
    if (x === Ship.P1) {
        spr.size.mulSelf(1.3);
    }
}

class Enemy {
    public sprite: Sprite
    public vel: Vector2
    public dir: Vector2
    public steer: number[]
    public ship_type: Ship
    public flying: boolean
    public friction: number
    public acc: number
    public hoverForce: number
    public dodgeForce: number
    public dodgeTime: number
    constructor(
        public pos: Vector2,
    ) {
        this.sprite = new Shaku.gfx!.Sprite(enemy_atlas_texture);
        this.sprite.size.mulSelf(CONFIG.enemy_radius / 50);
        this.dir = Vector2.random;
        this.vel = Vector2.zero;
        this.steer = Array(CONFIG.steer_resolution).fill(0);

        this.sprite.position = pos;
        this.ship_type = Ship.C;
        this.setType(this.ship_type);
        this.flying = false;
        this.friction = 1;
        this.acc = 1;
        this.hoverForce = 1;
        this.dodgeForce = 1;
        this.dodgeTime = 1;
    }

    setType(x: Ship) {
        this.ship_type = x;
        setSpriteToType(this.sprite, x);
    }

    steer_chaseDir(target_dir: Vector2, acc: number) {
        addSteer(this.steer, v => {
            return (Vector2.dot(v, target_dir) + 1) * .5 * acc;
        })
    }

    steer_chasePlayer(acc: number) {
        let player_dir = player_pos.sub(this.pos).normalizeSelf()
        if (player_stun_time_remaining > 0) {
            player_dir.mulSelf(-.25);
        }
        this.steer_chaseDir(player_dir, acc);
    }

    steer_hoverAndDodge() {
        enemies.forEach(other => {
            if (other === this) return;
            let delta = this.pos.sub(other.pos);
            let delta_len = delta.length;
            let delta_dir = delta.normalized();

            // try to hover at a CONFIG.min_enemy_dist distance
            if (delta_len < CONFIG.min_enemy_dist) {
                addSteer(this.steer, v => {
                    return (1.0 - Math.abs(Vector2.dot(v, delta_dir) - .65)) * this.hoverForce * CONFIG.separation_strength * lerp(2, 0, delta_len / CONFIG.min_enemy_dist);
                })
            }

            // avoid hurling enemies
            let other_speed = other.vel.length;
            let other_dir = other.vel.mul(1 / other_speed);
            // if enemy is hurling in our general direction...
            if (other_speed > this.vel.length * 1.5 && Vector2.dot(delta_dir, other.vel.normalized()) > CONFIG.dodge_prevision_dot) {
                // time until impact, only taking other enemy into account
                let remaining_time = delta_len / other_speed;
                if (remaining_time < CONFIG.dodge_prevision_time * this.dodgeTime) {
                    let closest_dist_along_ray = Vector2.dot(other_dir, delta);
                    let closest_point_along_ray = other_dir.mul(closest_dist_along_ray).subSelf(delta);
                    if (closest_point_along_ray.length < CONFIG.enemy_radius * 3) {
                        let dodge_dir = closest_point_along_ray.mul(-1).normalizeSelf();
                        addSteer(this.steer, v => {
                            let dot = Vector2.dot(v, dodge_dir);
                            if (dot > .5) {
                                return (dot - .5) * 2 * CONFIG.dodge_acc * this.dodgeForce;
                            } else if (dot < -.5) {
                                return (dot + .5) * 2 * CONFIG.dodge_acc * this.dodgeForce;
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
    }

    endUpdate(dt: number) {
        this.vel.addSelf(bestDir(this.steer).mulSelf(dt));
        this.vel.mulSelf(1 / (1 + (dt * this.friction * CONFIG.enemy_friction)));
        this.pos.addSelf(this.vel.mul(dt));
        this.bounce();
        if (this.vel.x !== 0 || this.vel.y !== 0) {
            this.dir.copy(this.vel).normalizeSelf();
        }
    }

    bounce() {
        if (this.pos.x < board_area.left) {
            this.vel.x *= -1;
            this.pos.x += (board_area.left - this.pos.x) * 2;
        } else if (this.pos.x > board_area.right) {
            this.vel.x *= -1;
            this.pos.x += (board_area.right - this.pos.x) * 2;
        } else if (this.pos.y < board_area.top) {
            this.vel.y *= -1;
            this.pos.y += (board_area.top - this.pos.y) * 2;
        } else if (this.pos.y > board_area.bottom) {
            this.vel.y *= -1;
            this.pos.y += (board_area.bottom - this.pos.y) * 2;
        }
    }

    update(dt: number) {
        this.steer.fill(0);

        this.steer_chasePlayer(CONFIG.enemy_acc * this.acc);
        this.steer_hoverAndDodge();

        this.endUpdate(dt);
    }

    draw() {
        this.sprite.rotation = this.dir.getRadians();
        Shaku.gfx.drawSprite(this.sprite);
        // for (let k = 0; k < CONFIG.steer_resolution; k++) {
        //     Shaku.gfx.drawLine(this.pos, this.pos.add(
        //         Vector2.fromRadians(Math.PI * 2 * k / CONFIG.steer_resolution).mulSelf(CONFIG.debug_steer * Math.abs(this.steer[k]))
        //     ), this.steer[k] >= 0 ? Color.green : Color.red);
        // }
    }
}

class ZombieEnemy extends Enemy {
    constructor(pos: Vector2) {
        super(pos);
        this.friction = .4;
        this.acc = 1.5;
    }

    update(dt: number) {
        this.steer.fill(0);

        this.steer_chaseDir(this.dir, CONFIG.enemy_acc * this.acc);
        this.steer_hoverAndDodge();

        this.endUpdate(dt);
    }
}

class DelayedEnemy extends Enemy {
    cur_goal: Vector2 | null;
    // cooling_time: number;
    constructor(pos: Vector2) {
        super(pos);
        this.cur_goal = null;
    }

    update(dt: number): void {
        this.steer.fill(0);

        if (this.cur_goal === null) {
            // rotate in place until facing player
            let delta = player_pos.sub(this.pos);
            this.dir = rotateTowards(this.dir, delta, CONFIG.delayed_rot_speed * dt);
            if (Math.abs(radiansBetween(this.dir, delta.normalized())) <= .0001) {
                this.cur_goal = player_pos.clone();
                // this.vel = this.dir.mul(CONFIG.enemy_speed * 4)
            }
        } else {
            // move towards
            // this.pos.addSelf(this.vel.mul(dt));
            this.steer_chaseDir(this.dir, CONFIG.enemy_speed * 30);
            if (Vector2.dot(this.dir, this.cur_goal.sub(this.pos)) <= 0) {
                this.cur_goal = null;
            }
        }

        this.steer_hoverAndDodge();

        this.vel.addSelf(bestDir(this.steer).mulSelf(dt));
        this.vel.mulSelf(1 / (1 + (dt * CONFIG.enemy_friction * 3)));
        this.pos.addSelf(this.vel.mul(dt));
        this.bounce();
    }
}

class SpiralMoveEnemy extends Enemy {
    constructor(pos: Vector2) {
        super(pos);
        this.friction = 1.0;
        this.acc = 2.0;
    }

    update(dt: number): void {
        this.steer.fill(0);
        let delta = player_pos.sub(this.pos);
        let perp = delta.rotatedDegrees(90).mulSelf(.5);
        this.steer_chaseDir(Vector2.lerp(delta, perp, .7).normalizeSelf(), CONFIG.enemy_acc * this.acc);

        // moveTowardsV(perp, delta, 50).normalizeSelf()
        // this.steer_chaseDir(player_pos.sub(this.pos).rotatedDegrees(50).normalizeSelf(), CONFIG.enemy_acc * 2);
        this.steer_hoverAndDodge();
        this.endUpdate(dt);
    }
}

class SpiralTrailEnemy extends Enemy {
    time_until_next_bullet: number;
    constructor(pos: Vector2) {
        super(pos);
        this.time_until_next_bullet = Math.random() * CONFIG.turret_delay * .1;
    }

    update(dt: number): void {
        this.steer.fill(0);
        let delta = player_pos.sub(this.pos);
        let perp = delta.rotatedDegrees(90).mulSelf(.5);
        this.steer_chaseDir(Vector2.lerp(delta, perp, .7).normalizeSelf(), CONFIG.enemy_acc * 2);

        this.time_until_next_bullet -= dt;
        if (this.time_until_next_bullet <= 0) {
            this.time_until_next_bullet = CONFIG.turret_delay * .1;
            bullets.push(new StaticBullet(this.pos.clone(), 4));
        }

        this.steer_hoverAndDodge();
        this.endUpdate(dt);
    }
}

class SpiralTurretEnemy extends Enemy {
    public time_until_next_shoot: number;
    constructor(pos: Vector2) {
        super(pos);
        this.time_until_next_shoot = CONFIG.turret_delay * Math.random() * .1;
    }

    update(dt: number): void {
        this.steer.fill(0);

        this.time_until_next_shoot -= dt;
        this.dir = this.dir.rotatedRadians(dt * -CONFIG.delayed_rot_speed * 2);
        if (this.time_until_next_shoot <= 0) {
            this.time_until_next_shoot = CONFIG.turret_delay * .1;
            bullets.push(new Bullet(this.pos.clone(), this.dir.mul(CONFIG.bullet_speed)));
        }

        this.steer_hoverAndDodge();
        this.vel.addSelf(bestDir(this.steer).mulSelf(dt));
        this.vel.mulSelf(1 / (1 + (dt * CONFIG.enemy_friction * 3)));
        this.pos.addSelf(this.vel.mul(dt));
    }
}

class EightTurretEnemy extends Enemy {
    public time_until_next_wave: number;
    constructor(pos: Vector2) {
        super(pos);
        this.time_until_next_wave = CONFIG.turret_delay * Math.random();
    }

    update(dt: number): void {
        this.steer.fill(0);

        this.time_until_next_wave -= dt;
        if (this.time_until_next_wave <= 0) {
            this.time_until_next_wave = CONFIG.turret_delay;
            for (let k = 0; k < 8; k++) {
                bullets.push(new Bullet(this.pos.clone(), Vector2.fromRadians(Math.PI * 2 * k / 8).mulSelf(CONFIG.bullet_speed)));
            }
        }

        this.steer_hoverAndDodge();
        // this.endUpdate(dt);
        this.vel.addSelf(bestDir(this.steer).mulSelf(dt));
        this.vel.mulSelf(1 / (1 + (dt * 3 * CONFIG.enemy_friction)));
        this.pos.addSelf(this.vel.mul(dt));
    }
}

// class LaserTurretEnemy extends Enemy {
//     public time_until_next_shot: number;
//     constructor(pos: Vector2) {
//         super(pos);
//         this.time_until_next_shot = CONFIG.turret_delay * Math.random();
//     }

//     update(dt: number): void {
//         this.time_until_next_shot -= dt;
//         if (this.time_until_next_shot <= 0) {
//             this.time_until_next_shot += CONFIG.turret_delay;

//         }

//         // this.endUpdate(dt);
//         this.vel.addSelf(bestDir(this.steer).mulSelf(dt));
//         this.vel.mulSelf(1 / (1 + (dt * 3 * CONFIG.enemy_friction)));
//         this.pos.addSelf(this.vel.mul(dt));
//     }
// }

// Data for the player shoot moving the enemy
let time_since_dash = Infinity;
let last_dash_pos = Vector2.zero;
let last_dash_dir = Vector2.zero;
let last_dash_dist = 0;

// Data for the actual enemy movement
let last_enemy_dash_pos = Vector2.zero;
let last_enemy_dash_dir = Vector2.zero;
let last_enemy_dash_dist = 0;
let last_dash_hit_enemy: Enemy | null = null;

let cur_hit: {
    hitter: Enemy,
    hitted: Enemy,
    time_until_end: number,
    hitter_new_vel: Vector2,
    hitted_new_vel: Vector2,
    starting: boolean,
    merge: boolean,
    particle: Sprite,
} | null = null;

let player_pos = Shaku.gfx.getCanvasSize().mulSelf(.5);
let player_dir = Vector2.right;
let player_vel = Vector2.right.mulSelf(CONFIG.player_speed);
let player_stun_time_remaining = 0;

let time_until_store_pos = 0;
let player_pos_history = new Deque<[number, Vector2]>(60);
while (player_pos_history.length < CONFIG.tail_frames) {
    player_pos_history.insertFront([0, Vector2.zero]);
}

let screen_shake_noise = new Perlin(Math.random());

let enemies: Enemy[] = [];
let bullets: Bullet[] = [];
let spawn_sprites: Sprite[] = [];

let cur_level_n = -1;
let menu_level_n = 0;
/** 0 continue, 1 restart */
let menu_vertical = -1;
const levels = [
    // [[Ship.C, Ship.C, Ship.M, Ship.M, Ship.Y, Ship.Y], [Ship.CC, Ship.M, Ship.M]],
    // [[Ship.CC, Ship.P1, Ship.YY, Ship.YY], [Ship.M]], // asdf 
    // [[Ship.MY, Ship.YC, Ship.CM, Ship.P1, Ship.MY, Ship.MY], [Ship.MY, Ship.YC, Ship.CM, Ship.P1, Ship.MM, Ship.YY]], // asdf
    // [[ Ship.MM, Ship.YY, Ship.P2, Ship.P2, Ship.P1], [Ship.MY, Ship.YC, Ship.CM, Ship.P1, Ship.MM, Ship.YY]], // asdf
    // [[Ship.MY, Ship.YC, Ship.CM, Ship.P1, Ship.MY, Ship.MY], [Ship.MY, Ship.YC, Ship.CM, Ship.P1, Ship.MM, Ship.YY]], // asdf

    [[Ship.C, Ship.C, Ship.MM], [Ship.CC, Ship.M, Ship.M]], // learn about splitting 
    [[Ship.MM, Ship.YY, Ship.P1, Ship.P1], [Ship.MY, Ship.MY, Ship.P1, Ship.P1]], // more splitting
    [[Ship.C, Ship.C, Ship.C], [Ship.Y, Ship.M, Ship.P2]], // learn about 3 equal
    [[Ship.C, Ship.Y, Ship.M], [Ship.Y, Ship.Y, Ship.P2]], // learn about 3 different
    [[Ship.M, Ship.M, Ship.P2], [Ship.C, Ship.C, Ship.P2]], // relearn about 3 different, just in case
    [[Ship.C, Ship.Y, Ship.P2, Ship.P2], [Ship.M, Ship.M, Ship.C, Ship.Y]], // relearn about a+b+2 = ccc & a+a+2 = abc
    [[Ship.M, Ship.M, Ship.M, Ship.Y], [Ship.CC, Ship.M, Ship.Y, Ship.P1]], // start with 3 equal, no options
    [[Ship.YY, Ship.YY, Ship.CC, Ship.P1], [Ship.YC, Ship.CM, Ship.MY, Ship.P1]], // forced path to the core theorem of double balls
    [[Ship.Y, Ship.Y, Ship.Y, Ship.Y], [Ship.C, Ship.C, Ship.C, Ship.C]], // start with 3 equal, then separate to change
    [[Ship.M, Ship.M, Ship.M, Ship.Y], [Ship.M, Ship.Y, Ship.Y, Ship.Y]], // "start with 3 equal, no options" twice in ping pong
    [[Ship.CC, Ship.YY, Ship.P2, Ship.P2], [Ship.CC, Ship.MM, Ship.P2, Ship.P2]], // visit the core theorem
    // [[Ship.Y, Ship.Y, Ship.M, Ship.M, Ship.M], [Ship.Y, Ship.Y, Ship.C, Ship.C, Ship.M]], // start with 3 equal // redundant & confusing
    [[Ship.CC, Ship.YY, Ship.MM, Ship.P1, Ship.P1], [Ship.CC, Ship.CC, Ship.CC, Ship.P1, Ship.P1]], // join two to get an extra P1
    [[Ship.C, Ship.M, Ship.P2, Ship.P2], [Ship.C, Ship.C, Ship.C, Ship.M]], // combine two previous levels to test player's memory
    [[Ship.C, Ship.C, Ship.M, Ship.M, Ship.Y], [Ship.Y, Ship.Y, Ship.Y, Ship.Y, Ship.Y]], // start with 3 different (the cool one)
    // [[Ship.C, Ship.C, Ship.YY, Ship.YY, Ship.YY, Ship.YY, Ship.YY, Ship.YY], [Ship.CC, Ship.P1, Ship.YY, Ship.YY, Ship.YY, Ship.YY, Ship.YY, Ship.YY]],
    [[Ship.YC, Ship.YC, Ship.P1, Ship.MM, Ship.P2, Ship.P2], [Ship.YY, Ship.CC, Ship.P1, Ship.MM, Ship.P2, Ship.P2]], // CATALYST (do stuff to get a P1) probably too confusing & unintended solutions idk
]
let initial_types: Ship[] = [];
let target_types: Ship[] = [];
let target_types_sprites: Sprite[] = [];
let outdated_types_sprites: Sprite[] = [];

let logo_text = Shaku.gfx.buildText(logo_font, "Catalyst", 178 * SCALING, Color.white, TextAlignments.Center);
logo_text.position = Shaku.gfx.getCanvasSize().mul(.5, .125);

let start_text = Shaku.gfx.buildText(logo_font, "Start", 120 * SCALING, Color.white, TextAlignments.Center);
start_text.position = Shaku.gfx.getCanvasSize().mul(.5, .5);
// start_text._sprites.forEach(x => x.position.addSelf(0, -40));

let continue_text = Shaku.gfx.buildText(logo_font, "Continue", 100 * SCALING, Color.white, TextAlignments.Center);
continue_text.position = Shaku.gfx.getCanvasSize().mul(.5, .45);

let restart_text = Shaku.gfx.buildText(logo_font, "Restart", 100 * SCALING, Color.white, TextAlignments.Center);
restart_text.position = Shaku.gfx.getCanvasSize().mul(.5, .6);

let level_n_text: SpritesGroup[] = [];
for (let k = 0; k < levels.length; k++) {
    let cur = Shaku.gfx.buildText(logo_font, `Level ${k + 1}`, 54 * SCALING, Color.white, TextAlignments.Center);
    cur.position = Shaku.gfx.getCanvasSize().mul(.5, .75);
    level_n_text.push(cur);
}

let arrow_right_text = Shaku.gfx.buildText(logo_font, ">", 54 * SCALING, Color.white, TextAlignments.Center);
arrow_right_text.position = Shaku.gfx.getCanvasSize().mul(.5, .75);
arrow_right_text.position.x += SCALING * 175;
const arrow_right_text_x = arrow_right_text.position.x;
let arrow_left_text = Shaku.gfx.buildText(logo_font, "<", 54 * SCALING, Color.white, TextAlignments.Center);
arrow_left_text.position = Shaku.gfx.getCanvasSize().mul(.5, .75);
arrow_left_text.position.x -= SCALING * 175;
const arrow_left_text_x = arrow_left_text.position.x;

let pause_menu_types_sprites: Sprite[][] = levels.map(([initial, target]) => {
    let res: Sprite[] = [];
    initial.forEach((x, k) => {
        let cur = new Shaku.gfx!.Sprite(enemy_atlas_texture);
        setSpriteToType(cur, x);
        cur.position = board_area.getBottomLeft().addSelf((k + .5) * CONFIG.enemy_radius * 2.5, - CONFIG.enemy_radius * 1);
        cur.rotation = Math.PI;
        res.push(cur);
    });
    target.forEach((x, k) => {
        let cur = new Shaku.gfx!.Sprite(enemy_atlas_texture);
        setSpriteToType(cur, x);
        cur.position = board_area.getBottomRight().addSelf(-(k + .5) * CONFIG.enemy_radius * 2.5, - CONFIG.enemy_radius * 1);
        res.push(cur);
    });
    return res;
});

let level_ended = false;
function updateCompletedTargets() {
    level_ended = enemies.length === target_types_sprites.length;
    let existing = enemies.map(x => x.ship_type);
    console.log("existing: ", existing);
    target_types_sprites.forEach((x, k) => {
        let existing_index = existing.indexOf(target_types[k]);
        if (existing_index !== -1) {
            existing.splice(existing_index, 1);
            x.color = new Color(1, 1, 1, .5);
        } else {
            x.color = new Color(1, 1, 1, 1);
            level_ended = false;
        }
    });
}

// addEventListener("resize", (event) => {
//     // todo: resize everything
//     Shaku.gfx!.maximizeCanvasSize(false, false);
//     FULL_SCREEN_SPRITE.size = Shaku.gfx.getCanvasSize();
//     Shaku.gfx.useEffect(background_effect);
//     // @ts-ignore
//     background_effect.uniforms["u_aspect_ratio"](FULL_SCREEN_SPRITE.size.x / FULL_SCREEN_SPRITE.size.y);
//     // @ts-ignore
//     Shaku.gfx.useEffect(null);
// });

function fastSpawnEnemy(x: Ship, pos: Vector2) {
    let enemy_class = Enemy;
    // switch (x) {
    //     case Ship.C:
    //     case Ship.M:
    //     case Ship.Y:
    //         enemy_class = Enemy;
    //         break;
    //     case Ship.P2:
    //         enemy_class = Enemy;
    //         break;
    //     case Ship.P1:
    //         enemy_class = Enemy;
    //         break;
    //     default:
    //         enemy_class = Enemy;
    //         break;
    // }
    let enemy = new enemy_class(pos);
    enemy.setType(x);
    switch (x) {
        case Ship.C:
        case Ship.M:
        case Ship.Y:
            // fast, constantly near
            enemy.friction = 1.25;
            enemy.acc = 1.25;
            break;
        case Ship.P2:
            // vanilla
            enemy.friction = 1;
            enemy.acc = 1;
            break;
        case Ship.P1:
            // slow
            enemy.friction = 2;
            enemy.acc = 1.0;
            break;
        default:
            // fast but takes a while to change direction
            enemy.dodgeForce = 1.2;
            enemy.dodgeTime = 1.2;
            enemy.hoverForce = 1.2;
            enemy.friction = .5;
            enemy.acc = 0.9;
            break;
    }
    enemies.push(enemy);
    return enemy;
}

function spawnEnemy(x: Ship, delay: number) {
    animators.push(new Animator(null).duration(delay).then(() => {
        let pos = new Vector2(Math.random(), Math.random()).mulSelf(board_area.getSize()).addSelf(board_area.getTopLeft());
        while (pos.distanceTo(player_pos) < SCALING * CONFIG.player_radius * 4) {
            pos = new Vector2(Math.random(), Math.random()).mulSelf(board_area.getSize()).addSelf(board_area.getTopLeft());
        }
        let spawn_sprite = new Sprite(merge_particle_texture);
        spawn_sprite.position.copy(pos);
        spawn_sprite.setSourceFromSpritesheet(
            new Vector2(0, 0), new Vector2(3, 3), 0, true
        );
        spawn_sprite.size.mulSelf(1.7 * SCALING);
        spawn_sprites.push(spawn_sprite);

        let spawned = false;
        // @ts-ignore
        animators.push(new Animator(spawn_sprite).duration(CONFIG.spawn_time).onUpdate(t => {
            let n = Math.floor(t * 9);
            spawn_sprite.setSourceFromSpritesheet(
                new Vector2(n % 3, Math.floor(n / 3)), new Vector2(3, 3), 0, true
            );
            spawn_sprite.size.mulSelf(1.7 * SCALING);
            if (!spawned && t > .5) {
                spawned = true;
                fastSpawnEnemy(x, pos);
            }
        }).then(() => {
            spawn_sprites = spawn_sprites.filter(y => y !== spawn_sprite);
        }));
    }));
}

function unloadCurrentEnemies() {
    enemies = [];
}

function loadLevel(n: number, regenerate_targets: boolean = true) {
    level_ended = false;

    let also_end_prev_level = regenerate_targets && target_types_sprites.length > 0;
    if (also_end_prev_level) {
        // old types go out of the way
        outdated_types_sprites = [...target_types_sprites];
        outdated_types_sprites.forEach((x, k) => {
            animators.push(new Animator(x).to(
                { "position.y": Shaku.gfx.getCanvasSize().y + CONFIG.enemy_radius * 3 }
            ).duration(.75 - k * .04).delay((outdated_types_sprites.length - k) * .1).smoothDamp(true));
        });
    }

    initial_types = levels[n][0];
    target_types = levels[n][1];

    // drop in new enemies
    initial_types.forEach((x, k) => {
        spawnEnemy(x, k * .1);
    })

    if (regenerate_targets) {
        // drop in new types
        target_types_sprites = target_types.map((x, k) => {
            let res = new Shaku.gfx!.Sprite(enemy_atlas_texture);
            setSpriteToType(res, x);
            // res.color = new Color(1, 1, 1, 1);
            res.position.set(board_area.x + board_area.width + CONFIG.enemy_radius * 3, - CONFIG.enemy_radius * 3);
            animators.push(new Animator(res).to(
                { "position.y": board_area.y + (k + .5) * CONFIG.enemy_radius * 3 }
            ).duration(.75 - k * .02).delay((also_end_prev_level ? 1.00 : 0.00) + (target_types.length - k) * .03).smoothDamp(true));
            return res;
        });
    }
    // updateCompletedTargets();
}

function playTouchSound(x: Ship) {
    switch (x) {
        case Ship.P1:
        case Ship.P2:
            metal_touch_sound.play();
            console.log("playing metal_touch_sound")
            break;
        default:
            wood_touch_sound.play();
            console.log("playing wood_touch_sound")
            break;
    }
}

function playMergeSound(x1: Ship, x2: Ship) {
    if (x1 === Ship.P1 || x1 === Ship.P2 || x2 === Ship.P1 || x2 === Ship.P2) {
        metal_merge_sound.play();
        console.log("playing metal_merge_sound")
    } else {
        wood_merge_sound.play();
        console.log("playing wood_merge_sound")
    }
}

function playCrashSound(x1: Ship, x2: Ship) {
    if (x1 === Ship.P1 || x1 === Ship.P2 || x2 === Ship.P1 || x2 === Ship.P2) {
        metal_crash_sound.play();
        console.log("playing metal_crash_sound")
    } else {
        wood_crash_sound.play();
        console.log("playing wood_crash_sound")
    }
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

function drawGame() {
    if (cur_hit !== null) {
        // draw enemy hit trail
        let original_size = cur_hit.hitter.sprite.size.clone();
        cur_hit.hitter.sprite.size.copy(player_sprite.size.mul(.85));
        for (let k = last_enemy_dash_dist * .5; k < last_enemy_dash_dist * 1.25; k += 4) {
            cur_hit.hitter.sprite.color = new Color(.65, .65, .65, clamp(k / (1.5 * last_enemy_dash_dist) - .2 * (time_since_dash / CONFIG.dash_duration), 0, 1));
            cur_hit.hitter.sprite.position.copy(last_enemy_dash_pos.add(last_enemy_dash_dir.mul(k)));
            Shaku.gfx!.drawSprite(cur_hit.hitter.sprite);
        }
        cur_hit.hitter.sprite.size.copy(original_size);
        cur_hit.hitter.sprite.color = Color.white;
    }

    target_types_sprites.forEach(x => Shaku.gfx.drawSprite(x));
    outdated_types_sprites.forEach(x => Shaku.gfx.drawSprite(x));
    enemies.forEach(x => x.draw());
    bullets.forEach(x => x.draw());
    spawn_sprites.forEach(x => Shaku.gfx.drawSprite(x));
    if (cur_hit !== null && cur_hit.merge) {
        let t = cur_hit.time_until_end / CONFIG.dash_hit_duration;
        t = remap(t, .9, 0, 0, 1);
        t = Math.floor(t * 9);
        // console.log(t);
        if (t >= 0) {
            cur_hit.particle.setSourceFromSpritesheet(
                new Vector2(t % 3, Math.floor(t / 3)), new Vector2(3, 3), 0, true
            );
            cur_hit.particle.size.mulSelf(1.7 * SCALING);
            Shaku.gfx.drawSprite(cur_hit.particle);
        }
    }

    player_tail_sprite.size.copy(player_sprite.size.mul(.5))
    for (let k = 0; k < CONFIG.tail_frames; k++) {
        let cur = player_pos_history.get(k)!;
        player_tail_sprite.size.mulSelf(.9);
        player_tail_sprite.position.copy(cur[1]);
        player_tail_sprite.color = new Color(1, 1, 1, cur[0]);
        Shaku.gfx!.drawSprite(player_tail_sprite);
    }

    Shaku.gfx!.drawSprite(player_sprite);
}

function updateAnimators(delta: number) {
    for (let i = animators.length - 1; i >= 0; --i) {
        animators[i].update(delta);
        if (animators[i].ended) {
            animators.splice(i, 1);
        }
    }
}

// do a single main loop step and request the next step
function step() {
    // start a new frame and clear screen
    Shaku.startFrame();
    Shaku.gfx!.clear(COLOR_BACKGROUND);

    // if (Shaku.input.mousePressed()) {
    //     Shaku.gfx.canvas.requestFullscreen();
    // }

    cursor_sprite.position.copy(Shaku.input.mousePosition);

    Shaku.gfx.useEffect(background_effect);
    // @ts-ignore
    background_effect.uniforms.u_time(Shaku.gameTime.elapsed);
    // @ts-ignore
    background_effect.uniforms["u_alpha"](1);
    Shaku.gfx.drawSprite(FULL_SCREEN_SPRITE);
    // @ts-ignore
    Shaku.gfx.useEffect(null);

    if (cur_level_n !== -1 && Shaku.input.pressed("escape")) {
        paused = !paused;
        menu_vertical = 0;
        menu_level_n = cur_level_n;
    }

    if (paused) {
        if (cur_level_n !== -1) {
            // actual pause instead of start up menu
            drawGame();
            Shaku.gfx.useEffect(background_effect);
            // @ts-ignore
            background_effect.uniforms.u_alpha(.5);
            Shaku.gfx.drawSprite(FULL_SCREEN_SPRITE);
            // @ts-ignore
            Shaku.gfx.useEffect(null);
        }
        updateAnimators(Shaku.gameTime.delta * 2);

        let menu_horizontal = 0;
        if (cursor_sprite.position.x > Shaku.gfx.getCanvasSize().x / 2 + 160 * SCALING) {
            menu_horizontal = 1;
        } else if (cursor_sprite.position.x < Shaku.gfx.getCanvasSize().x / 2 - 160 * SCALING) {
            menu_horizontal = -1;
        }
        if (menu_vertical === 2 && menu_level_n < levels.length - 1) {
            if (Shaku.input.pressed(["right", "d"]) || (Shaku.input.mousePressed() && menu_horizontal === 1)) {
                menu_level_n += 1;
                level_n_text[menu_level_n].scale.x = Math.random() * .1 + 1.1;
                level_n_text[menu_level_n].scale.y = level_n_text[menu_level_n].scale.x;
                level_n_text[menu_level_n].rotation = .1;
                animators.push(new Animator(level_n_text[menu_level_n]).to({ "scale.x": 1, "scale.y": 1, "rotation": 0 }).duration(.1));
            }
        }
        if (menu_vertical === 2 && menu_level_n > 0) {
            if (Shaku.input.pressed(["left", "a"]) || (Shaku.input.mousePressed() && menu_horizontal === -1)) {
                menu_level_n -= 1;
                level_n_text[menu_level_n].scale.x = Math.random() * .2 + 1.1;
                level_n_text[menu_level_n].scale.y = level_n_text[menu_level_n].scale.x;
                level_n_text[menu_level_n].rotation = -.1;
                animators.push(new Animator(level_n_text[menu_level_n]).to({ "scale.x": 1, "scale.y": 1, "rotation": 0 }).duration(.1));
            }
        }
        if (Shaku.input.pressed(["up", "w"])) {
            menu_vertical = Math.max(menu_vertical - 1, 0);
        }
        if (Shaku.input.pressed(["down", "s"])) {
            menu_vertical = Math.min(menu_vertical + 1, 2);
        }
        if (Shaku.input.mouseMoving) {
            menu_vertical = (cursor_sprite.position.y * SCALING < 565) ? 0 : (cursor_sprite.position.y * SCALING < 695 ? 1 : 2);
        }

        let scale = Math.sin(Shaku.gameTime.elapsed * 6.0) * .03 + 1;
        Shaku.gfx.useEffect(builtinEffects.MsdfFont);
        Shaku.gfx.drawGroup(logo_text, false);
        if (cur_level_n === -1) {
            if (menu_vertical === 2) {
                start_text.scale.set(1, 1);
            } else {
                start_text.scale.set(scale, scale);
            }
            Shaku.gfx.drawGroup(start_text, false);
        } else {
            if (menu_vertical === 0) {
                continue_text.scale.set(scale, scale);
                restart_text.scale.set(1, 1);
            } else if (menu_vertical === 1) {
                restart_text.scale.set(scale, scale);
                continue_text.scale.set(1, 1);
            }
            Shaku.gfx.drawGroup(continue_text, false);
            Shaku.gfx.drawGroup(restart_text, false);
        }
        level_n_text[menu_level_n].scale.set(1, 1);
        arrow_right_text.position.x = arrow_right_text_x;
        arrow_left_text.position.x = arrow_left_text_x;
        if (menu_vertical === 2) {
            if (menu_horizontal === 0) {
                level_n_text[menu_level_n].scale.set(scale, scale);
            } else if (menu_horizontal === 1) {
                arrow_right_text.position.x = arrow_right_text_x + (scale - 1) * 400;
            } else if (menu_horizontal === -1) {
                arrow_left_text.position.x = arrow_left_text_x - (scale - 1) * 400;
            }
        }
        Shaku.gfx.drawGroup(level_n_text[menu_level_n], false);
        if (menu_level_n > 0) {
            Shaku.gfx.drawGroup(arrow_left_text, false);
        }
        if (menu_level_n < levels.length - 1) {
            Shaku.gfx.drawGroup(arrow_right_text, false);
        }
        // @ts-ignore
        Shaku.gfx.useEffect(null);

        pause_menu_types_sprites[menu_level_n].forEach(x => Shaku.gfx.drawSprite(x));

        Shaku.gfx!.drawSprite(cursor_sprite);

        if (cur_level_n === -1) {
            if (Shaku.input.pressed("space") || (Shaku.input.mousePressed() && (menu_vertical < 2 || menu_horizontal === 0))) {
                cur_level_n = menu_level_n;
                loadLevel(cur_level_n);
                paused = false;
            }
        } else {
            if (menu_vertical === 0) {
                if (Shaku.input.pressed("space") || Shaku.input.mousePressed()) {
                    paused = false;
                }
            } else if (menu_vertical === 1) {
                if (Shaku.input.pressed("space") || Shaku.input.mousePressed()) {
                    unloadCurrentEnemies();
                    loadLevel(cur_level_n, false);
                    paused = false;
                }
            } else if (menu_vertical === 2) {
                if (Shaku.input.pressed("space") || (Shaku.input.mousePressed() && (menu_vertical < 2 || menu_horizontal === 0))) {
                    unloadCurrentEnemies();
                    cur_level_n = menu_level_n;
                    loadLevel(cur_level_n);
                    paused = false;
                }
            }
        }
        // if ((Shaku.input.pressed("space") || Shaku.input.mousePressed())) {
        //         cur_level_n = menu_level_n;
        //         loadLevel(cur_level_n);
        //     } else {
        //         if (menu_vertical === 0) {

        //         } else {

        //         }
        //     }
        //     paused = false;
        // }
        // console.log(cursor_sprite.position.x);

        Shaku.endFrame();
        Shaku.requestAnimationFrame(step);
        return;
    }

    let dt = Shaku.gameTime.delta;
    updateAnimators(dt);
    // cursor_sprite.position.copy(Shaku.input.mousePosition);

    if (cur_hit !== null) {
        // freezed screen
        let shake_damp = cur_hit.time_until_end / CONFIG.dash_hit_duration;
        Shaku.gfx.setCameraOrthographic(new Vector2(
            shake_damp * (screen_shake_noise.generate(Shaku.gameTime.elapsed * CONFIG.screen_shake_speed, 0, 1) - .5) * CONFIG.screen_shake_size,
            shake_damp * (screen_shake_noise.generate(Shaku.gameTime.elapsed * CONFIG.screen_shake_speed, 1, 1) - .5) * CONFIG.screen_shake_size
        ));
        cur_hit.time_until_end -= Shaku.gameTime.delta;
        dt *= CONFIG.hit_slowdown;
        if (cur_hit.starting) {
            dt *= .2;
            if (cur_hit!.time_until_end / CONFIG.dash_hit_duration < .5) {
                cur_hit.starting = false;
                let new_types = combine(cur_hit.hitter.ship_type, cur_hit.hitted.ship_type);
                if (new_types !== null) {
                    cur_hit.merge = true;
                    enemies = enemies.filter(x => x !== cur_hit!.hitted && x !== cur_hit!.hitter);
                    let new_enemy_1 = fastSpawnEnemy(new_types[0], cur_hit.hitted.pos.clone());
                    let new_enemy_2 = fastSpawnEnemy(new_types[1], cur_hit.hitter.pos.clone());
                    cur_hit.hitted = new_enemy_1;
                    cur_hit.hitter = new_enemy_2;
                    updateCompletedTargets();
                    if (level_ended) {
                        let delays: number[] = [];
                        for (let i = 0; i < enemies.length; i++) {
                            delays.push(i * .2);
                        }
                        shuffle(delays);
                        let pending: boolean[] = Array(target_types.length).fill(true);
                        let target_type_index: number[] = [];
                        enemies.forEach(x => {
                            let res = 0;
                            while (target_types[res] !== x.ship_type || !pending[res]) {
                                res++;
                            }
                            pending[res] = false;
                            target_type_index.push(res);
                        });
                        enemies.forEach((x, k) => {
                            x.flying = true;
                            let p0 = x.pos.clone();
                            let pE = target_types_sprites[target_type_index[k]].position as Vector2;
                            let p1 = Vector2.lerp(p0, pE, .5);
                            p1.addSelf(Vector2.random.mulSelf(200));
                            let original_size = x.sprite.size.clone();
                            // @ts-ignore
                            animators.push(new Animator(x).onUpdate(t => {
                                // x.pos.copy(Vector2.lerp(p0, pE, t));
                                x.pos.copy(bezier3(t, p0, p1, pE));
                                x.sprite.size = original_size.mul(1 - t * (1 - t) * (1 - t) * 3);
                            }).duration(.75).smoothDamp(true).delay(delays[k]).then(() => {
                                enemies = enemies.filter(y => y !== x);
                                target_types_sprites[target_type_index[k]].color = Color.white;
                                console.log("end");
                            }));
                        });

                        animators.push(new Animator(null).duration((enemies.length - 1) * .2 + .76).then(() => {
                            if (cur_level_n + 1 < levels.length) {
                                cur_level_n += 1;
                                loadLevel(cur_level_n);
                            } else {
                                // todo: victory screen
                            }
                        }));
                    }
                } else {
                    cur_hit.merge = false;
                    cur_hit.hitted.vel.addSelf(cur_hit.hitted_new_vel);
                    cur_hit.hitter.vel.addSelf(cur_hit.hitter_new_vel);
                }
            }
        }

        if (cur_hit.time_until_end <= 0) {
            Shaku.gfx.setCameraOrthographic(Vector2.zero);
            if (cur_hit.merge) {
                cur_hit.hitted.vel.addSelf(cur_hit.hitted_new_vel);
                cur_hit.hitter.vel.addSelf(cur_hit.hitter_new_vel);
            }
            cur_hit = null;
        }
    } else {
        // Starting a dash?
        if (time_since_dash >= CONFIG.dash_cooldown && !level_ended && player_stun_time_remaining === 0) {
            last_dash_pos.copy(player_pos);
            // last_dash_dir = player_dir.clone();
            last_dash_dir = (cursor_sprite.position as Vector2).sub(player_pos);
            // last_dash_dist = Math.min(CONFIG.dash_dist, last_dash_dir.length);
            last_dash_dist = CONFIG.dash_dist;
            last_dash_dir.normalizeSelf();

            // collision with enemies
            let first_hit = rayEnemiesCollision(player_pos, last_dash_dir, last_dash_dist, CONFIG.ray_radius, null);
            if (first_hit !== null) {
                last_dash_dist = first_hit.hit_dist;
            }
            let ray_end = last_dash_pos.add(last_dash_dir.mul(last_dash_dist));
            let perp_dir = last_dash_dir.rotatedDegrees(90).normalizeSelf().mul(CONFIG.ray_radius);
            if (first_hit !== null) {
                Shaku.gfx.drawLine(last_dash_pos.add(perp_dir).add(last_dash_dir.mul(30)), ray_end.add(perp_dir), Color.white);
                Shaku.gfx.drawLine(last_dash_pos.sub(perp_dir).add(last_dash_dir.mul(30)), ray_end.sub(perp_dir), Color.white);
                Shaku.gfx.fillCircle(new Circle(ray_end, CONFIG.ray_radius), Color.white);
            } else {
                Shaku.gfx.drawLines([last_dash_pos.add(perp_dir).add(last_dash_dir.mul(30)), ray_end.add(perp_dir)], [Color.white, Color.black]);
                Shaku.gfx.drawLines([last_dash_pos.sub(perp_dir).add(last_dash_dir.mul(30)), ray_end.sub(perp_dir)], [Color.white, Color.black]);
                /*for (let k = 0; k < 10; k++) {
                    const element = array[k];
                    
                }*/
                // let lines = [new Shaku.utils.Vector2(50, 50), new Shaku.utils.Vector2(500, 150), new Shaku.utils.Vector2(500, 150)];
                // let colors = [Color.cyan, Color.magenta, Color.yellow];
                // Shaku.gfx.drawLines(lines, colors);
            }

            if (Shaku.input.mousePressed()) {
                time_since_dash = 0;
                last_dash_hit_enemy = null;
                if (first_hit !== null) {
                    // actual collision
                    last_dash_hit_enemy = first_hit.hit_enemy;

                    // mix billiard direction with original direction
                    let second_ray_dir = first_hit.hit_enemy.pos.sub(ray_end).normalizeSelf();
                    second_ray_dir = second_ray_dir.add(last_dash_dir.mul(CONFIG.dash_dir_override)).normalizeSelf()

                    last_enemy_dash_pos.copy(first_hit.hit_enemy.pos);
                    last_enemy_dash_dir.copy(second_ray_dir);

                    let wall_collision_time = Infinity;
                    let wall_vector_modify = Vector2.one;
                    let collision_time_left = (board_area.left - first_hit.hit_enemy.pos.x) / second_ray_dir.x;
                    if (collision_time_left > 0 && collision_time_left <= CONFIG.enemy_throwback_dist) {
                        wall_collision_time = collision_time_left;
                        wall_vector_modify = new Vector2(-1, 1);
                    }
                    let collision_time_right = (board_area.right - first_hit.hit_enemy.pos.x) / second_ray_dir.x;
                    if (collision_time_right > 0 && collision_time_right <= CONFIG.enemy_throwback_dist && collision_time_right < wall_collision_time) {
                        wall_collision_time = collision_time_right;
                        wall_vector_modify = new Vector2(-1, 1);
                    }
                    let collision_time_up = (board_area.top - first_hit.hit_enemy.pos.y) / second_ray_dir.y;
                    if (collision_time_up > 0 && collision_time_up <= CONFIG.enemy_throwback_dist && collision_time_up < wall_collision_time) {
                        wall_collision_time = collision_time_up;
                        wall_vector_modify = new Vector2(1, -1);
                    }
                    let collision_time_down = (board_area.bottom - first_hit.hit_enemy.pos.y) / second_ray_dir.y;
                    if (collision_time_down > 0 && collision_time_down <= CONFIG.enemy_throwback_dist && collision_time_down < wall_collision_time) {
                        wall_collision_time = collision_time_down;
                        wall_vector_modify = new Vector2(1, -1);
                    }

                    let second_hit = rayEnemiesCollision(
                        first_hit.hit_enemy.pos,
                        second_ray_dir,
                        CONFIG.enemy_second_hit_dist,
                        CONFIG.enemy_radius,
                        first_hit.hit_enemy
                    );
                    if (second_hit !== null) {
                        second_hit.hit_dist -= CONFIG.enemy_radius / 2; // wtf
                    }

                    // first_hit.hit_enemy.pos.addSelf(second_ray_dir.mul(CONFIG.enemy_throwback_dist));
                    // first_hit.hit_enemy.vel.addSelf(second_ray_dir.mul(CONFIG.enemy_throwback_speed));

                    if (second_hit === null || wall_collision_time < second_hit.hit_dist) {
                        if (wall_collision_time < Infinity) {
                            first_hit.hit_enemy.pos.addSelf(second_ray_dir.mul(wall_collision_time));
                            first_hit.hit_enemy.vel.addSelf(second_ray_dir.mul(CONFIG.enemy_throwback_speed * (1 - wall_collision_time / CONFIG.enemy_throwback_dist)).mulSelf(wall_vector_modify));
                            last_enemy_dash_dist = wall_collision_time;
                        } else {
                            first_hit.hit_enemy.pos.addSelf(second_ray_dir.mul(CONFIG.enemy_throwback_dist));
                            first_hit.hit_enemy.vel.addSelf(second_ray_dir.mul(CONFIG.enemy_throwback_speed));
                            last_enemy_dash_dist = CONFIG.enemy_throwback_dist;
                        }
                        playTouchSound(first_hit.hit_enemy.ship_type);
                    } else {
                        let new_types = combine(first_hit.hit_enemy.ship_type, second_hit.hit_enemy.ship_type);
                        console.log("new types are: ", new_types)
                        if (new_types === null) {
                            playCrashSound(first_hit.hit_enemy.ship_type, second_hit.hit_enemy.ship_type);
                        } else {
                            playMergeSound(first_hit.hit_enemy.ship_type, second_hit.hit_enemy.ship_type);
                        }

                        // let hitter_new_vel = second_ray_dir
                        first_hit.hit_enemy.pos.addSelf(second_ray_dir.mul(second_hit.hit_dist))
                        // console.log(Vector2.distance(first_hit.hit_enemy.pos, second_hit.hit_enemy.pos));
                        // first_hit.hit_enemy.vel.set(0, 0);
                        // second_hit.hit_enemy.vel.set(0, 0);
                        // console.log("SPRITE thing: ", Vector2.distance(first_hit.hit_enemy.pos, first_hit.hit_enemy.sprite.position as Vector2));
                        let hit_to_hitter = second_hit.hit_enemy.pos.sub(first_hit.hit_enemy.pos).normalizeSelf();
                        // let hitter_new_vel = second_ray_dir.sub(hit_to_hitter.mul(Vector2.dot(hit_to_hitter, second_ray_dir)));
                        // let hitted_new_vel = second_ray_dir.sub(hitter_new_vel);
                        let hitted_new_vel = hit_to_hitter.mul(Vector2.dot(hit_to_hitter, second_ray_dir));
                        let hitter_new_vel = second_ray_dir.sub(hitted_new_vel);
                        // first_hit.hit_enemy.vel.addSelf(hitter_new_vel.mul(500));
                        // second_hit.hit_enemy.vel.addSelf(hitted_new_vel.mul(500));
                        let new_particle = new Sprite(merge_particle_texture);
                        new_particle.size.mulSelf(SCALING);
                        new_particle.position = first_hit.hit_enemy.pos.add(hit_to_hitter.mul(CONFIG.enemy_radius));
                        new_particle.rotation = hit_to_hitter.getRadians() + Math.PI / 2;
                        // Avoid straight shoots having too much energy
                        let damp = remap(Vector2.dot(second_ray_dir, hit_to_hitter), 0, 1, 1, .75);
                        cur_hit = {
                            hitter: first_hit.hit_enemy,
                            hitted: second_hit.hit_enemy,
                            time_until_end: CONFIG.dash_hit_duration,
                            hitter_new_vel: hitter_new_vel.mul(CONFIG.post_merge_speed * damp),
                            hitted_new_vel: hitted_new_vel.mul(CONFIG.post_merge_speed * damp),
                            starting: true,
                            merge: true,
                            particle: new_particle,
                        }
                        last_enemy_dash_dist = second_hit.hit_dist;
                    }
                }
            }
        }

        if (time_since_dash < CONFIG.dash_duration) {
            // draw dash trail
            // player_tail_sprite.size.copy(player_sprite.size.mul(.85 * (1. - clamp(time_since_dash / CONFIG.dash_duration, 0, .5))));
            player_tail_sprite.size.copy(player_sprite.size.mul(.35));
            for (let k = 0; k < last_dash_dist; k += 4) {
                player_tail_sprite.color = new Color(.65, .65, .65, clamp(k / last_dash_dist - .2 * (time_since_dash / CONFIG.dash_duration), 0, 1));
                player_tail_sprite.position.copy(last_dash_pos.add(last_dash_dir.mul(k)));
                Shaku.gfx!.drawSprite(player_tail_sprite);
            }
        }
    }

    if (player_stun_time_remaining === 0) {
        // Keyboard controls
        let dx = ((Shaku.input.down("d") || Shaku.input.down("right")) ? 1 : 0) - ((Shaku.input.down("a") || Shaku.input.down("left")) ? 1 : 0);
        let dy = ((Shaku.input.down("s") || Shaku.input.down("down")) ? 1 : 0) - ((Shaku.input.down("w") || Shaku.input.down("up")) ? 1 : 0);
        // player_vel.set(dx, dy);    
        // player_vel.mulSelf(CONFIG.player_speed);
        let normalizer = (Math.abs(dx) + Math.abs(dy)) === 2 ? Math.SQRT1_2 : 1
        player_vel.addSelf(CONFIG.player_acc * dx * normalizer * dt, CONFIG.player_acc * dy * normalizer * dt);
        player_vel.mulSelf(1 / (1 + (dt * CONFIG.player_friction)));
        if (player_vel.length > 1) {
            player_dir = player_vel.normalized();
            player_sprite.rotation = player_dir.getRadians();
        }
    } else {
        player_vel.mulSelf(1 / (1 + (dt * CONFIG.player_friction * .35)));
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
    if (player_pos.x < board_area.left) {
        player_vel.x *= -1;
        player_pos.x += (board_area.left - player_pos.x) * 2;
    } else if (player_pos.x > board_area.right) {
        player_vel.x *= -1;
        player_pos.x += (board_area.right - player_pos.x) * 2;
    } else if (player_pos.y < board_area.top) {
        player_vel.y *= -1;
        player_pos.y += (board_area.top - player_pos.y) * 2;
    } else if (player_pos.y > board_area.bottom) {
        player_vel.y *= -1;
        player_pos.y += (board_area.bottom - player_pos.y) * 2;
    }
    player_sprite.position.copy(player_pos);

    if (!level_ended) {
        enemies.forEach(x => x.update(dt));
    }
    bullets.forEach(x => x.update(dt));
    if (cur_hit === null && player_stun_time_remaining === 0) {
        // maybe stun player
        let colliding_index = enemies.findIndex(x => !x.flying && Vector2.distance(player_pos, x.pos) < (CONFIG.enemy_radius + CONFIG.player_radius));
        if (colliding_index !== -1) {
            player_stun_time_remaining = CONFIG.stun_time;
        }
    }


    if (player_stun_time_remaining > 0) {
        player_stun_time_remaining -= dt;
        if (player_stun_time_remaining <= 0) {
            player_sprite.color = Color.white;
            player_stun_time_remaining = 0;
        } else {
            player_sprite.color = (Math.floor(player_stun_time_remaining * 7) % 2 === 0) ? Color.white : Color.gray;
        }
    }

    drawGame();

    // time_until_store_pos -= dt;
    // if (time_until_store_pos <= 0) {
    player_pos_history.removeBack();
    // player_pos_history.insertFront(player_inputing ? player_pos.sub(player_dir.mul(CONFIG.player_radius * .8)) : null);
    player_pos_history.insertFront([player_vel.length / 600, player_pos.sub(player_dir.mul(CONFIG.player_radius * .7))]);
    // console.log(player_vel.length);
    //     time_until_store_pos = 0.01;
    // }

    Shaku.gfx!.drawSprite(cursor_sprite);
    // @ts-ignore
    Shaku.gfx.useEffect(null);

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

function choice<T>(arr: T[]) {
    if (arr.length === 0) {
        return undefined
    }
    return arr[Math.floor(Math.random() * arr.length)];
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

/** How much to rotate a so it its be */
function radiansBetween(a: Vector2, b: Vector2) {
    let radians = b.getRadians() - a.getRadians();
    // get them in the interval [-PI+eps, PI+eps] to bias the result
    let eps = .01;
    return mod(radians + Math.PI + eps, Math.PI * 2) - Math.PI + eps;
}

function rotateTowards(cur_val: Vector2, target_val: Vector2, max_radians: number): Vector2 {
    let radians = radiansBetween(cur_val, target_val);
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

// from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle<T>(array: T[]) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

// from https://stackoverflow.com/questions/6711707/draw-a-quadratic-b%C3%A9zier-curve-through-three-given-points
function bezier3(t: number, p0: Vector2, p1: Vector2, p2: Vector2) {
    let result = p2.mul(t * t);
    result.addSelf(p1.mul(2 * t * (1 - t)));
    result.addSelf(p0.mul((1 - t) * (1 - t)));
    return result;
}

// from https://stackoverflow.com/questions/16227300/how-to-draw-bezier-curves-with-native-javascript-code-without-ctx-beziercurveto
function bezier4(t: number, p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2) {
    var cX = 3 * (p1.x - p0.x),
        bX = 3 * (p2.x - p1.x) - cX,
        aX = p3.x - p0.x - cX - bX;

    var cY = 3 * (p1.y - p0.y),
        bY = 3 * (p2.y - p1.y) - cY,
        aY = p3.y - p0.y - cY - bY;

    var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
    var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

    return new Vector2(x, y);
}

document.getElementById("loading")!.style.opacity = "0";
// Shaku.gfx.canvas.style.display = "initial";
// start main loop
step();

// todo: "click to start"
Shaku.gfx.canvas.style.cursor = "none";