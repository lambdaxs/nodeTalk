/**
 * Created by xiaos on 16/11/24.
 */
Array.prototype.range = (start,end,step)=>{
    const stepVal = step || 1
    const set = new Set()
    for (var i=start;i<=end;i=i+stepVal){
        set.add(i)
    }
    return [...set]
}

Set.prototype.union = function (set) {
    return new Set([...this,...set])
}

Set.prototype.inrs = function (set) {
    let arr = [...this].filter(v=>set.has(v))
    return new Set(arr)
}

Set.prototype.diff = function (set) {
    let arr = [...this].filter(v=>!set.has(v))
    return new Set(arr)
}



module.exports = {
    page(page,count,maxCount,action){
        const maxPage = Math.ceil(maxCount/count)
        const data = {}
        if (page >= maxPage){
            data.last = true
            data.pre =  Math.max(1,maxPage-1)
        }else if (page == 1){
            data.first = true
            data.next =  page + 1
        }else {
            data.pre = page - 1
            data.next = page + 1
        }
        data.action = action
        return data
    }
}