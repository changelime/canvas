precision mediump float;
varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;
uniform vec3 u_LightColor; //平行光颜色
uniform vec3 u_PointLightColor; //点光源颜色
uniform vec3 u_LightDirection; //平行光归一化世界坐标，光线方向
uniform vec3 u_PointLightPosition; //点光源位置
uniform vec3 u_AmbientLight; //环境光

void main(){
    // gl_FragColor = v_Color;
    vec3 normal = normalize(v_Normal);
    //环境光
    vec3 ambient = u_AmbientLight * v_Color.rgb;
    //平行光
    //漫反射光颜色 = 入射光颜色 *　表面基颜色 * （光线方向 · 法线方向）
    float nDotL = max(dot(u_LightDirection, normal), 0.0);
    vec3 parellel = u_LightColor * v_Color.rgb * nDotL;

    //点光源
    //漫反射光颜色 = 入射光颜色 *　表面基颜色 * （光线方向 · 法线方向）
    vec3 lightDirection = normalize(u_PointLightPosition - v_Position);
    float nDotP = max(dot(lightDirection, normal), 0.0);
    vec3 ponit = u_PointLightColor * v_Color.rgb * nDotP;

    gl_FragColor = vec4(parellel + ponit + ambient, v_Color.a);
}