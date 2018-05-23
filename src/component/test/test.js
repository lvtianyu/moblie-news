import cytoscape from "cytoscape";


$(function(){
    
    console.log(1);
    var cy = window.cy=cytoscape({
  
        container: document.getElementById('cy'),
      
        elements: [
          { // node n1
            group: 'nodes', 
      
      
            data: {
              id: 'n1', 
              //parent: 'nparent', 
            },
      
            scratch: {
              _foo: 'bar' 
            },
      
            position: { 
              x: 100,
              y: 100
            },
      
            selected: false, // whether the element is selected (default false)
      
            selectable: true, // whether the selection state is mutable (default true)
      
            locked: false, // when locked a node's position is immutable (default false)
      
            grabbable: true, // whether the node can be grabbed and moved by the user
      
            classes: 'foo bar' // a space separated list of class names that the element has
          },
      
          { // node n2
            data: { id: 'n2' },
            renderedPosition: { x: 200, y: 200 } 
            // can alternatively specify position in rendered on-screen pixels
          },
      
          { // node n3
            data: { id: 'n3', parent: 'nparent' },
            position: { x: 123, y: 234 }
          },
      
        //   { // node nparent
        //     data: { id: 'nparent', position: { x: 200, y: 100 } }
        //   },
      
          {// edge e1
            data:{
            //   id: 'e1',
              // inferred as an edge because `source` and `target` are specified:
              source: 'n1', // the source node id (edge comes from this node)
              target: 'n3',  // the target node id (edge goes to this node)
             
            }
        },
          {// edge e1
            data:{
            //   id: 'e1',
              // inferred as an edge because `source` and `target` are specified:
              source: 'n2', // the source node id (edge comes from this node)
              target: 'n3',  // the target node id (edge goes to this node)
             
            }
             }   
        ],
      
        // layout: {
        //   name: 'preset'
        // },
      
        // so we can see the ids
        style: [
          {
            selector: 'node',
            style: {
              'content': 'data(id)'
            }
          }
        ]
      
      });
    //   var j = cy.$("#cy");
    //   cy.remove( j );
})