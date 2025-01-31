uniform float uTime;
uniform float uIOR; 
uniform vec3 uBaseColor;
uniform float uDispersion;
uniform samplerCube uEnvMap; // Environment reflection map

varying vec3 csm_vNormal;
varying vec3 csm_vViewDir;
varying vec2 csm_vUv;

vec3 refractColor(vec3 color, vec3 normal, float ior) {
    float ratio = 1.0 / ior;
    vec3 refracted = refract(csm_vViewDir, normalize(normal), ratio);
    return mix(color, vec3(1.0), 0.3) * refracted;
}

void main() {
    vec3 baseColor = uBaseColor;

    // Simulate chromatic dispersion
    vec3 redRefract = refractColor(vec3(1.0, 0.2, 0.2), csm_vNormal, uIOR - uDispersion);
    vec3 greenRefract = refractColor(vec3(0.2, 1.0, 0.2), csm_vNormal, uIOR);
    vec3 blueRefract = refractColor(vec3(0.2, 0.2, 1.0), csm_vNormal, uIOR + uDispersion);

    vec3 dispersionColor = vec3(redRefract.r, greenRefract.g, blueRefract.b);

    // Fresnel effect for reflections
    float fresnel = pow(1.0 - dot(csm_vNormal, csm_vViewDir), 3.0);
    
    // Sample environment reflection (skybox, HDRI)
    vec3 reflectedColor = textureCube(uEnvMap, reflect(csm_vViewDir, csm_vNormal)).rgb;
    
    // Blend refraction and reflection
    vec3 finalColor = mix(dispersionColor, reflectedColor, fresnel);

    gl_FragColor = vec4(finalColor, 0.5); // Adjust transparency
}
