const Fraction = require('fractional').Fraction;

let num = 0.9999999997558594;

let tens_exp = String(num).split('.')[1].length;

let denominator = Math.pow(10, tens_exp);
let numerator = denominator * num;

function gcd(a, b)
{
  if (b === 0)
    return a;
  return gcd(b, a % b);
}

let common_factors = gcd(denominator, numerator);
denominator = denominator / common_factors
numerator = numerator / common_factors;

console.log(numerator, denominator)