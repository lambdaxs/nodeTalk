/**
 * Created by xiaos on 16/11/18.
 */
const util = require('../lib/util')

const set1 = new Set([1,2,3,5])
const set2 = new Set([2,3,6,7])

console.log(set1.union(set2))
console.log(set1.inrs(set2))
console.log(set1.diff(set2))
console.log(set2.diff(set1))



console.log([].range(1,10))


