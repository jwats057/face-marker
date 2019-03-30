    //Adds spheres to the vertices of the face object (mesh)
    //Then push to objects array
    function sphereMesh(mesh, object, scene){
      var sphereGeom;
      var material;
      var sphere;
      var sphereMeshes = [];

      //for each vertex, create sphere mesh and translate to face mesh vertices
      for(var i = 0; i < mesh.geometry.vertices.length; i++){
        sphereGeom = new THREE.SphereGeometry(.01,7,7);
        material = new THREE.MeshBasicMaterial({color: 0x43a242});
        sphere = new THREE.Mesh(sphereGeom, material);
        sphere.geometry.translate(mesh.geometry.vertices[i].x, mesh.geometry.vertices[i].y, mesh.geometry.vertices[i].z);
        scene.add(sphere);
        sphereMeshes.push(sphere);
        objects.push(sphere);
      }

	  //push sphere meshes to objects array
      for(var i = 0; i < mesh.geometry.vertices.length; i++){
          object[sphereMeshes[i].uuid] = sphereMeshes[i];
      }

    }
