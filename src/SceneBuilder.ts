import * as BABYLON from 'babylonjs';
import "babylonjs-loaders";


export class SceneBuilder{

    private canvas : HTMLCanvasElement;
    private camera !: BABYLON.ArcFollowCamera;
    private light !: BABYLON.HemisphericLight;
    private engine !: BABYLON.Engine;
    private scene !: BABYLON.Scene;
    private box !: BABYLON.Mesh;
    private ground !: BABYLON.Mesh;
    private hero !: BABYLON.ISceneLoaderAsyncResult;
    private skyboxMaterial !: BABYLON.StandardMaterial;


    constructor(canvas : HTMLCanvasElement){
        this.canvas = canvas;
    }

    public async __init__() : Promise<void>{
        this.initalizeEngine();
        this.initializeScene();
        await this.initializeMesh();
        this.initializeCamera();
        this.initializeLight();
        this.startScene();
    }

    public getScene() : BABYLON.Scene{
        return this.scene;
    }

    public getEngine() : BABYLON.Engine{
        return this.engine;
    }

    public getHero() : BABYLON.ISceneLoaderAsyncResult{
        return this.hero;
    }

    private initalizeEngine() : void{
        this.engine = new BABYLON.Engine(this.canvas);
    }

    private initializeScene() : void{
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
    }

    private initializeCamera() : void{
        this.camera = new BABYLON.ArcFollowCamera("Rotate Camera",Math.PI/2,Math.PI/4,80,this.hero.meshes[0],this.scene);
        this.camera.attachControl(this.canvas,true);

    }

    private initializeLight() : void{
        this.light = new BABYLON.HemisphericLight("Light", new BABYLON.Vector3(0,1,0), this.scene);
    }

    private async initializeMesh() : Promise<void>{
        this.box = BABYLON.MeshBuilder.CreateBox("skybox", {size : 3000.0}, this.scene);
	    this.initializeBox();
        this.initializeGround();
        await this.initializeHero();
    }

    private initializeBox() : void{
        this.skyboxMaterial = new BABYLON.StandardMaterial("skybox", this.scene);
	    this.skyboxMaterial.backFaceCulling = false;
	    this.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/skybox/skybox",this.scene);
	    this.skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	    this.skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	    this.skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	    this.box.material = this.skyboxMaterial;
    }
    
    private initializeGround() : void{
        this.ground = BABYLON.MeshBuilder.CreateGround("Ground", {width : 50, height : 300, subdivisions : 4},this.scene);
        const material = new BABYLON.StandardMaterial("Material",this.scene);
        material.diffuseTexture = new BABYLON.Texture("/textures/road.jpg",this.scene);
        material.specularColor = new BABYLON.Color3(0.1,0.1,0.1);
        this.ground.material = material;
    }

    private async initializeHero() : Promise<void>{
        this.hero = await BABYLON.SceneLoader.ImportMeshAsync("","/heroModel/","durian_defender_rammus.glb",this.scene);
        this.hero.meshes[0].position.y = 5;
        this.hero.meshes[0].scaling = new BABYLON.Vector3(10,10,10);
    }

    private startScene() : void{
        this.engine.runRenderLoop(() =>{
            this.scene.render();
        });
    }

}