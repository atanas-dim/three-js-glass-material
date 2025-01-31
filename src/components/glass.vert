varying vec3 csm_vNormal;
varying vec3 csm_vViewDir;
varying vec2 csm_vUv;

void main() {
    csm_vUv = uv;
    csm_vNormal = normalize(normalMatrix * normal);
    csm_vViewDir = normalize(cameraPosition - position);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
