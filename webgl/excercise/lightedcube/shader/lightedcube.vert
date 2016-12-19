attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
attribute vec4 a_Color;
varying vec4 v_Color;

//light
attribute vec4 a_Normal; //法向量
uniform vec3 u_LightColor; //入射光颜色
uniform vec3 u_LightDirection; //归一化世界坐标，光线方向
uniform vec3 u_AmbientLight; //环境光

void main(){
    gl_Position = u_ModelMatrix * a_Position;
    vec3 normal = normalize(vec3(a_Normal));
    float nDotL = max(dot(u_LightDirection, normal), 0.0);
    //漫反射光颜色 = 入射光颜色 *　表面基颜色 * （光线方向 · 法线方向）
    vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;
    vec3 ambient = u_AmbientLight * a_Color.rgb;
    v_Color = vec4(diffuse + ambient, a_Color.a);
}