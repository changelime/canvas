attribute vec4 a_Position;
uniform mat4 u_MvpMatrix;
uniform mat4 u_ModelMatrix;
attribute vec4 a_Color;
varying vec4 v_Color;

//light
attribute vec4 a_Normal; //法向量
uniform mat4 u_NormalMatrix;

//
varying vec3 v_Normal;
varying vec3 v_Position;
void main(){
    gl_Position = u_MvpMatrix * a_Position;
    //顶点世界坐标
    v_Position = vec3(u_ModelMatrix * a_Position);
    v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
    v_Color = a_Color;
}