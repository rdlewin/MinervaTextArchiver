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