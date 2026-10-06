"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/components/motion/gsap";

export default function BackgroundShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    const vs = `
      attribute vec2 p;
      void main(){
        gl_Position = vec4(p, 0.0, 1.0);
      }
    `;

    const fs = `
      precision mediump float;
      uniform vec2 r;
      uniform float t;
      uniform vec2 m;
      uniform float s;

      float h(vec2 p){
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float n(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(h(i), h(i + vec2(1.0, 0.0)), f.x),
                   mix(h(i + vec2(0.0, 1.0)), h(i + vec2(1.0, 1.0)), f.x), f.y);
      }

      float fb(vec2 p){
        float v = 0.0;
        float a = 0.5;
        for(int i = 0; i < 5; i++){
          v += a * n(p);
          p *= 2.02;
          a *= 0.5;
        }
        return v;
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / r;
        vec2 p = uv * vec2(r.x / r.y, 1.0) * 1.6;
        vec2 mm = m * vec2(r.x / r.y, 1.0) * 1.6;
        float d = exp(-3.0 * length(p - mm));

        p.y += s * 0.0006;
        vec2 q = vec2(fb(p + t * 0.03), fb(p + vec2(5.2, 1.3) - t * 0.025));
        vec2 w = vec2(fb(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.04 + d * 0.6),
                      fb(p + 3.0 * q + vec2(8.3, 2.8) - t * 0.03));
        float f = fb(p + 2.5 * w);

        vec3 ivory = vec3(0.957, 0.945, 0.918);
        vec3 sage  = vec3(0.78,  0.84,  0.74);
        vec3 wheat = vec3(0.90,  0.85,  0.72);
        vec3 moss  = vec3(0.55,  0.65,  0.53);

        vec3 col = mix(ivory, sage, smoothstep(0.35, 0.85, f));
        col = mix(col, wheat, smoothstep(0.4, 0.9, length(q)) * 0.55);
        col = mix(col, moss, smoothstep(0.62, 1.0, w.x) * 0.35 + d * 0.12);
        col += (h(gl_FragCoord.xy + t) - 0.5) * 0.018;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, vs);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const ur = gl.getUniformLocation(program, "r");
    const ut = gl.getUniformLocation(program, "t");
    const um = gl.getUniformLocation(program, "m");
    const us = gl.getUniformLocation(program, "s");

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onMouse = (e: MouseEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMouse, { passive: true });

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const t0 = performance.now();

    const render = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      gl.uniform2f(ur, canvas.width, canvas.height);
      gl.uniform1f(ut, (performance.now() - t0) / 1000);
      gl.uniform2f(um, mouse.x, mouse.y);
      gl.uniform1f(us, window.scrollY);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    gsap.ticker.add(render);

    return () => {
      gsap.ticker.remove(render);
      window.removeEventListener("pointermove", onMouse);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
