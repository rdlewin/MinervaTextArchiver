export function getInitials(userName){
    if (userName){
        return userName.split(' ').reduce((prev,curr,idx,arr)=>{
            if (idx === 0 || idx === arr.length-1){
                return prev + curr.substring(0,1).toUpperCase();
            }
            else {
                return prev;
            }
        },'');
    }
}


export function getHierarchy (list){
    const nodesMap = list.reduce((nodes, currentValue) => {
        currentValue.children = [];
        nodes[currentValue.id] = currentValue;
        return nodes;
    },{});


    list.forEach(node => {
       const parent = node.reply_to_id;
       if (parent !== null) {
           nodesMap[parent].children.push(node);
       }
    });

    const rootElement = list.find(node =>{
       if (!node.reply_to_id){
           return node;
       }
    });

    return rootElement;
}