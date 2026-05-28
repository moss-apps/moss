uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 u_accent;
uniform float u_dotScale;

#define PI 3.14159265359

// Simplex noise functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 1.0;
  float freq = 1.0;
  for (int i = 0; i < 5; i++) {
    sum += amp * snoise(p * freq);
    amp *= 0.5;
    freq *= 2.0;
  }
  return sum;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  
  // Grid setup
  float gridSize = 40.0 * u_dotScale;
  vec2 grid = uv * gridSize * aspect;
  vec2 cell = fract(grid) - 0.5;
  vec2 id = floor(grid);
  
  // Noise-driven animation
  float t = u_time * 0.3;
  float noise = fbm(id * 0.08 + t * 0.15);
  float noise2 = fbm(id * 0.15 - t * 0.1 + 100.0);
  
  // Mouse influence
  vec2 mouseNorm = u_mouse / u_resolution;
  float mouseDist = length((uv - mouseNorm) * aspect);
  float mouseInfluence = smoothstep(0.5, 0.0, mouseDist) * 0.4;
  
  // Dot size variation
  float baseSize = 0.18 + noise * 0.12 + noise2 * 0.06 + mouseInfluence;
  float dist = length(cell);
  float dotMask = smoothstep(baseSize, baseSize - 0.04, dist);
  
  // Accent color influence - stronger near mouse and in noise peaks
  float accentMix = smoothstep(0.3, 0.8, noise + mouseInfluence * 2.0);
  vec3 dotColor = mix(vec3(0.93, 0.93, 0.93), u_accent, accentMix * 0.35);
  
  // Vignette and depth
  float vignette = 1.0 - smoothstep(0.3, 1.2, length((uv - 0.5) * 1.8));
  float depthFade = 0.15 + vignette * 0.55 + noise * 0.15;
  
  // Canvas color
  vec3 canvas = vec3(0.039, 0.039, 0.043);
  
  // Final color
  vec3 col = mix(canvas, dotColor, dotMask * depthFade);
  
  // Subtle grain
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += grain * 0.015;
  
  gl_FragColor = vec4(col, 1.0);
}
