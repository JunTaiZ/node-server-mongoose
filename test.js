let password = /(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$).{6,18}$/;
let str = '123ijo4'
console.log(password.test(str))
console.log(password.test('8906969'))
console.log(password.test('asdfajsodjfo'))
console.log(password.test('ifjosjJ'))