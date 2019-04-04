/*Node module needed to access files from computer*/
let fs = require('fs');

/*
Changes depending on number of data we need to use.
Currently Includes: Identifier/vertex color/x-pos/y-pos/z-pos
*/
const NUM_OF_COL = 6;

class MarkerSaver {
     /*Returns a formatted string detailing marker data. The
     array passed to it is populated as the user clicks on the Spheres
     to mark data.*/
     static createMarkerString(listOfFeatures) {
          var i;
          var j;
          var stringData = "";
          //console.log(listOfFeatures.length);
          var NUM_OF_ROWS = listOfFeatures.length;
          stringData += "#MarkerStart\n";
          for (i = 0; i < NUM_OF_ROWS; i++) {
               for (j = 0; j < NUM_OF_COL; j++) {
                    //MarkerType
                    if (j == 0) {
                         if (listOfFeatures[i][0] == 1)
                              stringData += "nosev ";
                         else if (listOfFeatures[i][0] == 2)
                              stringData += "l-eyebrowv ";
                         else if (listOfFeatures[i][0] == 3)
                              stringData += "r-eyebrowv ";
                         else if (listOfFeatures[i][0] == 4)
                              stringData += "l-eyev ";
                         else if (listOfFeatures[i][0] == 5)
                              stringData += "r-eyev ";
                         else if (listOfFeatures[i][0] == 6)
                              stringData += "l-earv ";
                         else if (listOfFeatures[i][0] == 7)
                              stringData += "r-earv ";
                         else if (listOfFeatures[i][0] == 8)
                              stringData += "chinv ";
                    }
                    //Color
                    if (j == 1)
                         stringData +=  listOfFeatures[i][1] + " ";
                    //Vertex Index
                    else if (j == 2)
                         stringData += listOfFeatures[i][2] + " "
                    //Vertex.x
                    else if (j == 3)
                         stringData +=  listOfFeatures[i][3] + " ";
                    //Vertex.y
                    else if (j == 4)
                         stringData +=  listOfFeatures[i][4] + " ";
                    //Vertex.z
                    else if (j == 5)
                         stringData +=  listOfFeatures[i][5];
               }
               stringData += "\n";
          }
          stringData += "#MarkerEnd\n";
          return stringData;
     }
     static appendMarkerData(location, markerData) {
          fs.appendFile(location, markerData, 'utf8',
               function(err) {
                    if(err) throw err;
                    console.log("Data appended to OBJ succesfully.")
               }
          );
     }
     static createMarkerFile(location, markerData) {
          fs.writeFile(location, markerData,
               function(err) {
                    if(err) throw err;
                    console.log("New marker file created succesfully.")
               }
          );
     }
     static deleteMarkerFile(location) {
          fs.stat(location, function (err, stats) {
               console.log(stats);
               if (err) throw err;
               fs.unlink(location, function(err){
                    if(err && err.code == 'ENOENT')
                         console.info("Marker file nonexistent.");
                    else if (err)
                         console.error("Error occured.");
                    console.log("Marker file \"" + location + "\" deleted successfully.");
               });
          });
     }
}

function test() {
     let markerData = "";

     let featureList = [
          [1, "#00000", 0, 0.1213, 0.554688, 0.1523554],
          [2, "#00000", 2, 0.1213, 0.554688, 0.1523554],
          [7, "#00000", 6, 0.1213, 0.554688, 0.1523554],
          [3, "#00000", 7, 0.1213, 0.554688, 0.1523554],
          [5, "#00000", 9, 0.1213, 0.554688, 0.1523554]
     ];
     markerData = MarkerSaver.createMarkerString(featureList, markerData);
     /*Appended to random file because didn't want to mess with face.obj*/
     MarkerSaver.appendMarkerData('../../obj/torus.obj', markerData);
     //MarkerSaver.createMarkerFile('FaceMarker.fmd', markerData);

     /*fmd is a made up file type. Anything after the '.' can be a filetype in windows.*/
     MarkerSaver.createMarkerFile('Marker.fmd', markerData);


     //MarkerSaver.deleteMarkerFile('Marker.fmd');
     console.log(markerData);
}

/*Run 'node MarkerSaver.js' in bash*/
//test();
