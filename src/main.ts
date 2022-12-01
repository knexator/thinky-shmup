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
    dash_cooldown: .5,
    dash_speed: 2600, // double speed idk
    tail_frames: 20, // double speed idk
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

// init shaku
await Shaku.init();

// add shaku's canvas to document and set resolution to 800x600
document.body.appendChild(Shaku!.gfx!.canvas);
Shaku.gfx!.setResolution(800, 600, true);
// Shaku.gfx!.centerCanvas();
// Shaku.gfx!.maximizeCanvasSize(false, false);


// Loading Screen
Shaku.startFrame();
Shaku.gfx!.clear(Shaku.utils.Color.cornflowerblue);
Shaku.endFrame();

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
    Shaku.utils.Color.black,
]);
let player_sprite = new Shaku.gfx!.Sprite(player_texture);
player_sprite.size.mulSelf(7.5);
let player_tail_sprite = new Shaku.gfx!.Sprite(player_texture);
(player_tail_sprite.color as Color).a = .5;

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
        this.vel = player_pos.sub(this.pos).normalizeSelf().mulSelf(CONFIG.enemy_speed);
        enemies.forEach(x => {
            if (x === this) return;
            let delta = this.pos.sub(x.pos);
            let delta_len = delta.length;
            if (delta_len < CONFIG.min_enemy_dist) {
                this.vel.addSelf(delta.mulSelf(smoothstep(CONFIG.min_enemy_dist, CONFIG.min_enemy_dist * .95, delta_len) * CONFIG.separation_strength / delta_len));
            }
        })

        this.pos.addSelf(this.vel.mulSelf(dt));
        this.sprite.rotation = this.vel.getRadians();
        Shaku.gfx.drawSprite(this.sprite);
    }
}

let time_since_dash = Infinity;
let last_dash_pos = Vector2.zero;
let last_dash_dir = Vector2.zero;

let player_pos = Shaku.gfx.getCanvasSize().mulSelf(.5);
let player_vel = Vector2.zero;

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

    cursor_sprite.position.copy(Shaku.input.mousePosition);

    if (time_since_dash >= CONFIG.dash_cooldown && Shaku.input.mousePressed()) {
        // Shaku.gfx.canvas.requestPointerLock();
        time_since_dash = 0;
        last_dash_pos.copy(player_pos);
        last_dash_dir = Shaku.input.mousePosition.sub(player_pos).normalizeSelf();
    }

    if (time_since_dash < CONFIG.dash_duration) {
        player_vel.copy(last_dash_dir);
        player_vel.mulSelf(CONFIG.dash_speed);
        // Shaku.input._mousePos.addSelf(player_vel.mul(Shaku.gameTime.delta));
        // untested, gradually reduce speed
        // player_vel.mulSelf(lerp(CONFIG.player_speed, CONFIG.dash_speed, time_since_dash / CONFIG.dash_duration))
    } else {
        // let dx = (Shaku.input.down("d") ? 1 : 0) - (Shaku.input.down("a") ? 1 : 0);
        // let dy = (Shaku.input.down("s") ? 1 : 0) - (Shaku.input.down("w") ? 1 : 0);
        // player_vel.set(dx, dy);
        // player_vel.mulSelf(CONFIG.player_speed);

        player_vel = Shaku.input.mousePosition.sub(player_pos).normalizeSelf();
        player_vel.mulSelf(CONFIG.player_speed);
    }

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

// start main loop
step();

