import Effect from "shaku/lib/gfx/effects/effect";
import { BasicEffect } from "shaku/lib/gfx";

export class ScreenTextureEffect extends BasicEffect {
    get vertexCode(): string {
        return `attribute vec3 position;
        attribute vec2 coord;
        attribute vec4 color;
        
        uniform mat4 projection;
        uniform mat4 world;
        
        varying vec2 v_texCoord;
        varying vec2 v_screenCord;
        varying vec4 v_color;
        
        void main(void) {
            gl_Position = projection * world * vec4(position, 1.0);
            gl_PointSize = 1.0;
            v_texCoord = coord;
            v_screenCord = gl_Position.xy / gl_Position.w;
            v_color = color;
        }`;
    }

    get fragmentCode(): string {
        return `
        #ifdef GL_ES
            precision highp float;
        #endif
        uniform sampler2D texture;

        uniform sampler2D textureR;
        uniform sampler2D textureG;
        uniform sampler2D textureB;

        varying vec2 v_texCoord;
        varying vec2 v_screenCord;
        varying vec4 v_color;
        
        void main(void) {
            vec4 sampled = texture2D(texture, v_texCoord);
            gl_FragColor = texture2D(textureR, v_screenCord * .5) * sampled.r + texture2D(textureG, .5 * v_screenCord) * sampled.g + texture2D(textureB, .5 * v_screenCord) * sampled.b;
            gl_FragColor.a = sampled.a;
            gl_FragColor.rgb *= gl_FragColor.a;

            // gl_FragColor = texture2D(texture, v_texCoord) * v_color;
            // gl_FragColor.rgb *= gl_FragColor.a;
        }`;
    }

    get uniformTypes() {
        return {
            "textureR": { type: Effect.UniformTypes.Texture, bind: Effect.UniformBinds.MainTexture },
            "textureG": { type: Effect.UniformTypes.Texture, bind: Effect.UniformBinds.MainTexture },
            "textureB": { type: Effect.UniformTypes.Texture, bind: Effect.UniformBinds.MainTexture },
            "texture": { type: Effect.UniformTypes.Texture, bind: Effect.UniformBinds.MainTexture },
            "projection": { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.Projection },
            "world": { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.World },
        };
    }

    // @ts-ignore
    /*get attributeTypes() {
        return {
            "position": { size: 3, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Position },
            "color": { size: 4, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Colors },
        };
    }*/
}

