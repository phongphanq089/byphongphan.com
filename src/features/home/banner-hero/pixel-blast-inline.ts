/**
 * PixelBlast Early Inline Bootstrap (Method 2)
 *
 * Executes synchronously during HTML parsing at 0ms (before React bundle downloads & hydrates).
 * Initializes WebGL2 directly on <canvas id="hero-pixel-blast-canvas"> and starts frame 0 immediately.
 * Leaves a controller at canvas.__pb_instance so React can seamlessly adopt it without any flicker or restart.
 */

export function getPixelBlastInlineScript(
  canvasId: string = "hero-pixel-blast-canvas"
): string {
  return `(function(){
  try {
    var canvas = document.getElementById("${canvasId}");
    if (!canvas || canvas.__pb_active) return;

    var container = canvas.parentElement || document.body;
    var w = Math.max(1, container.clientWidth || window.innerWidth);
    var h = Math.max(1, container.clientHeight || 500);

    canvas.width = w;
    canvas.height = h;

    var gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false
    });
    if (!gl) return;

    canvas.__pb_active = true;

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }

    function link(fsSrc) {
      var vs = compile(gl.VERTEX_SHADER, "#version 300 es\\nvoid main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));gl_Position=vec4(p*2.0-1.0,0.0,1.0);}");
      var fs = compile(gl.FRAGMENT_SHADER, fsSrc);
      if (!vs || !fs) return null;
      var prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;

      var uniforms = {};
      var count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
      for (var i = 0; i < count; i++) {
        var info = gl.getActiveUniform(prog, i);
        if (info) {
          var name = info.name.replace(/\\[0\\]$/, "");
          uniforms[name] = gl.getUniformLocation(prog, name);
        }
      }
      return { program: prog, uniforms: uniforms };
    }

    var PACKING = "const float RANGE_MIN = -6.0; const float RANGE_MAX = 10.0; vec2 pack16(float value){ float x = floor(clamp((value - RANGE_MIN) / (RANGE_MAX - RANGE_MIN), 0.0, 1.0) * 65535.0 + 0.5); float hi = floor(x / 256.0); return vec2(hi, x - hi * 256.0) / 255.0; } float unpack16(vec2 c){ float x = floor(c.x * 255.0 + 0.5) * 256.0 + floor(c.y * 255.0 + 0.5); return RANGE_MIN + x / 65535.0 * (RANGE_MAX - RANGE_MIN); }";

    var CELL_FRAGMENT = "#version 300 es\\nprecision highp float; precision highp int; uniform vec2 uResolution; uniform float uTime; uniform float uPixelSize; uniform float uScale; uniform float uDensity; uniform int uEnableRipples; uniform float uRippleSpeed; uniform float uRippleThickness; uniform float uRippleIntensity; uniform vec2 uClickPos[10]; uniform float uClickAge[10]; uniform ivec2 uOrigin; uniform vec2 uDrift; uniform int uHover; uniform vec2 uMouse; uniform float uMouseRadius; uniform float uMousePresence; uniform float uIntro; uniform sampler2D uPrev; uniform float uDecay; uniform float uFresh; out vec4 outCell; " + PACKING + " float hash11(float n){ return fract(sin(n) * 43758.5453); } float vnoise(vec3 p){ vec3 ip=floor(p); vec3 fp=fract(p); float n000=hash11(dot(ip+vec3(0.0,0.0,0.0),vec3(1.0,57.0,113.0))); float n100=hash11(dot(ip+vec3(1.0,0.0,0.0),vec3(1.0,57.0,113.0))); float n010=hash11(dot(ip+vec3(0.0,1.0,0.0),vec3(1.0,57.0,113.0))); float n110=hash11(dot(ip+vec3(1.0,1.0,0.0),vec3(1.0,57.0,113.0))); float n001=hash11(dot(ip+vec3(0.0,0.0,1.0),vec3(1.0,57.0,113.0))); float n101=hash11(dot(ip+vec3(1.0,0.0,1.0),vec3(1.0,57.0,113.0))); float n011=hash11(dot(ip+vec3(0.0,1.0,1.0),vec3(1.0,57.0,113.0))); float n111=hash11(dot(ip+vec3(1.0,1.0,1.0),vec3(1.0,57.0,113.0))); vec3 w=fp*fp*fp*(fp*(fp*6.0-15.0)+10.0); float x00=mix(n000,n100,w.x); float x10=mix(n010,n110,w.x); float x01=mix(n001,n101,w.x); float x11=mix(n011,n111,w.x); float y0=mix(x00,x10,w.y); float y1=mix(x01,x11,w.y); return mix(y0,y1,w.z)*2.0-1.0; } float fbm2(vec2 uv, float t){ vec3 p=vec3(uv*uScale, t); float amp=1.0; float freq=1.0; float sum=1.0; for(int i=0; i<5; ++i){ sum+=amp*vnoise(p*freq); freq*=1.25; } return sum*0.5+0.5; } void main(){ ivec2 texel=ivec2(gl_FragCoord.xy); float aspectRatio=uResolution.x/uResolution.y; float cellPixelSize=8.0*uPixelSize; vec2 cellId=vec2(texel+uOrigin); vec2 cellCoord=cellId*cellPixelSize; vec2 uv=cellCoord/uResolution*vec2(aspectRatio, 1.0); float base=fbm2(uv+uDrift, uTime*0.05); base=base*0.5-0.65; float feed=base+(uDensity-0.5)*0.3; if(uEnableRipples==1){ for(int i=0; i<10; ++i){ vec2 pos=uClickPos[i]; if(pos.x<0.0) continue; vec2 cuv=(((pos-uResolution*0.5-cellPixelSize*0.5)/uResolution))*vec2(aspectRatio,1.0); float t=max(uClickAge[i],0.0); float r=distance(uv,cuv); float waveR=uRippleSpeed*t; float ring=exp(-pow((r-waveR)/uRippleThickness,2.0)); float atten=exp(-0.85*t)*exp(-2.8*r); feed=max(feed, ring*atten*uRippleIntensity); } } if(uIntro<1.0){ vec2 center=(-cellPixelSize*0.5/uResolution)*vec2(aspectRatio,1.0); float reach=length(vec2(aspectRatio,1.0))*0.5+0.2; float eased=1.0-pow(1.0-uIntro, 2.4); float front=eased*reach; float r=distance(uv, center); float shown=smoothstep(front+0.04, front-0.06, r); float ring=exp(-pow((r-front)/0.08, 2.0))*(1.0-uIntro); feed=mix(-1.0, feed, shown); feed=max(feed, ring*1.6); } float brush=0.0; if(uHover>0){ vec2 d=(cellCoord+cellPixelSize*0.5+uResolution*0.5-uMouse)/max(uMouseRadius, 1.0); brush=exp(-dot(d,d))*uMousePresence; } vec4 prev=texelFetch(uPrev, texel, 0)*(1.0-uFresh); float trail=max(brush, max(prev.a*uDecay-1.0/255.0, 0.0)); if(uHover==2) feed+=trail*0.9; outCell=vec4(pack16(feed), clamp((feed+0.5)*0.5, 0.0, 1.0), trail); }";

    var BAYER = "0.0, 0.5, 0.125, 0.625, 0.03125, 0.53125, 0.15625, 0.65625, 0.75, 0.25, 0.875, 0.375, 0.78125, 0.28125, 0.90625, 0.40625, 0.1875, 0.6875, 0.0625, 0.5625, 0.21875, 0.71875, 0.09375, 0.59375, 0.9375, 0.4375, 0.8125, 0.3125, 0.96875, 0.46875, 0.84375, 0.34375, 0.046875, 0.546875, 0.171875, 0.671875, 0.015625, 0.515625, 0.140625, 0.640625, 0.796875, 0.296875, 0.921875, 0.421875, 0.765625, 0.265625, 0.890625, 0.390625, 0.234375, 0.734375, 0.109375, 0.609375, 0.203125, 0.703125, 0.078125, 0.578125, 0.984375, 0.484375, 0.859375, 0.359375, 0.953125, 0.453125, 0.828125, 0.328125";

    var MAIN_FRAGMENT = "#version 300 es\\nprecision highp float; precision highp int; uniform vec3 uColor; uniform vec3 uAccent; uniform vec2 uResolution; uniform float uTime; uniform float uClock; uniform float uPixelSize; uniform float uPixelJitter; uniform float uEdgeFade; uniform int uShapeType; uniform sampler2D uCells; uniform ivec2 uOrigin; uniform ivec2 uCellCount; uniform float uSoftness; uniform float uSmoothing; uniform float uGlow; uniform float uTwinkle; uniform float uLightMode; uniform float uTransparent; uniform float uNoise; uniform int uHover; uniform mat3 uPlane; uniform float uTilted; out vec4 fragColor; " + PACKING + " const float BAYER[64] = float[64](" + BAYER + "); vec2 gDx; vec2 gDy; float aaFrom(vec2 grad){ return abs(dot(grad, gDx)) + abs(dot(grad, gDy)); } float maskSquare(vec2 p, float cov, float soft){ if(soft<=0.0) return cov; float side=0.5*sqrt(clamp(cov,0.0,1.0)); vec2 c=p-0.5; vec2 q=abs(c)-side; float d=max(q.x,q.y); vec2 grad=q.x>q.y ? vec2(sign(c.x),0.0) : vec2(0.0,sign(c.y)); float aa=max(aaFrom(grad), 1e-4); return 1.0-smoothstep(-aa*0.5, aa*0.5, d); } void main(){ float pixelSize=uPixelSize; vec2 screen=gl_FragCoord.xy; vec4 empty=uTransparent<0.5 ? vec4(vec3(uLightMode>0.5?1.0:0.0), 1.0) : vec4(0.0); vec2 fragCoord=screen-uResolution*0.5; gDx=dFdx(fragCoord)/pixelSize; gDy=dFdy(fragCoord)/pixelSize; float cellPixelSize=8.0*pixelSize; vec2 cellId=floor(fragCoord/cellPixelSize); ivec2 texel=clamp(ivec2(cellId)-uOrigin, ivec2(0), uCellCount-1); vec2 smoothAt=(fragCoord/cellPixelSize-vec2(uOrigin))/vec2(uCellCount); vec4 blended=texture(uCells, smoothAt); float smoothFeed=blended.b*2.0-0.5; float feed=smoothFeed; float trail=uHover==1 ? blended.a : 0.0; if(feed < -0.12*uSoftness && smoothFeed < 0.2){ fragColor=empty; return; } vec2 pixelId=floor(fragCoord/pixelSize); vec2 pixelUV=fragCoord/pixelSize-pixelId; ivec2 cellBits=ivec2(mod(pixelId, 8.0)); float bayer=BAYER[cellBits.y*8+cellBits.x]-0.5; float margin=feed+bayer-0.5; float bw=uSoftness>0.0 ? smoothstep(-0.12*uSoftness, 0.12*uSoftness, margin) : step(0.0, margin); float coverage=bw; float M=maskSquare(pixelUV, coverage, uSoftness); if(uEdgeFade>0.0){ vec2 norm=gl_FragCoord.xy/uResolution; vec2 edgeA=clamp(norm/uEdgeFade, 0.0, 1.0); vec2 edgeB=clamp((1.0-norm)/uEdgeFade, 0.0, 1.0); M*=edgeA.x*edgeA.y*edgeB.x*edgeB.y; } vec3 color=mix(uColor, uAccent, 0.0); float alpha=M; fragColor=vec4(color*M, alpha); }";

    var cellShader = link(CELL_FRAGMENT);
    var mainShader = link(MAIN_FRAGMENT);
    if (!cellShader || !mainShader) return;

    var cu = cellShader.uniforms;
    var mu = mainShader.uniforms;
    var vao = gl.createVertexArray();

    function makeTexture() {
      var tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      return tex;
    }

    var targets = [0, 1].map(function() {
      var tex = makeTexture();
      var fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      return { texture: tex, framebuffer: fb };
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    var cells = { x: 0, y: 0, w: 1, h: 1, key: "" };
    var current = 0;
    var elapsed = 0;
    var clock = 0;
    var introClock = 0;
    var raf = 0;
    var last = 0;
    var fresh = true;

    function layoutCells() {
      var ps = 4.0;
      var cps = 8.0 * ps;
      var cw = canvas.width;
      var ch = canvas.height;
      var x0 = Math.floor((-cw / 2 - cps) / cps);
      var x1 = Math.floor((cw / 2 + cps) / cps);
      var y0 = Math.floor((-ch / 2 - cps) / cps);
      var y1 = Math.floor((ch / 2 + cps) / cps);
      var width = Math.max(1, Math.min(2048, x1 - x0 + 1));
      var height = Math.max(1, Math.min(2048, y1 - y0 + 1));
      var key = x0 + ":" + y0 + ":" + width + ":" + height;
      if (key === cells.key) return;
      cells.key = key;
      cells.x = x0;
      cells.y = y0;
      cells.w = width;
      cells.h = height;
      for (var k = 0; k < 2; k++) {
        gl.bindTexture(gl.TEXTURE_2D, targets[k].texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      fresh = true;
    }

    function stepCells() {
      var source = targets[current];
      var target = targets[1 - current];
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
      gl.viewport(0, 0, cells.w, cells.h);
      gl.useProgram(cellShader.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, source.texture);
      gl.uniform1i(cu.uPrev, 0);
      gl.uniform2f(cu.uResolution, canvas.width, canvas.height);
      gl.uniform1f(cu.uTime, elapsed * 0.16);
      gl.uniform1f(cu.uPixelSize, 4.0);
      gl.uniform1f(cu.uScale, 3.5);
      gl.uniform1f(cu.uDensity, 0.9);
      gl.uniform1i(cu.uEnableRipples, 1);
      gl.uniform1f(cu.uRippleSpeed, 0.38);
      gl.uniform1f(cu.uRippleThickness, 0.16);
      gl.uniform1f(cu.uRippleIntensity, 1.5);
      gl.uniform2i(cu.uOrigin, cells.x, cells.y);
      gl.uniform2f(cu.uDrift, 0.0, 0.0);
      gl.uniform1i(cu.uHover, 2);
      gl.uniform2f(cu.uMouse, canvas.width / 2, canvas.height / 2);
      gl.uniform1f(cu.uMouseRadius, 130.0);
      gl.uniform1f(cu.uMousePresence, 0.0);
      gl.uniform1f(cu.uIntro, introClock);
      gl.uniform1f(cu.uDecay, 0.0);
      gl.uniform1f(cu.uFresh, fresh ? 1.0 : 0.0);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      current = 1 - current;
      fresh = false;
    }

    function draw() {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(mainShader.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, targets[current].texture);
      gl.uniform1i(mu.uCells, 0);
      gl.uniform3f(mu.uColor, 0.796, 0.835, 0.882); // #cbd5e1
      gl.uniform3f(mu.uAccent, 0.0, 0.0, 0.0);
      gl.uniform2f(mu.uResolution, canvas.width, canvas.height);
      gl.uniform1f(mu.uTime, elapsed * 0.16);
      gl.uniform1f(mu.uClock, clock);
      gl.uniform1f(mu.uPixelSize, 4.0);
      gl.uniform1f(mu.uPixelJitter, 0.0);
      gl.uniform1f(mu.uEdgeFade, 0.35);
      gl.uniform1i(mu.uShapeType, 0);
      gl.uniform2i(mu.uOrigin, cells.x, cells.y);
      gl.uniform2i(mu.uCellCount, cells.w, cells.h);
      gl.uniform1f(mu.uSoftness, 0.2);
      gl.uniform1f(mu.uSmoothing, 1.0);
      gl.uniform1f(mu.uGlow, 0.0);
      gl.uniform1f(mu.uTwinkle, 0.35);
      gl.uniform1f(mu.uLightMode, 0.0);
      gl.uniform1f(mu.uTransparent, 1.0);
      gl.uniform1f(mu.uNoise, 0.0);
      gl.uniform1i(mu.uHover, 2);
      gl.uniform1f(mu.uTilted, 0.0);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);
    }

    layoutCells();
    stepCells();
    draw(); // Frame 0 rendered immediately!

    function frame(now) {
      var dt = last ? Math.min((now - last) / 1000, 1 / 20) : 0;
      last = now;
      elapsed += dt;
      clock += dt;
      if (introClock < 1.0) {
        introClock = Math.min(1.0, introClock + dt / 0.65);
      }
      stepCells();
      draw();
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    canvas.__pb_instance = {
      gl: gl,
      stop: function() { cancelAnimationFrame(raf); },
      destroy: function() {
        cancelAnimationFrame(raf);
        try {
          targets.forEach(function(t) {
            gl.deleteTexture(t.texture);
            gl.deleteFramebuffer(t.framebuffer);
          });
          gl.deleteVertexArray(vao);
          gl.deleteProgram(cellShader.program);
          gl.deleteProgram(mainShader.program);
        } catch (e) {}
      }
    };
  } catch (err) {
    console.warn("[PixelBlast Early]", err);
  }
})();`
}
