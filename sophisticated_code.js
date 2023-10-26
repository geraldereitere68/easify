/* sophisticated_code.js */

// This code generates an encryption algorithm based on a modified version of the RSA algorithm.
// Encrypts a message using a public key and decrypts using the corresponding private key.

function generateKeyPair(bitLength) {
  // Generate a key pair with the given bit length

  function modInverse(a, m) {
    // Calculate the modular multiplicative inverse

    let b = BigInt(a);
    let m0 = BigInt(m);
    let y = BigInt(0), x = BigInt(1);

    while (b > 1n) {
      let q = b / m0;
      let temp = m0;
      m0 = b % m0;
      b = temp;
      temp = y;
      y = x - q * y;
      x = temp;
    }

    return (x < 0) ? x + BigInt(m) : x;
  }

  function generatePrimeCandidate(length) {
    // Generate a random prime candidate of the given bit length

    let prime;
    do {
      prime = BigInt(0);
      for (let i = 0; i < length / 16; i++) {
        let randomChunk = BigInt(Math.floor(Math.random() * (2 ** 16)));
        prime = (prime * (2 ** 16)) + randomChunk;
      }
      if (prime % 2n == 0) prime += 1n;
    } while (!isProbablyPrime(prime));

    return prime;
  }

  function isProbablyPrime(num) {
    // Check if a number is probably prime using Miller-Rabin test

    if (num == 2n || num == 3n) return true;
    if (num == 1n || num % 2n == 0n) return false;

    let s = 0, d = num - 1n;
    while (d % 2n == 0n) {
      d /= 2n;
      s++;
    }

    const iterations = Math.ceil(Math.log2(num));

    for (let i = 0; i < iterations; i++) {
      let a = BigInt(Math.floor(Math.random() * (num - 3n))) + 2n;
      let x = a ** d % num;

      if (x == 1n || x == num - 1n) continue;

      for (let r = 0; r < s - 1; r++) {
        x = x ** 2n % num;
        if (x == 1n) return false;
        if (x == num - 1n) break;
      }

      if (x != num - 1n) return false;
    }

    return true;
  }

  const e = 65537n; // Public exponent

  let p, q;
  do {
    p = generatePrimeCandidate(bitLength / 2);
    q = generatePrimeCandidate(bitLength / 2);
  } while (p == q);

  const n = p * q; // Modulus

  const phi = (p - 1n) * (q - 1n); // Euler's totient function

  const d = modInverse(e, phi); // Private exponent

  return {
    publicKey: {
      e: e.toString(),
      n: n.toString()
    },
    privateKey: {
      d: d.toString(),
      n: n.toString()
    }
  };
}

function encrypt(message, publicKey) {
  // Encrypt the given message using the public key

  const messageBytes = Array.from(message).map(byte => byte.charCodeAt(0));

  const encryptedBytes = messageBytes.map(m => BigInt(m) ** BigInt(publicKey.e) % BigInt(publicKey.n));

  return encryptedBytes.map(byte => String.fromCharCode(Number(byte))).join('');
}

function decrypt(encrypted, privateKey) {
  // Decrypt the given encrypted message using the private key

  const encryptedBytes = Array.from(encrypted).map(byte => BigInt(byte.charCodeAt(0)));

  const decryptedBytes = encryptedBytes.map(m => m ** BigInt(privateKey.d) % BigInt(privateKey.n));

  return decryptedBytes.map(byte => String.fromCharCode(Number(byte))).join('');
}

// Example usage:
const keyPair = generateKeyPair(1024);

const message = "This is a secret message!";
const encryptedMessage = encrypt(message, keyPair.publicKey);
const decryptedMessage = decrypt(encryptedMessage, keyPair.privateKey);

console.log("Original Message:", message);
console.log("Encrypted Message:", encryptedMessage);
console.log("Decrypted Message:", decryptedMessage);
