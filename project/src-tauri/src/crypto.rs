use aes::Aes128;
use aes_gcm::{
    aead::{Aead, KeyInit, OsRng},
    Aes256Gcm, Nonce as GcmNonce,
};
use argon2::Argon2;
use base64::{engine::general_purpose::STANDARD as B64, Engine};
use cbc::cipher::{BlockDecryptMut, BlockEncryptMut, KeyIvInit};
use chacha20poly1305::ChaCha20Poly1305;
use rand::RngCore;
use serde::{Deserialize, Serialize};

type Aes128CbcEnc = cbc::Encryptor<Aes128>;
type Aes128CbcDec = cbc::Decryptor<Aes128>;

#[derive(Serialize, Deserialize)]
struct EncryptedPayload {
    alg: String,
    salt: String,
    iv: String,
    ct: String,
}

/// Derive a key from password + salt using Argon2id.
fn derive_key(password: &str, salt: &[u8], key_len: usize) -> Result<Vec<u8>, String> {
    let mut key = vec![0u8; key_len];
    let argon2 = Argon2::default();
    argon2
        .hash_password_into(password.as_bytes(), salt, &mut key)
        .map_err(|e| format!("Key derivation failed: {}", e))?;
    Ok(key)
}

/// PKCS7 padding for CBC mode
fn pkcs7_pad(data: &[u8], block_size: usize) -> Vec<u8> {
    let padding_len = block_size - (data.len() % block_size);
    let mut padded = data.to_vec();
    padded.extend(std::iter::repeat(padding_len as u8).take(padding_len));
    padded
}

/// Remove PKCS7 padding
fn pkcs7_unpad(data: &[u8]) -> Result<Vec<u8>, String> {
    if data.is_empty() {
        return Err("Empty data".to_string());
    }
    let pad_len = *data.last().unwrap() as usize;
    if pad_len == 0 || pad_len > 16 || pad_len > data.len() {
        return Err("Invalid padding".to_string());
    }
    // Verify all padding bytes
    for &byte in &data[data.len() - pad_len..] {
        if byte as usize != pad_len {
            return Err("Invalid padding".to_string());
        }
    }
    Ok(data[..data.len() - pad_len].to_vec())
}

#[tauri::command]
pub fn encrypt_text(
    plaintext: String,
    password: String,
    algorithm: String,
) -> Result<String, String> {
    let mut salt = [0u8; 16];
    OsRng.fill_bytes(&mut salt);

    let payload = match algorithm.as_str() {
        "AES-256-GCM" => {
            let key_bytes = derive_key(&password, &salt, 32)?;
            let cipher = Aes256Gcm::new_from_slice(&key_bytes)
                .map_err(|e| format!("Cipher init failed: {}", e))?;

            let mut iv = [0u8; 12];
            OsRng.fill_bytes(&mut iv);
            let nonce = GcmNonce::from_slice(&iv);

            let ciphertext = cipher
                .encrypt(nonce, plaintext.as_bytes())
                .map_err(|e| format!("Encryption failed: {}", e))?;

            EncryptedPayload {
                alg: algorithm,
                salt: B64.encode(salt),
                iv: B64.encode(iv),
                ct: B64.encode(ciphertext),
            }
        }
        "ChaCha20-Poly1305" => {
            let key_bytes = derive_key(&password, &salt, 32)?;
            let cipher = ChaCha20Poly1305::new_from_slice(&key_bytes)
                .map_err(|e| format!("Cipher init failed: {}", e))?;

            let mut iv = [0u8; 12];
            OsRng.fill_bytes(&mut iv);
            let nonce = chacha20poly1305::Nonce::from_slice(&iv);

            let ciphertext = cipher
                .encrypt(nonce, plaintext.as_bytes())
                .map_err(|e| format!("Encryption failed: {}", e))?;

            EncryptedPayload {
                alg: algorithm,
                salt: B64.encode(salt),
                iv: B64.encode(iv),
                ct: B64.encode(ciphertext),
            }
        }
        "AES-128-CBC" => {
            let key_bytes = derive_key(&password, &salt, 16)?;
            let mut iv = [0u8; 16];
            OsRng.fill_bytes(&mut iv);

            let padded = pkcs7_pad(plaintext.as_bytes(), 16);
            let cipher = Aes128CbcEnc::new_from_slices(&key_bytes, &iv)
                .map_err(|e| format!("Cipher init failed: {}", e))?;
            let ciphertext =
                cipher.encrypt_padded_vec_mut::<cbc::cipher::block_padding::NoPadding>(&padded);

            EncryptedPayload {
                alg: algorithm,
                salt: B64.encode(salt),
                iv: B64.encode(iv),
                ct: B64.encode(ciphertext),
            }
        }
        _ => return Err(format!("Unsupported algorithm: {}", algorithm)),
    };

    let json =
        serde_json::to_string(&payload).map_err(|e| format!("Serialization failed: {}", e))?;
    Ok(B64.encode(json))
}

#[tauri::command]
pub fn decrypt_text(encoded: String, password: String) -> Result<String, String> {
    let json_bytes = B64
        .decode(&encoded)
        .map_err(|_| "Invalid base64 input".to_string())?;
    let json_str =
        String::from_utf8(json_bytes).map_err(|_| "Invalid UTF-8 in payload".to_string())?;
    let payload: EncryptedPayload = serde_json::from_str(&json_str)
        .map_err(|_| "Invalid encrypted payload format".to_string())?;

    let salt = B64
        .decode(&payload.salt)
        .map_err(|_| "Invalid salt encoding".to_string())?;
    let iv = B64
        .decode(&payload.iv)
        .map_err(|_| "Invalid IV encoding".to_string())?;
    let ct = B64
        .decode(&payload.ct)
        .map_err(|_| "Invalid ciphertext encoding".to_string())?;

    let plaintext_bytes = match payload.alg.as_str() {
        "AES-256-GCM" => {
            let key_bytes = derive_key(&password, &salt, 32)?;
            let cipher = Aes256Gcm::new_from_slice(&key_bytes)
                .map_err(|e| format!("Cipher init failed: {}", e))?;
            let nonce = GcmNonce::from_slice(&iv);

            cipher
                .decrypt(nonce, ct.as_ref())
                .map_err(|_| "Decryption failed — wrong password or corrupted data".to_string())?
        }
        "ChaCha20-Poly1305" => {
            let key_bytes = derive_key(&password, &salt, 32)?;
            let cipher = ChaCha20Poly1305::new_from_slice(&key_bytes)
                .map_err(|e| format!("Cipher init failed: {}", e))?;
            let nonce = chacha20poly1305::Nonce::from_slice(&iv);

            cipher
                .decrypt(nonce, ct.as_ref())
                .map_err(|_| "Decryption failed — wrong password or corrupted data".to_string())?
        }
        "AES-128-CBC" => {
            let key_bytes = derive_key(&password, &salt, 16)?;
            let cipher = Aes128CbcDec::new_from_slices(&key_bytes, &iv)
                .map_err(|e| format!("Cipher init failed: {}", e))?;

            let mut buf = ct.clone();
            let decrypted = cipher
                .decrypt_padded_vec_mut::<cbc::cipher::block_padding::NoPadding>(&mut buf)
                .map_err(|_| "Decryption failed — wrong password or corrupted data".to_string())?;

            pkcs7_unpad(&decrypted)?
        }
        _ => return Err(format!("Unsupported algorithm: {}", payload.alg)),
    };

    String::from_utf8(plaintext_bytes)
        .map_err(|_| "Decrypted output is not valid UTF-8".to_string())
}
