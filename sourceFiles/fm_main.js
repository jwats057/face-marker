var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
var scene;
var objects = [];
var noseArray = [];
var eyebrowArray = [];
var mouse3D;

window.onload=function(){
var renderer, camera, control, sphereGeo;
var divElem, divObj;
var i = 1;
var raycaster;

init();
animate();

function init() {
     scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x0000ff );
     camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1.0, 1000);
     camera.position.z = 1;
	mouse3D = new THREE.Vector2();
	raycaster =  new THREE.Raycaster();
     renderer = new THREE.WebGLRenderer();
     renderer.setSize(window.innerWidth, window.innerHeight);
     document.body.appendChild(renderer.domElement);
     control = new THREE.OrbitControls(camera, renderer.domElement);
     //control.addEventListener('change', function() {
          //onCameraChange();
     //});
	//ywindow.addEventListener( 'mousemove', onMouseMove, false );
     var size = 10;
     var divisions = 10;
     //var gridHelper = new THREE.GridHelper( size, divisions );
     //scene.add( gridHelper );

	// instantiate a loader
     var loader = new THREE.OBJLoader();

     // load a resource
     //var light = new THREE.PointLight( 0xffffff, 1, 20 );
     //light.position.set( 0, 0, 2 );
     //scene.add(light);
     loader.load(
	     // resource URL
          'obj/face.obj',
	      // called when resource is loaded
	     function ( obje ) {
	     //var material = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} );
               obje.traverse( function ( child ) {
                    if ( child.isMesh ){
			          //child.material = material;
                    }
		     });

	          //scene.add( obje );
	          var bb = new THREE.Box3()
	          bb.setFromObject(obje);
	          bb.getCenter(control.target);
	          //camera.lookAt(bb.position);
	          var cubeGeo = new THREE.Geometry().fromBufferGeometry( obje.children[0].geometry );
 	         //var cubeGeo =  obje.children[0].geometry;//new THREE.Geometry().fromBufferGeometry(obje.children[0].geometry);

               /*Start of Spheres*/
               //cubeGeo = new THREE.SphereGeometry(1,7,7);
               sphereGeo = cubeGeo;
               var cubeMaterial = new THREE.MeshBasicMaterial( {color: 0xcccccc, wireframe: false} );
               var cubeMesh = new THREE.Mesh(sphereGeo, cubeMaterial); //obje.children[0].materials);
               //cubeMesh.scale.set(100, 100, 100);

               var eGeometry = new THREE.EdgesGeometry( cubeMesh.geometry );
               var eMaterial = new THREE.LineBasicMaterial( { color: 0xcccccc, linewidth: 1 } );
               var edges = new THREE.LineSegments( eGeometry, eMaterial );
               //cubeMesh.add( edges );
               //scene.add(cubeMesh);
               console.log( "BufferGeometry:"+cubeMesh.geometry.isBufferGeometry );
          	//var ageometry = new THREE.Geometry().fromBufferGeometry( cubeMesh.geometry );
               var edgelist = getEdges(cubeMesh.geometry);//cubeMesh.geometry
              //console.log("edgelist: "+edgelist.length);
              /*
              for(var i=0; i<cubeMesh.geometry.vertices.length; i++) {
                   eu = edgelist[i].filter(onlyUnique);
                   console.log("edgelist: "+i+": "+eu);

                   for(var j=0; j<eu.length; j++) {
                        console.log("e: "+i+","+eu[j]);
                        var cyMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                        var cylinder = cylinderMesh(cubeGeo.vertices[i], cubeGeo.vertices[eu[j]], cyMaterial);
                        scene.add(cylinder);
                        objects[cylinder.uuid] = cylinder;
                   }
              }
              */
               var sphereObjects = [];
               var sphereMeshes = [];
               var materials = [];

               for(var i=0; i<cubeMesh.geometry.vertices.length; i++) {
                    var sphere = new THREE.SphereGeometry(.01, 5, 5);
                    sphereObjects.push(sphere);
               }
               for(var i=0; i<cubeMesh.geometry.vertices.length; i++) {
	               var material1 = new THREE.MeshBasicMaterial({color: 0x00ff00});
                    materials.push(material1);
               }
               for (i = 0; i < cubeGeo.vertices.length; i++) {
                    //sphereObjects[i] = sphereObjects[i].translate(cubeGeo.vertices[i].x, cubeGeo.vertices[i].y, cubeGeo.vertices[i].z);
                    sphereMeshes.push( new THREE.Mesh(sphereObjects[i], materials[i]) );
               }

               for(var i=0; i<cubeMesh.geometry.vertices.length; i++) {
     	          sphereMeshes[i].position.set(cubeGeo.vertices[i].x, cubeGeo.vertices[i].y, cubeGeo.vertices[i].z);
	               scene.add(sphereMeshes[i]);
                    objects[sphereMeshes[i].uuid] = sphereMeshes[i];
	               //console.log("sphereMesh uuid: "+sphereMeshes[i].uuid);
	               //console.log("x:"+sphereMeshes[i].position.x+" y:"+sphereMeshes[i].position.y+" z:"+sphereMeshes[i].position.z);
               }
	          /*End of Spheres*/
	     },
	     // called when loading is in progresses
	     function ( xhr ) {
	     	console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	     },
	     // called when loading has errors
     	function ( error ) {
	     	console.log( 'An error happened' );
     	}
     );

    console.log("objects size: "+objects.length);
    showLog();

     displayGUI(); //function call for gui
    //showCoords(event);
    //document.addEventListener("click", showCoords);
    document.addEventListener( 'mousedown', onDocumentMouseDown );
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function getEdges(geometry) {
     var vertices = {};
     var faceIndices = [ 'a', 'b', 'c', 'd' ];
     for(var i=0;i<geometry.vertices.length;i++) {
          vertices[i]=[];
     }

     for(var i =0;i<geometry.faces.length;i++) {
         face = geometry.faces[ i ];
         numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;

         var faceVertices = [];
         for( var j=0;j<numberOfSides; j++) {
              vertexIndex = face[ faceIndices[ j ] ];
              faceVertices.push(vertexIndex);
         }

         if (vertices[faceVertices[1]].indexOf(faceVertices[0])==-1)
              vertices[faceVertices[0]].push(faceVertices[1]);
         if (vertices[faceVertices[2]].indexOf(faceVertices[0])==-1)
             vertices[faceVertices[0]].push(faceVertices[2]);
         if (vertices[faceVertices[2]].indexOf(faceVertices[1])==-1)
             vertices[faceVertices[1]].push(faceVertices[2]);
         /*vertices.push([ Math.min(faceVertices[0], faceVertices[1]), Math.max(faceVertices[0], faceVertices[1]) ]);
         vertices.push([ Math.min(faceVertices[0], faceVertices[2]), Math.max(faceVertices[0], faceVertices[2]) ]);
         vertices.push([ Math.min(faceVertices[1], faceVertices[2]), Math.max(faceVertices[1], faceVertices[2]) ]);*/
          //console.log("faceVertices length: "+faceVertices.length);
     }
     return vertices;
}

function cylinderMesh(pointX, pointY, material) {
     var direction = new THREE.Vector3().subVectors(pointY, pointX);
     var orientation = new THREE.Matrix4();
     orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
     orientation.multiply(new THREE.Matrix4().set(
          1,  0, 0, 0,
          0,  0, 1, 0,
          0, -1, 0, 0,
          0,  0, 0, 1
     ));
     var edgeGeometry = new THREE.CylinderGeometry(0.01/4, 0.01/4, direction.length(), 8, 1);
     var edge = new THREE.Mesh(edgeGeometry, material);
     edge.applyMatrix(orientation);
     // position based on midpoints - there may be a better solution than this
     edge.position.x = (pointY.x + pointX.x) / 2;
     edge.position.y = (pointY.y + pointX.y) / 2;
     edge.position.z = (pointY.z + pointX.z) / 2;
     return edge;
}

/*function onDocumentMouseDown( event ) {
            //event.preventDefault();

			mouse3D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse3D.y = -( event.clientY / window.innerHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse3D, camera );
            var intersects = raycaster.intersectObjects( scene.children);

            if ( intersects.length > 0 ) {
                console.log("intersects.length: "+intersects.length);

                //console.log("intersected objects position: "+intersects[ 0 ].object.uuid);

				for ( var i = 0; i < intersects.length; i++ ) {
				var uuidtemp = intersects[i].object.uuid;
				//console.log("uuid: "+uuidtemp);

				if (objects.hasOwnProperty(uuidtemp)){
				    var objID = intersects[ i ].object.id;
                    console.log("We got object: "+objID+" Random:"+Math.random());
					//objects[intersects[ 0 ].object.uuid].material.color.setHex( Math.random() * 0xffffff );
					//scene.updateMatrixWorld(true);
					var pt = new THREE.Vector3();
					pt.setFromMatrixPosition( intersects[ i ].object.matrixWorld );
					console.log("position pt: x:"+pt.x+" y:"+pt.y+" z:"+pt.z);
                    intersects[ i ].object.material.color.setHex( Math.random() * 0xffffff );

					if(lastInputID != 0){
						//$('#'+lastInputID).val(objID+','+$('#'+lastInputID).val());//$('#'+lastInputID).val()+","+i);
						//var trimmed = $('#'+lastInputID).val().replace(/(^[,\s]+)|([,\s]+$)/g, '');
						//$('#'+lastInputID).val(trimmed);
					}
				}
                }
                //intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
        }

}*/

//raycast on mouse down
function onDocumentMouseDown( event ) {
     //event.preventDefault();
     var mouse3D = new THREE.Vector2( ( event.clientX / window.innerWidth ) * 2 - 1,
                                    -( event.clientY / window.innerHeight ) * 2 + 1);
                                    //0.5 );
     var raycaster =  new THREE.Raycaster();
     raycaster.setFromCamera( mouse3D, camera );
     var intersects = raycaster.intersectObjects(objects);
     var resume = true;

     //checks for duplicate selected vertex
     function checkDuplicate(arr, k){
          var res = true;
          if(arr.length > 1){
               for(var j = 0; j < arr.length; j++){
                    if(arr[j] == k){
                         //console.log("duplicate vertex");
                         res = false;
                         break;
                    }
                    else{
                         res = true;
                         //console.log("ok vertex");
                     }
                }
              }
              return res;
     }
     if ( intersects.length > 0 ) {
          //console.log("intersects.length: "+intersects.length);
          //console.log("intersected objects position: "+intersects[ 0 ].object.uuid);
          //console.log("v: " + intersects[ 0 ].object.geometry.vertices[0]);
          for(var i=0; i<objects.length; i++) {
               if (objects[i].uuid == intersects[0].object.uuid) {
                    console.log("We got object: "+i);
                    //switch based on current state
                    switch(state){
                         case 1:     //Nose
                              resume = checkDuplicate(noseArray, i);  //duplicate?
                              console.log("resume: " + resume);
                              if(resume == true){
                                   console.log("Nose point");
                                   objects[i].material.color.setHex( Math.random() * 0xffffff );   //see selection
                                   noseArray.push(i);  //not duplicate, so push (index) to array
                              }
                              break;
                         case 2:     //Eyebrows
                              resume = checkDuplicate(eyebrowArray, i);
                              console.log("resume: " + resume);
                              if(resume == true){
                                   console.log("Eyebrow point");
                                   objects[i].material.color.setHex( Math.random() * 0xffffff );
                                   eyebrowArray.push(i)
                              }
                              break;
                         default:    //Null
                              console.log("Null state");
                              break;
                    }
               }
          }
     //intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
     }
}

//Create gui and handle gui events
function displayGUI(){
     var gui = new dat.GUI();
     /*var jar;

     var parameters = {
          a: "NosePoints",
          b: "Eyebrows",
          c: false
     }*/
     var str = "-";
     var controller = new function(){
          this.Nose = str;
          this.Eyebrows = str;
          this.Check = false;
          this.Print = false;
     }();
     var labels = gui.addFolder('Labels')
     labels.add(controller, 'Nose', str).onChange(function(){  //
          state = 1;  //global state for Nose
          (controller.Nose) = noseArray;    //see verts/edges from array in gui
     });
     //labels.add(parameters, 'a').name('NosePoints');
     labels.add(controller, 'Eyebrows', str).onChange(function(){
          state = 2;
          (controller.Eyebrows) = eyebrowArray;
     });
     labels.add(controller, 'Check', false).onChange(function(){
          state = 0;  //Null state
     });
     labels.add(controller, 'Print', false).onChange(function(){ //Print vert/edge indices
          console.log("Nose: " + noseArray);
          console.log("Eyebrows: " + eyebrowArray);
     });
     gui.open();
}


function showLog() {
/*
    var log = "Object Info...</br>Number of vertices: "+ sphereGeo.vertices.length;
    for (i = 0; i < sphereGeo.vertices.length; i++) {

      log+="</br> vertex["+i+"]: "+ sphereGeo.vertices[i].x+", "+ sphereGeo.vertices[i].y+ ", "+ sphereGeo.vertices[i].z;

    }

    document.getElementById("log").innerHTML=log;
*/
}

function showLogLive() {
     var logLive = "Object Info...</br>Number of vertices: "+ sphereGeo.vertices.length;
     logLive += "</br> Projected Vertex coordinates:";
     for (i = 0; i < sphereGeo.vertices.length; i++) {
          var proj = createVector(sphereGeo.vertices[i].x, sphereGeo.vertices[i].y, sphereGeo.vertices[i].z, camera, renderer.context.canvas.width, renderer.context.canvas.height);
          logLive += "</br> vertex["+i+"]: "+ proj.x+", "+proj.y;
     }
    document.getElementById("logLive").innerHTML=logLive;
}

function showCoords(event) {
     var vector = new THREE.Vector3();
     vector.set((event.clientX / window.innerWidth ) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
     vector.unproject( camera );

     var dir = vector.sub( camera.position ).normalize();
     var distance = - camera.position.z / dir.z;
     var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
     var pos2 = createVector(pos.x, pos.y, 0, camera, window.innerWidth, window.height);
     alert(pos2.x+" "+pos2.y);
}


//window.requestAnimationFrame(render);
function animate() {
     requestAnimationFrame( animate );
	//render( scene, camera );
     //update();
     render();
     stats.update();
}

function update() {
    control.update();
}

function render() {
    renderer.render(scene, camera);
}

function onCameraChange() {
    //showLogLive();
    //var proj = toScreenPosition(sphereGeo.vertices[i], camera);
    //showLog();
    //document.getElementById("log").innerHTML+="</br> projected coordinate: "+proj.x+", "+proj.y;
    //var proj = toScreenPosition(divObj, camera);
    //divElem.style.left = proj.x + 'px';
    //divElem.style.top = proj.y + 'px';
}

function createVector(x, y, z, camera, width, height) {
     var p = new THREE.Vector3(x, y, z);
     var vector = p.project(camera);
     vector.x = (vector.x + 1) / 2 * width;
     vector.y = -(vector.y - 1) / 2 * height;
     return vector;
}
}
var lastInputID=0;
var polyLineObjects = [];
$(document).ready(function(){
     document.body.appendChild(stats.dom);
     $("#btn2").click(function(){
	     var lID = $( "#labelName" ).val().replace(/\s/g, '');
          $("ol").append("<li>"+$( "#labelName" ).val()+"</li><input placeholder='Click here then on sphere' id='input"+lID+"'><input type='checkbox' id='poly"+lID+"' value='show'> Show poly lines");

          $("#input"+lID).on("click", function() {
               console.log("Clicked input.");
               lastInputID = $(this).attr("id");
	     	console.log("Last input id: "+ lastInputID);
          });
	     $("#poly"+lID).on("click", function() {
               console.log("Clicked checkbox.");
		     var list = $("#input"+lID).val();
		     var array = list.split(',');
		     var points3D = new THREE.Geometry();
		     for (var i in array) {
		          console.log("List " + array[i]);
			     //console.log("x:"+objects[array[i]].position.x+" y:"+objects[array[i]].position.y+" z:"+objects[array[i]].position.z);
			     //console.log(objects[425]);
			     points3D.vertices.push( // here you can use 3-dimensional coordinates
			          new THREE.Vector3(objects[array[i]].position.x, objects[array[i]].position.y, objects[array[i]].position.z)
			     );
		     }
		     var line2 = new THREE.Line(points3D, new THREE.LineBasicMaterial({color: "red"}));
		     scene.add(line2);
          });
     });
});
