/**
 * Created by xiaos on 16/11/18.
 */
const set1 = new Set([1,2,3,5])
const set2 = new Set([2,3,6,7])

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
console.log(set1.union(set2))
console.log(set1.inrs(set2))
console.log(set1.diff(set2))
console.log(set2.diff(set1))



