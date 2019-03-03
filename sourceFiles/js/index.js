/*var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true, wireframelinewidth:8} );
var cube = new THREE.Mesh( geometry, material );

cube.rotation.x = Math.PI/4;
cube.rotation.y = Math.PI/4;

scene.add( cube );

camera.position.z = 5;


render();

function render() {
	requestAnimationFrame( render );

	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}


  //geometry = new THREE.IcosahedronGeometry(200, 1 );
  //material =  new THREE.MeshBasicMaterial({
  //                                          color: 0xfff999fff,
  //                                          wireframe: true,  
  //                                          wireframelinewidth:8 })
  //mesh = new THREE.Mesh(geometry, material);
  //scene.add( mesh );
*/

var renderer, canvas, canvasPosition, camera, scene, rayCaster,  mousePosition;

    renderer = new THREE.WebGLRenderer({ antialias: false });
    canvas = renderer.domElement;
    canvasPosition = $(canvas).position();
    camera = new THREE.PerspectiveCamera(20, $(canvas).width() / $(canvas).height(), 0.01, 1e10);
    scene = new THREE.Scene();
    rayCaster = new THREE.Raycaster();
    mousePosition = new THREE.Vector2();

    scene.add(camera);

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true, wireframelinewidth:8} );
    var cube = new THREE.Mesh( geometry, material );


    var myObjects = cube;
    // myObjects.add( your object );
    // myObjects.add( your object );
    // myObjects.add( your object );
    myObjects.name = 'MyObj_s';
    scene.add(myObjects);

    render();

function render() {
  requestAnimationFrame( render );

  //cube.rotation.x += 0.01;
  //cube.rotation.y += 0.01;

  renderer.render( scene, camera );
}

function getClicked3DPoint(evt) {
    evt.preventDefault();

    mousePosition.x = ((evt.clientX - canvasPosition.left) / canvas.width) * 2 - 1;
    mousePosition.y = -((evt.clientY - canvasPosition.top) / canvas.height) * 2 + 1;

    rayCaster.setFromCamera(mousePosition, camera);
    var intersects = rayCaster.intersectObjects(scene.getObjectByName('MyObj_s').children, true);

    if (intersects.length > 0)
        return intersects[0].point;
};